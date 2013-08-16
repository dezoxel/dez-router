define(['router'], function(router) {

  describe('Router', function() {

    beforeEach(function() {
      router.reset();
    });

    it('registers route pattern and maps it to the module name', function() {
      router.when('user/:id/profile', {module: 'user-profile'});

      expect(router.route('user/:id/profile').module).toEqual('user-profile')
    });

    it('supports params in the route pattern');
    it('requires "module" option when defining a route');
    it('moves control to the callback after the route matched');

    describe('when empty', function() {

      it('doesnt have any routes when loaded', function() {
        expect(router.hasAnyRoutes()).toBe(false);
      });

      it('resets all routes', function() {
        router.when('hello/world', {module: 'hello-world'});

        router.reset();

        expect(router.hasAnyRoutes()).toBe(false);
      });
    });

  });
});