(function () {
  'use strict';
  angular
    .module('ngLogModule')
    .provider('ngLog', NgLog);

  function NgLog() {
    // Just in case IE behaves like...well, IE
    var self = this;

    // Options that will affect all loggers
    self.globalOptions = {
      dateFormat: 'h:mm:ss a',
      // Each logger will save any logs to the history this could create a really big object
      // if there are a lot of logs
      history: {
        enable: false
      },
      // This mutes all logging throughout the app
      mute: false,
      // Will log the time stamp after each log
      showMeta: true
    };

    var options = {
      // Will avoid any log with logging level lower than the one set from here
      filterFrom: null,
      // Will mute every log except the one specified here
      muteExcept: null
    };

    self.$get = $get;

    $get.$inject = ['$filter', 'ngLogColor', 'ngLogHistory', 'ngLogLevel'];
    function $get($filter, LCS, LH, Levels) {

      /**
       * Will define the Logger class
       * @param context
       * @constructor
       */
      function Logger(context) {
        this.$parent = null;
        this.$root = this;
        this.context = context;
        this.options = options;
      }

      Logger.prototype = {
        get             : get,
        _log            : _log,
        constructor     : Logger,
        Levels          : Levels,
        filterLogging   : filterLogging,
        muteLoggingBut  : muteLoggingBut,
        showHistory     : showHistory,
        debug           : logFnGetter(Levels.DEBUG),
        error           : logFnGetter(Levels.ERROR),
        info            : logFnGetter(Levels.INFO),
        log             : logFnGetter(Levels.LOG),
        warn            : logFnGetter(Levels.WARN)
      };

      return new Logger('root');

      /**
       * We'll use this function to define our on log levels (console.log, info, etc...)
       * @param originalFn name of the function that will be replaced
       * @param args arguments received by the Logger
       * @private
       */
      function _log(originalFn, args) {

        // When the history is enabled, will save the parameters that were used when a Logger was called
        if (self.globalOptions.history.enable){
          LH.history.push({originalFn: originalFn, args: args});
        }

        if (!isConsolable(originalFn, this)){
          return;
        }

        var toLogArray = getFormattedContext.call(this);

        // We'll append the args that the Logger should log to the entire message
        _.each(args, function(arg){
          toLogArray.push(arg);
        });

        // Prevent logging when console is not available
        if (window.console) {
          console[originalFn].apply(console, toLogArray);
          showMetaInfo();
        }

      }

      /**
       * This will create Logger instances, whether it's a brand new instance or inherits from another Logger
       * @param context this will determine the current Logger context name to be able to identify them
       * @param isolate if true,it will create a new instance that will be it's own root logger
       * @param parent the new instance of the Logger will be created from the parent's instance, thus inheriting from
       * the prototype
       * @returns {object} Logger instance
       */
      function createLoggerInstance(context, isolate, parent) {
        var child;
        parent = parent || this;
        // When isolate is true, we'll return a brand new instance of the Logger
        if (isolate) {
          child = new Logger(context);
          child.$root = this.$root;
        } else {
          // Only create child Logger if asked for one
          // we'll cache this in order to ease future look ups
          if (!this.$$ChildLogger) {
            this.$$ChildLogger = function ChildLogger(context) {
              this.context = context;
            };
            this.$$ChildLogger.prototype = this;
          }
          child = new this.$$ChildLogger(context);
        }
        // Set reference to the parent and inherit it's options
        child.$parent = parent;
        child.options = parent.options;
        return child;
      }

      /**
       * Set the Logger level that will prevent Logger levels below to print into the console
       * @param level
       */
      function filterLogging(level) {
        this.options.filterFrom = level;
      }

      /**
       * Getter for a Logger instance, if no instance is found, a new one will be created
       * @param context name of the instance that will define the logger and it's hierarchy tree
       * @param isolate if true, it will create a new instance that will be it's own root logger
       * @returns {Object} Logger instance
       */
      function get(context, isolate) {
        var parent = this.$root;
        var hierarchyTree = [];

        // If the current context is different than the root, then we will union the current context and the one passed
        // in order to correctly identify the hierarchy tree
        if(this.context !== 'root'){
          hierarchyTree = _.union(this.context.split('.'), context.split('.'));
        }else{
          hierarchyTree = context.split('.');
        }
        context = '';
        // We're going to navigate through the rest of the tree, and return when we found an instance of the requested
        // Logger. If along the tree, there is a branch that doesn't exist, it will be created automatically
        _.each(hierarchyTree, function (child, index) {
          context = _.take(hierarchyTree, index + 1).join('.');
          if(_.isUndefined(parent[child])){
            parent[child] = createLoggerInstance.call(parent.$root, context, isolate, parent);
          }
          parent = parent[child];
        });

        return parent;
      }

      /**
       * Used to format the log timestamp according to the global config
       * @param date
       * @returns {string} date formated and converted to string
       */
      function getFormattedTimestamp(date) {
        return $filter('date')(date, self.globalOptions.dateFormat);
      }

      /**
       * Depending on the context, it will return a colored string in order to be able to identify which Logger instance
       * it belongs to
       * @returns {Array} Logger context formatted with a color scheme
       */
      function getFormattedContext() {
        var consoleMessage = '%c';
        var toLogArray = [];
        consoleMessage += "[ " + this.context + " ] ";

        toLogArray.push(consoleMessage);
        toLogArray.push(LCS.getColor(this.context));
        return toLogArray;
      }

      /**
       * It will add some metadata to each log
       * @returns {Array} formatted Metadata
       */
      function getFormattedMetaInfo() {
        var metaLogArray = [];
        var metaConsoleMessage = '%c';
        metaConsoleMessage += getFormattedTimestamp(new Date()) + ' \t \t ';

        metaLogArray.push(metaConsoleMessage);
        metaLogArray.push(LCS.getMetaColor());
        return metaLogArray;
      }

      /**
       * Here we'll check the Logger's options to know if we should not be logging the requested Logger level
       * If no options is found in the current Logger, we'll also crawl the parent tree
       * @param originalFn Log function that will determine the Logger Level
       * @param logger the Logger instance
       * @returns {boolean}
       */
      function isConsolable(originalFn, logger) {
        if (self.globalOptions.mute) return false;
        var consolable = true;
        var mute = logger.options;

        if (mute.filterFrom !== null){
          consolable = !(Levels[originalFn.toUpperCase()].isLessThan(mute.filterFrom));
        }

        if (mute.muteExcept !== null){
          consolable = !(originalFn !== mute.muteExcept);
        }

        if (consolable && logger.$parent) {
          return isConsolable(originalFn, logger.$parent);
        }

        return consolable;
      }

      /**
       * It will return a function that wraps the call to _log with the proper log Level
       * @param logFnLevel
       * @returns {Function}
       */
      function logFnGetter(logFnLevel){
        return function ngLogWrapperFn(){
          this._log(logFnLevel.toString(), arguments);
        }
      }

      /**
       * Set the Logger level that will prevent all Logger levels except itself to print into the console
       * @param level
       */
      function muteLoggingBut(level) {
        this.options.muteExcept = level;
      }

      /**
       * Print the current Logger history
       */
      function showHistory() {
        var historyLength = LH.history.length;
        var currentHistory;
        for (var i = 0; i < historyLength; i++) {
          currentHistory = LH.history[i];
          this._log(currentHistory.originalFn, currentHistory.args);
        }
      }

      /**
       * Will generate the meta data after each logger when enabled by the global options
       */
      function showMetaInfo() {
        if (self.globalOptions.showMeta) {
          console.log.apply(console, getFormattedMetaInfo());
        }
      }

    }
  }
})();
