angular.module('SearchApp')

.controller('TagsController', ['$log', '$scope', 'appService', 'RESPONSE_NAME', function($log, $scope, appService, RESPONSE_NAME) {
  
  $scope.tags = [];

  appService.handleResponse(RESPONSE_NAME.TAGS, function(data) {
    $scope.activeIndex = -1;
    $scope.tags = data;
  });

  $scope.selectTag = function(tag, index) {
    if (!tag) {
      $log.debug('Selected empty tag');
      return;
    }

    $log.debug('Selected tag', tag);

    $scope.isLoading = true;

    appService.selectTag(tag).then(function() {
      $scope.activeIndex = index;
    })
    .finally(function() {
      $scope.isLoading = false;
    });
  };

}]);