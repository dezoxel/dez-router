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

	});

  function goTo(params) {
    CanRoute.attr(params, true);
  }

});