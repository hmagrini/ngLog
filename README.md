# ngLog

# Features:

* Prevents logging when console is unavailable
* Creates a logging history for reviewing
* Context logging:
 + Each instance of the logger will be grouped by a defined context 
 + Each context will log with its own color to identify contexts more easily
* Muted Logs via filter:
 + The property Options and Filters will be inherited by every child within a Logger
 + ContextMute can be set via filterLogging(): this allows to set a ngLog.Level, which will mute all logging levels below than that Level.
 + ContextMute can be also set by muteLoggingBut(): this allows to set a ngLog.Level, which will mute all logging levels except the one provided.

* Timestamp format can be configured through the LoggerProvider

# Sample Usage:

**Logging**
* Step 1: Inject ngLogModule as a dependency 
```javascript
  app.module('mySampleModule',['ngLogModule']);
```
* Step 2: Inject ngLog provider to wherever you need a Logger
```javascript
  app.module('mySampleModule')
     .controller('sampleController', ['ngLog', function(ngLog){
       // controller implementation
     }]);
```
* Step 3: create a new instance of the logger with the desired context name
```javascript
  var firstLogger = ngLog.get('firstLogger');
  firstLogger.log('Log example'); // Will output: 'Log example'
```

**Logger hierarchy and filter/mute inheritance**
* You can get a new Logger instance from the injected service:
```javascript
  var firstLogger = ngLog.get('firstLogger');
  firstLogger.filterLogging(ngLog.Levels.DEBUG);
  firstLogger.log('Log example'); // Won't output anything
```
* You can also have a nested Logger that will inherit the parents mute/filter options:
```javascript
  var firstLogger = ngLog.get('firstLogger');
  firstLogger.filterLogging(ngLog.Levels.DEBUG);
  var firstLoggerChild = ngLog.get('firstLogger.firstChild');
  firstLogger.log('Log example'); // Won't output anything
  firstLoggerChild.log('Log example'); // Won't output anything
  firstLoggerChild.debug('Another log example') // Will output: 'Another log example'
```
* Or you could just create the child Logger from the parent:
```javascript
  var firstLogger = ngLog.get('firstLogger');
  firstLogger.filterLogging(ngLog.Levels.DEBUG);
  var firstLoggerChild = firstLogger.get('firstChild');
  firstLogger.log('Log example'); // Won't output anything
  firstLoggerChild.log('Log example'); // Won't output anything
  firstLoggerChild.debug('Another log example') // Will output: 'Another log example'
```
* If there is a branch in the hierarchy missing, it will be automatically created:
```javascript
  var firstLogger = ngLog.get('firstLogger');
  firstLogger.filterLogging(ngLog.Levels.DEBUG);
  var firstLoggerGrandChild = ngLog.get('firstLogger.firstChild.firtGrandChild');
  firstLogger.log('Log example'); // Won't output anything
  firstLoggerGrandChild.log('Log example'); // Won't output anything
  firstLoggerGrandChild.info(firstLoggerGrandChild.$parent.context) // Will output: 'firstLogger.firstChild'
```
