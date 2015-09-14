angular.module('SearchApp')

.controller('SearchController', ['$log', '$scope', 'appService', 'cacheService', function($log, $scope, appService, cacheService) {

  $scope.recentSearchEntries = cacheService.getRecentSearchEntries();

  $scope.search = function(query) {
    if (!query) {
      $log.debug('Empty search');
      return;
    }

    $log.debug('Search tags', query);

    $scope.isLoading = true;

    appService.search(query).then(function() {
      $scope.query = null;
      $scope.recentSearchEntries = cacheService.addSearchEntry(query);
    }).finally(function() {
      $scope.isLoading = false;
    });
  };

}]);