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

    function routeFunction(e, attr, how, currentRoutePattern) {

      if (!this.isRouteMatch(routePattern, currentRoutePattern, e)) {
        return false;
      }

      this.batchNum = e.batchNum;

      this.loadModule(moduleName);
    }

    routeFunction.bind(this);

    this._CanRoute(routePattern).bind('change', routeFunction);

    this._addRoute(routePattern, routeFunction, options);

    return this;
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

  Router.prototype._addRoute = function(routePattern, routeFunction, routeOptions) {
    var route = {};
    routeOptions.routeFunction = routeFunction;
    route[routePattern] = routeOptions;

    this._routes.push(route);

    return this;
  };

  Router.prototype.reset = function() {
    var i = this._routes.length;
    while(i--) {
      this._CanRoute.unbind('change', this._routes[i].routeFunction);
    }
    this._routes = [];

    return this;
  };

  var router = new Router(CanRoute);
  MicroEvent.mixin(router);

  return router;
});