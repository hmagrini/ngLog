(function () {
  "use strict";
  angular
      .module('ngLogModule')
      .factory('ngLogColor', ngLogColor);

  function ngLogColor() {
    var GROUP_COLORS = [
      // first is BG color, second is foreground color, third is border
      ['#F9A825', '#000000', '#FDD835'],
      ['#C62828', '#FFFFFF', '#E53935'],
      ['#BF360C', '#FFFFFF', '#E64A19'],
      ['#212121', '#FFFFFF', '#616161'],
      ['#00695C', '#FFFFFF', '#00897B'],
      ['#3E2723', '#FFFFFF', '#5D4037'],
      ['#0D47A1', '#FFFFFF', '#1976D2'],
      ['#311B92', '#FFFFFF', '#512DA8'],
      ['#6A1B9A', '#FFFFFF', '#8E24AA'],
      ['#01579B', '#FFFFFF', '#0288D1'],
      ['#0277BD', '#FFFFFF', '#039BE5'],
      ['#4527A0', '#FFFFFF', '#5E35B1'],
      ['#4E342E', '#FFFFFF', '#6D4C41'],
      ['#37474F', '#FFFFFF', '#546E7A'],
      ['#F57F17', '#000000', '#FBC02D'],
      ['#EF6C00', '#FFFFFF', '#FB8C00'],
      ['#2E7D32', '#FFFFFF', '#43A047'],
      ['#1A237E', '#FFFFFF', '#303F9F'],
      ['#33691E', '#FFFFFF', '#689F38'],
      ['#880E4F', '#FFFFFF', '#C2185B'],
      ['#9E9D24', '#000000', '#C0CA33'],
      ['#B71C1C', '#FFFFFF', '#D32F2F'],
      ['#FF8F00', '#000000', '#FFB300'],
      ['#006064', '#FFFFFF', '#0097A7'],
      ['#E65100', '#000000', '#F57C00'],
      ['#D84315', '#FFFFFF', '#F4511E'],
      ['#4A148C', '#FFFFFF', '#7B1FA2'],
      ['#283593', '#FFFFFF', '#3949AB'],
      ['#263238', '#FFFFFF', '#455A64'],
      ['#004D40', '#FFFFFF', '#00796B'],
      ['#424242', '#FFFFFF', '#757575'],
      ['#AD1457', '#FFFFFF', '#D81B60'],
      ['#1565C0', '#FFFFFF', '#1E88E5'],
      ['#558B2F', '#FFFFFF', '#7CB342'],
      ['#1B5E20', '#FFFFFF', '#388E3C'],
      ['#FF6F00', '#000000', '#FFA000'],
      ['#827717', '#FFFFFF', '#AFB42B'],
      ['#00838F', '#FFFFFF', '#00ACC1']
    ];

    var BASE_CSS = 'padding: 2px; margin:2px; line-height: 1.8em;';
    var META_STYLE = BASE_CSS + 'font-size:0.9em; color: #CDCDCD; padding-left:30px;';

    var _foundColors = [];

    var LCS = {
      getColor      : getColor,
      getMetaColor  : getMetaColor
    };

    getColor.cache = {};

    return LCS;

    /**
     * Will return a color css string for the selected Logger context
     * @param context
     * @returns {string}
     */
    function getColor(context) {

      if(!getColor.cache[context]){
        var color = '';
        var cssString = '';

        if (_foundColors.length >= GROUP_COLORS.length) {
          // Is the index too high? loop around if so
          color = GROUP_COLORS[_foundColors.length % GROUP_COLORS.length];
          cssString += 'font-style: italic;';
        } else {
          // We haven't yet exhausted all the colors
          color = GROUP_COLORS[_foundColors.length];
        }

        cssString += BASE_CSS +
        "background: " + color[0] + ";" +
        "border: 1px solid " + color[2] + ";" +
        "color: " + color[1] + ";";

        // update the stored color info
        _foundColors.push(color);
        getColor.cache[context] = cssString;

        return cssString;
      }
      return getColor.cache[context];
    }

    /**
     * Returns the Meta info style
     * @returns {string}
     */
    function getMetaColor() {
      return META_STYLE;
    }
  }
})();
