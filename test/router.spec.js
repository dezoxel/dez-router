/* global describe, it, expect, beforeEach */
define(['dez-router/router'], function(Router) {
  'use strict';

  describe('Router', function() {

    var router = new Router();

    describe('when define the route', function() {

      beforeEach(function() {
        router.reset();

        router.when('user/:id/profile', {module: 'user/profile', foo: 'bar', as: 'userProfile'});
      });

      it('supports params in the route pattern', function() {
        router.bind('routeMatched', function(params) {
          expect(params.id).toEqual(2);
        });

        goTo('user/2/profile');
      });

      it('supports query string params', function() {
        router.bind('routeMatched', function(params) {
          expect(params.hello).toEqual('world');
        });

        goTo('user/2/profile&hello=world');
      });

      it('passes custom route params when defining a route', function() {
        router.bind('routeMatched', function(params) {
          expect(params.foo).toEqual('bar');
        });

        goTo('user/2/profile');
      });

      it('handles "not matched" event', function() {
        router.bind('routeNotMatched', function(params) {
          expect(params).toBeUndefined();
        });

        goTo('hello/world');
      });

      it('registers routes', function() {
        router.when('user/:id', {as: 'user'});
        router.when('news', {as: 'news'});
        router.when('articles/:some-id/newest', {as: 'newest'});
        router.when(':section/:category/:item', {as: 'item'});

        router.bind('routeChanged', function(params) {
          expect(params.someId).toEqual(56);
        });

        goTo('articles/56/newest');
      });

      it('has method-alias to a "routeMatched" event', function() {
        router.then(function(params) {
          expect(params.module).toEqual('user/profile');
        });

        goTo('user/2/profile');
      });

      it('has method-alias to a "routeNotMatched" event', function() {
        router.whenNotFound(function(params) {
          expect(params).toBeUndefined();
        });

        goTo('hello/world');
      });

      it('has method-alias to the default route', function() {
        router.defaultRoute({module: 'home-module', as: 'home'});
        router.then(function(params) {
          expect(params.module).toEqual('home-module');
        });

        goTo('');
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
        router.when('hello/world', {module: 'hello-world', as: 'hello'});

        router.reset();

        expect(router.hasAnyRoutes()).toBe(false);
      });
    });

    describe('#getPatternByName', function() {

      beforeEach(function() {
        router.reset();
      });

      it('gets route pattern by route name', function() {
        router.when('hello/world', {as: 'hello'});
        expect(router.getPatternByName('hello')).toEqual('hello/world');
      });

      it('returns false if route pattern not found', function() {
        expect(router.getPatternByName('hello')).toEqual(false);
      });

    });

  });

  function goTo(url) {
    window.location.hash = '#' + url;
  }
});