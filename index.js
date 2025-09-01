import express from "express";
import cors from "cors";
import nbBetRouter from "./routes/nbBet.js";
import geminiRouter from "./routes/geminiApi.js";
import arbworldRouter from "./routes/arbworld.js";
import xgScoreRouter from "./routes/xgscore.js";
import excaperRouter from "./routes/excaper.js";
import stavkaTvRouter from "./routes/stavkaTV.js";

const app = express();

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
// Port Number
const port = 8000;

// Server setup
app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
