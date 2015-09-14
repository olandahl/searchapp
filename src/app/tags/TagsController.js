angular.module('SearchApp')

.controller('TagsController', ['$log', '$scope', 'appService', 'RESPONSE_NAME', function($log, $scope, appService, RESPONSE_NAME) {
  
  $scope.tags = [];

  appService.handleResponse(RESPONSE_NAME.TAGS, function(data) {
    $scope.tags = data;
  });

  $scope.selectTag = function(tag) {
    if (!tag) {
      $log.debug('Selected empty tag');
      return;
    }

    $log.debug('Selected tag', tag);

    $scope.isLoading = true;

    appService.selectTag(tag).finally(function() {
      $scope.isLoading = false;
    });
  };

}]);