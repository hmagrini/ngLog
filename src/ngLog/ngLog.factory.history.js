(function () {
  "use strict";
  angular
      .module('ngLogModule')
      .factory('ngLogHistory', ngLogHistory);

  function ngLogHistory() {
    var LH = {};

    LH.history = [];

    return LH;
  }
})();
