import { createShortUrlApi, getOriginalUrlApi } from "../api/api";

// Hàm tạo short URL
export const createShortUrl = async (url: string): Promise<string> => {
  const { id } = await createShortUrlApi(url); // Gọi API để tạo short URL
  return `http://localhost:3000/${id}`; // Tạo URL đầy đủ từ short ID
};

// Hàm lấy URL gốc từ short ID
export const getOriginalUrl = async (shortId: string): Promise<string> => {
  return await getOriginalUrlApi(shortId); // Gọi API để lấy URL gốc
};
