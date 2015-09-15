angular.module('InstagramSearchApp')

.controller('ImagesController', ['$scope', 'appService', 'UPDATE_EVENT', function($scope, appService, UPDATE_EVENT) {

  // Init images to empty list
  $scope.images = [];

  // Listen for image update
  appService.onUpdate(UPDATE_EVENT.IMAGES, function(images) {
    $scope.images = images;
  });

}]);