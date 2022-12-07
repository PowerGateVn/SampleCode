import EventEmitter from 'events';

const LOG_LEVELS = {
  NOTSET: 0,
  TRACE: 10,
  DEBUG: 20,
  INFO: 30,
  WARN: 40,
  ERROR: 50,
  IGNORE: 100,
};

class Logger {
  constructor({name, level=LOG_LEVELS.NOTSET, parent, manager, propagate=true}) {
    this.name = name;
    this.level = level;
    this.manager = manager;
    this.parent = parent;
    this.propagate = propagate;
    this.handlers = [];
  }

  trace(msg, opts) {
    this.log(LOG_LEVELS.TRACE, msg, opts);
  }

  debug(msg, opts) {
    this.log(LOG_LEVELS.DEBUG, msg, opts);
  }

  info(msg, opts) {
    this.log(LOG_LEVELS.INFO, msg, opts);
  }

  warn(msg, opts) {
    this.log(LOG_LEVELS.WARN, msg, opts);
  }

  error(msg, opts) {
    this.log(LOG_LEVELS.ERROR, msg, opts);
  }

  log(level, msg, opts) {
    if (this.isEnabledFor(level)) {
      this._log(level, msg, opts);
    }
  }

  getEffectiveLevel() {
    let logger = this;
    while (logger) {
      if (logger.level !== LOG_LEVELS.NOTSET) {
        return logger.level;
      }
      logger = logger.parent;
    }
    return LOG_LEVELS.NOTSET;
  }

  isEnabledFor(level) {
    return level >= this.getEffectiveLevel();
  }

  _log(level, msg, opts={}) {
    const ts = new Date();
    if (typeof msg === 'function') {
      msg = msg();
    }
    const record = new LogRecord(this.name, level, ts, msg, opts);
    callHandlers(this, record);
  }
}

function callHandlers(logger, record) {
  for (let handler of logger.handlers) {
    handler.emit(record);
  }

  if (logger.propagate && logger.parent) {
    callHandlers(logger.parent, record);
  }
}

function findParentLogger(loggers, name) {
  let parts = name.split('.');
  while (parts.length > 1) {
    parts.pop(); // throw away child name
    const path = parts.join('.');
    const logger = loggers.get(path);
    if (logger) {
      return logger;
    }
  }
  return loggers.get('root');
}

function findChildLoggers(loggers, name) {
  return Array.from(loggers.values()).filter(child => {
    const parts = child.name.split('.');
    while (parts.length > 1) {
      parts.pop(); // throw away child name
      const path = parts.join('.');
      if (path === name) {
        return true;
      }
    }
    return false;
  });
}

function fixChildren(loggers, logger) {
  findChildLoggers(loggers, logger.name).forEach(child => {
    child.parent = logger;
  });
}

class LogRecord {
  constructor(loggerName, level, timestamp, msg, opts={}) {
    this.loggerName = loggerName;
    this.level = level;
    this.timestamp = timestamp;
    this.message = msg;
    this.opts = opts;
  }
}

class LogManager {
  constructor() {
    this.loggers = new Map();
    this.createLogger('root');
  }

  configureLoggers(loggers) {
    Object.keys(loggers).forEach(name => {
      const opts = loggers[name];
      const logger = this.getLogger(name);
      if (opts.propagate !== undefined) {
        logger.propagate = opts.propagate;
      }
      if (opts.handlers !== undefined) {
        logger.handlers = opts.handlers;
      }
      if (opts.level !== undefined) {
        logger.level = opts.level;
      }
    });
  }

  createLogger(name) {
    const parent = findParentLogger(this.loggers, name);

    const logger = new Logger({
      name,
      parent,
      manager: this,
    });
    fixChildren(this.loggers, logger);
    this.loggers.set(name, logger);
    return logger;
  }

  getLogger(name) {
    let logger = this.loggers.get(name);
    if (logger === undefined) {
      logger = this.createLogger(name);
    }
    return logger;
  }
}

const defaultManager = global.ptLogManager = global.ptLogManager || new LogManager();

const configureLoggers = defaultManager.configureLoggers.bind(defaultManager);
const getLogger = defaultManager.getLogger.bind(defaultManager);

const levelStrings = {
  [LOG_LEVELS.TRACE]: 'TRACE',
  [LOG_LEVELS.DEBUG]: 'DEBUG',
  [LOG_LEVELS.INFO]:  'INFO ',
  [LOG_LEVELS.WARN]:  'WARN ',
  [LOG_LEVELS.ERROR]: 'ERROR',
};

function levelToString(level) {
  return levelStrings[level];
}

function basicFormat(record) {
  return `${levelToString(record.level)} ${record.message}`;
}

class DebugHandler {
  constructor(format=basicFormat) {
    this.format = format;
  }

  emit(record) {
    const msg = this.format(record);
    if (record.level < LOG_LEVELS.WARN) {
      console.log(msg); // eslint-disable-line
    }
    else {
      console.error(msg); // eslint-disable-line
    }
  }
}

class StderrHandler {
  constructor(format=basicFormat) {
    this.format = format;
  }

  emit(record) {
    const msg = this.format(record);
    console.error(msg); // eslint-disable-line
  }
}

class EventEmittingHandler extends EventEmitter {
  constructor(format=basicFormat) {
    super();
    this.format = format;
  }

  emit(record) {
    const msg = this.format(record);
    super.emit('log', msg);
  }
}

export default {
  configureLoggers,
  getLogger,
  defaultManager,

  LOG_LEVELS,
  Logger,
  LogRecord,
  LogManager,

  basicFormat,
  levelToString,
  DebugHandler,
  EventEmittingHandler,
  StderrHandler,
};
