angular.module('InstagramSearchApp')

// Cache identifiers
.constant('CACHE_ID', {
  RECENT_ENTRIES: 'InstagramSearchAppCache_RecentEntries',
  FAVORITE_TAGS: 'InstagramSearchAppCache_FavoriteTags'
})

// The sessionCache service is responsible for caching recent search entries
.factory('cacheService', ['$window', '$http', 'CACHE_ID', function($window, $http, CACHE_ID) {

  // The maximum number of recent entries
  var MAX_NO_OF_ENTRIES = 10;

  // Use browser session storage if available
  // Fallback to local object (will be reset on page reload) 
  var sessionCache = $window.sessionStorage || {},
    localCache = $window.localStorage || {};

  // Get deserialized entries from cache
  var getDeserializedData = function(cache, id) {
    var data = cache.getItem(id);
    return data ? JSON.parse(data) : [];
  };

  // Set serialized data in cache
  var setSerializedData = function(cache, id, data) {
    var serializedData = JSON.stringify(data);
    cache.setItem(id, serializedData);
  };

  // Get search entries from session cache
  var getSearchEntries = function() {
    return getDeserializedData(sessionCache, CACHE_ID.RECENT_ENTRIES);
  };

  // Get favorite tags from local cache
  var getFavoriteTags = function() {
    return getDeserializedData(localCache, CACHE_ID.FAVORITE_TAGS);
  };

  // Set search entries in session cache
  var setSearchEntries = function(entries) {
    setSerializedData(sessionCache, CACHE_ID.RECENT_ENTRIES, entries);
  };

  // Set favorite tags in local cache
  var setFavoriteTags = function(favorites) {
    setSerializedData(localCache, CACHE_ID.FAVORITE_TAGS, favorites);
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

  // Add favorite tag to cache
  var addFavorite = function(tag) {
      var favorites = getFavoriteTags();

      // Add favorite to the list
      favorites.push(tag);

      if (favorites.length > MAX_NO_OF_ENTRIES) {
        // Remove the first item
        favorites.shift();
      }

      // Update cache
      setFavoriteTags(favorites);

      return favorites;
  };

  return {
    getRecentSearchEntries: getSearchEntries,
    addSearchEntry: addSearchEntry,
    getFavoriteTags: getFavoriteTags,
    addFavorite: addFavorite
  };

}]);