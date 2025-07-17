# Mini Zipper Service
## 🚀 Запуск локально
### 1️⃣ Встановлення залежностей

```bash
npm i
```

### 2️⃣ Запуск у dev-режимі

```bash
npm run dev
```

Сервер буде доступний за адресою:

```
http://localhost:3000
```

---

## 📦 API
### POST `/zip`
#### CURL:

```bash
curl -F "zip=@imgs.zip" http://localhost:3000/zip
```

#### Відповідь:

```json
{
  "processed": 48,
  "skipped": 2,
  "durationMs": 3278,
  "requestId": "e4a1cf6a-..."
}
```

---

## 🐳 Запуск через Docker
### 1️⃣ Збірка Docker-образу

```bash
docker build -t mini-zipper .
```

### 2️⃣ Запуск контейнера
```bash
docker run -p 3000:3000 mini-zipper
```

### Після запуску
Додаток буде доступний за адресою:
```
http://localhost:3000
```

---

## 📂 Output
Файли прев'ю зберігаються у директорії `uploads/{requestId}`
