angular.module('InstagramSearchApp')

// Identifiers for update events
.constant('UPDATE_EVENT', {
  TAGS: 'TAGS',
  IMAGES: 'IMAGES'
})

// The app service is the main application service that ties together controllers and other services
.factory('appService', ['$log', 'instagramService', 'UPDATE_EVENT', function($log, instagramService, UPDATE_EVENT) {

  // Store event handlers
  var eventHandlers = {};

  // Execute specified event handler with response data
  var executeEventHandler = function(eventName, response) {
    var eventCallback = eventHandlers[eventName];
    if (eventCallback) {
      var hasData = response && response.data && response.data.data,
        data = hasData ? response.data.data : [];
      eventCallback(data);
    }
  };

  // Search tags 
  var search = function(query) {
    $log.debug('Get tags for', query);

    var promise = instagramService.searchTags(query);
    promise.then(function(response) {
      $log.debug('Got tags for', query, response);

      // Notify that tags and images have been updated (Images are reset)
      executeEventHandler(UPDATE_EVENT.TAGS, response);
      executeEventHandler(UPDATE_EVENT.IMAGES);
    });

    // Allow function caller to act on resolved promise
    return promise;
  };

  // Select tag to fetch images
  var selectTag = function(tag) {
    $log.debug('Get images for', tag);

    var promise = instagramService.getMedia(tag);
    promise.then(function(response) {
      $log.debug('Got images for', tag, response);

      // Notify that images have been updated
      executeEventHandler(UPDATE_EVENT.IMAGES, response);
    });

    // Allow function caller to act on resolved promise
    return promise;
  };

  // Add event handler to specific update event
  var onUpdate = function(eventName, eventHandler) {
    eventHandlers[eventName] = eventHandler;
  };

  return {
    search: search,
    selectTag: selectTag,
    onUpdate: onUpdate
  };

}]);