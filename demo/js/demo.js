(function () {
  "use strict";
  angular
    .module('demoApp', ["ngLogModule"]);

  angular
    .module('demoApp')
    .controller("demoController", demoController);

  demoController.$inject = ["$scope", "ngLog"];
  function demoController($scope, ngLog){
    var firstLogger = ngLog.get('firstLogger');
    firstLogger.filterLogging(ngLog.Levels.DEBUG);

    firstLogger.log('parent logging');
    firstLogger.info('parent logging');
    firstLogger.error('parent logging');

    var child = ngLog.get('firstLogger.child');
    child.filterLogging(ngLog.Levels.WARN);

    child.log('this should not log');
    child.info('this should not log');
    child.error('child logging');

    var grandchild = ngLog.get('firstLogger.child.grandchild');

    grandchild.log('this should not log');
    grandchild.info('this should not log');
    grandchild.error('grand child logging');
  }
})();
