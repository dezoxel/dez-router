define(['microevent'], function(MicroEvent) {
  'use strict';

  function Router() {
    this._routes = [];
    this._batchNum = null;
    MicroEvent.mixin(this);
    this._registerRouteChangeHandler();
  }

  Router.prototype.when = function(routePattern, options) {
    this._addRoute(routePattern, options);

    return this;
  };

  Router.prototype.routeChange = function(routeParams) {
    var currentRoutePattern = routeParams.route;

    var i = this._routes.length;
    while(i--) {
      var routePattern = this._routes[i].routePattern;
      if (currentRoutePattern !== routePattern) {
        return false;
      }
    }

    this.trigger('routeMatched', routeParams);
  };

  Router.prototype.reset = function() {
    this._routes = [];

    return this;
  };

  Router.prototype.hasAnyRoutes = function() {
    return this._routes.length > 0;
  };

  Router.prototype.route = function(routePattern) {
    return this._findRouteBy(routePattern);
  };

  Router.prototype._registerRouteChangeHandler = function() {
    this.bind('routeChanged', this.routeChange.bind(this));
  };

  Router.prototype._addRoute = function(routePattern, routeOptions) {
    var route = routeOptions;
    route.routePattern = routePattern;

    this._routes.push(route);
    this.trigger('routeAdded', route);

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

  return new Router();
});