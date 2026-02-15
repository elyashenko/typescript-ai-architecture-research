/**
 * Shared: Logger
 * 
 * Structured logging utility
 */

export interface LogMeta {
  [key: string]: unknown;
}

export const logger = {
  info(message: string, meta?: LogMeta) {
    console.log(JSON.stringify({
      level: 'info',
      message,
      ...meta,
      timestamp: new Date().toISOString(),
    }));
  },
  
  error(message: string, error: Error, meta?: LogMeta) {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      ...meta,
      timestamp: new Date().toISOString(),
    }));
  },
  
  warn(message: string, meta?: LogMeta) {
    console.warn(JSON.stringify({
      level: 'warn',
      message,
      ...meta,
      timestamp: new Date().toISOString(),
    }));
  },
};
