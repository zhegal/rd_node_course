# Docker для Node.js
## 📂 Структура репозиторію

```
03_docker/
├── kv-server/              # Express API для key-value сховища
│   ├── index.js
│   └── package.json
├── redis-like/             # HTTP-сервер для зберігання даних у памʼяті
│   ├── index.js
│   ├── lib/parseJsonBody.js
│   └── package.json
├── Dockerfile              # Базовий образ Node.js
├── Dockerfile.kv           # Multi-stage збірка kv-server
├── Dockerfile.kv.dev       # Dev-збірка із nodemon
├── Dockerfile.redis        # Multi-stage збірка redis-like
├── docker-compose.yml      # Production конфігурація
└── docker-compose.dev.yml  # Development конфігурація (hot-reload)
```

---

## 🧩 Компоненти

### Redis-like
HTTP API, що зберігає ключі у памʼяті:
- `POST /set` — зберегти ключ/значення
- `GET /get?key=...` — отримати значення за ключем

### KV-server
Express API, що:
- Отримує та надсилає дані через Redis-like
- Використовує змінну оточення `REDIS_URL` для підключення

---

## 🚀 Збірка та запуск

### Production режим
1. Збірка образів:
   ```bash
   docker-compose build
   ```
2. Запуск сервісів:
   ```bash
   docker-compose up
   ```
3. KV-server буде доступний за адресою `http://localhost:8080`.

### Development режим із hot-reload
1. Збірка образів:
   ```bash
   docker-compose -f docker-compose.dev.yml build
   ```
2. Запуск сервісів:
   ```bash
   docker-compose -f docker-compose.dev.yml up
   ```
3. При зміні файлів у `kv-server` застосунок буде перезапущений автоматично.

---

## 🧪 Приклади запитів

#### Зберегти значення
```bash
curl -X POST http://localhost:8080/kv -H "Content-Type: application/json"   -d '{"key":"foo","value":"bar"}'
```

#### Отримати значення
```bash
curl http://localhost:8080/kv/foo
```

---

## 🧹 Зупинка та очищення
Для зупинки контейнерів:
```bash
docker-compose down
```
або
```bash
docker-compose -f docker-compose.dev.yml down
```

---
