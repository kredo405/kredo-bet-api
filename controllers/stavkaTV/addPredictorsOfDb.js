// import db from "../../firebase.js";
import axios from "axios";

// Массив агентов пользователей
const desktop_agents = [
  "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/602.2.14 (KHTML, like Gecko) Version/10.0.1 Safari/602.2.14",
  "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36",
  "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36",
  "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:50.0) Gecko/20100101 Firefox/50.0",
];

// Функция для получения случайной задержки
const getRandomDelay = () => Math.floor(Math.random() * 10000) + 5000; // случайная задержка от 5 до 10 секунд

// Функция для добавления предсказателей в БД
export const addPredictorsOfDB = async (link) => {
  let rand = Math.floor(Math.random() * desktop_agents.length);

  // Функция для загрузки данных
  const fetchData = async (offset = 0, limit = 20, total = null) => {
    const options = {
      method: "GET",
      url: `https://stavka.tv/api/v2/rating?sort=result&limit=${limit}&period[]=2024-12-01&period[]=2024-12-31&offset=${offset}`,
      headers: {
        "User-Agent": desktop_agents[rand],
      },
    };

    try {
      const response = await axios.request(options);
      const result = response.data;

      // // Сохраняем данные в Firebase
      // if (result.data) {
      //   const batch = db.batch(); // Используем батч для оптимального сохранения
      //   result.data.forEach((item) => {
      //     const docRef = db.collection("predictors").doc(item.id);
      //     batch.set(docRef, item);
      //   });
      //   await batch.commit();
      //   console.log(`Saved data from offset: ${offset}`);
      // }

      // // Проверяем, есть ли ещё данные для загрузки
      // const { meta } = result;
      // if (total === null) total = meta.total;

      // if (offset + limit < total) {
      //   // Ждём случайную задержку перед следующим запросом
      //   await new Promise((resolve) => setTimeout(resolve, getRandomDelay()));
      //   return fetchData(offset + limit, limit, total);
      // } else {
      //   console.log("All data fetched and saved.");
      // }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  await fetchData();
};
