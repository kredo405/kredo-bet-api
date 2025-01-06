import { Router } from "express";
import { getMatchesStavkaTv } from "../controllers/stavkaTV/getMatchesStavkaTv.js";
import { getPredictionsStavkaTv } from "../controllers/stavkaTV/getPredictionsStavkaTv.js";
import { getStatisticsStavkaTv } from "../controllers/stavkaTV/getStatisticsStavkaTv.js";
import { getPreviewStavkaTv } from "../controllers/stavkaTV/getPreviewStavkaTv.js";
import { getAverageStatisticsStavkaTv } from "../controllers/stavkaTV/getAverageStatisticsStavkaTv.js";
import { getPopularBetsStavkaTv } from "../controllers/stavkaTV/getPopularBetsStavkaTv.js";
import { addPredictorsOfDB } from "../controllers/stavkaTV/addPredictorsOfDb.js";
import { getLastMatchesWithTeam } from "../controllers/stavkaTV/getLastMatchesWithTeam.js";
import { getOdds } from "../controllers/stavkaTV/getOdds.js";

const stavkaTvRouter = Router();

stavkaTvRouter.get("/matches", async (req, res) => {
  const matches = await getMatchesStavkaTv(
    req.query.limit,
    req.query.dateFrom,
    req.query.dateTo,
    req.query.status,
    req.query.sport
  );
  res.json({ matches });
});

stavkaTvRouter.get("/last-matches", async (req, res) => {
  const lastMatches = await getLastMatchesWithTeam(
    req.query.sport,
    req.query.slug,
    req.query.offset
  );
  res.json({ lastMatches });
});

stavkaTvRouter.get("/predictions", async (req, res) => {
  const predictions = await getPredictionsStavkaTv(
    req.query.link,
    req.query.limit,
    req.query.offset
  );
  res.json({ predictions });
});

stavkaTvRouter.get("/statistics", async (req, res) => {
  const statistics = await getStatisticsStavkaTv(req.query.link);
  res.json({ statistics });
});

stavkaTvRouter.get("/preview", async (req, res) => {
  const preview = await getPreviewStavkaTv(req.query.link);
  res.json({ preview });
});

stavkaTvRouter.get("/average-statistics", async (req, res) => {
  const averageStatistics = await getAverageStatisticsStavkaTv(req.query.link);
  res.json({ averageStatistics });
});

stavkaTvRouter.get("/popular-bets", async (req, res) => {
  const popularBets = await getPopularBetsStavkaTv(req.query.link);
  res.json({ popularBets });
});

stavkaTvRouter.get("/odds", async (req, res) => {
  const odds = await getOdds(req.query.link);
  res.json({ odds });
});

stavkaTvRouter.post("/predictors", async (req, res) => {
  addPredictorsOfDB();
});

export default stavkaTvRouter;
