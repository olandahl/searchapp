angular.module("SearchApp", []);

angular.module("SearchApp").controller("ResultController", [ "$log", "$scope", "instagramService", function($log, $scope, instagramService) {
    $scope.showImages = function(tag) {
        if (!tag) {
            $log.debug("Empty tag");
            return;
        }
        $log.debug("Get media for tag", tag);
        $scope.isLoading = true;
        $scope.images = [];
        instagramService.getMedia(tag).then(function(response) {
            $log.debug("Got media for", tag, response);
            $scope.images = response.data.data;
        }).finally(function() {
            $scope.isLoading = false;
        });
    };
} ]);

angular.module("SearchApp").controller("SearchController", [ "$log", "$rootScope", "$scope", "cacheService", "instagramService", function($log, $rootScope, $scope, cacheService, instagramService) {
    $scope.recentSearchEntries = cacheService.getRecentSearchEntries();
    $scope.search = function(query) {
        if (!query) {
            $log.debug("Empty search");
            return;
        }
        $log.debug("Search tags", query);
        $scope.isLoading = true;
        instagramService.searchTags(query).then(function(response) {
            $log.debug("Got tags for", query, response);
            $scope.query = null;
            $rootScope.resultItems = response.data.data;
            $scope.recentSearchEntries = cacheService.addSearchEntry(query);
        }).finally(function() {
            $scope.isLoading = false;
        });
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