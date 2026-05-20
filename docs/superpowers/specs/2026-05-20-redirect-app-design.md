# Приложение редиректов — Дизайн-спек

**Дата:** 2026-05-20

## Обзор

NestJS-приложение с одним публичным эндпоинтом, который принимает URL через query-параметр и выполняет редирект клиента на него. Деплоится на Vercel как Serverless Function через `@vercel/node`.

## Эндпоинт

```
GET /redirect?url=<целевой-url>
→ HTTP 302, Location: <целевой-url>
```

- Валидация URL не выполняется — любое переданное значение используется как есть.
- Авторизация отсутствует.

## Архитектура

Стандартный NestJS-проект с одним модулем. Vercel запускает его через serverless-обёртку:

- `api/index.ts` — экспортирует Vercel-совместимый handler, который инициализирует Nest-приложение и делегирует ему запросы.
- `vercel.json` — роутит весь входящий трафик на `api/index.ts`.
- `src/main.ts` — стандартный Nest bootstrap для локальной разработки.

## Структура файлов

```
src/
  app.module.ts        — корневой модуль, импортирует AppController
  app.controller.ts    — обработчик GET /redirect
  main.ts              — точка входа для локальной разработки
api/
  index.ts             — serverless handler для Vercel
vercel.json            — роутит все запросы на api/index
package.json
tsconfig.json
```

## Ключевые детали реализации

- **Фреймворк:** NestJS с дефолтным Express-адаптером.
- **Адаптер Vercel:** `@vercel/node` — оборачивает Express-инстанс как serverless-функцию.
- **Статус редиректа:** 302 (временный) — браузеры не кэшируют, легко мигрировать на кастомный домен позже.
- **Контроллер:** использует `@Res() res: Response` и вызывает `res.redirect(302, url)`, где `url = @Query('url')`.

## Локальная разработка

```bash
# Запуск в режиме разработки (с hot-reload)
npm run start:dev

# Запуск в продакшн-режиме
npm run build && npm run start:prod

# GET http://localhost:3000/redirect?url=https://example.com
```

## Деплой

```bash
npx vercel deploy
```

Vercel автоматически присваивает домен `*.vercel.app`. Кастомный домен можно подключить позже через дашборд Vercel.
