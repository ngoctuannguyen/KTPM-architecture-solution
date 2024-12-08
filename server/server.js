//server.js
import express from "express";
import { shortUrl, findOrigin } from "./utils.js";
import cors from "cors"; // Thêm vào
// const { connectRedis, getCache } = require("./src/helpers/redis");
import rateLimiterMiddleware from "./src/helpers/rateLimiter.js";
import { fetchWithRetry } from "./src/helpers/retry.js";


const app = express();
const port = 3000;

app.use(express.json()); // Hỗ trợ body dạng JSON
app.use(cors());
app.use(rateLimiterMiddleware);
// app.use(
//   cors({
//     origin: "http://localhost:5173", // Chỉ cho phép yêu cầu từ localhost:5173 (React client)
//     methods: ["GET", "POST"], // Cho phép các phương thức GET và POST
//   })
// );

// Chuyển hướng từ short URL -> URL gốc
app.get("/short/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const url = await fetchWithRetry(() => findOrigin(id));
    if (url == null) {
      res.status(404).send("<h1>404 Not Found</h1>");
    } else {
      res.status(200).send(url);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tạo short URL từ URL gốc
app.post("/create", async (req, res) => {
  try {
    const { url } = req.body;
    const message = req.body;
    console.log(message);
    // console.log(req.body);
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
    const newID = await fetchWithRetry(() => shortUrl(url));
    res.status(201).json({ id: newID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`ShortURL service running on port ${port}`);
});
