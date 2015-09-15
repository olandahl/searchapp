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

    it('Should show the resulting images', function() {
      expect($scope.tags.length).toBe(2);
      expect($scope.tags).toEqual(TEST_RESPONSE.data);
    });

  });

  describe('Selecting a tag', function() {

    var testTag = {name: 'angular'},
      TEST_RESPONSE = {
        data: [
          {id: '123'}, 
          {id: '456'},
          {id: '789'}
        ]
      };

    beforeEach(function() {
      $httpBackend.expect('JSONP', INSTAGRAM_API.BASE_PATH+testTag.name+'/media/recent'+INSTAGRAM_API.PARAMS).respond(TEST_RESPONSE);
      $scope.selectTag(testTag);
      $httpBackend.flush();
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('Should set the selected tag as active', function() {
      expect(testTag.isActive).toBe(true);
    });

  });

  describe('Adding a favorite tag', function() {

    var testTag = {name: 'angular', isActive: true};

    beforeEach(function() {
      $scope.addFavorite(testTag);
    });

    it('Should add a copy of the tag to the favorites list', function() {
      expect($scope.tagFavorites.length).toBe(1);
      expect($scope.tagFavorites[0]).not.toBe(testTag);
      expect($scope.tagFavorites[0].name).toBe(testTag.name);
    });

    it('The favorite tag should not be active', function() {
      expect($scope.tagFavorites[0].isActive).toBe(false);
    });

  });
});