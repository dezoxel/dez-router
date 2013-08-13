define(['can/route', 'microevent'], function(CanRoute, MicroEvent) {

	function Router() {
	}

	Router.prototype.when = function(routePattern, options) {
		if (!options.module) {
			throw 'The "module" option has not been specified for the route';
		}

		var moduleName = options.module;

		this.batchNum = null;

		CanRoute(routePattern).bind('change', function(e, _, _, currentRoutePattern) {
			this.routingFunction(routePattern, currentRoutePattern, moduleName, e);
		}.bind(this));

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
		requirejs([moduleName], function(module) {
			this.trigger('moduleLoaded', module);
		}.bind(this));
	};

	Router.prototype.isRouteMatch = function(routePattern, currentRoutePattern, e) {
		return (currentRoutePattern === routePattern) &&
			(e.batchNum === null || e.batchNum !== this.batchNum);
	};

	var router = new Router();
	MicroEvent.mixin(router);

	return router;
});