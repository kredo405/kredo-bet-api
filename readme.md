# Серверное приложение для агрегации данных спортивных ставок

![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![CORS](https://img.shields.io/badge/CORS-Enabled-success?style=for-the-badge)

Серверная часть приложения для агрегации данных с различных источников спортивных ставок и прогнозов. Предоставляет RESTful API для доступа к данным.

## 🚀 Особенности

- REST API для доступа к спортивным данным

## 🛠 Технологический стек

- **Серверная платформа**: 
  - Node.js
  - Express.js
- **Роутеры**:
  - Поддержка 5 различных источников данных

## 📡 Доступные эндпоинты

| Роут | Описание |
|------|----------|
| `GET /` | Основная информация о сервере |
| `GET /nbBet` | Данные с источника nbBet |
| `GET /excaper` | Данные с источника Excaper |
| `GET /arbworld` | Данные с источника Arbworld |
| `GET /xgScore` | Данные с источника xGScore |
| `GET /stavkatv` | Данные с источника StavkaTV |

## ⚙️ Установка и запуск

1. Клонируйте репозиторий:
```bash
git clone https://github.com/kredo405/kredo-bet-api.git
cd kredo-bet-api
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите сервер:
```bash
npm start
```

4. Сервер будет доступен по адресу:
```
http://localhost:8000
```

Для доступа к данным конкретного источника:
```bash
curl http://localhost:8000/nbBet
```

## 🚢 Деплой на Heroku

Приложение готово к запуску на Heroku через `Procfile`:

```bash
heroku create kredo-bet-api
heroku config:set GEMINI_API_KEY=your_gemini_api_key
git push heroku main
```

Heroku сам передаст порт через `PORT`, локально сервер продолжит запускаться на `8000`.

Проверка после деплоя:

```bash
heroku open
heroku logs --tail
```

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте новую ветку (`git checkout -b feature/your-feature`)
3. Сделайте коммит изменений (`git commit -am 'Add some feature'`)
4. Запушьте ветку (`git push origin feature/your-feature`)
5. Создайте Pull Request

---

**Сервер спортивных ставок** © | Разработано с ❤️ для точных прогнозов
