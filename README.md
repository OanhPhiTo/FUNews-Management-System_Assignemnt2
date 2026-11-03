# FUNews Management System — Assignment 2

[![CI with GitHub Actions using Ant and JUnit | © 2026 by oanhtp](https://img.shields.io/github/actions/workflow/status/OanhPhiTo/FUNews-Management-System_Assignemnt2/ci.yml?branch=main&label=CI%20with%20GitHub%20Actions%20using%20Ant%20and%20JUnit%20%7C%20%C2%A9%202026%20by%20oanhtp)](https://github.com/OanhPhiTo/FUNews-Management-System_Assignemnt2/actions/workflows/ci.yml)

Ứng dụng quản lý tin tức, gồm backend Spring Boot và frontend React. Hệ thống hỗ trợ đăng nhập theo vai trò, quản lý tài khoản, danh mục, bài viết và thẻ; người dùng có thể xem tin công khai.

## Công nghệ

- Backend: Java 21, Spring Boot, Spring Data JPA, Maven
- Frontend: React 18, Vite, Bootstrap, Axios
- Cơ sở dữ liệu: Microsoft SQL Server

## Cấu trúc thư mục

```text
assignment2/
├── be/    # Spring Boot REST API
└── fe/    # React/Vite web client
```

## Yêu cầu

- JDK 21
- Node.js và npm
- SQL Server

## Chạy backend

Mặc định backend dùng SQL Server tại `localhost:1433`, cơ sở dữ liệu `assignment2`. Đặt thông tin đăng nhập bằng biến môi trường trước khi chạy.

PowerShell:

```powershell
$env:DB_USERNAME = "sa"
$env:DB_PASSWORD = "your-sql-server-password"
cd be
.\mvnw.cmd spring-boot:run
```

Backend chạy tại `http://localhost:8080`; REST API có tiền tố `/api`.

## Chạy frontend

Mở terminal khác tại thư mục dự án:

```powershell
cd fe
npm install
npm run dev
```

Mở địa chỉ Vite hiển thị trong terminal (thường là `http://localhost:5173`). Frontend hiện gọi API tại `http://localhost:8080/api`.

## Tài khoản mẫu

Backend tự tạo dữ liệu mẫu khi cơ sở dữ liệu còn trống:

| Vai trò | Email | Mật khẩu |
|---|---|---|
| Admin | `admin@fpt.edu.vn` | `admin123` |
| Staff | `staff1@fpt.edu.vn` | `staff123` |

Đây là thông tin đăng nhập phục vụ demo và cần được thay đổi nếu triển khai sử dụng thực tế.

## Tài liệu

Hai tài liệu hướng dẫn bằng tiếng Việt nằm trong thư mục `be/`:

- `Bao_Cao_Giai_Thich_Luong_Chay_Assignment2.doc`
- `Danh_Sach_Chuc_Nang_Va_Luong_Thuc_Thi_FUNewsManagementSystem.doc`
