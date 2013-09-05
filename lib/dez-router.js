define(['microevent'], function(MicroEvent) {
  'use strict';

  function Router() {
    this._routes = [];
    this._cachedRoutes = [];
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

    if (!this._isRouteMatched(currentRoutePattern)) {
      this.trigger('routeNotMatched', routeParams);
      return false;
    }

    var routeParamsWithDefaultOptions = extend(routeParams, this._findRouteBy(currentRoutePattern));

    this.trigger('routeMatched', routeParamsWithDefaultOptions);

    return true;
  };

  Router.prototype.reset = function() {
    this.unbind('routeChanged');
    this.unbind('routeNotChanged');
    this.unbind('routeAdded');
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
    var route = routeOptions || {};
    route.routePattern = routePattern;

    this._routes.push(route);
    this.trigger('routeAdded', route);

    return this;
  };

  Router.prototype._findRouteBy = function(routePattern) {
    if (this._cachedRoutes[routePattern]) {
      return this._cachedRoutes[routePattern];
    }

    var i = this._routes.length;
    while(i--) {
      if (this._routes[i].routePattern === routePattern) {
        this._cachedRoutes[routePattern] = this._routes[i];
        return this._routes[i];
      }
    }

    return {};
  };

  Router.prototype._isRouteMatched = function(routePattern) {
    if (this._findRouteBy(routePattern)) {
      return true;
    }

    return false;
  };

  function extend(destination, source) {
    for (var property in source) {
      if (source.hasOwnProperty(property)) {
        destination[property] = source[property];
      }
    }

    return destination;
  }


  return new Router();
});