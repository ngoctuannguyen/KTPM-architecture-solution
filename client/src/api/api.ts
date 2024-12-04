import axios from "axios";

const BASE_URL = "http://localhost:3000";

// Tạo một instance Axios để dùng chung
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 5000, // Timeout sau 5 giây
});

// Hàm gọi API POST để tạo short URL
export const createShortUrlApi = async (
  url: string
): Promise<{ id: string }> => {
  const response = await axiosInstance.post("/create", { url });
  return response.data;
};

// Hàm gọi API GET để lấy URL gốc từ short ID
export const getOriginalUrlApi = async (shortId: string): Promise<string> => {
  const response = await axiosInstance.get(`/short/${shortId}`);
  console.log(response.data);
  return response.data; // URL gốc trả về dưới dạng chuỗi
};
