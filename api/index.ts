import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';
import { VercelRequest, VercelResponse } from '@vercel/node';

const expressApp = express();
const adapter = new ExpressAdapter(expressApp);

let initPromise: Promise<void> | null = null;

function initApp(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      const app = await NestFactory.create(AppModule, adapter, { logger: ['error', 'warn'] });
      await app.init();
    })();
  }
  return initPromise!;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await initApp();
  expressApp(req as any, res as any);
}
