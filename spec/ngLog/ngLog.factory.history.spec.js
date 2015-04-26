(function () {
  'use strict';

  describe('Factory: ngLogHistory', function () {

    var LH;

    beforeEach(activateBeforeEach);

    describe('should have an Array called history', function (){
      checkDefinitionByType('history', Array);
    });

    function activateBeforeEach() {
      module('ngLogModule');
      inject(DISetter);
    }

    function checkDefinitionByType(name, type) {
      it('should be defined', function () {
        expect(LH[name]).toBeDefined();
      });

      it('should be a ' + type.toString(), function () {
        expect(LH[name]).toEqual(jasmine.any(type));
      });
    }

    function DISetter(ngLogHistory) {
      LH = ngLogHistory;
    }

  });
})();
