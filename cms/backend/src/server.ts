import dotenv from 'dotenv';
import { createApp } from './app.js';
import { checkDatabaseConnection, closeDatabaseConnection } from './config/database.js';
import { logger } from './services/logger.service.js';

// Load environment variables
dotenv.config();

// Configuration
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Start server
 */
const startServer = async (): Promise<void> => {
  try {
    // Check database connection
    if (!checkDatabaseConnection()) {
      throw new Error('Database connection failed');
    }
    logger.info('✅ Database connected');

    // Create Express app
    const app = createApp();

    // Start server
    const server = app.listen(PORT, HOST, () => {
      logger.info(`🚀 Server running on http://${HOST}:${PORT}`);
      logger.info(`📝 Environment: ${NODE_ENV}`);
      logger.info(`🔧 API prefix: ${process.env.API_PREFIX || '/api'}`);

      if (NODE_ENV === 'development') {
        logger.info(`📖 Health check: http://localhost:${PORT}/api/health`);
      }
    });

    // Graceful shutdown
    const shutdown = (signal: string) => {
      logger.info(`${signal} received, closing server gracefully...`);

      server.close(() => {
        logger.info('Server closed');
        closeDatabaseConnection();
        logger.info('Database connection closed');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: unknown) => {
      logger.error('Unhandled Rejection:', reason);
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
