# Tea Tracker

## 🚀 Запуск без Docker

Перейдіть у папку з проєктом:

```bash
cd tea-tracker
```

Встановіть залежності:

```bash
npm install
```

Запустіть додаток у режимі розробки:

```bash
npm run start:dev
```

Додаток буде доступний за адресою:

```
http://localhost:3000
```

---

## 🛣️ Запуск через Docker

**1️⃣ Збірка Docker-образу**

З кореня проєкту:

```bash
docker build -t tea-tracker .
```

**2️⃣ Запуск контейнера**

```bash
docker run -p 3000:3000 tea-tracker
```

Після запуску додаток буде доступний за адресою:

```
http://localhost:3000
```

---

## 📝 Додатково

Документація Swagger доступна за адресою:

```
http://localhost:3000/docs
```
