define(['router'], function(router) {

  describe('Router', function() {

    it('doesnt have any routes when loaded', function() {
      expect(router.getAllRoutes()).toEqual([]);
    });

    it('resets all routes', function() {
      router.when('hello/world', {module: 'hello-world'});

      router.reset();

      expect(router.getAllRoutes()).toEqual([]);
    });

    it('maps route pattern to the module name');
    it('supports params in the route pattern');
    it('requires "module" option when defining a route');
    it('moves control to the callback after the route matched');
  });
});