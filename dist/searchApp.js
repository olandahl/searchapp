angular.module("SearchApp", []);

angular.module("SearchApp").controller("ImagesController", [ "$scope", "appService", "EVENT_NAME", function($scope, appService, EVENT_NAME) {
    $scope.images = [];
    appService.subscribe(EVENT_NAME.IMAGES, function(data) {
        $scope.images = data;
    });
} ]);

angular.module("SearchApp").controller("SearchController", [ "$log", "$scope", "appService", "cacheService", function($log, $scope, appService, cacheService) {
    $scope.recentSearchEntries = cacheService.getRecentSearchEntries();
    $scope.search = function(query) {
        if (!query) {
            $log.debug("Empty search");
            return;
        }
        $log.debug("Search tags", query);
        $scope.isLoading = true;
        appService.search(query).then(function() {
            $scope.query = null;
            $scope.recentSearchEntries = cacheService.addSearchEntry(query);
        }).finally(function() {
            $scope.isLoading = false;
        });
    };
} ]);

angular.module("SearchApp").constant("EVENT_NAME", {
    TAGS: "TAGS",
    IMAGES: "IMAGES"
}).factory("appService", [ "$log", "instagramService", "cacheService", "EVENT_NAME", function($log, instagramService, cacheService, EVENT_NAME) {
    var events = {};
    var executeCallback = function(eventName, response) {
        var eventCallback = events[eventName];
        if (eventCallback) {
            eventCallback(response.data.data);
        }
    };
    var search = function(query) {
        var promise = instagramService.searchTags(query);
        promise.then(function(response) {
            $log.debug("Got tags for", query, response);
            executeCallback(EVENT_NAME.TAGS, response);
        });
        return promise;
    };
    var selectTag = function(tag) {
        var promise = instagramService.getMedia(tag);
        promise.then(function(response) {
            $log.debug("Got images for", tag, response);
            executeCallback(EVENT_NAME.IMAGES, response);
        });
        return promise;
    };
    var subscribe = function(eventName, callback) {
        events[eventName] = callback;
    };
    return {
        search: search,
        selectTag: selectTag,
        subscribe: subscribe
    };
} ]);

angular.module("SearchApp").constant("SEARCH_CACHE_ID", "SearchAppCache").factory("cacheService", [ "$window", "$http", "SEARCH_CACHE_ID", function($window, $http, SEARCH_CACHE_ID) {
    var getSearchEntries = function() {
        var data = $window.sessionStorage.getItem(SEARCH_CACHE_ID);
        return data ? JSON.parse(data) : [];
    };
    return {
        getRecentSearchEntries: function() {
            return getSearchEntries();
        },
        addSearchEntry: function(query) {
            var entries = getSearchEntries();
            entries.unshift(query);
            if (entries.length > 10) {
                entries.pop();
            }
            $window.sessionStorage.setItem(SEARCH_CACHE_ID, JSON.stringify(entries));
            return entries;
        }
    };
} ]);

angular.module("SearchApp").constant("INSTAGRAM_API", {
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

angular.module("SearchApp").controller("TagsController", [ "$log", "$scope", "appService", "EVENT_NAME", function($log, $scope, appService, EVENT_NAME) {
    $scope.tags = [];
    appService.subscribe(EVENT_NAME.TAGS, function(data) {
        $scope.tags = data;
    });
    $scope.selectTag = function(tag) {
        if (!tag) {
            $log.debug("Selected empty tag");
            return;
        }
        $log.debug("Selected tag", tag);
        $scope.isLoading = true;
        appService.selectTag(tag).finally(function() {
            $scope.isLoading = false;
        });
    };
} ]);