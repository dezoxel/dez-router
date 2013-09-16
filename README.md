Dez Router
=======

## Requirements

1. CanJS Route (tested only on 1.1.7, but should work with earlier versions).
2. MicroEvent (tested on 1.x). Just very simple event emitter.
3. jQuery (0_o) - because `can/route` requires it. Why? I don't know.
4. CommonJS AMD loader. Why? Because everyone must use module approach! Its enough archaisms.

## Example

```js
require(['router'], function(router) {


  // define routes
  router
    .defaultRoute({module: 'controls/tweets-list'})
    .when('tweets', {module: 'controls/tweets-list'})
    .when('tweets/:id', {module: 'controls/tweet-details'})
    .when('tweets/:id/reply', {module: 'reply-to-tweet'})
    .when('tweets/new', {module: 'compose-tweet'})
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

});
```

## TODO

Implement self routing mechanism watching to `window.location.hash` changes. It means we will not have dependency to CanJS and jQuery at all. Only MicroEvent.

## Tests

```
$ npm install
$ bower install
$ grunt
```

It will install grunt (`npm install`) and module dependencies (`bower install`). `grunt` will execute `jshint` and `jasmine` tasks.

## License

Released under the [MIT License](http://www.opensource.org/licenses/MIT)
