Dez Router
=======

Lightweight JavaScript router with a rails-like interface.

## Requirements

1. MicroEvent (tested on 1.x). Just very simple and small event emitter.
2. CommonJS AMD loader. Why? Because everyone must use module approach! Its enough archaisms.

## Installation
1. `bower install dez-router` or specify `dez-router` dependency in your bower.json.
2. Or you can use it without bower, of course: download the library [file](https://raw.github.com/dezoxel/dez-router/master/lib/), place it in your "libs/" folder.
3. Create alias to `dez-router` lib in your AMD-loader configuration. See example below.

## Example

```js
require.config({
  paths: {
    'dez-router': 'bower_components/dez-router/lib'
  }
});

require(['dez-router/router', 'dez-router/route-helper'], function(Router, RouteHelper) {

  var router = new Router();

  // define routes
  router
    .defaultRoute({module: 'controls/tweets-list', as: 'home_path'})
    .when('tweets', {module: 'controls/tweets-list', as: 'tweets_path'})
    .when('tweets/:id', {module: 'controls/tweet-details', as: 'tweet_path'})
    .when('tweets/:id/reply', {module: 'reply-to-tweet', as: 'reply_path'})
    .when('tweets/new', {module: 'compose-tweet', as: 'new_tweet_path'})
    .when('tweets/new', function(){}})
    // WHEN route is matched, THEN do this work
    .then(function(params) {
      require([params.module], function(Controller) {
        new Controller();
      });
    })
    // WHEN route is not matched
    .whenNotFound(function(params) {
      console.log('Sorry, page not found');
    });

  var routeHelper = new RouteHelper(router);
  routeHelper.routeTo('tweet_path', {id: 5}); // "tweets/5"
  routeHelper.goTo('reply_path', {id: 7}); // Goes to path. window.location.hash === "tweets/7/reply"

});
```

## TODO

* Clean up the code.
* Test it for complex routes, url encoded data, etc.
* Test performance and improve it, if needed.
* README (more examples), show microevent configuring
* unbind route
* unbind by regex
* optional params
* Wildcard in route definition
* Callback for route

## Tests

```
$ npm install
$ bower install
$ grunt
```

It will install grunt (`npm install`) and module dependencies (`bower install`). `grunt` will execute `jshint` and `jasmine` tasks.

## License

Released under the [MIT License](http://www.opensource.org/licenses/MIT)

