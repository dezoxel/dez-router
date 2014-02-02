define([], function() {
  'use strict';

  function RouteHelper(router) {
    this.router = router;
  }

  RouteHelper.prototype.goTo = function(routeName, params, queryStringParams) {
    var history = true;

    if (params && typeof params.history !== 'undefined') {
      history = params.history;
      delete params.history;
    }

    var route = '#' + this.routeTo(routeName, params, queryStringParams);

    if (history) {
      window.location.hash = route;
    } else {
      window.location.replace(route);
    }
  };

  RouteHelper.prototype.routeTo = function(routeName, params, queryStringParams) {
    var routePattern = this.router.getPatternByName(routeName);

    if (!routePattern) {
      throw 'There is no such route "' + routeName + '"';
    }

    return this._replaceParamsInside(routePattern, params) + this._toQueryString(queryStringParams);
  };

  RouteHelper.prototype._replaceParamsInside = function(routePattern, params) {
    var route = routePattern;
    for (var routeParam in params) {
      if (params.hasOwnProperty(routeParam)) {
        route = route.replace(':' + routeParam, params[routeParam]);
      }
    }

    return route;
  };

  RouteHelper.prototype._toQueryString = function(params) {
    var res = '';
    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        res += '&' + key + '=' + params[key];
      }
    }

    return res;
  };

  return RouteHelper;
});