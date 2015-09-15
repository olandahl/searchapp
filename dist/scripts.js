angular.module("InstagramSearchApp", []).config(function($logProvider) {
    $logProvider.debugEnabled(false);
});

angular.module("InstagramSearchApp").controller("ImagesController", [ "$scope", "appService", "UPDATE_EVENT", function($scope, appService, UPDATE_EVENT) {
    $scope.images = [];
    appService.onUpdate(UPDATE_EVENT.IMAGES, function(images) {
        $scope.images = images;
    });
} ]);

angular.module("InstagramSearchApp").controller("SearchController", [ "$log", "$scope", "appService", "cacheService", function($log, $scope, appService, cacheService) {
    $scope.recentSearchEntries = cacheService.getRecentSearchEntries();
    $scope.search = function(query) {
        if (!query) {
            $log.debug("Empty search");
            return;
        }
        $scope.isLoading = true;
        appService.search(query).then(function() {
            $scope.query = null;
            $scope.recentSearchEntries = cacheService.addSearchEntry(query);
        }).finally(function() {
            $scope.isLoading = false;
        });
    };
} ]);

angular.module("InstagramSearchApp").constant("UPDATE_EVENT", {
    TAGS: "TAGS",
    IMAGES: "IMAGES"
}).factory("appService", [ "$log", "instagramService", "UPDATE_EVENT", function($log, instagramService, UPDATE_EVENT) {
    var eventHandlers = {};
    var executeEventHandler = function(eventName, response) {
        var eventCallback = eventHandlers[eventName];
        if (eventCallback) {
            var hasData = response && response.data && response.data.data, data = hasData ? response.data.data : [];
            eventCallback(data);
        }
    };
    var search = function(query) {
        $log.debug("Get tags for", query);
        var promise = instagramService.searchTags(query);
        promise.then(function(response) {
            $log.debug("Got tags for", query, response);
            executeEventHandler(UPDATE_EVENT.TAGS, response);
            executeEventHandler(UPDATE_EVENT.IMAGES);
        });
        return promise;
    };
    var selectTag = function(tag) {
        $log.debug("Get images for", tag);
        var promise = instagramService.getMedia(tag);
        promise.then(function(response) {
            $log.debug("Got images for", tag, response);
            executeEventHandler(UPDATE_EVENT.IMAGES, response);
        });
        return promise;
    };
    var onUpdate = function(eventName, eventHandler) {
        eventHandlers[eventName] = eventHandler;
    };
    return {
        search: search,
        selectTag: selectTag,
        onUpdate: onUpdate
    };
} ]);

angular.module("InstagramSearchApp").constant("CACHE_ID", {
    RECENT_ENTRIES: "InstagramSearchAppCache_RecentEntries",
    FAVORITE_TAGS: "InstagramSearchAppCache_FavoriteTags"
}).factory("cacheService", [ "$window", "$http", "CACHE_ID", function($window, $http, CACHE_ID) {
    var MAX_NO_OF_ENTRIES = 10;
    var sessionCache = $window.sessionStorage || {}, localCache = $window.localStorage || {};
    var getDeserializedData = function(cache, id) {
        var data = cache.getItem(id);
        return data ? JSON.parse(data) : [];
    };
    var setSerializedData = function(cache, id, data) {
        var serializedData = JSON.stringify(data);
        cache.setItem(id, serializedData);
    };
    var getSearchEntries = function() {
        return getDeserializedData(sessionCache, CACHE_ID.RECENT_ENTRIES);
    };
    var getFavoriteTags = function() {
        return getDeserializedData(localCache, CACHE_ID.FAVORITE_TAGS);
    };
    var setSearchEntries = function(entries) {
        setSerializedData(sessionCache, CACHE_ID.RECENT_ENTRIES, entries);
    };
    var setFavoriteTags = function(favorites) {
        setSerializedData(localCache, CACHE_ID.FAVORITE_TAGS, favorites);
    };
    var addSearchEntry = function(entry) {
        var entries = getSearchEntries();
        if (entries.length > 0 && entries[0] === entry) {
            return entries;
        }
        entries.unshift(entry);
        if (entries.length > MAX_NO_OF_ENTRIES) {
            entries.pop();
        }
        setSearchEntries(entries);
        return entries;
    };
    var addFavorite = function(tag) {
        var favorites = getFavoriteTags();
        if (favorites.indexOf(tag) >= 0) {
            return favorites;
        }
        favorites.push(tag);
        if (favorites.length > MAX_NO_OF_ENTRIES) {
            favorites.shift();
        }
        setFavoriteTags(favorites);
        return favorites;
    };
    return {
        getRecentSearchEntries: getSearchEntries,
        addSearchEntry: addSearchEntry,
        getFavoriteTags: getFavoriteTags,
        addFavorite: addFavorite
    };
} ]);

angular.module("InstagramSearchApp").constant("INSTAGRAM_API", {
    BASE_PATH: "https://api.instagram.com/v1/tags/",
    PARAMS: "?callback=JSON_CALLBACK&client_id=ea8d18da670948188c72a723dd1616c9"
}).factory("instagramService", [ "$http", "INSTAGRAM_API", function($http, INSTAGRAM_API) {
    return {
        searchTags: function(query) {
            return $http.jsonp(INSTAGRAM_API.BASE_PATH + "search/" + INSTAGRAM_API.PARAMS + "&q=" + query);
        },
        getMedia: function(tag) {
            return $http.jsonp(INSTAGRAM_API.BASE_PATH + tag + "/media/recent" + INSTAGRAM_API.PARAMS);
        }
    };
} ]);

angular.module("InstagramSearchApp").controller("TagsController", [ "$log", "$scope", "appService", "cacheService", "UPDATE_EVENT", function($log, $scope, appService, cacheService, UPDATE_EVENT) {
    var activeTag = null, setActiveTag = function(tag) {
        if (activeTag) {
            activeTag.isActive = false;
        }
        if (tag) {
            tag.isActive = true;
            activeTag = tag;
        }
    };
    $scope.tags = [];
    $scope.tagFavorites = cacheService.getFavoriteTags();
    appService.onUpdate(UPDATE_EVENT.TAGS, function(tags) {
        setActiveTag();
        $scope.tags = tags;
    });
    $scope.selectTag = function(tag) {
        if (!tag) {
            $log.debug("Selected empty tag");
            return;
        }
        $scope.isLoading = true;
        appService.selectTag(tag.name).then(function() {
            setActiveTag(tag);
        }).finally(function() {
            $scope.isLoading = false;
        });
    };
    $scope.addFavorite = function(tag) {
        var favTag = angular.copy(tag);
        favTag.isActive = false;
        $scope.tagFavorites = cacheService.addFavorite(favTag);
    };
} ]);