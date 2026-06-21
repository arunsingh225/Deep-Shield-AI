// DeepShield AI — API server entry point
import 'dotenv/config';
import { app, PORT, MODEL, ALLOWED_ORIGIN, RATE_LIMIT_MAX } from './app';
import { logger } from './logger';

const server = app.listen(PORT, () => {
  logger.info(`API server listening on http://localhost:${PORT}`, {
    model: MODEL,
    corsOrigin: ALLOWED_ORIGIN,
    rateLimit: `${RATE_LIMIT_MAX} req/15min`,
  });
});

function gracefulShutdown(signal: string) {
  logger.info(`Received ${signal} — shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
  // Force close after 10s
  setTimeout(() => process.exit(1), 10_000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
