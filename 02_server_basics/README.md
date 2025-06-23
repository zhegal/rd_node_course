# Node.js HTTP — REST API з folder-based маршрутизацією

Цей проєкт реалізує **міні-фреймворк** на чистому Node.js без жодних залежностей, що підтримує REST API з динамічною маршрутизацією в стилі **Next.js App Router**.

---

## 📁 Структура проєкту

```
.
├── lib/                          # Базова логіка: роутер, парсинг, помилки, утиліти
│   ├── BaseRoute.js             # Базовий клас для обробки HTTP-методів та помилок
│   ├── db.js                    # Читання/запис JSON-файлу як "бази даних"
│   ├── errors.js                # Кастомні класи помилок (наприклад, ValidationError)
│   ├── getCurrentDateTime.js    # Поточна дата/час у форматі YYYY-MM-DD HH:mm:ss
│   ├── getRoutePath.js          # Визначення шляху до файлу маршруту (враховує [id])
│   ├── isValidEmail.js          # Перевірка формату email
│   ├── newIdFromArray.js        # Генерація нового ID на основі max у масиві
│   ├── parseJsonBody.js         # Асинхронний парсинг JSON-тіла запиту
│   ├── respond.js               # Утиліта для формування JSON-відповіді
│   └── router.js                # Головний роутер: визначає файл обробки запиту
├── models/
│   └── users.model.js           # Робота з JSON-базою: CRUD над юзерами
├── routes/                      # Folder-based маршрути
│   ├── route.js                 # GET / (Hello world)
│   └── users/
│       ├── route.js             # GET, POST /users
│       └── [id]/
│           └── route.js         # GET, PATCH, DELETE /users/:id
├── services/
│   └── users.service.js         # Логіка перевірки/валидації, обробки даних
├── database.json                # JSON-файл з усіма збереженими юзерами
├── .env                         # Змінні середовища (наприклад, PORT=3000)
├── .env.example                 # Приклад .env
├── .gitignore
├── eslint.config.js
├── index.js                     # Точка входу: createServer + router
├── package.json
└── package-lock.json
```

---

## 🧩 Реалізовані можливості

- 📁 **Folder-based routing** з підтримкою `GET`, `POST`, `PATCH`, `DELETE`
- 🆔 **Динамічні сегменти**: `/users/:id`
- 🧠 **Шарова архітектура**: `Route → Service → Model`
- 🧾 **JSON-база**: запис/зчитування з `database.json`
- ⚠️ **Обробка помилок**: `ValidationError`, `NotFoundError` → статуси 400, 404
- 🛡 **Multimethod API**: неекспортований метод → 405
- 🔧 **Zero-dep**: тільки `http`, `fs`, `path` з Node.js

---

## 🗂 Опис основних файлів у `lib/`

| Файл | Призначення |
|------|-------------|
| `BaseRoute.js` | Базовий клас для всіх маршрутів. Містить метод `handle()`, який обробляє методи HTTP, відповіді, помилки та статуси. |
| `db.js` | Простий обгортковий інтерфейс для читання/запису `database.json`. |
| `errors.js` | Оголошення типізованих помилок (`ValidationError`, `NotFoundError`) для контролю статусів 400/404. |
| `getRoutePath.js` | Обчислює шлях до правильного `route.js` файлу. Підтримує динамічні сегменти (наприклад, `[id]`) і fallback до динамічної папки. |
| `getCurrentDateTime.js` | Повертає поточну дату/час у форматі `YYYY-MM-DD HH:mm:ss` для `createdAt` і `updatedAt`. |
| `isValidEmail.js` | Перевіряє, що email має валідний формат через регулярний вираз. |
| `newIdFromArray.js` | Обчислює новий ID на основі найбільшого `id` у масиві об'єктів. |
| `parseJsonBody.js` | Читає і парсить JSON тіло запиту. Обов’язково для обробки `POST`, `PATCH` без Express. |
| `respond.js` | Відправляє HTTP-відповідь у форматі JSON із відповідним `statusCode`. |
| `router.js` | Основний роутер: визначає маршрут, підключає відповідний `route.js` та викликає `handle(method)`. |

---

## 📝 Валідація користувачів

Під час створення нового користувача (`POST /users`) обов’язкові поля:

- `name` — будь-який непорожній текст
- `email` — має пройти перевірку функцією `isValidEmail()`

У разі відсутності або невірного формату буде кинуто `ValidationError` з HTTP-статусом `400`.

