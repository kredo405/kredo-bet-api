import TelegramBot from "node-telegram-bot-api";

// Укажите токен вашего бота
const token = "6266484728:AAHLvGpiPYZGfd40IjFTCJzHgmdgDoIYowQ";

// Создаем экземпляр бота
const bot = new TelegramBot(token, { polling: true });

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Приветственное сообщение
  bot.sendMessage(
    chatId,
    "Добро пожаловать! Нажмите кнопку ниже, чтобы открыть Mini App.",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Открыть Mini App",
              url: "https://excapper-scrapper.vercel.app/",
            },
          ],
        ],
      },
    }
  );
});
