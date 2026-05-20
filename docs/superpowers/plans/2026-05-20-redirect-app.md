# Приложение редиректов — План реализации

> **Для агентов:** ОБЯЗАТЕЛЬНЫЙ СУБ-СКИЛЛ: используй superpowers:subagent-driven-development (рекомендуется) или superpowers:executing-plans для пошагового выполнения. Шаги размечены чекбоксами (`- [ ]`).

**Цель:** Создать NestJS-приложение с одним эндпоинтом `GET /redirect?url=<target>`, который делает HTTP 302 редирект, и задеплоить его на Vercel.

**Архитектура:** Стандартный NestJS-проект с Express-адаптером. Vercel запускает приложение как Serverless Function — `api/index.ts` инициализирует Nest и передаёт ему запросы. Все маршруты через `vercel.json` направляются на этот handler.

**Стек:** NestJS 10, Express, @vercel/node, TypeScript, Jest

---

## Структура файлов

| Файл | Назначение |
|---|---|
| `package.json` | Зависимости и скрипты (генерируется CLI) |
| `tsconfig.json` | Конфиг TypeScript со strict mode (генерируется CLI, обновляется) |
| `nest-cli.json` | Конфиг Nest CLI (генерируется CLI) |
| `src/app.module.ts` | Корневой модуль (перезаписывается) |
| `src/app.controller.ts` | Эндпоинт GET /redirect (перезаписывается) |
| `src/app.controller.spec.ts` | Тесты контроллера (перезаписывается) |
| `src/main.ts` | Bootstrap для локального запуска (генерируется CLI) |
| `api/index.ts` | Vercel serverless handler |
| `vercel.json` | Роутинг Vercel |

---

## Задача 1: Скаффолдинг через Nest CLI

**Файлы:**
- Генерируется: `package.json`, `tsconfig.json`, `nest-cli.json`, `src/main.ts`, `src/app.module.ts`, `src/app.controller.ts`, `src/app.controller.spec.ts`, `src/app.service.ts`

- [ ] **Шаг 1: Создать NestJS проект через CLI**

```bash
npx @nestjs/cli new . --skip-git --package-manager npm
```

Если CLI спрашивает про существующие файлы — подтверди перезапись. Проект будет создан в текущей директории.

Ожидаемый результат: появляются `src/`, `node_modules/`, `package.json`, `tsconfig.json`, `nest-cli.json`.

- [ ] **Шаг 2: Удалить ненужные файлы**

```bash
rm src/app.service.ts src/app.service.spec.ts
```

- [ ] **Шаг 3: Включить strict mode в `tsconfig.json`**

Открыть `tsconfig.json`, удалить строки `"strictNullChecks": false` и `"noImplicitAny": false` (если есть), добавить `"strict": true`:

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
    "strict": true
  }
}
```

- [ ] **Шаг 4: Установить `@vercel/node`**

```bash
npm install --save-dev @vercel/node
```

- [ ] **Шаг 5: Закоммитить**

```bash
git add package.json package-lock.json tsconfig.json nest-cli.json src/main.ts
git commit -m "Скаффолдинг NestJS проекта через Nest CLI"
```

---

## Задача 2: Корневой модуль

**Файлы:**
- Изменить: `src/app.module.ts`

- [ ] **Шаг 1: Заменить содержимое `src/app.module.ts`**

CLI генерирует модуль с импортом `AppService` — он нам не нужен. Заменить файл:

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
})
export class AppModule {}
```

- [ ] **Шаг 2: Закоммитить**

```bash
git add src/app.module.ts
git commit -m "Упростить AppModule, убрать AppService"
```

---

## Задача 3: Контроллер редиректа (TDD)

**Файлы:**
- Изменить: `src/app.controller.spec.ts`
- Изменить: `src/app.controller.ts`

- [ ] **Шаг 1: Заменить тесты в `src/app.controller.spec.ts`**

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

Ожидаемый результат: тесты падают, так как текущий контроллер не имеет метода `redirect`.

- [ ] **Шаг 3: Заменить `src/app.controller.ts`**

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

В отдельном терминале:

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
