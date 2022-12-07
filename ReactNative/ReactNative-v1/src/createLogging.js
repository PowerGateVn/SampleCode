import ENV from '~app/env';
import Logging from '~app/utils/logging';

function formatRecord(record) {
  return `${record.timestamp.toISOString()} ${Logging.levelToString(record.level)} ${record.loggerName} ${record.message}`;
}

export default function configureLogging() {
  if (ENV.DEBUG) {
    Logging.configureLoggers({
      'root': {
        level: Logging.LOG_LEVELS.DEBUG,
        handlers: [
          new Logging.DebugHandler(formatRecord),
        ],
      },
      'app.actionLog': {
        level: Logging.LOG_LEVELS.IGNORE,
      },
      'app.actions': {
        level: Logging.LOG_LEVELS.TRACE,
      },
      'app.reducers': {
        level: Logging.LOG_LEVELS.TRACE,
      },
      'app.sagas': {
        level: Logging.LOG_LEVELS.TRACE,
      },
      'app.ui': {
        level: Logging.LOG_LEVELS.TRACE,
      },
    });
  }
  else {
    Logging.configureLoggers({
      'root': {
        level: Logging.LOG_LEVELS.WARN,
        handlers: [
          new Logging.StderrHandler(formatRecord),
        ],
      },
    });
  }
}
