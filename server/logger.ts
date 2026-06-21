/**
 * Structured logging utility for DeepShield API server.
 *
 * Replaces scattered `console.log` calls with level-tagged, timestamped
 * JSON logs that are easy to parse in production log aggregators
 * (Cloud Logging, Datadog, etc.).
 */

export type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  requestId?: string;
  [key: string]: unknown;
}

function formatEntry(level: LogLevel, message: string, meta?: Record<string, unknown>): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };
}

export const logger = {
  info(message: string, meta?: Record<string, unknown>): void {
    console.log(JSON.stringify(formatEntry('info', message, meta)));
  },

  warn(message: string, meta?: Record<string, unknown>): void {
    console.warn(JSON.stringify(formatEntry('warn', message, meta)));
  },

  error(message: string, meta?: Record<string, unknown>): void {
    console.error(JSON.stringify(formatEntry('error', message, meta)));
  },
};
