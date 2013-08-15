define(['can/route', 'microevent'], function(CanRoute, MicroEvent) {
  'use strict';

  function Router(CanRoute) {
    this._CanRoute = CanRoute;
    this._routes = [];
  }

  Router.prototype.when = function(routePattern, options) {
    if (!options.module) {
      throw 'The "module" option has not been specified for the route';
    }

    var moduleName = options.module;

    this.batchNum = null;

    this._CanRoute(routePattern).bind('change', function(e, attr, how, currentRoutePattern) {
      this.routingFunction(routePattern, currentRoutePattern, moduleName, e);
    }.bind(this));

    this._addRoute(routePattern, options);

    return this;
  };

  Router.prototype.routingFunction = function(routePattern, currentRoutePattern, moduleName, e) {
    if (!this.isRouteMatch(routePattern, currentRoutePattern, e)) {
      return false;
    }

    this.batchNum = e.batchNum;

    this.loadModule(moduleName);
  };

  Router.prototype.loadModule = function(moduleName) {
    require([moduleName], function(module) {
      this.trigger('moduleLoaded', module);
    }.bind(this));
  };

  Router.prototype.isRouteMatch = function(routePattern, currentRoutePattern, e) {
    return (currentRoutePattern === routePattern) &&
      (e.batchNum === null || e.batchNum !== this.batchNum);
  };

  Router.prototype.goTo = function(routePattern, params) {
    var routeParams = params;

    if (!routeParams) {
      routeParams = {};
    }

    routeParams.route = routePattern;

    this._CanRoute.attr(routeParams);
  };

  Router.prototype._addRoute = function(routePattern, routeOptions) {
    var route = {};
    route[routePattern] = routeOptions;

    this._routes.push(route);

    return this;
  };

  Router.prototype.getAllRoutes = function() {
    return this._routes;
  };

  var router = new Router(CanRoute);
  MicroEvent.mixin(router);

  return router;
});