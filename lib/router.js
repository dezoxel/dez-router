define(['can/route', 'microevent'], function(CanRoute, MicroEvent) {
  'use strict';

  function Router(CanRoute) {
    this._CanRoute = CanRoute;
    this._routes = [];
    this._batchNum = null;
  }

  Router.prototype.when = function(routePattern, options) {
    // we need to register route change handler function only one time
    if (!this._isRouteChangeHandlerRegistered()) {
      this._registerRouteChangeHandler();
    }

    this._addRoute(routePattern, options);

    return this;
  };

  Router.prototype.routeChange = function(e, attr, how, currentRoutePattern) {

    var i = this._routes.length;
    while(i--) {
      var routePattern = this._routes[i].routePattern;
      if (!this._isRouteMatch(routePattern, currentRoutePattern, e)) {
        return false;
      }
    }

    this._batchNum = e.batchNum;

    this.trigger('routeMatched');
  };

  Router.prototype._isRouteMatch = function(routePattern, currentRoutePattern, e) {
    return (currentRoutePattern === routePattern) &&
      (e.batchNum === null || e.batchNum !== this._batchNum);
  };

  // TODO: Remove it. Router shouldn't making nagivation functions
  Router.prototype.goTo = function(routePattern, params) {
    var routeParams = params;

    if (!routeParams) {
      routeParams = {};
    }

    routeParams.route = routePattern;

    this._CanRoute.attr(routeParams);
  };

  Router.prototype.reset = function() {
    this._unregisterRouteChangeHandler();
    this._routes = [];

    return this;
  };

  Router.prototype.hasAnyRoutes = function() {
    return this._routes.length > 0;
  };

  Router.prototype.route = function(routePattern) {
    return this._findRouteBy(routePattern);
  };

  Router.prototype._isRouteChangeHandlerRegistered = function() {
    return this._routeChangeHandler;
  };

  Router.prototype._registerRouteChangeHandler = function() {
    this._routeChangeHandler = this.routeChange.bind(this);
    this._CanRoute.bind('change', this._routeChangeHandler);
  };

  Router.prototype._unregisterRouteChangeHandler = function() {
    this._CanRoute.unbind('change', this._routeChangeHandler);
    this._routeChangeHandler = null;
  };

  Router.prototype._addRoute = function(routePattern, routeOptions) {
    var route = routeOptions;
    route.routePattern = routePattern;

    this._CanRoute(routePattern);
    this._routes.push(route);

    return this;
  };

  Router.prototype._findRouteBy = function(routePattern) {
    var i = this._routes.length;
    while(i--) {
      if (this._routes[i].routePattern === routePattern) {
        return this._routes[i];
      }
    }

    return {};
  };


  var router = new Router(CanRoute);
  MicroEvent.mixin(router);

  return router;
});