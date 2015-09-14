angular.module('SearchApp')

.constant('RESPONSE_NAME', {
  TAGS: 'TAGS',
  IMAGES: 'IMAGES'
})

.factory('appService', ['$log', 'instagramService', 'cacheService', 'RESPONSE_NAME', function($log, instagramService, cacheService, RESPONSE_NAME) {

  var events = {};

  var executeCallback = function(eventName, response) {
    var eventCallback = events[eventName];
    if (eventCallback) {
      eventCallback(response.data.data);
    }
  };

  var search = function(query) {
    var promise = instagramService.searchTags(query);
    promise.then(function(response) {
      $log.debug('Got tags for', query, response);
      executeCallback(RESPONSE_NAME.TAGS, response);
    });
    return promise;
  };

  var selectTag = function(tag) {
    var promise = instagramService.getMedia(tag);
    promise.then(function(response) {
      $log.debug('Got images for', tag, response);
      executeCallback(RESPONSE_NAME.IMAGES, response);
    });
    return promise;
  };

  var handleResponse = function(eventName, callback) {
    events[eventName] = callback;
  };

  return {
    search: search,
    selectTag: selectTag,
    handleResponse: handleResponse
  };

}]);