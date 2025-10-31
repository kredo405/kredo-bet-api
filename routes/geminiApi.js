import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import multer from 'multer';

const geminiRouter = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Настройка multer для обработки загрузки файлов
const upload = multer({ storage: multer.memoryStorage() });

geminiRouter.post('/chat', upload.single('file'), async (req, res) => {
  try {
    const { prompt } = req.body;
    const file = req.file;

    if (!prompt) {
      return res.status(400).send({ error: 'Prompt is required' });
    }

    if (!file) {
      return res.status(400).send({ error: 'File is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

    const imagePart = {
      inlineData: {
        data: file.buffer.toString("base64"),
        mimeType: file.mimetype,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    res.send({ response: text });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to generate content' });
  }
});

export default geminiRouter;
