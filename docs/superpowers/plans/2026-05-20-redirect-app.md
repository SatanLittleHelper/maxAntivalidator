# Приложение редиректов — План реализации

> **Для агентов:** ОБЯЗАТЕЛЬНЫЙ СУБ-СКИЛЛ: используй superpowers:subagent-driven-development (рекомендуется) или superpowers:executing-plans для пошагового выполнения. Шаги размечены чекбоксами (`- [ ]`).

**Цель:** Создать NestJS-приложение с одним эндпоинтом `GET /redirect?url=<target>`, который делает HTTP 302 редирект, и задеплоить его на Vercel.

**Архитектура:** Стандартный NestJS-проект с Express-адаптером. Vercel запускает приложение как Serverless Function — `api/index.ts` инициализирует Nest и передаёт ему запросы. Все маршруты через `vercel.json` направляются на этот handler.

**Стек:** NestJS 10, Express, @vercel/node, TypeScript, Jest

---

## Структура файлов

| Файл | Назначение |
|---|---|
| `package.json` | Зависимости и скрипты |
| `tsconfig.json` | Конфиг TypeScript |
| `nest-cli.json` | Конфиг Nest CLI |
| `src/app.module.ts` | Корневой модуль |
| `src/app.controller.ts` | Эндпоинт GET /redirect |
| `src/app.controller.spec.ts` | Тесты контроллера |
| `src/main.ts` | Bootstrap для локального запуска |
| `api/index.ts` | Vercel serverless handler |
| `vercel.json` | Роутинг Vercel |

---

## Задача 1: Инициализация проекта

**Файлы:**
- Создать: `package.json`
- Создать: `tsconfig.json`
- Создать: `nest-cli.json`

- [ ] **Шаг 1: Создать `package.json`**

```json
{
  "name": "max-antivalidator",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.2",
    "@types/node": "^20.3.1",
    "@vercel/node": "^3.0.0",
    "jest": "^29.5.0",
    "ts-jest": "^29.1.0",
    "typescript": "^5.1.3"
  },
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": { "^.+\\.(t|j)s$": "ts-jest" },
    "testEnvironment": "node"
  }
}
```

- [ ] **Шаг 2: Создать `tsconfig.json`**

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false
  }
}
```

- [ ] **Шаг 3: Создать `nest-cli.json`**

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src"
}
```

- [ ] **Шаг 4: Установить зависимости**

```bash
npm install
```

Ожидаемый результат: появляется `node_modules/`, `package-lock.json`.

- [ ] **Шаг 5: Закоммитить**

```bash
git add package.json tsconfig.json nest-cli.json package-lock.json
git commit -m "Инициализация NestJS проекта"
```

---

## Задача 2: Корневой модуль и bootstrap

**Файлы:**
- Создать: `src/app.module.ts`
- Создать: `src/main.ts`

- [ ] **Шаг 1: Создать `src/app.module.ts`**

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
})
export class AppModule {}
```

- [ ] **Шаг 2: Создать `src/main.ts`**

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();
```

- [ ] **Шаг 3: Закоммитить**

```bash
git add src/app.module.ts src/main.ts
git commit -m "Добавить корневой модуль и bootstrap"
```

---

## Задача 3: Контроллер редиректа (TDD)

**Файлы:**
- Создать: `src/app.controller.spec.ts`
- Создать: `src/app.controller.ts`

- [ ] **Шаг 1: Написать падающий тест в `src/app.controller.spec.ts`**

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { Response } from 'express';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('редиректит на переданный url с кодом 302', () => {
    const mockRes = { redirect: jest.fn() } as unknown as Response;
    controller.redirect('https://example.com', mockRes);
    expect(mockRes.redirect).toHaveBeenCalledWith(302, 'https://example.com');
  });

  it('передаёт url как есть, без изменений', () => {
    const mockRes = { redirect: jest.fn() } as unknown as Response;
    const url = 'https://example.com/path?foo=bar&baz=qux';
    controller.redirect(url, mockRes);
    expect(mockRes.redirect).toHaveBeenCalledWith(302, url);
  });
});
```

- [ ] **Шаг 2: Запустить тест — убедиться, что падает**

```bash
npm test
```

Ожидаемый результат: ошибка `Cannot find module './app.controller'`.

- [ ] **Шаг 3: Реализовать контроллер в `src/app.controller.ts`**

```typescript
import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get('redirect')
  redirect(@Query('url') url: string, @Res() res: Response): void {
    res.redirect(302, url);
  }
}
```

- [ ] **Шаг 4: Запустить тест — убедиться, что проходит**

```bash
npm test
```

Ожидаемый результат:
```
PASS src/app.controller.spec.ts
  AppController
    ✓ редиректит на переданный url с кодом 302
    ✓ передаёт url как есть, без изменений
```

- [ ] **Шаг 5: Закоммитить**

```bash
git add src/app.controller.ts src/app.controller.spec.ts
git commit -m "Добавить контроллер редиректа с тестами"
```

---

## Задача 4: Vercel serverless handler

**Файлы:**
- Создать: `api/index.ts`
- Создать: `vercel.json`

- [ ] **Шаг 1: Создать `api/index.ts`**

```typescript
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
```

- [ ] **Шаг 2: Создать `vercel.json`**

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/api/index" }
  ]
}
```

- [ ] **Шаг 3: Закоммитить**

```bash
git add api/index.ts vercel.json
git commit -m "Добавить Vercel serverless handler"
```

---

## Задача 5: Локальная проверка

- [ ] **Шаг 1: Запустить приложение локально**

```bash
npm run start:dev
```

Ожидаемый результат: `Nest application successfully started` на порту 3000.

- [ ] **Шаг 2: Проверить редирект**

```bash
curl -v "http://localhost:3000/redirect?url=https://example.com" 2>&1 | grep -E "Location|< HTTP"
```

Ожидаемый результат:
```
< HTTP/1.1 302 Found
< Location: https://example.com
```

- [ ] **Шаг 3: Остановить сервер** (Ctrl+C)

---

## Задача 6: Деплой на Vercel

- [ ] **Шаг 1: Установить Vercel CLI (если не установлен)**

```bash
npm install -g vercel
```

- [ ] **Шаг 2: Авторизоваться в Vercel**

```bash
vercel login
```

Следуй инструкциям в браузере.

- [ ] **Шаг 3: Задеплоить**

```bash
vercel deploy --prod
```

На вопросы CLI отвечай:
- `Set up and deploy?` → Y
- `Which scope?` → выбери свой аккаунт
- `Link to existing project?` → N
- `Project name` → `max-antivalidator` (или Enter для дефолта)
- `In which directory is your code located?` → `./` (Enter)

Ожидаемый результат: URL вида `https://max-antivalidator-xxx.vercel.app`.

- [ ] **Шаг 4: Проверить редирект на проде**

```bash
curl -v "https://<твой-домен>.vercel.app/redirect?url=https://example.com" 2>&1 | grep -E "Location|< HTTP"
```

Ожидаемый результат:
```
< HTTP/1.1 302 Found
< Location: https://example.com
```
