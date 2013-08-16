define(['can/route', 'microevent'], function(CanRoute, MicroEvent) {
  'use strict';

  function Router(CanRoute) {
    this._CanRoute = CanRoute;
    this._routes = {};
  }

  Router.prototype.when = function(routePattern, options) {
    if (!options.module) {
      throw 'The "module" option has not been specified for the route';
    }

    var moduleName = options.module;

    this.batchNum = null;

    function routeFunction(e, attr, how, currentRoutePattern) {
      if (!this.isRouteMatch(routePattern, currentRoutePattern, e)) {
        return false;
      }

      this.batchNum = e.batchNum;

      // TODO: Trigger "routeMatched" event instead
      this.loadModule(moduleName);
    }

    routeFunction.bind(this);

    this._CanRoute(routePattern).bind('change', routeFunction);

    this._addRoute(routePattern, routeFunction, options);

    return this;
  };

  // TODO: Remove it. Router shouldn't load anything
  Router.prototype.loadModule = function(moduleName) {
    require([moduleName], function(module) {
      this.trigger('moduleLoaded', module);
    }.bind(this));
  };

  Router.prototype.isRouteMatch = function(routePattern, currentRoutePattern, e) {
    return (currentRoutePattern === routePattern) &&
      (e.batchNum === null || e.batchNum !== this.batchNum);
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

  Router.prototype._addRoute = function(routePattern, routeFunction, routeOptions) {
    routeOptions.routeFunction = routeFunction;

    this._routes[routePattern] = routeOptions;

    return this;
  };

  Router.prototype.reset = function() {
    for(var route in this._routes) {
      this._CanRoute.unbind('change', route.routeFunction);
    }

    this._routes = {};

    return this;
  };

  Router.prototype.hasAnyRoutes = function() {
    return Object.keys(this._routes).length > 0;
  };

  Router.prototype.route = function(routePattern) {
    return this._routes[routePattern];
  };

  var router = new Router(CanRoute);
  MicroEvent.mixin(router);

  return router;
});