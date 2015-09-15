describe('TagsController', function() {

  var $scope, $httpBackend, appService, INSTAGRAM_API;

  beforeEach(module('InstagramSearchApp'));

  beforeEach(inject(function($controller, _$httpBackend_, _appService_, _INSTAGRAM_API_) {
    $httpBackend = _$httpBackend_;
    appService = _appService_;
    INSTAGRAM_API = _INSTAGRAM_API_;

    $scope = {};
    $controller('TagsController', { $scope: $scope });
  }));

  describe('Searching for a tag', function() {

    var TEST_QUERY = 'angular',
      TEST_RESPONSE = {
        data: [
          {name: 'angular'}, 
          {name: 'angularjs'}
        ]
      };

    beforeEach(function() {
      $httpBackend.expect('JSONP', INSTAGRAM_API.BASE_PATH+'search/'+INSTAGRAM_API.PARAMS+'&q='+TEST_QUERY).respond(TEST_RESPONSE);
      appService.search(TEST_QUERY);
      $httpBackend.flush();
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('Should reset the active index', function() {
      expect($scope.activeIndex).toBe(-1);
    });

    it('Should show the resulting images', function() {
      expect($scope.tags.length).toBe(2);
      expect($scope.tags).toEqual(TEST_RESPONSE.data);
    });

  });

  describe('Selecting a tag', function() {

    var TEST_TAG = 'angular',
      TEST_INDEX = 2,
      TEST_RESPONSE = {
        data: [
          {id: '123'}, 
          {id: '456'},
          {id: '789'}
        ]
      };

    beforeEach(function() {
      $httpBackend.expect('JSONP', INSTAGRAM_API.BASE_PATH+TEST_TAG+'/media/recent'+INSTAGRAM_API.PARAMS).respond(TEST_RESPONSE);
      $scope.selectTag(TEST_TAG, TEST_INDEX);
      $httpBackend.flush();
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('Should set the selected tag as active', function() {
      expect($scope.activeIndex).toBe(TEST_INDEX);
    });

  });
});