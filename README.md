# Max Antivalidator — сервис редиректов

Публичный сервис для обхода валидации URL в Max (JetBrains AI Assistant). Если Max не даёт открыть нужный URL прямо из IDE — используй этот редирект.

**Живой сервис:** https://max-antivalidator.vercel.app/

## Проблема

JetBrains Max (AI Assistant) валидирует URL-адреса и в некоторых случаях не позволяет перейти по ссылке напрямую из среды разработки. Это мешает локальной разработке, когда нужно быстро открыть документацию, API или любой другой ресурс.

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
