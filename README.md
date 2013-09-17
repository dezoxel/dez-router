Dez Router
=======

Extremely simple and beautiful router for javascript applications.

## Requirements

1. MicroEvent (tested on 1.x). Just very simple and small event emitter.
2. CommonJS AMD loader. Why? Because everyone must use module approach! Its enough archaisms.

## Installation
1. `bower install dez-router` or specify `dez-router` dependency in your bower.json.
2. Or you can use it without bower, of course: download the library [file](https://raw.github.com/dezoxel/dez-router/master/lib/router.js), place it in your "libs/" folder.
3. Create alias to `dez-router` lib in your AMD-loader configuration. See example below.
4. Specify the dependency `dez-router/router` in your script.

## Example

```js
require.config({
  paths: {
    'dez-router': 'bower_components/dez-router/lib/router'
  }
});

require(['dez-router'], function(router) {


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

* Clean up the code.
* Test it for complex routes, url encoded data, etc.
* Test performance and improve it, if needed.

## Tests

```
$ npm install
$ bower install
$ grunt
```

It will install grunt (`npm install`) and module dependencies (`bower install`). `grunt` will execute `jshint` and `jasmine` tasks.

## License

Released under the [MIT License](http://www.opensource.org/licenses/MIT)

