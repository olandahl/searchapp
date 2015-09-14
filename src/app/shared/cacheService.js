angular.module('SearchApp')

.constant('SEARCH_CACHE_ID', 'SearchAppCache')

.factory('cacheService', ['$window', '$http', 'SEARCH_CACHE_ID', function($window, $http, SEARCH_CACHE_ID) {

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

}]);