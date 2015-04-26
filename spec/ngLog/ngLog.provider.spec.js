(function () {
  'use strict';

  describe('Provider: ngLog', function () {

    var Logger;
    var mockLogHistory;
    var mockHistory = {'originalFn':'log','args':'mocked args'};

    beforeEach(activateBeforeEach);

    describe('should have a function called get that', function () {

      checkDefinitionByType('get', Function);

      describe('should return a Logger instance that', function () {

        it('and should be a direct child of the root Logger', specHierarchyChildFromRoot);
        function specHierarchyChildFromRoot() {
          var firstLogger = Logger.get('firstLogger');
          expect(firstLogger.$root.context).toBe('root');
        }

        it('and should create a child from a Logger instance reference', specHierarchyChildFromReference);
        function specHierarchyChildFromReference() {
          var firstLogger = Logger.get('firstLogger');
          var firstLoggerChild = firstLogger.get('firstChild');
          expect(firstLoggerChild.$parent.context).toBe('firstLogger');
        }

        it('and should create a child Logger when passed full hierarchy tree to the service', specHierarchyChildFullTree);
        function specHierarchyChildFullTree() {
          var firstLogger = Logger.get('firstLogger');
          var firstLoggerChild = Logger.get('firstLogger.firstChild');
          expect(firstLoggerChild.$parent.context).toBe('firstLogger');
        }

        it('and should create a full hierarchy tree even when some branches dont exist', specHierarchyCompleteMissing);
        function specHierarchyCompleteMissing() {
          var grandChildLogger = Logger.get('NoneRelatedLogger.firstChild.grandchild');
          expect(grandChildLogger.$parent.context).toBe('NoneRelatedLogger.firstChild');
          expect(grandChildLogger.$parent.$parent.context).toBe('NoneRelatedLogger');
        }
      });
    });

    describe('should have a function called filterLogging that', function () {

      checkDefinitionByType('filterLogging', Function);

      it('should set a filterFrom flag to the desired Logger Lever', specFilterLogging);
      function specFilterLogging() {
        var filteredLogger = Logger.get('filteredLogger');
        expect(filteredLogger.options.filterFrom).toBe(null);
        filteredLogger.filterLogging(Logger.Levels.DEBUG);
        expect(filteredLogger.options.filterFrom).toEqual(Logger.Levels.DEBUG);
      }
    });

    describe('should have a function called muteLoggingBut that', function () {

      checkDefinitionByType('muteLoggingBut', Function);

      it('should set a muteExcept flag to the desired Logger Lever', specMuteLogging);
      function specMuteLogging() {
        var mutedLogger = Logger.get('mutedLogger');
        expect(mutedLogger.options.muteExcept).toBe(null);
        mutedLogger.muteLoggingBut(Logger.Levels.DEBUG);
        expect(mutedLogger.options.muteExcept).toEqual(Logger.Levels.DEBUG);
      }
    });

    describe('should have a function showHistory that', function () {
      checkDefinitionByType('showHistory', Function);

      it('should call N times to the _log function', specShowHistory);
      function specShowHistory() {
        spyOn(Logger, '_log');
        Logger.showHistory();
        expect(Logger._log.calls.count()).toEqual(mockLogHistory.history.length);
      }
    });

    function activateBeforeEach() {
      module('ngLogModule');

      mockLogHistory = {
        history: [mockHistory, mockHistory]
      };

      module(function ($provide) {
        $provide.value('ngLogHistory', mockLogHistory);
      });

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

    function DISetter(ngLog) {
      Logger = ngLog;
    }


  });
})();
