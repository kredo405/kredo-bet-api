import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
const geminiRouter = Router();
// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

geminiRouter.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).send({ error: 'Prompt is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.send({ response: text });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to generate content' });
  }
});

export default geminiRouter;

