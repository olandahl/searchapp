angular.module('InstagramSearchApp')

.controller('TagsController', ['$log', '$scope', 'appService', 'UPDATE_EVENT', function($log, $scope, appService, UPDATE_EVENT) {
  
  // Init tags to empty list
  $scope.tags = [];

  // Listen for tag updates
  appService.onUpdate(UPDATE_EVENT.TAGS, function(tags) {
    // Reset active tag
    $scope.activeIndex = -1;
    $scope.tags = tags;
  });

  // Select tag
  $scope.selectTag = function(tag, index) {
    if (!tag) {
      $log.debug('Selected empty tag');
      return;
    }

    // Show loading info
    $scope.isLoading = true;

    appService.selectTag(tag).then(function() {
      // Set selected tag to active
      $scope.activeIndex = index;
    })
    .finally(function() {
      // Done. Hide loading info
      $scope.isLoading = false;
    });
  };

}]);