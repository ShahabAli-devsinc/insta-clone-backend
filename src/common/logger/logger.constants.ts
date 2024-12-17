export const LOGGER_CONSTANTS = {
    LOG_FILE_PATH: 'logs/app.log',
    LOG_LEVEL: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  };
  