angular.module('InstagramSearchApp')

.controller('SearchController', ['$log', '$scope', 'appService', 'cacheService', function($log, $scope, appService, cacheService) {

  // Init recent search entries list from cache
  $scope.recentSearchEntries = cacheService.getRecentSearchEntries();

  // Search for tags
  $scope.search = function(query) {
    if (!query) {
      $log.debug('Empty search');
      return;
    }

    // Show loading info
    $scope.isLoading = true;

    // Search for tags
    appService.search(query).then(function() {
      // Reset query
      $scope.query = null;

      // Add search entry to cache and get updated list
      $scope.recentSearchEntries = cacheService.addSearchEntry(query);
    }).finally(function() {
      // Done. Hide loading info
      $scope.isLoading = false;
    });
  };

}]);