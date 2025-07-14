# Telegram Bot Backend для Vercel

## Описание
Серверное приложение для обработки данных и отправки их в Telegram бот.

## Структура проекта
```
bot_hack/
├── api/
│   └── index.js        # Основной файл API
├── package.json        # Зависимости и скрипты
├── vercel.json         # Конфигурация Vercel
├── .vercelignore       # Файлы для игнорирования
└── README.md           # Этот файл
```

## API Endpoints

### POST /sendDataToTelegram
Отправляет данные пользователя в Telegram

### POST /sendPhotoToTelegram
Отправляет фото в Telegram

### POST /sendLocationToTelegram
Отправляет геолокацию в Telegram

## Деплой на Vercel

### Через CLI:
1. Установите Vercel CLI: `npm i -g vercel`
2. Войдите в аккаунт: `vercel login`
3. Деплойте проект: `vercel --prod`

### Через Web интерфейс:
1. Перейдите на [vercel.com](https://vercel.com)
2. Подключите ваш GitHub репозиторий
3. Выберите папку `bot_hack` как корневую
4. Нажмите Deploy

## Настройка окружения
После деплоя ваш API будет доступен по адресу:
`https://your-project-name.vercel.app`

## Использование
Замените базовый URL в вашем клиентском коде на новый Vercel URL.

Пример:
```javascript
const API_BASE_URL = 'https://your-project-name.vercel.app';
```
