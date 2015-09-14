angular.module('SearchApp').controller('SearchController', ['$log', '$rootScope', '$scope', 'cacheService', 'instagramService', function($log, $rootScope, $scope, cacheService, instagramService) {

  $scope.recentSearchEntries = cacheService.getRecentSearchEntries();

  $scope.search = function(query) {
    if (!query) {
      $log.debug('Empty search');
      return;
    }

    $log.debug('Search tags', query);

    $scope.isLoading = true;

    instagramService.searchTags(query).then(function(response) {
      $log.debug('Got tags for', query, response);
      $scope.query = null;
      $rootScope.resultItems = response.data.data;
      $scope.recentSearchEntries = cacheService.addSearchEntry(query);
    }).finally(function() {
      $scope.isLoading = false;
    });
  };

}]);