# ngLog

# Features:

* Prevents logging when console is unavailable
* Creates a logging history for reviewing
* Context logging:
 + Each instance of the logger will be grouped by a defined context 
 + Each context will log with its own color to identify contexts more easily
* Muted Logs via filter:
 + The property Options and Filters will be inherited by every child within a Logger
 + ContextMute can be set via filterLogging()
 + This allows to set a Logger.Level, which will mute all logging levels below than that Level.
 + ContextMute can be also set by muteLoggingBut()
 + This allows to set a Logger.Level, which will mute all logging levels except the one provided.

* Timestamp format can be configured through the LoggerProvider

# Sample Usage:

**Logging**
* Step 1: inject Logger as a dependency 
* 
* Step 2: create a new instance of the logger with the desired context name
```javascript
  var firstLogger = Logger.$new('firstLogger');
  firstLogger.setLoggingLevel(Logger.Levels.LOG);

  firstLogger.log('this should not log');
  firstLogger.info('parent logging');
  firstLogger.error('parent logging');

  var child = Logger.$new('firstLogger.child');
  child.setLoggingLevel(Logger.Levels.INFO);

  child.log('this should not log');
  child.info('this should not log');
  child.error('child logging');

  var grandchild = Logger.$new('firstLogger.child.grandchild');

  grandchild.log('this should not log');
  grandchild.info('this should not log');
  grandchild.error('grand child logging');
```
