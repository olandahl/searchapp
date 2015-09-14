describe('instagramService', function() {

  var $httpBackend, instagramService, INSTAGRAM_API;

  beforeEach(module('SearchApp'));

  beforeEach(inject(function(_$httpBackend_, _INSTAGRAM_API_, _instagramService_) {
    $httpBackend = _$httpBackend_;
    instagramService = _instagramService_;
    INSTAGRAM_API = _INSTAGRAM_API_;
  }));

  describe('Searching for tag "angular"', function() {

    var TEST_QUERY = 'angular',
      TEST_RESULT = {
        data: [
          {name: 'angular'}, 
          {name: 'angularjs'}
        ]
      };

    beforeEach(function() {
      $httpBackend.expectGET(INSTAGRAM_API.BASE_PATH+'/tags/search/?callback=callbackFunction&client_id='+INSTAGRAM_API.CLIENT_ID+'&q='+TEST_QUERY).respond(TEST_RESULT);
      instagramService.searchTags(TEST_QUERY);
      $httpBackend.flush();
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('Should call the instagram api to fetch results', function() {
      expect(true).toBe(true);
    });

  });

});