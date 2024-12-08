# ShortURL Service

ShortURL Service là một ứng dụng rút gọn URL hiệu quả, tối ưu hóa để xử lý nhanh chóng các yêu cầu thông qua cơ sở dữ liệu MongoDB, bộ nhớ đệm Redis, và hỗ trợ giới hạn tốc độ (Rate Limiting) để bảo mật.

## Các tính năng

- Rút gọn URL và tạo mã ngẫu nhiên duy nhất.
- Truy xuất URL gốc từ mã rút gọn.
- Lưu trữ URL trong MongoDB, kết hợp Redis để tăng tốc độ truy xuất.
- Kiểm tra URL hợp lệ trước khi tạo short URL.
- Giới hạn tốc độ yêu cầu để ngăn chặn lạm dụng dịch vụ.
- Hỗ trợ CORS để tích hợp với ứng dụng web khác.

## Cách cài đặt

### Yêu cầu

- Node.js v16 trở lên
- MongoDB (Cơ sở dữ liệu chính)
- Redis (Bộ nhớ đệm)
- Công cụ quản lý gói: npm hoặc yarn

### Hướng dẫn cài đặt

1. Clone repository:

   ```bash
   git clone https://github.com/your-username/shorturl-service.git
   cd shorturl-service
   ```

2. Cài đặt các package cần thiết:

   ```bash
   npm install
   ```

3. Cấu hình môi trường (file `.env`):
   Tạo file `.env` ở thư mục gốc và thêm các giá trị sau:

   ```makefile
   MONGODB_URI=mongodb://localhost:27017/shorturl
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379
   REDIS_PASSWORD=your_redis_password
   RATE_LIMIT_MAX=100
   RATE_LIMIT_WINDOW=15
   ```

4. Chạy ứng dụng:
   ```bash
   npm start
   ```
   Ứng dụng sẽ chạy ở [http://localhost:3000](http://localhost:3000).

## API Endpoints

1. **Tạo short URL**

   - Endpoint: `POST /create`
   - Body:
     ```json
     {
       "url": "https://example.com"
     }
     ```
   - Response:
     ```json
     {
       "id": "abc12"
     }
     ```
   - Mô tả: Trả về ID ngắn tương ứng với URL gốc.

2. **Truy xuất URL gốc từ short ID**
   - Endpoint: `GET /short/:id`
   - Response:
     - Thành công (200):
       ```text
       https://example.com
       ```
     - Không tìm thấy (404):
       ```html
       <h1>404 Not Found</h1>
       ```

## Tối ưu hóa đã thực hiện

1. **Chuyển từ SQLite sang MongoDB**

   - Dùng MongoDB để lưu trữ dữ liệu, cải thiện khả năng mở rộng và hiệu suất so với SQLite.

2. **Thêm Redis Cache**

   - Redis được sử dụng để lưu trữ tạm thời (cache) kết quả truy vấn, giảm tải cho MongoDB.

3. **Thêm kiểm tra URL hợp lệ**

   - Xác thực URL đầu vào trước khi lưu trữ để đảm bảo tính chính xác.

4. **Hỗ trợ Rate Limiting**

   - Thêm middleware giới hạn tốc độ sử dụng (Rate Limiting) để ngăn chặn tấn công DDoS hoặc lạm dụng API.

5. **Refactor code**

   - Sử dụng `Array.from` thay vì vòng lặp trong hàm `makeID` để tăng hiệu suất và đọc dễ hơn.
   - Sửa lỗi logic trong vòng lặp vô hạn khi tạo ID, giới hạn số lần thử.

6. **Hỗ trợ CORS**
   - Thêm middleware `cors` để hỗ trợ các ứng dụng web tích hợp.

## Cấu trúc dự án

```plaintext
shorturl-service/
├── helpers/
│   ├── mongodb.js        # Kết nối MongoDB
│   ├── redis.js          # Kết nối và xử lý Redis
│   └── rateLimiter.js    # Middleware giới hạn tốc độ
├── utils.js              # Xử lý logic chính
├── server.js             # Tệp khởi chạy Express server
├── .env                  # Cấu hình môi trường
```
