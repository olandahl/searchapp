describe('SearchController', function() {

  var $controller, $window, $scope, $httpBackend, INSTAGRAM_API, SEARCH_CACHE_ID;

  beforeEach(module('InstagramSearchApp'));

  beforeEach(inject(function(_$controller_, _$window_, _$httpBackend_, _INSTAGRAM_API_, _SEARCH_CACHE_ID_) {
    $window = _$window_;
    $httpBackend = _$httpBackend_;
    $controller = _$controller_;
    INSTAGRAM_API = _INSTAGRAM_API_;
    SEARCH_CACHE_ID = _SEARCH_CACHE_ID_;
  }));


  describe('If previous search entries have been executed in the same session', function() {

    var TEST_ENTRIES = ['query1','query2','query3'];

    beforeEach(function() {
      $window.sessionStorage.setItem(SEARCH_CACHE_ID, JSON.stringify(TEST_ENTRIES));
      $scope = {};
      $controller('SearchController', { $scope: $scope });
    });

    it('The recent search entries should be displayed', function() {
      expect($scope.recentSearchEntries.length).toBe(3);
      expect($scope.recentSearchEntries[0]).toBe(TEST_ENTRIES[0]);
      expect($scope.recentSearchEntries[1]).toBe(TEST_ENTRIES[1]);
      expect($scope.recentSearchEntries[2]).toBe(TEST_ENTRIES[2]);
    });
  });

  describe('Searching for a tag', function() {

    var TEST_QUERY = 'angular';

    beforeEach(function() {
      $window.sessionStorage.setItem(SEARCH_CACHE_ID, "");
      $scope = {};
      $controller('SearchController', { $scope: $scope });

      $httpBackend.expect('JSONP', INSTAGRAM_API.BASE_PATH+'search/'+INSTAGRAM_API.PARAMS+'&q='+TEST_QUERY).respond({data:[]});
      $scope.query = TEST_QUERY;
      $scope.search($scope.query);
      $httpBackend.flush();
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('Should clear the query string', function() {
      expect($scope.query).toBeNull();
    });

    it('Should update the list of recent search entries', function() {
      expect($scope.recentSearchEntries.length).toBe(1);
      expect($scope.recentSearchEntries[0]).toBe(TEST_QUERY);
    });

  });
});