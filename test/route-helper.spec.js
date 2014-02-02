/* global describe, it, expect, beforeEach */
define(['dez-router/router', 'dez-router/route-helper'], function(Router, RouteHelper) {
  'use strict';

  describe('Router', function() {

    var router = new Router();
    router.when('users', {as: 'users_list'});
    router.when('users/:hello/profile', {as: 'profile'});
    var routeHelper = new RouteHelper(router);

    it('requires router instance', function() {
      expect(routeHelper.router instanceof Router).toBe(true);
    });

    it('goes to route', function() {
      routeHelper.goTo('users_list');
      expect(window.location.hash).toEqual('#users');
    });

    describe('when generates a route string', function() {

      it('creates a static route', function() {
        expect(routeHelper.routeTo('users_list')).toEqual('users');
      });

      it('supports route vars', function() {
        expect(routeHelper.routeTo('profile', {hello: 5})).toEqual('users/5/profile');
      });

      it('generates query string parameters too', function() {
        expect(routeHelper.routeTo('users_list', {}, {sortBy: 'age', order: 'desc'})).toEqual('users&sortBy=age&order=desc');
      });
    });

  });

});