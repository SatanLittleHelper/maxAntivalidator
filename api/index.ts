import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import * as express from 'express';
import { VercelRequest, VercelResponse } from '@vercel/node';

const expressApp = express();
const adapter = new ExpressAdapter(expressApp);

let appInitialized = false;

async function initApp(): Promise<void> {
  if (appInitialized) return;
  const app = await NestFactory.create(AppModule, adapter, { logger: false });
  await app.init();
  appInitialized = true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await initApp();
  expressApp(req as any, res as any);
}
