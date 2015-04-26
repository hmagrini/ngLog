(function () {
  'use strict';

  describe('Factory: ngLogColor', function () {

    var LCS;

    beforeEach(activateBeforeEach);

    describe('should have a function called getColor', function (){
      checkDefinitionByType('getColor', Function);

      it('should return a new color combination for different Loggers', specGetColorDifferentLogs);

      it('should return the same color combination for the same Logger', specGetColorSameLogs);

    });

    describe('should have a function called getMetaColor',function(){
      checkDefinitionByType('getMetaColor', Function);

      it('should return the meta style for the meta info', function(){
        var META_INFO = 'padding: 2px; margin:2px; line-height: 1.8em;font-size:0.9em; color: #CDCDCD; padding-left:30px;';
        expect(LCS.getMetaColor()).toEqual(META_INFO);
      });
    });

    function activateBeforeEach() {
      module('ngLogModule');
      inject(DISetter);
    }

    function checkDefinitionByType(name, type) {
      it('should be defined', function () {
        expect(LCS[name]).toBeDefined();
      });

      it('should be a ' + type.toString(), function () {
        expect(LCS[name]).toEqual(jasmine.any(type));
      });
    }

    function DISetter(ngLogColor) {
      LCS = ngLogColor;
    }

    function specGetColorDifferentLogs(){
      expect(LCS.getColor('some context')).not.toEqual(LCS.getColor('another context'));
    }

    function specGetColorSameLogs(){
      expect(LCS.getColor('some context')).toEqual(LCS.getColor('some context'));
    }

  });
})();
