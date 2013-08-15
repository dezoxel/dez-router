define(['router'], function(router) {

  describe('Router', function() {

    beforeEach(function() {
      router.when('hello/world', {module: 'hello-world'});
      router.when('foo/bar', {module: 'foo-bar'});
    });

    it('gets an array of the all routes', function() {
      expect(router.getAllRoutes()).toEqual([
        {'hello/world': {module: 'hello-world'} },
        {'foo/bar': {module: 'foo-bar'}},
      ]);
    });

    it('resets all routing maps');
    it('maps route pattern to the module name');
    it('supports params in the route pattern');
    it('requires "module" option when defining a route');
    it('moves control to the callback after the route matched');
  });
});