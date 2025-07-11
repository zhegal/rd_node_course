# Mini NestJS Framework
## Запуск у Docker
### 1. Збірка Docker-образу
```
docker build -t mini-nest .
```

### 2. Запуск контейнера
```
docker run -p 3000:3000 mini-nest
```

Після запуску сервер буде доступний за адресою: [http://localhost:3000](http://localhost:3000)

## Структура проекту
- `src/` — вихідні файли на TypeScript
- `dist/` — згенеровані JS-файли після компіляції
- `rewrite-imports.js` — скрипт-костиль для виправлення імпортів у стилі ES-модулів після збірки
- `tsconfig.json` — налаштування TypeScript
- `Dockerfile` — основний докер-файл для збірки

## Локальна збірка без Docker

```
npm install
npm run build
node dist/main.js
```

## Скрипти
- `npm run dev` - запускає проект у dev-режимі за допомогою nodemon
- `npm run build` — видаляє `dist`, компілює TypeScript і виправляє імпорти
- `npm run clean` — очищує `dist`

