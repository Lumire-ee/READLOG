import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, ".env") });
const app = express();
app.use(cors());

app.get("/api/books", async (req, res) => {
  const query = req.query.query;
  const url = `https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(
    query,
  )}`;

  const headers = {
    "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
    "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
  };

  // 키가 안 불리면 바로 에러 반환 (로그는 필요 시만)
  if (!headers["X-Naver-Client-Id"] || !headers["X-Naver-Client-Secret"]) {
    return res
      .status(500)
      .json({ error: "NAVER_CLIENT_ID/SECRET not loaded from .env" });
  }

  try {
    const response = await fetch(url, { headers });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(5000, () =>
  console.log("✅ Proxy server running on http://localhost:5000"),
);
