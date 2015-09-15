angular.module('InstagramSearchApp')

// Cache identifier for recent search entries
.constant('SEARCH_CACHE_ID', 'InstagramSearchAppCache')

// The cache service is responsible for caching recent search entries
.factory('cacheService', ['$window', '$http', 'SEARCH_CACHE_ID', function($window, $http, SEARCH_CACHE_ID) {

  // The maximum number of recent entries
  var MAX_NO_OF_ENTRIES = 10;

  // Use browser session storage if available
  // Fallback to local object (will be reset on page reload) 
  var cache = $window.sessionStorage || {};

  // Get deserialized entries from cache
  var getSearchEntries = function() {
    var data = cache.getItem(SEARCH_CACHE_ID);
    return data ? JSON.parse(data) : [];
  };

  // Set serialized entries in cache
  var setSearchEntries = function(entries) {
    var data = JSON.stringify(entries);
    cache.setItem(SEARCH_CACHE_ID, data);
  };

  // Add search entry to cache
  var addSearchEntry = function(entry) {
      var entries = getSearchEntries();
      
      if (entries.length > 0 && entries[0] === entry) {
        // Don't set last entry again
        return entries;
      }

      // Add entry to the top of the list
      entries.unshift(entry);

      if (entries.length > MAX_NO_OF_ENTRIES) {
        // Remove the last item
        entries.pop();
      }

      // Update cache
      setSearchEntries(entries);

      return entries;
  };

  return {
    getRecentSearchEntries: getSearchEntries,
    addSearchEntry: addSearchEntry
  };

}]);