define(['router'], function(router) {

  describe('Router', function() {

    describe('when define the route', function() {

      beforeEach(function() {
        router.reset();

        router.when('user/:id/profile', {module: 'user/profile', foo: 'bar'});
      });

      it('registers route pattern and maps it to the module name', function() {
        expect(router.route('user/:id/profile').module).toEqual('user/profile')
      });

      it('supports params in the route pattern', function() {
        router.bind('routeMatched', function(params) {
          expect(params.id).toBe(2);
        });

        goTo({route: 'user/:id/profile', id: 2});
      });

      it('passes custom route params when defining a route', function() {
        router.bind('routeMatched', function(params) {
          expect(params.foo).toEqual('bar');
        });

        goTo({route: 'user/:id/profile', id: 2});
      });

      it('moves control to the callback after the route matched');
    });

    describe('when empty', function() {

      beforeEach(function() {
        router.reset();
      });

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

  function goTo(params) {
    router.trigger('routeChanged', params);
  }
});