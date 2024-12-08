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
   git clone https://github.com/ngoctuannguyen/KTPM-architecture-solution.git
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
   
   <b>Frontend:</b>
   ```bash
   cd client
   npm run dev
   ```
   Frontend server sẽ chạy ở [http://localhost:5173](http://localhost:5173).

   <b>Backend:</b>
   ```bash
   cd server
   npm run dev
   ```
   Backend server sẽ chạy ở [http://localhost:3000](http://localhost:3000).

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

4. **Các mẫu thiết kế đã sử dụng**
   1. [Rate Limiting](server\src\helpers\rateLimiter.js)
   - Thêm middleware giới hạn tốc độ sử dụng (Rate Limiting) để ngăn chặn tấn công DDoS hoặc lạm dụng API. 
   2. [Retry](server\src\helpers\retry.js)
   - Sử dụng mẫu thiết kế này nhằm đảm bảo việc thực thi lại một thao tác nếu thao tác đó thất bại do các lỗi tạm thời, đặc biệt hữu ích khi làm việc với các hệ thống không đồng bộ hoặc phân tán.
   3. Cache-Aside
   ![image](res\cache.png)
   - Công nghệ sử dụng: Redis
   - Cơ chế: 
        - Read-Through (Đọc dữ liệu):
        Khi ứng dụng cần một dữ liệu, nó sẽ kiểm tra xem dữ liệu đã có trong cache chưa.
        Nếu có (cache hit), trả về dữ liệu từ cache.
        Nếu không có (cache miss), ứng dụng sẽ lấy dữ liệu từ nguồn dữ liệu chính (database), lưu vào cache, và sau đó trả về dữ liệu cho client.

       - Write-Through (Ghi dữ liệu):
        Khi dữ liệu được cập nhật, ứng dụng sẽ cập nhật trực tiếp vào cơ sở dữ liệu và có thể cập nhật thủ công vào cache (hoặc để dữ liệu cũ trong cache hết hạn tự động).

    - Mục đích sử dụng: 
        - Giảm độ trễ khi lấy dữ liệu nếu dữ liệu đã có trong cache.
        - Dữ liệu cũ tự động hết hạn, giảm nguy cơ dữ liệu không nhất quán.
        - Giảm tải cho Database MongoDB.

5. **Refactor code**

   - Sử dụng `Array.from` thay vì vòng lặp trong hàm `makeID` để tăng hiệu suất và đọc dễ hơn ([Hàm makeID](server\utils.js)).
   - Sửa lỗi logic trong vòng lặp vô hạn khi tạo ID, giới hạn số lần thử. ([Dòng 104 trong hàm shortURL](server\utils.js)).

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
### Thí nghiệm và đánh giá
Công cụ sử dụng: [Load Testing Artillery](https://www.artillery.io/)
#### Các chiến lược test ####
Sau khi thực hiện test với 50000 request trong 50s, nhóm có kết quả như sau:

<b>1. Kết quả khi sử dụng phần code được cung cấp</b>
- GET: 
![image](res\get_without_optimization.png)
- POST: 
![image](res\post_without_optimization.png)

<b>2. Kết quả khi đã thực hiện tối ưu code và kiến trúc</b>
- GET: 
![image](res\get_with_optimization.png)
- POST: 
![image](res\post_with_optimization.png)

<b>3. Kết quả khi không sử dụng Rate Limit</b>
- GET: 
![image](res\get_without_ratelimit.png)
- POST: 
![image](res\post_without_ratelimit.png)

<b>4. Kết quả khi không sử dụng Cache-Aside</b>
- GET: 
![image](res\get_without_cache.png)
- POST: 
![image](res\post_without_cache.png)

#### Đánh giá ####
1. <b>Thời gian phản hồi trung bình - POST </b>
![image](res\mean_post.png)

- Kết quả cho thấy khi thực hiện tối ưu code và kiến trúc thì thời gian phản hồi của POST request được giảm đi rất nhiều so với ban đầu và so với khi không sử dụng Cache. Lý do là hệ thống đã được sử dụng Cache nên việc có nhiều link giống nhau sẽ chỉ mang một ID duy nhất mà không phải mất thời gian tạo ID mới.

2. <b>Thời gian phản hồi trung bình - GET</b>
![image](res\mean_get.png)

- Kết quả cho thấy khi thực hiện tối ưu code và kiến trúc thì thời gian phản hồi của GET request được giảm đi rất nhiều so với ban đầu và so với khi không sử dụng Cache. Lý do là hệ thống đã được sử dụng Cache nên việc đọc ở trên Cache diễn ra rất nhanh
- Hơn nữa, việc sử dụng Rate Limiting góp phần đáng kể vào thời gian phản hồi so với việc không sử dụng Rate Limiting.

3. <b>Tác động của Rate Limiting tới số lượng request gửi cho hệ thống </b>
- Dựa vào những số liệu về request_rate được cung cấp ở trên, ta thấy việc sử dụng Rate Limiting giúp giảm đáng kể số lượng request từ 1000 xuống 857 request/s.

