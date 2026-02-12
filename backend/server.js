import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(cors());

const { thumbRoute } = await import("./thumbRoute.js");

app.use("/api", thumbRoute);

// 네이버 API 프록시
app.get("/api/books", async (req, res) => {
  const query = req.query.query;

  const url = `https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(
    query,
  )}`;

  const headers = {
    "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
    "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
  };

  if (!headers["X-Naver-Client-Id"] || !headers["X-Naver-Client-Secret"]) {
    return res
      .status(500)
      .json({ error: "NAVER_CLIENT_ID/SECRET not loaded from .env" });
  }

  try {
    const response = await fetch(url, { headers });
    const data = await response.json();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(5000, () => {
  console.log("✅ Proxy server running on http://localhost:5000");
});
