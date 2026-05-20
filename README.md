# Max Antivalidator — сервис редиректов

Публичный сервис для обхода валидации URL в кнопках с типом «ссылка» при разработке ботов для [Max](https://max.ru) (мессенджер от VK).

**Живой сервис:** https://max-antivalidator.vercel.app/

## Проблема

Когда создаёшь кнопку с типом «ссылка» в боте для Max, API валидирует URL. Локальные адреса (`localhost`, `127.0.0.1`) не проходят валидацию — кнопку не получится отправить.

## Решение

Используй этот сервис как промежуточный редирект + пропиши фейковый домен в `/etc/hosts`, который указывает на `127.0.0.1`.

### Шаг 1 — Добавь домен в `/etc/hosts`

**Mac / Linux** — открой файл в редакторе с правами администратора:

```bash
sudo nano /etc/hosts
```

Добавь строку:

```
127.0.0.1 my-local-bot.com
```

**Windows** — открой от имени администратора файл:

```
C:\Windows\System32\drivers\etc\hosts
```

Добавь аналогичную строку:

```
127.0.0.1 my-local-bot.com
```

### Шаг 2 — Используй редирект в кнопке

В качестве URL кнопки укажи:

```
https://max-antivalidator.vercel.app/redirect?url=http://my-local-bot.com:3000/your/path
```

### Как это работает

1. Max API принимает URL — `vercel.app` проходит валидацию
2. Пользователь нажимает кнопку — браузер переходит на `max-antivalidator.vercel.app`
3. Сервис делает 302 редирект на `http://my-local-bot.com:3000/your/path`
4. `/etc/hosts` резолвит `my-local-bot.com` в `127.0.0.1` — запрос идёт на твой локальный сервер

## API

```
GET /redirect?url=<целевой-url>
→ HTTP 302, Location: <целевой-url>
```

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
