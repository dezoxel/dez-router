/* global describe, it, expect, beforeEach */
define(['dez-router'], function(router) {
  'use strict';

  describe('Router', function() {

    describe('when define the route', function() {

      beforeEach(function() {
        router.reset();

        router.when('user/:id/profile', {module: 'user/profile', foo: 'bar'});
      });

      it('registers route pattern and maps it to the module name', function() {
        expect(router.route('user/:id/profile').module).toEqual('user/profile');
      });

      it('supports params in the route pattern', function() {
        router.bind('routeMatched', function(params) {
          expect(params.id).toEqual(2);
        });

        goTo({route: 'user/:id/profile', id: 2});
      });

      it('passes custom route params when defining a route', function() {
        router.bind('routeMatched', function(params) {
          expect(params.foo).toEqual('bar');
        });

        goTo({route: 'user/:id/profile', id: 2});
      });

      it('handles "not matched" event', function() {
        router.bind('routeNotMatched', function(params) {
          expect(params.route).toEqual('hello/world');
        });

        goTo({route: 'hello/world'});
      });

      it('registers many routes', function() {
        router.when('user/:id');
        router.when('news');
        router.when('articles/:some-id/newest');
        router.when(':section/:category/:item');

        router.bind('routeChanged', function(params) {
          expect(params.someId).toEqual(56);
        });

        goTo({route: 'articles/:some-id/newest', someId: 56});
      });
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