# Max Antivalidator — сервис редиректов

Публичный сервис для обхода валидации URL при разработке ботов для [Max](https://max.ru) (мессенджер от VK). Если Max API не принимает твой локальный URL — используй этот редирект.

**Живой сервис:** https://max-antivalidator.vercel.app/

## Проблема

При разработке ботов для мессенджера Max (VK) API валидирует URL-адреса — например, для вебхуков. Локальные адреса (`localhost`, `127.0.0.1`) не проходят валидацию, что мешает локальной разработке без дополнительных инструментов вроде ngrok.

## Решение

Передай URL через этот сервис — он сделает HTTP 302 редирект на нужный адрес.

## Использование

```
GET https://max-antivalidator.vercel.app/redirect?url=<твой-url>
```

### Пример

Вместо:
```
https://example.com/some/page
```

Используй:
```
https://max-antivalidator.vercel.app/redirect?url=https://example.com/some/page
```

Браузер автоматически перейдёт на целевой адрес через 302 редирект.

## Локальный запуск

```bash
npm install
npm run start:dev
# Сервис доступен на http://localhost:3000
```

## Стек

- [NestJS](https://nestjs.com/)
- [Vercel](https://vercel.com/)
- TypeScript
