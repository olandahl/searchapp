angular.module("SearchApp", []);

angular.module("SearchApp").controller("ImagesController", [ "$scope", "appService", "RESPONSE_NAME", function($scope, appService, RESPONSE_NAME) {
    $scope.images = [];
    appService.handleResponse(RESPONSE_NAME.IMAGES, function(data) {
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

angular.module("SearchApp").constant("RESPONSE_NAME", {
    TAGS: "TAGS",
    IMAGES: "IMAGES"
}).factory("appService", [ "$log", "instagramService", "cacheService", "RESPONSE_NAME", function($log, instagramService, cacheService, RESPONSE_NAME) {
    var events = {};
    var executeCallback = function(eventName, response) {
        var eventCallback = events[eventName];
        if (eventCallback) {
            var data = response ? response.data.data : [];
            eventCallback(data);
        }
    };
    var search = function(query) {
        var promise = instagramService.searchTags(query);
        promise.then(function(response) {
            $log.debug("Got tags for", query, response);
            executeCallback(RESPONSE_NAME.TAGS, response);
            executeCallback(RESPONSE_NAME.IMAGES);
        });
        return promise;
    };
    var selectTag = function(tag) {
        var promise = instagramService.getMedia(tag);
        promise.then(function(response) {
            $log.debug("Got images for", tag, response);
            executeCallback(RESPONSE_NAME.IMAGES, response);
        });
        return promise;
    };
    var handleResponse = function(eventName, callback) {
        events[eventName] = callback;
    };
    return {
        search: search,
        selectTag: selectTag,
        handleResponse: handleResponse
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

angular.module("SearchApp").controller("TagsController", [ "$log", "$scope", "appService", "RESPONSE_NAME", function($log, $scope, appService, RESPONSE_NAME) {
    $scope.tags = [];
    appService.handleResponse(RESPONSE_NAME.TAGS, function(data) {
        $scope.activeIndex = -1;
        $scope.tags = data;
    });
    $scope.selectTag = function(tag, index) {
        if (!tag) {
            $log.debug("Selected empty tag");
            return;
        }
        $log.debug("Selected tag", tag);
        $scope.isLoading = true;
        appService.selectTag(tag).then(function() {
            $scope.activeIndex = index;
        }).finally(function() {
            $scope.isLoading = false;
        });
    };
} ]);