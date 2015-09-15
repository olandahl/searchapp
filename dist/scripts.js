angular.module("InstagramSearchApp",[]).config(["$logProvider",function(a){a.debugEnabled(!1)}]),angular.module("InstagramSearchApp").controller("ImagesController",["$scope","appService","UPDATE_EVENT",function(a,b,c){a.images=[],b.onUpdate(c.IMAGES,function(b){a.images=b})}]),angular.module("InstagramSearchApp").controller("SearchController",["$log","$scope","appService","cacheService",function(a,b,c,d){b.recentSearchEntries=d.getRecentSearchEntries(),b.search=function(e){return e?(b.isLoading=!0,void c.search(e).then(function(){b.query=null,b.recentSearchEntries=d.addSearchEntry(e)})["finally"](function(){b.isLoading=!1})):void a.debug("Empty search")}}]),angular.module("InstagramSearchApp").constant("UPDATE_EVENT",{TAGS:"TAGS",IMAGES:"IMAGES"}).factory("appService",["$log","instagramService","UPDATE_EVENT",function(a,b,c){var d={},e=function(a,b){var c=d[a];if(c){var e=b&&b.data&&b.data.data,f=e?b.data.data:[];c(f)}},f=function(d){a.debug("Get tags for",d);var f=b.searchTags(d);return f.then(function(b){a.debug("Got tags for",d,b),e(c.TAGS,b),e(c.IMAGES)}),f},g=function(d){a.debug("Get images for",d);var f=b.getMedia(d);return f.then(function(b){a.debug("Got images for",d,b),e(c.IMAGES,b)}),f},h=function(a,b){d[a]=b};return{search:f,selectTag:g,onUpdate:h}}]),angular.module("InstagramSearchApp").constant("CACHE_ID",{RECENT_ENTRIES:"InstagramSearchAppCache_RecentEntries",FAVORITE_TAGS:"InstagramSearchAppCache_FavoriteTags"}).factory("cacheService",["$window","$http","CACHE_ID",function(a,b,c){var d=10,e=a.sessionStorage||{},f=a.localStorage||{},g=function(a,b){var c=a.getItem(b);return c?JSON.parse(c):[]},h=function(a,b,c){var d=JSON.stringify(c);a.setItem(b,d)},i=function(){return g(e,c.RECENT_ENTRIES)},j=function(){return g(f,c.FAVORITE_TAGS)},k=function(a){h(e,c.RECENT_ENTRIES,a)},l=function(a){h(f,c.FAVORITE_TAGS,a)},m=function(a){var b=i();return b.length>0&&b[0]===a?b:(b.unshift(a),b.length>d&&b.pop(),k(b),b)},n=function(a){var b=j();return b.push(a),b.length>d&&b.shift(),l(b),b};return{getRecentSearchEntries:i,addSearchEntry:m,getFavoriteTags:j,addFavorite:n}}]),angular.module("InstagramSearchApp").constant("INSTAGRAM_API",{BASE_PATH:"https://api.instagram.com/v1/tags/",PARAMS:"?callback=JSON_CALLBACK&client_id=ea8d18da670948188c72a723dd1616c9"}).factory("instagramService",["$http","INSTAGRAM_API",function(a,b){return{searchTags:function(c){return a.jsonp(b.BASE_PATH+"search/"+b.PARAMS+"&q="+c)},getMedia:function(c){return a.jsonp(b.BASE_PATH+c+"/media/recent"+b.PARAMS)}}}]),angular.module("InstagramSearchApp").controller("TagsController",["$log","$scope","appService","cacheService","UPDATE_EVENT",function(a,b,c,d,e){var f=null,g=function(a){f&&(f.isActive=!1),a&&(a.isActive=!0,f=a)};b.tags=[],b.tagFavorites=d.getFavoriteTags(),c.onUpdate(e.TAGS,function(a){g(),b.tags=a}),b.selectTag=function(d){return d?(b.isLoading=!0,void c.selectTag(d.name).then(function(){g(d)})["finally"](function(){b.isLoading=!1})):void a.debug("Selected empty tag")},b.addFavorite=function(a){var c=angular.copy(a);c.isActive=!1,b.tagFavorites=d.addFavorite(c)}}]);