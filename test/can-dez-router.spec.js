/* global describe, it, expect, beforeEach */
define(['can-dez-router', 'can/route'], function(router, CanRoute) {
  'use strict';

  describe('CanJS Dez Router', function() {

    beforeEach(function() {
      router.reset();

      router.when('user/:id/profile', {module: 'user/profile', foo: 'bar'});
    });


    it('passes custom route params when defining a route', function() {
      router.bind('routeMatched', function(params) {
        expect(params.foo).toEqual('bar');
      });

      goTo({route: 'user/:id/profile', id: 3});
    });

    it('supports params in the route pattern', function() {
      router.bind('routeMatched', function(params) {
        expect(params.id).toEqual(2);
      });

      goTo({route: 'user/:id/profile', id: 2});
    });

    it('handles "not matched" event', function() {
      router.bind('routeNotMatched', function(params) {
        expect(params.route).toEqual('hello/world');
      });

      goTo({route: 'hello/world'});
    });

    it('changes route even if param changed in the same route', function() {
      var id = 0;
      router.bind('routeMatched', function(params) {
        id = params.id;
      });

      expect(id).toEqual(0);

      goTo({route: 'user/:id/profile', id: 2});
      expect(id).toEqual(2);

      goTo({route: 'user/:id/profile', id: 4});
      expect(id).toEqual(4);
    });

  });

  function goTo(params) {
    CanRoute.attr(params);
  }

});