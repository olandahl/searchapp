angular.module('InstagramSearchApp')

// Path components for the instagram api
.constant('INSTAGRAM_API', {
  BASE_PATH: 'https://api.instagram.com/v1/tags/',
  PARAMS: '?callback=JSON_CALLBACK&client_id=ea8d18da670948188c72a723dd1616c9'
})

// The instagram services handles the communication with the instagram api
.factory('instagramService', ['$http', 'INSTAGRAM_API', function($http, INSTAGRAM_API) {

  return {
    searchTags: function(query) {
      return $http.jsonp(INSTAGRAM_API.BASE_PATH+'search/'+INSTAGRAM_API.PARAMS+'&q='+query);
    },
    getMedia: function(tag) {
      return $http.jsonp(INSTAGRAM_API.BASE_PATH+tag+'/media/recent'+INSTAGRAM_API.PARAMS);
    }
  };

}]);