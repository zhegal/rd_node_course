# Coffee Logger API
## 🚀 Швидкий старт

### Збірка та запуск через Docker

1. Збірка образу:

   ```bash
   docker build -t brew-api .
   ```

2. Запустіть контейнер:

   ```bash
   docker run -p 3000:3000 brew-api
   ```

3. API буде доступне за адресою:

   ```
   http://localhost:3000
   ```

> **Увага:**\
> При запуску через Docker проект збирається у режимі **production**, тому Swagger UI недоступний.

---

### Запуск локально (режим розробки)

1. Створіть файл `.env` на основі прикладу:

   ```bash
   cp .env.example .env
   ```

2. У файлі `.env` вкажіть змінні оточення:

   ```
   PORT=3000
   NODE_ENV=dev
   ```

3. Встановіть залежності:

   ```bash
   npm install
   ```

4. Запустіть сервер:

   ```bash
   npm run dev
   ```

При `NODE_ENV=dev` Swagger UI буде доступний за адресою:

```
http://localhost:3000/docs
```

---

## 🛠️ Приклад `.env.example`

```dotenv
PORT=3000
NODE_ENV=dev
```

---

## 📄 Скрипти

- `npm run build` – збірка проекту у папку `dist/`
- `npm run start` – запуск production-версії
- `npm run dev` – запуск у режимі розробки з hot-reload, використовуючи nodemon
- `npm run lint` – перевірка ESLint
- `npm run lint:fix` – автоматичне виправлення ESLint

---

## ⚠️ Примітки

- У Docker, або при команді "start" використовується `NODE_ENV=prod`.
- Для доступу до Swagger UI запускайте проект **локально** у режимі розробки.

