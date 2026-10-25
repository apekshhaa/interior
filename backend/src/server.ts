import { createServer } from 'node:http';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { env } from './config/env.js';
import { createApp } from './app.js';

const server = createServer(createApp());

try {
  await connectDatabase();
  server.listen(env.PORT, () => {
    console.log(`COLOUR TONE API listening on port ${env.PORT}`);
  });
} catch (error) {
  console.error(
    'COLOUR TONE API could not connect to MongoDB. Check the Atlas network access list, database credentials, and local network.',
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
}

async function shutdown(signal: string) {
  console.log(`Received ${signal}; shutting down`);
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
