import axios from "axios";
import http from "node:http";
import https from "node:https";

const desktopAgents = [
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

const MATCH_CACHE_TTL_MS = 60 * 1000;
const STALE_CACHE_TTL_MS = 5 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 20 * 1000;
const MAX_CACHE_ITEMS = 200;

const httpAgent = new http.Agent({ keepAlive: true, maxSockets: 25 });
const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 25 });

const client = axios.create({
  timeout: REQUEST_TIMEOUT_MS,
  responseType: "text",
  decompress: true,
  httpAgent,
  httpsAgent,
  maxContentLength: 5 * 1024 * 1024,
  headers: {
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.9",
    Connection: "keep-alive",
  },
});

const cache = new Map();
const pendingRequests = new Map();

const getUserAgent = () =>
  desktopAgents[Math.floor(Math.random() * desktopAgents.length)];

const normalizeWhitespace = (value) => value.replace(/\s+/g, " ").trim();

const decodeHtml = (value) =>
  value
    .replace(/&emsp;|&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

const textFromHtml = (html = "") =>
  normalizeWhitespace(
    decodeHtml(
      html
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/<script\b[\s\S]*?<\/script>/gi, "")
        .replace(/<style\b[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
    )
  );

const getAttr = (html, attrName) => {
  const match = html.match(new RegExp(`${attrName}\\s*=\\s*["']([^"']+)["']`, "i"));
  return match ? match[1].trim() : "";
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const extractRows = (tbodyHtml) => {
  const rows = [];
  const rowRegex = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch;

  while ((rowMatch = rowRegex.exec(tbodyHtml)) !== null) {
    const cells = [];
    const cellRegex = /<td\b[^>]*>([\s\S]*?)<\/td>/gi;
    let cellMatch;

    while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
      cells.push(textFromHtml(cellMatch[1]));
    }

    if (cells.length >= 11) {
      rows.push({
        market: cells[2],
        values: {
          type: cells[0],
          date: cells[1],
          sum: cells[3],
          change: cells[4],
          time: cells[5],
          score: cells[6],
          odd: cells[7],
          percentChange: cells[8],
          totalSum: cells[9],
          percentOfMarket: cells[10],
        },
      });
    }
  }

  return rows;
};

export const parseMatchDataExcaperHtml = (html) => {
  const h1Match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  const teams = h1Match ? textFromHtml(h1Match[1]) : "";
  const tabs = [];
  const tabRegex = /<a\b[^>]*class=["'][^"']*\btab\b[^"']*["'][^>]*>[\s\S]*?<\/a>/gi;
  let tabMatch;

  while ((tabMatch = tabRegex.exec(html)) !== null) {
    const tabHtml = tabMatch[0];
    const id = getAttr(tabHtml, "data-tab");
    const market = textFromHtml(tabHtml);

    if (id && market) {
      tabs.push({ id, market });
    }
  }

  const contentPositions = tabs.map(({ id }) =>
    html.search(new RegExp(`<div\\b[^>]*id=["']${escapeRegExp(id)}["'][^>]*>`, "i"))
  );

  return tabs.map(({ market }, index) => {
    const contentStart = contentPositions[index];
    const nextContentStart =
      contentPositions.find((position) => position > contentStart) || html.length;

    if (contentStart === -1) {
      return { market, values: [], teams };
    }

    const sectionHtml = html.slice(contentStart, nextContentStart);
    const values = [];
    const tbodyRegex = /<tbody\b[^>]*>([\s\S]*?)<\/tbody>/gi;
    let tbodyMatch;

    while ((tbodyMatch = tbodyRegex.exec(sectionHtml)) !== null) {
      values.push(...extractRows(tbodyMatch[1]));
    }

    return {
      market,
      values,
      teams,
    };
  });
};

const isAllowedMatchUrl = (link) => {
  try {
    const url = new URL(link);
    return url.protocol === "https:" && url.hostname === "www.excapper.com";
  } catch {
    return false;
  }
};

const rememberCache = (link, data) => {
  if (cache.size >= MAX_CACHE_ITEMS) {
    cache.delete(cache.keys().next().value);
  }

  cache.set(link, { data, timestamp: Date.now() });
};

const getCached = (link, maxAgeMs) => {
  const item = cache.get(link);

  if (!item || Date.now() - item.timestamp > maxAgeMs) {
    return null;
  }

  return item.data;
};

const fetchAndParseMatch = async (link) => {
  const response = await client.get(link, {
    headers: {
      "User-Agent": getUserAgent(),
    },
  });

  const data = parseMatchDataExcaperHtml(response.data);
  rememberCache(link, data);

  return data;
};

export const getMatchDataExcaper = async (link) => {
  if (!link || !isAllowedMatchUrl(link)) {
    return [];
  }

  const fresh = getCached(link, MATCH_CACHE_TTL_MS);

  if (fresh) {
    return fresh;
  }

  if (pendingRequests.has(link)) {
    return pendingRequests.get(link);
  }

  const request = fetchAndParseMatch(link)
    .catch((error) => {
      console.error("Failed to load Excapper match data:", error.message);
      return getCached(link, STALE_CACHE_TTL_MS) || [];
    })
    .finally(() => {
      pendingRequests.delete(link);
    });

  pendingRequests.set(link, request);

  return request;
};
