describe('ResultController', function() {

  var $scope, $httpBackend, INSTAGRAM_API;

  beforeEach(module('SearchApp'));

  beforeEach(inject(function($controller, _$httpBackend_, _INSTAGRAM_API_) {
    $httpBackend = _$httpBackend_;
    INSTAGRAM_API = _INSTAGRAM_API_;

    $scope = {};
    $controller('ResultController', { $scope: $scope });
  }));

  describe('Searching for a tag', function() {

    var TEST_TAG = 'angular',
      TEST_RESPONSE = {
        data: [
          {id: '123'}, 
          {id: '456'}
        ]
      };

    beforeEach(function() {
      $httpBackend.expect('JSONP', INSTAGRAM_API.BASE_PATH+TEST_TAG+'/media/recent'+INSTAGRAM_API.PARAMS).respond(TEST_RESPONSE);
      $scope.showImages(TEST_TAG);
      $httpBackend.flush();
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('Should show the resulting images', function() {
      expect($scope.images.length).toBe(2);
      expect($scope.images[0].id).toBe('123');
      expect($scope.images[1].id).toBe('456');
    });

  });
});