define(['dez-router', 'can/route'], function(router, CanRoute) {
	'use strict';

  var batchNum;
  CanRoute.bind('change', function(e) {

    if (e.batchNum === batchNum) {
      return false;
    }

    batchNum = e.batchNum;

    var routeParams = CanRoute.attr();
    router.routeChange(routeParams);

    return true;
  });

  router.bind('routeAdded', function(routeOptions) {
    CanRoute(routeOptions.routePattern);
  });

  return router;
});