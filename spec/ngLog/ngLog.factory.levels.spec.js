(function () {
  'use strict';

  describe('Factory: ngLogLevel', function () {

    var logLevel;

    beforeEach(activateBeforeEach);

    describe('should define this Level objects as constants', function () {

      checkDefinitionByType('VERBOSE', Object);

      checkDefinitionByType('LOG', Object);

      checkDefinitionByType('DEBUG', Object);

      checkDefinitionByType('INFO', Object);

      checkDefinitionByType('WARN', Object);

      checkDefinitionByType('ERROR', Object);

      checkDefinitionByType('SILENT', Object);

    });

    describe('should have a function called isEqualTo that', function () {

      it('should be correctly defined', specEqualTo);
      function specEqualTo() {
        expect(logLevel.INFO.isEqualTo).toBeDefined();
        expect(logLevel.INFO.isEqualTo).toEqual(jasmine.any(Function));
      }

      describe('should return true', specEqualToTruthyResults);

      describe('should return false', specEqualToFalsyResults);

    });

    describe('should have a function called isGreaterThan', function () {

      it('should be correctly defined', specIsGreaterThan);

      describe('should return true', specIsGreaterThanTruthyResults);

      describe('should return false', specIsGreaterThanFalsyResults);

    });

    describe('should have a function called isGreaterThanOrEqualTo', function () {

      it('should be correctly defined', specIsGreaterThanOrEqualTo);

      describe('should return true', specIsGreaterThanOrEqualToTruthyResults);

      describe('should return false', specIsGreaterThanOrEqualToFalsyResults);

    });

    describe('should have a function called isLowerThan', function () {

      it('should be correctly defined', specIsLowerThan);

      describe('should return true', specIsLowerThanTruthyResults);

      describe('should return false', specIsLowerThanFalsyResults);

    });

    describe('should have a function called isLowerThanOrEqualTo', function () {

      it('should be correctly defined', specIsLowerThanOrEqualTo);

      describe('should return true', specIsLowerThanOrEqualToTruthyResults);

      describe('should return false', specIsLowerThanOrEqualToFalsyResults);

    });

    describe('should have a function called toLevel', function (){
      it('should be correctly defined', specToLevel);

      it('should return a Level Object when passed a string', specToLevelAsString);

      it('should return a Level Object when passed a Level Object', spectToLevelAsObject);

    });


    function activateBeforeEach() {
      module('ngLogModule');
      inject(DISetter);
    }

    function checkDefinitionByType(name, type) {
      it('should be defined', function () {
        expect(logLevel[name]).toBeDefined();
      });

      it('should be a ' + type.toString(), function () {
        expect(logLevel[name]).toEqual(jasmine.any(type));
      });
    }

    function DISetter(ngLogLevel) {
      logLevel = ngLogLevel;
    }

    function specEqualToFalsyResults(){
      specGenericCompareFalsy(
        'when different levels are compared',
        'isEqualTo', 'log'
      )
    }

    function specEqualToTruthyResults(){
      specGenericCompareTruthy(
        'when equal levels are compared',
        'isEqualTo', 'info'
      );
    }

    function specGenericCompareFalsy(specMessage, fnToCompare, levelAsArgument) {
      it(specMessage + ', as an string', function specGenericCompareStringFnFalsy() {
        expect(logLevel.INFO[fnToCompare](levelAsArgument))
          .toBeFalsy();
      });

      it(specMessage + ', as an Object', function specGenericCompareObjectFnFalsy() {
        expect(logLevel.INFO[fnToCompare](logLevel.INFO.toLevel(levelAsArgument)))
          .toBeFalsy();
      });
    }

    function specGenericCompareTruthy(specMessage, fnToCompare, levelAsArgument) {
      it(specMessage + ', as an string', function specGenericCompareStringFnTruthy() {
        expect(logLevel.INFO[fnToCompare](levelAsArgument))
          .toBeTruthy();
      });

      it(specMessage + ', as an Object', function specGenericCompareObjectFnTruthy() {
        expect(logLevel.INFO[fnToCompare](logLevel.INFO.toLevel(levelAsArgument)))
          .toBeTruthy();
      });
    }

    function specIsGreaterThan() {
      expect(logLevel.INFO.isGreaterThan).toBeDefined();
      expect(logLevel.INFO.isGreaterThan).toEqual(jasmine.any(Function));
    }

    function specIsGreaterThanFalsyResults(){
      specGenericCompareFalsy(
        'when a level is lower than another',
        'isGreaterThan', 'silent'
      );
    }

    function specIsGreaterThanTruthyResults(){
      specGenericCompareTruthy(
        'when a level is greater than another',
        'isGreaterThan', 'verbose'
      );
    }

    function specIsGreaterThanOrEqualTo() {
      expect(logLevel.INFO.isGreaterThanOrEqualTo).toBeDefined();
      expect(logLevel.INFO.isGreaterThanOrEqualTo).toEqual(jasmine.any(Function));
    }

    function specIsGreaterThanOrEqualToFalsyResults(){
      specGenericCompareFalsy(
        'when a level is lower than another',
        'isGreaterThanOrEqualTo', 'silent'
      );
    }

    function specIsGreaterThanOrEqualToTruthyResults(){
      specGenericCompareTruthy(
        'when a level is greater than another',
        'isGreaterThanOrEqualTo', 'verbose'
      );

      specGenericCompareTruthy(
        'when a level is equal to another',
        'isGreaterThanOrEqualTo', 'info'
      );
    }

    function specIsLowerThan() {
      expect(logLevel.INFO.isLowerThan).toBeDefined();
      expect(logLevel.INFO.isLowerThan).toEqual(jasmine.any(Function));
    }

    function specIsLowerThanFalsyResults(){
      specGenericCompareFalsy(
        'when a level is greater than another',
        'isLowerThan', 'verbose'
      );
    }

    function specIsLowerThanOrEqualTo() {
      expect(logLevel.INFO.isLowerThanOrEqualTo).toBeDefined();
      expect(logLevel.INFO.isLowerThanOrEqualTo).toEqual(jasmine.any(Function));
    }

    function specIsLowerThanOrEqualToFalsyResults(){
      specGenericCompareFalsy(
        'when a level is lower than another',
        'isLowerThanOrEqualTo', 'verbose'
      );
    }

    function specIsLowerThanOrEqualToTruthyResults(){
      specGenericCompareTruthy(
        'when a level is lower than another',
        'isLowerThanOrEqualTo', 'silent'
      );

      specGenericCompareTruthy(
        'when a level is equal to another',
        'isLowerThanOrEqualTo', 'info'
      );
    }

    function specIsLowerThanTruthyResults(){
      specGenericCompareTruthy(
        'when a level is lower than another',
        'isLowerThan', 'silent'
      );
    }

    function specToLevel(){
      expect(logLevel.INFO.toLevel).toBeDefined();
      expect(logLevel.INFO.toLevel).toEqual(jasmine.any(Function));
    }

    function specToLevelAsString(){
      expect(logLevel.INFO.toLevel('log')).toEqual(logLevel.LOG);
    }

    function spectToLevelAsObject(){
      expect(logLevel.INFO.toLevel(logLevel.LOG)).toEqual(logLevel.LOG);
    }

  });
})();
