angular.module('InstagramSearchApp')

.controller('TagsController', ['$log', '$scope', 'appService', 'cacheService', 'UPDATE_EVENT', function($log, $scope, appService, cacheService, UPDATE_EVENT) {
  
  var activeTag = null,
    setActiveTag = function(tag) {
      if (activeTag) {
        activeTag.isActive = false;
      }
      if (tag) {
        tag.isActive = true;
        activeTag = tag;
      }
    };

  // Init tags to empty list
  $scope.tags = [];

  // Init favorite tags from cache
  $scope.tagFavorites = cacheService.getFavoriteTags();

  // Listen for tag updates
  appService.onUpdate(UPDATE_EVENT.TAGS, function(tags) {
    // Reset active tag
    setActiveTag();
    $scope.tags = tags;
  });

  // Select tag
  $scope.selectTag = function(tag) {
    if (!tag) {
      $log.debug('Selected empty tag');
      return;
    }

    // Show loading info
    $scope.isLoading = true;

    appService.selectTag(tag.name).then(function() {
      // Set selected tag to active
      setActiveTag(tag);
    })
    .finally(function() {
      // Done. Hide loading info
      $scope.isLoading = false;
    });
  };

  // Copy, reset active flag and add to favorites
  $scope.addFavorite = function(tag) {
    var favTag = angular.copy(tag);
    favTag.isActive = false;
    $scope.tagFavorites = cacheService.addFavorite(favTag);
  };

}]);