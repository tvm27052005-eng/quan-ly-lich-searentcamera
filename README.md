# Quản lý Lịch cho thuê Camera & Thiết bị (Camera Rental Manager)

Ứng dụng quản lý lịch cho thuê máy ảnh, camera, flycam, ống kính, và phụ kiện tích hợp cơ sở dữ liệu MySQL và WebSockets thời gian thực.

## Cấu hình Cơ sở dữ liệu MySQL

Hệ thống sử dụng **MySQL** làm nơi lưu trữ dữ liệu.

1. **Cấu hình file `.env`**:
   Sao chép hoặc chỉnh sửa file `.env`:
   ```env
   DB_HOST="localhost"
   DB_PORT="3306"
   DB_USER="root"
   DB_PASSWORD=""
   DB_NAME="camera_rental_db"
   ```

2. **Tự động khởi tạo cơ sở dữ liệu (Auto Initialization)**:
   Khi chạy `npm run dev`, hệ thống sẽ tự động:
   - Tạo cơ sở dữ liệu `camera_rental_db` (nếu chưa có).
   - Khởi tạo tất cả các bảng: `users`, `cameras`, `customers`, `rentals`, `transactions`, `notifications`.
   - Nạp dữ liệu mẫu ban đầu (Auto Seed Mock Data) khi bảng trống.

3. **Schema SQL**:
   Bạn cũng có thể xem hoặc import thủ công file schema tại [database/schema.sql](file:///c:/Users/acer/Downloads/qu%E1%BA%A3n-l%C3%BD-l%E1%BB%8Bch-searentcamera/database/schema.sql).

## Hướng dẫn Chạy Ứng dụng

1. **Cài đặt thư viện**:
   ```bash
   npm install
   ```

2. **Khởi chạy ứng dụng (Backend + Frontend Dev)**:
   ```bash
   npm run dev
   ```

3. Mở trình duyệt tại: `http://localhost:3000`
