// TODO: Divide terms like "Route definition params" and "Route matched params"
define(['microevent'], function(MicroEvent) {
  'use strict';

  function Router() {
    this._routes = {};
    this._batchNum = null;
    MicroEvent.mixin(this);
    this._registerRouteChangeHandler();
  }

  Router.prototype.when = function(routePattern, options) {
    this._addRoute(routePattern, options);

    return this;
  };

  Router.prototype.then = function(callback) {
    this.bind('routeMatched', callback);

    return this;
  };

  Router.prototype.defaultRoute = function(options) {
    this.when('', options);

    return this;
  };

  Router.prototype.whenNotFound = function(callback) {
    this.bind('routeNotMatched', callback);

    return this;
  };

  // TODO: Simplify
  Router.prototype._fetchRouteParams = function(url, route) {
    var paramsMatcher = /^(?:&[^=]+=[^&]*)+/;
    var parts = url.match(route.regex);
    var start = parts.shift();
    var queryString = url.substr(start.length - 1);
    var queryStringParams = {};
    var routeParams = {};

    if (queryString && paramsMatcher.test(queryString)) {
      queryStringParams = parseQueryString(queryString.slice(1));
    }

    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      if (part && part !== '&') {
        var value = decodeURIComponent(part);
        routeParams[route.names[i]] = isNaN(parseFloat(value)) ? value : parseFloat(value);
      }
    }

    var resultParams = extend(route, queryStringParams);
    resultParams = extend(resultParams, routeParams);

    delete resultParams.names;
    delete resultParams.regex;
    delete resultParams.length;
    delete resultParams.routePattern;

    return resultParams;
  };

  Router.prototype.routeChange = function(url) {
    var matchedRoute = this._findRouteBy(url);

    if (isEmpty(matchedRoute)) {
      this.trigger('routeNotMatched');
      return false;
    }

    var routeParams = this._fetchRouteParams(url, matchedRoute);

    this.trigger('routeMatched', routeParams);

    return true;
  };

  // TODO: This method resets routeAdded handler and can.route can't add self route and nothing works
  Router.prototype.reset = function() {
    this.unbind('routeChanged');
    this.unbind('routeNotChanged');
    this.unbind('routeAdded');
    this.unbind('routeMatched');
    this.unbind('routeNotMatched');
    this._routes = {};
    this._registerRouteChangeHandler();

    return this;
  };

  Router.prototype.hasAnyRoutes = function() {
    return !isEmpty(this._routes);
  };

  Router.prototype.start = function() {
    window.onhashchange();
  };

  Router.prototype._registerRouteChangeHandler = function() {
    window.onhashchange = function() {
      this.routeChange(window.location.hash.substr(1));
    }.bind(this);
  };

  Router.prototype._addRoute = function(routePattern, routeOptions) {
    var route = routeOptions || {};
    route.routePattern = routePattern;

    var wrapQuote = function(str) {
      return (str+'').replace(/([.?*+\^$\[\]\\(){}|\-])/g, "\\$1");
    };

    var matcher = /\:([\w\.]+)/g;
    var names = [];
    var test = routePattern.replace(matcher, function(whole, name, i) {
      names.push(name);
      var next = "\\"+( routePattern.substr(i+whole.length,1) || '&');
      var regex = "([^" +next+"]+)";
      return regex;
    });

    route.names = names;
    route.regex = new RegExp("^" + test+"($|"+wrapQuote('&')+")");
    route.length = routePattern.split('/').length;

    this._routes[routePattern] = route;
    this.trigger('routeAdded', route);

    return this;
  };

  Router.prototype._findRouteBy = function(url) {

    var route = {
      length: -1
    };

    // TODO: Create more elegant solution
    for (var routePattern in this._routes) {
      if (this._routes.hasOwnProperty(routePattern)) {
        var temp = this._routes[routePattern];
        if (temp.regex.test(url) && temp.length > route.length) {
          route = temp;
        }
      }
    }

    if (route.length > -1) {
      return route;
    } else {
      return {};
    }
  };

  function extend(destination, source) {
    for (var property in source) {
      if (source.hasOwnProperty(property)) {
        destination[property] = source[property];
      }
    }

    return destination;
  }

  function isEmpty(map) {
    for(var key in map) {
      if (map.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  function parseQueryString(query) {
    var result = {};
    var pairs = query.split('&');
    for (var i in pairs) {
      if (pairs.hasOwnProperty(i)) {
        var parts = pairs[i].split('=');
        result[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
      }
    }

    return result;
  }

  return new Router();
});