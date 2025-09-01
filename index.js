import express from "express";
import cors from "cors";
import nbBetRouter from "./routes/nbBet.js";
import geminiRouter from "./routes/geminiApi.js";
import arbworldRouter from "./routes/arbworld.js";
import xgScoreRouter from "./routes/xgscore.js";
import excaperRouter from "./routes/excaper.js";
import stavkaTvRouter from "./routes/stavkaTV.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const genAI = new GoogleGenerativeAI("AIzaSyBoghkcOWCEOiE0egp_a9NvHr5wN1iP0WU");

app.use(cors());

app.get("/", (req, res) => {
  res.json("welcome to our server");
});
app.get("/gemini", (req, res) => {
  main();
});

app.use("/nbBet", nbBetRouter);
app.use("/excaper", excaperRouter);
app.use("/arbworld", arbworldRouter);
app.use("/xgScore", xgScoreRouter);
app.use("/stavkatv", stavkaTvRouter);
app.use("/gemini", geminiRouter);

app.post('/chat', async (req, res) => {
  try {
    // const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).send({ error: 'Prompt is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(req.body);
    const response = await result.response;
    const text = response.text();

    res.send({ response: text });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to generate content' });
  }
});
// Port Number
const port = 8000;

// Server setup
app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
