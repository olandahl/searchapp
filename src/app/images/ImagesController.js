angular.module('SearchApp')

.controller('ImagesController', ['$scope', 'appService', 'RESPONSE_NAME', function($scope, appService, RESPONSE_NAME) {

  $scope.images = [];

  appService.handleResponse(RESPONSE_NAME.IMAGES, function(data) {
    $scope.images = data;
  });

}]);