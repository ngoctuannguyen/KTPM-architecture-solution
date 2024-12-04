const { URLModel } = require("./src/helpers/mongodb");
const { setCache, getCache } = require("./src//helpers/redis");
const { connectRedis } = require("./src/helpers/redis");

// Tạo mã ngắn ngẫu nhiên
function makeID(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// (async () => {
//   await connectRedis(); // Kiểm tra kết nối Redis
// })();

// const id = "X6ch6";
// console.log("Cache");
// async function exampleGetCache() {
//   try {
//     const value = await getCache(id);
//     console.log(value); // In ra giá trị của key "X6ch6"
//   } catch (err) {
//     console.error("Error getting cache:", err.message);
//   }
// }

// exampleGetCache();

// Tìm URL gốc từ short ID
async function findOrigin(id) {
  try {
    console.log("Finding origin for ID:", id);
    // Kiểm tra Redis cache trước
    const cachedUrl = await getCache(id);
    const res = cachedUrl;
    console.log(cachedUrl);
    if (res) {
      return res;
    }

    // Nếu không có trong Redis, truy vấn MongoDB
    const doc = await URLModel.findOne({ id });
    if (!doc) return null;

    // Lưu vào Redis cache
    await setCache(id, doc.url);
    return doc.url;
  } catch (err) {
    throw new Error("Error finding origin: " + err.message);
  }
}

// Tạo short URL
async function create(id, url) {
  try {
    const newEntry = new URLModel({ id, url });
    await newEntry.save();
    console.log("Created new short URL:", id);
    console.log(url);
    // Lưu vào Redis cache
    await setCache(id, url);

    return id;
  } catch (err) {
    throw new Error("Error creating short URL: " + err.message);
  }
}

// Rút gọn URL
async function shortUrl(url) {
  while (true) {
    let newID = makeID(5);
    let originUrl = await findOrigin(newID);
    if (!originUrl) {
      // Chỉ tạo ID mới khi nó chưa tồn tại
      await create(newID, url);
      return newID; // Đảm bảo trả về ID mới
    }
  }
}

module.exports = {
  findOrigin,
  shortUrl,
};
