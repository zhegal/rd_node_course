# Images worker-thread Nest project
## 🛣️ Запуск через Docker
**1️⃣ Збірка Docker-образу**

З кореня проєкту:

```bash
docker build -t node-async .
```

**2️⃣ Запуск контейнера**

```bash
docker run -p 3000:3000 node-async
```

Після запуску додаток буде доступний за адресою:

```
http://localhost:3000
```
