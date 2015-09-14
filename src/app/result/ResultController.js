angular.module('SearchApp').controller('ResultController', ['$log', '$scope', 'instagramService', function($log, $scope, instagramService) {
  
  $scope.showImages = function(tag) {
    if (!tag) {
      $log.debug('Empty tag');
      return;
    }

    $log.debug('Get media for tag', tag);

    $scope.isLoading = true;
    $scope.images = [];

    instagramService.getMedia(tag).then(function(response) {
      $log.debug('Got media for', tag, response);
      $scope.images = response.data.data;
    }).finally(function() {
      $scope.isLoading = false;
    });
  };

}]);