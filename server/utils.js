//utils.js
import { URLModel } from "./src/helpers/mongodb.js";
import { setCache, getCache } from "./src//helpers/redis.js";
import { connectRedis } from "./src/helpers/redis.js";

// Tạo mã ngắn ngẫu nhiên
function makeID(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  // let result = "";
  // for (let i = 0; i < length; i++) {
  //   result += characters.charAt(Math.floor(Math.random() * characters.length));
  // }
  // return result;
  const charactersLength = characters.length;
  return Array.from(
    { length },
    () => characters[Math.floor(Math.random() * charactersLength)]
  ).join("");
}

// Kết nối tới Redis
async function ensureRedisConnection() {
  try {
    await connectRedis();
    console.log("Connected to Redis.");
  } catch (err) {
    console.error("Failed to connect to Redis:", err.message);
  }
}
ensureRedisConnection();

// Tìm URL gốc từ short ID
async function findOrigin(id) {
  try {
    // console.log("Finding origin for ID:", id);
    // Kiểm tra Redis cache trước
    let cachedUrl = await getCache(id);
    if (cachedUrl) {
      return cachedUrl;
    }

    // Nếu không có trong Redis, truy vấn MongoDB
    const doc = await URLModel.findOne({ id });
    if (!doc) return null;
    cachedUrl = doc.url;
    // Lưu vào Redis cache
    await setCache(id, doc.url);
    return cachedUrl;
  } catch (err) {
    throw new Error("Error finding origin: " + err.message);
  }
}

// Kiểm tra URL hợp lệ
function isValidUrl(url) {
  return /^https?:\/\//.test(url); // Chỉ kiểm tra các URL bắt đầu với http:// hoặc https://
}

// Tạo short URL
async function create(id, url) {
  try {
    if (!isValidUrl(url)) {
      throw new Error("Invalid URL provided.");
    }
    const newEntry = new URLModel({ id, url });

    await newEntry.save();
    console.log("Created new short URL:", id);
    // Lưu vào Redis cache
    await setCache(id, url);

    return id;
  } catch (err) {
    throw new Error("Error creating short URL: " + err.message);
  }
}

// Rút gọn URL
async function shortUrl(url) {
  try {
    const cachedId = await getCache(url);
    if (cachedId) {
      // console.log("Found in cache:", cachedId);
      return cachedId; // Trả về ID nếu URL đã tồn tại trong cache
    }
    const existingEntry = await URLModel.findOne({ url });
    if (existingEntry) {
      // Lưu vào Redis cache
      await setCache(existingEntry.id, url);
      return existingEntry.id; // Trả về ID nếu URL đã tồn tại
    }
    // while (true) {
    //   let newID = makeID(5);
    //   let originUrl = await findOrigin(newID);
    //   if (!originUrl) {
    //     // Chỉ tạo ID mới khi nó chưa tồn tại
    //     await create(newID, url);
    //     return newID; // Đảm bảo trả về ID mới
    //   }
    // }

    // giới hạn số lần thử tránh vòng lặp vô hạn
    for (let attempt = 0; attempt < 10; attempt++) {
      // Giới hạn 10 lần thử
      const newID = makeID(5);
      const isUnique = !(await URLModel.exists({ id: newID }));
      if (isUnique) {
        await create(newID, url);
        return newID;
      }
    }
    throw new Error(
      "Unable to generate a unique short ID after multiple attempts."
    );
  } catch (err) {
    throw new Error("Error shortening URL: " + err.message);
  }
}

export { findOrigin, shortUrl };
