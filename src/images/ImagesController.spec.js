describe('ImagesController', function() {

  var $scope, $httpBackend, appService, INSTAGRAM_API;

  beforeEach(module('InstagramSearchApp'));

  beforeEach(inject(function($controller, _$httpBackend_, _appService_, _INSTAGRAM_API_) {
    $httpBackend = _$httpBackend_;
    appService = _appService_;
    INSTAGRAM_API = _INSTAGRAM_API_;

    $scope = {};
    $controller('ImagesController', { $scope: $scope });
  }));

  describe('Searching for a tag', function() {

    var TEST_TAG = 'angular',
      TEST_RESPONSE = {
        data: [
          {id: '123'}, 
          {id: '456'},
          {id: '789'}
        ]
      };

    beforeEach(function() {
      $httpBackend.expect('JSONP', INSTAGRAM_API.BASE_PATH+TEST_TAG+'/media/recent'+INSTAGRAM_API.PARAMS).respond(TEST_RESPONSE);
      appService.selectTag(TEST_TAG);
      $httpBackend.flush();
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('Should show the resulting images', function() {
      expect($scope.images.length).toBe(3);
      expect($scope.images).toEqual(TEST_RESPONSE.data);
    });

  });
});