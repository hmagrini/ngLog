(function () {
  'use strict';

  describe('Provider: ngLog', function () {

    var Logger;
    var mockLogHistory;
    var mockHistory = {
      'originalFn': 'log',
      'args'      : 'mocked args'
    };

    beforeEach(activateBeforeEach);

    describe('should have a function called get that', function () {

      checkDefinitionByType('get', Function);

      describe('should return a Logger instance that', function () {

        it('and should be a direct child of the root Logger', specHierarchyChildFromRoot);

        it('and should create a child from a Logger instance reference', specHierarchyChildFromReference);

        it('and should create a child Logger when passed full hierarchy tree to the service', specHierarchyChildFullTree);

        it('and should create a full hierarchy tree even when some branches dont exist', specHierarchyCompleteMissing);

      });
    });

    describe('should have a function called filterLogging that', function () {

      checkDefinitionByType('filterLogging', Function);

      it('should set a filterFrom flag to the desired Logger Lever', specFilterLogging);

    });

    describe('should have a function called muteLoggingBut that', function () {

      checkDefinitionByType('muteLoggingBut', Function);

      it('should set a muteExcept flag to the desired Logger Lever', specMuteLogging);

    });

    describe('should have a function showHistory that', function () {

      checkDefinitionByType('showHistory', Function);

      it('should invoke N times to the _log function', specShowHistory);

    });

    describe('should have a set of loggin functions that', function(){
      specGenericLogFunctions('debug');

      specGenericLogFunctions('error');

      specGenericLogFunctions('info');

      specGenericLogFunctions('log');

      specGenericLogFunctions('warn');
    });

    function activateBeforeEach() {
      module('ngLogModule');
      module(DIMockServices);
      inject(DISetter);
    }

    function checkDefinitionByType(name, type) {
      it('should be defined', function () {
        expect(Logger[name]).toBeDefined();
      });

      it('should be a ' + type.toString(), function () {
        expect(Logger[name]).toEqual(jasmine.any(type));
      });
    }

    function DIMockServices($provide) {
      mockLogHistory = {
        history: [mockHistory, mockHistory]
      };
      $provide.value('ngLogHistory', mockLogHistory);
    }

    function DISetter(ngLog) {
      Logger = ngLog;
    }

    function specFilterLogging() {
      var filteredLogger = Logger.get('filteredLogger');
      expect(filteredLogger.options.filterFrom).toBe(null);
      filteredLogger.filterLogging(Logger.Levels.DEBUG);
      expect(filteredLogger.options.filterFrom).toEqual(Logger.Levels.DEBUG);
    }

    function specGenericLogFunctions(logFnLevel){
      describe('should be called ' + logFnLevel + 'and that', function (){
        checkDefinitionByType(logFnLevel, Function);

        it('should invoke the function _log with the correct Logger Level as argument', specGenericLogFnCallArgs);

      });
    }

    function specGenericLogFnCallArgs(){
      spyOn(Logger, '_log');
      var logFnSpec = Logger.get('logFnSpec');
      logFnSpec[logFnLevel]('some arguments');
      expect(Logger._log.calls.argsFor(0)[0]).toEqual(logFnLevel);
      expect(Logger._log.calls.argsFor(0)[1][0]).toEqual('some arguments');
    }

    function specHierarchyCompleteMissing() {
      var grandChildLogger = Logger.get('NoneRelatedLogger.firstChild.grandchild');
      expect(grandChildLogger.$parent.context).toBe('NoneRelatedLogger.firstChild');
      expect(grandChildLogger.$parent.$parent.context).toBe('NoneRelatedLogger');
    }

    function specHierarchyChildFromReference() {
      var firstLogger = Logger.get('firstLogger');
      var firstLoggerChild = firstLogger.get('firstChild');
      expect(firstLoggerChild.$parent.context).toBe('firstLogger');
    }

    function specHierarchyChildFromRoot() {
      var firstLogger = Logger.get('firstLogger');
      expect(firstLogger.$root.context).toBe('root');
    }

    function specHierarchyChildFullTree() {
      var firstLogger = Logger.get('firstLogger');
      var firstLoggerChild = Logger.get('firstLogger.firstChild');
      expect(firstLoggerChild.$parent.context).toBe('firstLogger');
    }

    function specMuteLogging() {
      var mutedLogger = Logger.get('mutedLogger');
      expect(mutedLogger.options.muteExcept).toBe(null);
      mutedLogger.muteLoggingBut(Logger.Levels.DEBUG);
      expect(mutedLogger.options.muteExcept).toEqual(Logger.Levels.DEBUG);
    }

    function specShowHistory() {
      spyOn(Logger, '_log');
      Logger.showHistory();
      expect(Logger._log.calls.count()).toEqual(mockLogHistory.history.length);
    }

  });
})();
