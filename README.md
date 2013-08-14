CanJS router DSL
=======

## Requirements

1. CanJS Route (tested only on 1.1.7, but should work with earlier versions).
2. MicroEvent (tested on 1.x). Just very simple event emitter.
3. jQuery (0_o) - because `can/route` requires it. Why? I don't know.
4. CommonJS AMD loader. Why? Because everyone must use module approach! Its enough archaisms.

## Example

```js
require(['router'], function(router) {

  # you really should subscribe to this event if you want something besides loading module file
  router.bind('moduleLoaded', function(Control) {
    console.log('Just some control loaded');
    var control = new Control(document.body);
  });

  # define routes and handlers
  router
    .when('tweets', {module: 'controls/tweets-list'})
    .when('tweets/:id', {module: 'controls/tweet-details'});
    .when('tweets/:id/reply', {module: 'controls/reply-to-tweet'})
    .when('tweets/new', {module: 'controls/compose-tweet'});

  # default route
  router.goTo('tweets');

});
```

It is all of you should to know. If I missed something don't hesitate to contact me.

## Tests

```
$ npm install
$ bower install
$ grunt
```

It will install grunt (`npm install`) and module dependencies (`bower install`). `grunt` will execute `jshint` and `jasmine` tasks.

Author: Yuriy Buchchenko (dezoxel).

## License

Released under the [MIT License](http://www.opensource.org/licenses/MIT)

