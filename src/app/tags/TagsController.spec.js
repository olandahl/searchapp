describe('TagsController', function() {

  var $scope, $httpBackend, appService, INSTAGRAM_API;

  beforeEach(module('SearchApp'));

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
});