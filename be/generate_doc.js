import fs from 'fs';
import path from 'path';

const htmlDocContent = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" 
      xmlns:w="urn:schemas-microsoft-com:office:word" 
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>Báo Cáo Giải Thích Luồng Chạy Hệ Thống - FUNewsManagementSystem (Assignment 02)</title>
<style>
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 13pt;
    line-height: 1.5;
    color: #111827;
    margin: 2cm;
  }
  h1 {
    font-size: 22pt;
    font-weight: bold;
    color: #1e3a8a;
    text-align: center;
    margin-bottom: 5px;
    text-transform: uppercase;
  }
  .sub-title {
    text-align: center;
    font-size: 14pt;
    font-weight: bold;
    color: #4b5563;
    margin-bottom: 25px;
  }
  .meta-box {
    border: 2px solid #1e3a8a;
    background-color: #f0f7ff;
    padding: 15px 20px;
    margin-bottom: 30px;
    border-radius: 6px;
  }
  .meta-box table {
    width: 100%;
    border-collapse: collapse;
  }
  .meta-box td {
    padding: 4px 8px;
    font-size: 12pt;
  }
  h2 {
    font-size: 16pt;
    font-weight: bold;
    color: #1e3a8a;
    border-bottom: 2px solid #1e3a8a;
    padding-bottom: 4px;
    margin-top: 30px;
    margin-bottom: 12px;
  }
  h3 {
    font-size: 14pt;
    font-weight: bold;
    color: #0369a1;
    margin-top: 20px;
    margin-bottom: 8px;
  }
  h4 {
    font-size: 13pt;
    font-weight: bold;
    color: #374151;
    margin-top: 14px;
    margin-bottom: 6px;
  }
  p {
    margin-bottom: 10px;
    text-align: justify;
  }
  ul, ol {
    margin-top: 5px;
    margin-bottom: 12px;
    padding-left: 25px;
  }
  li {
    margin-bottom: 5px;
  }
  table.data-table {
    width: 100%;
    border-collapse: collapse;
    margin: 15px 0 20px 0;
  }
  table.data-table th, table.data-table td {
    border: 1px solid #9ca3af;
    padding: 8px 10px;
    font-size: 11pt;
  }
  table.data-table th {
    background-color: #1e3a8a;
    color: #ffffff;
    font-weight: bold;
    text-align: left;
  }
  table.data-table tr:nth-child(even) {
    background-color: #f9fafb;
  }
  .callout {
    border-left: 5px solid #2563eb;
    background-color: #eff6ff;
    padding: 12px 15px;
    margin: 15px 0;
    font-size: 12pt;
  }
  .callout-warning {
    border-left: 5px solid #d97706;
    background-color: #fffbeb;
    padding: 12px 15px;
    margin: 15px 0;
  }
  .badge {
    display: inline-block;
    padding: 2px 8px;
    font-size: 10.5pt;
    font-weight: bold;
    border-radius: 4px;
  }
  .badge-admin { background-color: #fee2e2; color: #991b1b; border: 1px solid #f87171; }
  .badge-staff { background-color: #e0f2fe; color: #075985; border: 1px solid #38bdf8; }
  .badge-public { background-color: #dcfce7; color: #166534; border: 1px solid #4ade80; }
  code {
    font-family: 'Consolas', 'Courier New', Courier, monospace;
    background-color: #f3f4f6;
    color: #b91c1c;
    padding: 2px 5px;
    font-size: 11pt;
    border-radius: 3px;
  }
  pre {
    font-family: 'Consolas', 'Courier New', Courier, monospace;
    background-color: #1f2937;
    color: #f9fafb;
    padding: 12px;
    border-radius: 5px;
    font-size: 10.5pt;
    overflow-x: auto;
  }
  .step-box {
    border: 1px solid #e5e7eb;
    background-color: #fafafa;
    border-radius: 6px;
    padding: 12px 18px;
    margin-bottom: 15px;
  }
  .step-header {
    font-weight: bold;
    color: #1e3a8a;
    font-size: 13pt;
    margin-bottom: 6px;
  }
</style>
</head>
<body>

  <h1>BÁO CÁO GIẢI THÍCH LUỒNG CHẠY HỆ THỐNG</h1>
  <div class="sub-title">HỆ THỐNG QUẢN LÝ TIN TỨC - FUNEWSMANAGEMENTSYSTEM<br>MÔN HỌC: SBA301 - ASSIGNMENT 02</div>

  <div class="meta-box">
    <table>
      <tr>
        <td width="25%"><strong>Môn học:</strong></td>
        <td width="35%">SBA301 (Distributed Systems / Web Services)</td>
        <td width="20%"><strong>Lớp học:</strong></td>
        <td width="20%">SE1910</td>
      </tr>
      <tr>
        <td><strong>Đề bài:</strong></td>
        <td>Assignment 02 - RESTful Web Service & ReactJS</td>
        <td><strong>Database:</strong></td>
        <td><code>A2StudentName_ClassCode</code></td>
      </tr>
      <tr>
        <td><strong>Backend:</strong></td>
        <td>Spring Boot 3 (3-Layer Architecture, Spring Data JPA)</td>
        <td><strong>Frontend:</strong></td>
        <td>ReactJS Client (Axios, Bootstrap 5)</td>
      </tr>
      <tr>
        <td><strong>Vai trò phụ trách:</strong></td>
        <td colspan="3">Senior Fullstack Developer & System Architect</td>
      </tr>
    </table>
  </div>

  <h2>1. TỔNG QUAN HỆ THỐNG VÀ YÊU CẦU ĐỀ BÀI</h2>
  <p>
    Hệ thống <strong>FUNewsManagementSystem</strong> là một ứng dụng quản lý, biên tập và xuất bản tin tức dành cho các trường đại học và tổ chức giáo dục. Hệ thống cho phép quản lý vòng đời tin tức từ khâu tạo bản thảo, phân loại danh mục, gắn thẻ (tags), kiểm duyệt trạng thái xuất bản, cho đến hiển thị cho công chúng và người dùng nội bộ.
  </p>
  <p>
    Dự án được xây dựng tuân thủ đầy đủ các tiêu chuẩn kỹ thuật trong tài liệu đặc tả <strong>Assignment 02 SBA301</strong>:
  </p>
  <ul>
    <li><strong>Phía Backend:</strong> Xây dựng bằng <strong>Spring Boot 3</strong> theo mô hình chuẩn <strong>3-Layer Architecture with Repository Pattern</strong>. Tương tác với cơ sở dữ liệu <strong>MS SQL Server</strong> thông qua <strong>Spring Data JPA</strong> và cơ chế tự động đồng bộ lược đồ <code>ddl-auto=update</code>. Tên cơ sở dữ liệu quy định là <code>A2StudentName_ClassCode</code>.</li>
    <li><strong>Phía Frontend:</strong> Xây dựng ứng dụng Client bằng <strong>ReactJS</strong> đặt tên là <code>A2StudentName_ClassCode</code>. Sử dụng thư viện <strong>Axios</strong> để gửi nhận các HTTP request/response đến REST API, cập nhật state và hiển thị dữ liệu linh hoạt trên các React components.</li>
    <li><strong>Kiểm soát dữ liệu & Xác thực:</strong> Áp dụng validate kiểu dữ liệu (data type validation) và các ràng buộc toàn vẹn cho toàn bộ các trường nhập liệu từ cả 2 phía FE và BE.</li>
    <li><strong>Giao diện người dùng theo yêu cầu bài tập:</strong> Các thao tác Thêm mới (Create) và Cập nhật (Update) <strong>bắt buộc phải được thực hiện bằng Popup Dialog (Modal)</strong>. Thao tác Xóa (Delete) <strong>luôn luôn kết hợp với Popup xác nhận (Confirm Dialog)</strong>.</li>
  </ul>

  <h2>2. THIẾT KẾ CƠ SỞ DỮ LIỆU & QUY TẮC RÀNG BUỘC NGHIỆP VỤ</h2>

  <h3>2.1. Cấu trúc lược đồ dữ liệu (Entities)</h3>
  <table class="data-table">
    <thead>
      <tr>
        <th width="15%">Bảng dữ liệu</th>
        <th width="35%">Thuộc tính chính</th>
        <th width="20%">Khóa chính / Khóa ngoại</th>
        <th width="30%">Mô tả nghiệp vụ</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>SystemAccount</strong></td>
        <td><code>AccountID, AccountName, AccountEmail, AccountRole, AccountPassword</code></td>
        <td>PK: <code>AccountID</code></td>
        <td>Tài khoản người dùng. <code>AccountRole = 1</code>: Admin, <code>AccountRole = 2</code>: Staff.</td>
      </tr>
      <tr>
        <td><strong>Category</strong></td>
        <td><code>CategoryID, CategoryName, CategoryDesciption, ParentCategoryID, IsActive</code></td>
        <td>PK: <code>CategoryID</code><br>FK: <code>ParentCategoryID</code> (self)</td>
        <td>Danh mục tin tức, hỗ trợ cấu trúc phân cấp cha - con. Trạng thái <code>IsActive</code> (1: active, 0: inactive).</td>
      </tr>
      <tr>
        <td><strong>NewsArticle</strong></td>
        <td><code>NewsArticleID, NewsTitle, Headline, CreatedDate, NewsContent, NewsSource, CategoryID, NewsStatus, CreatedByID, UpdatedByID, ModifiedDate</code></td>
        <td>PK: <code>NewsArticleID</code><br>FK: <code>CategoryID</code>, <code>CreatedByID</code>, <code>UpdatedByID</code></td>
        <td>Bài viết tin tức. Trạng thái <code>NewsStatus</code> (1: active/xuất bản, 0: inactive/bản nháp). Quản lý người tạo và người sửa đổi.</td>
      </tr>
      <tr>
        <td><strong>Tag</strong></td>
        <td><code>TagID, TagName, Note</code></td>
        <td>PK: <code>TagID</code></td>
        <td>Thẻ từ khóa để phân loại nội dung bài viết.</td>
      </tr>
      <tr>
        <td><strong>NewsTag</strong></td>
        <td><code>NewsArticleID, TagID</code></td>
        <td>Composite PK:<br><code>(NewsArticleID, TagID)</code></td>
        <td>Bảng liên kết quan hệ Nhiều - Nhiều (Many-to-Many) giữa NewsArticle và Tag.</td>
      </tr>
    </tbody>
  </table>

  <h3>2.2. Các quy tắc nghiệp vụ cốt lõi (Business Integrity Rules)</h3>
  <div class="callout-warning">
    <strong>CÁC RÀNG BUỘC NGHIỆP VỤ ĐẶC TẢ TRONG ĐỀ BÀI:</strong>
    <ol>
      <li><strong>Quy tắc xóa tài khoản (Admin Role):</strong> Thao tác xóa tài khoản chỉ được phép thực hiện khi tài khoản đó <em>chưa từng tạo bất kỳ bài viết tin tức nào</em>. Nếu tài khoản đã tạo bài viết, hệ thống chặn xóa và trả về thông báo lỗi <code>400 Bad Request</code>.</li>
      <li><strong>Quy tắc xóa danh mục (Staff Role):</strong> Thao tác xóa danh mục chỉ được phép thực hiện khi danh mục đó <em>chưa từng được gắn vào bất kỳ bài viết tin tức nào</em> và không có danh mục con phụ thuộc. Nếu đã có bài viết thuộc danh mục này, hệ thống từ chối xóa.</li>
      <li><strong>Quy tắc xem bài viết công khai (Public Access):</strong> Người dùng vãng lai (khách không cần đăng nhập) chỉ được phép xem các bài viết có trạng thái kích hoạt <code>NewsStatus = active (1)</code>.</li>
      <li><strong>Quy tắc lịch sử bài viết (Staff Role):</strong> Nhân viên Staff được quyền xem riêng danh sách lịch sử các bài viết do chính tài khoản của mình tạo ra (lọc theo <code>CreatedByID == currentStaffId</code>).</li>
    </ol>
  </div>

  <h2>3. KIẾN TRÚC 3-LAYER PHÍA BACKEND (SPRING BOOT 3)</h2>
  <p>
    Phía Backend được thiết kế theo đúng mô hình <strong>3-Layer Architecture</strong> tiêu chuẩn trong phát triển phần mềm doanh nghiệp:
  </p>

  <table class="data-table">
    <thead>
      <tr>
        <th width="20%">Tầng kiến trúc</th>
        <th width="35%">Các Class / Giao diện chính</th>
        <th width="45%">Trách nhiệm chuyên biệt</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>1. Web / Controller Layer</strong></td>
        <td>
          <code>AuthController</code><br>
          <code>PublicNewsController</code><br>
          <code>SystemAccountController</code><br>
          <code>CategoryController</code><br>
          <code>NewsArticleController</code><br>
          <code>TagController</code>
        </td>
        <td>
          - Tiếp nhận HTTP requests (GET, POST, PUT, DELETE).<br>
          - Kiểm tra tính hợp lệ của dữ liệu đầu vào thông qua Jakarta Validation <code>@Valid</code>.<br>
          - Chuyển tiếp yêu cầu sang Service layer tương ứng.<br>
          - Trả về HTTP Response mã chuẩn (200 OK, 201 Created, 400 Bad Request, 404 Not Found).
        </td>
      </tr>
      <tr>
        <td><strong>2. Business / Service Layer</strong></td>
        <td>
          <code>AuthService / AuthServiceImpl</code><br>
          <code>SystemAccountService / Impl</code><br>
          <code>CategoryService / Impl</code><br>
          <code>NewsArticleService / Impl</code><br>
          <code>TagService / Impl</code>
        </td>
        <td>
          - Nơi lưu trữ toàn bộ logic nghiệp vụ cốt lõi.<br>
          - Kiểm tra ràng buộc trước khi xóa: kiểm tra sự tồn tại của bài viết liên quan.<br>
          - Quản lý giao dịch dữ liệu với <code>@Transactional</code>.<br>
          - Ánh xạ giữa Entity và DTO (Data Transfer Object) để che giấu mật khẩu và bảo mật dữ liệu.
        </td>
      </tr>
      <tr>
        <td><strong>3. Data Access / Repository Layer</strong></td>
        <td>
          <code>SystemAccountRepository</code><br>
          <code>CategoryRepository</code><br>
          <code>NewsArticleRepository</code><br>
          <code>TagRepository</code>
        </td>
        <td>
          - Kế thừa <code>JpaRepository</code> từ Spring Data JPA.<br>
          - Cung cấp các hàm CRUD tự động.<br>
          - Định nghĩa các custom JPQL query cho việc tìm kiếm linh hoạt theo từ khóa, danh mục, trạng thái và tác giả.
        </td>
      </tr>
    </tbody>
  </table>

  <h3>3.1. Cơ chế bắt lỗi toàn cục (Global Exception Handling)</h3>
  <p>
    Lớp <code>GlobalExceptionHandler</code> sử dụng annotation <code>@RestControllerAdvice</code> bắt gọn các ngoại lệ trong toàn bộ hệ thống:
  </p>
  <ul>
    <li><code>MethodArgumentNotValidException</code>: Trả về danh sách chi tiết các trường dữ liệu không hợp lệ (ví dụ: email sai định dạng, tiêu đề rỗng, độ dài vi phạm).</li>
    <li><code>BadRequestException</code>: Trả về mã HTTP 400 khi vi phạm nghiệp vụ (ví dụ: xóa tài khoản/danh mục đang có bài viết, trùng email).</li>
    <li><code>ResourceNotFoundException</code>: Trả về mã HTTP 404 khi không tìm thấy thực thể cần thao tác.</li>
  </ul>

  <h3>3.2. Cơ chế nạp dữ liệu mẫu ban đầu (Data Initializer)</h3>
  <p>
    Lớp <code>DataInitializer</code> cài đặt interface <code>CommandLineRunner</code>. Khi ứng dụng chạy lần đầu trên một cơ sở dữ liệu trống, nó tự động khởi tạo dữ liệu mẫu phong phú bao gồm:
  </p>
  <ul>
    <li><strong>Tài khoản Admin:</strong> <code>admin@fpt.edu.vn</code> (mật khẩu: <code>admin123</code>, Role = 1).</li>
    <li><strong>Tài khoản Staff 1:</strong> <code>staff1@fpt.edu.vn</code> (mật khẩu: <code>staff123</code>, Role = 2).</li>
    <li><strong>Tài khoản Staff 2:</strong> <code>staff2@fpt.edu.vn</code> (mật khẩu: <code>staff123</code>, Role = 2).</li>
    <li><strong>Tài khoản Staff thử nghiệm:</strong> <code>teststaff@fpt.edu.vn</code> (tài khoản này chưa có bài viết để kiểm thử tính năng Xóa thành công).</li>
    <li><strong>Các danh mục mẫu:</strong> Academic & Education, Campus Life, Career & Internship, và một danh mục rỗng để kiểm thử xóa.</li>
    <li><strong>Các Tag từ khóa và bài viết tin tức mẫu</strong> với đầy đủ nội dung, tác giả và ngày tạo.</li>
  </ul>

  <h2>4. KIẾN TRÚC PHÍA FRONTEND (REACTJS & AXIOS CLIENT)</h2>
  <p>
    Ứng dụng Frontend được xây dựng bằng ReactJS phiên bản hiện đại, sử dụng Vite làm công cụ đóng gói tối ưu. Cấu trúc mã nguồn được phân tách module rõ ràng:
  </p>
  <ul>
    <li><strong>src/services/api.js:</strong> Khởi tạo Axios Instance với Base URL <code>http://localhost:8080/api</code>. Tích hợp Axios Interceptor tự động gắn Header <code>X-User-Id</code> để nhận diện nhân viên thực hiện thao tác tạo/sửa tin tức.</li>
    <li><strong>src/components/Modal.jsx:</strong> Thành phần Popup Dialog dùng chung cho toàn bộ các tác vụ Thêm mới và Sửa đổi thông tin bài viết, tài khoản và danh mục.</li>
    <li><strong>src/components/ConfirmModal.jsx:</strong> Thành phần Hộp thoại xác nhận chuyên biệt cho các tác vụ Xóa, hiển thị cảnh báo đỏ và yêu cầu người dùng xác nhận dứt khoát trước khi gọi API xóa.</li>
    <li><strong>src/pages/PublicNewsPage.jsx:</strong> Trang tin tức công khai dành cho công chúng, hỗ trợ thanh tìm kiếm theo từ khóa và bộ lọc danh mục.</li>
    <li><strong>src/pages/AccountManagementPage.jsx:</strong> Trang quản trị tài khoản dành riêng cho Admin (Role 1), hiển thị trạng thái an toàn/bị khóa xóa của từng tài khoản.</li>
    <li><strong>src/pages/CategoryManagementPage.jsx:</strong> Trang quản lý danh mục tin tức dành cho Staff (Role 2).</li>
    <li><strong>src/pages/NewsArticleManagementPage.jsx:</strong> Trang quản lý bài viết tin tức và gắn thẻ tag đa lựa chọn dành cho Staff.</li>
    <li><strong>src/pages/NewsHistoryPage.jsx:</strong> Trang xem lịch sử bài viết được sáng tác bởi chính nhân viên đang đăng nhập cùng bảng thống kê bài viết.</li>
    <li><strong>src/pages/ProfilePage.jsx:</strong> Trang quản lý và cập nhật thông tin cá nhân của nhân viên, hỗ trợ đổi mật khẩu an toàn.</li>
  </ul>

  <h2>5. GIẢI THÍCH CHI TIẾT CÁC LUỒNG CHẠY CỦA HỆ THỐNG (EXECUTION FLOWS)</h2>

  <div class="step-box">
    <div class="step-header">Luồng 1: Khởi động hệ thống & Tự động sinh cấu trúc dữ liệu</div>
    <ol>
      <li>Ứng dụng Spring Boot 3 khởi động tại cổng <code>8080</code>.</li>
      <li>Cấu hình Hibernate kết nối tới MS SQL Server với chuỗi kết nối <code>databaseName=A2StudentName_ClassCode</code>.</li>
      <li>Thuộc tính <code>spring.jpa.hibernate.ddl-auto=update</code> tự động tạo hoặc đồng bộ các bảng <code>SystemAccount</code>, <code>Category</code>, <code>NewsArticle</code>, <code>Tag</code>, và bảng liên kết <code>NewsTag</code>.</li>
      <li>Component <code>DataInitializer</code> kích hoạt: kiểm tra nếu bảng <code>SystemAccount</code> chưa có dữ liệu, tự động thêm các tài khoản Admin, Staff, các danh mục, thẻ tag và bài viết mẫu.</li>
      <li>Frontend ReactJS khởi động tại cổng <code>3000</code>, sẵn sàng phục vụ người dùng.</li>
    </ol>
  </div>

  <div class="step-box">
    <div class="step-header">Luồng 2: Khách vãng lai xem và tìm kiếm tin tức công khai (Public News)</div>
    <ol>
      <li>Khách truy cập vào hệ thống tại <code>http://localhost:3000</code>. Theo mặc định, tab <strong>Public News</strong> được kích hoạt mà không yêu cầu đăng nhập.</li>
      <li>Component <code>PublicNewsPage</code> gửi yêu cầu <code>GET /api/public/news</code> và <code>GET /api/public/categories</code> bằng Axios.</li>
      <li>Tại Backend, <code>PublicNewsController</code> tiếp nhận request và chuyển sang <code>NewsArticleService.getPublicArticles(keyword, categoryId)</code>.</li>
      <li>Service gọi Repository thực hiện truy vấn với điều kiện bắt buộc: <code>NewsStatus = true (1)</code>. Chỉ những tin tức đã được xuất bản mới được trả về.</li>
      <li>Client nhận danh sách JSON, hiển thị giao diện các thẻ Card tin tức gồm: Tiêu đề, Danh mục, Headline tóm tắt, Tác giả, Ngày đăng và các Thẻ Tag.</li>
      <li>Khi khách nhấn nút <strong>"Read Story"</strong>: Một Popup Dialog (Modal) hiển thị chi tiết toàn bộ nội dung bài viết.</li>
      <li>Khi khách nhập từ khóa vào ô Search hoặc chọn Danh mục từ Dropdown: Client tự động gửi tham số <code>keyword</code> và <code>categoryId</code> lên API để lọc kết quả tức thời.</li>
    </ol>
  </div>

  <div class="step-box">
    <div class="step-header">Luồng 3: Xác thực đăng nhập (Login Authentication) và Phân quyền Role</div>
    <ol>
      <li>Người dùng nhấn nút <strong>"Member Login"</strong> trên thanh điều hướng Navbar. Popup Dialog đăng nhập xuất hiện.</li>
      <li>Người dùng điền Email và Password (hoặc bấm chọn nút tài khoản kiểm thử nhanh Admin / Staff).</li>
      <li>Client kiểm tra định dạng email và mật khẩu không rỗng. Nếu hợp lệ, Axios gửi <code>POST /api/auth/login</code> với payload <code>{ email, password }</code>.</li>
      <li>Tại Backend, <code>AuthService</code> tìm kiếm tài khoản theo email trong bảng <code>SystemAccount</code>. Nếu sai email hoặc mật khẩu, ném <code>BadRequestException("Invalid email or password.")</code>.</li>
      <li>Nếu đăng nhập thành công, Backend trả về <code>LoginResponse</code> gồm: <code>accountID, accountName, accountEmail, accountRole, roleName, token</code>.</li>
      <li>Client lưu thông tin người dùng vào <code>localStorage ('funews_user')</code> và cập nhật State <code>currentUser</code>:
        <ul>
          <li>Nếu là <strong>Admin (Role = 1)</strong>: Navbar hiển thị menu <em>Account Management</em> và tự động chuyển người dùng đến trang quản lý tài khoản.</li>
          <li>Nếu là <strong>Staff (Role = 2)</strong>: Navbar hiển thị đầy đủ các menu: <em>Category Management</em>, <em>News Management</em>, <em>My History</em>, và <em>Profile</em>.</li>
        </ul>
      </li>
    </ol>
  </div>

  <div class="step-box">
    <div class="step-header">Luồng 4: Admin - Quản lý tài khoản và Kiểm soát ràng buộc bài viết</div>
    <ol>
      <li><strong>Xem & Tìm kiếm:</strong> Admin truy cập tab Account Management. Axios gửi <code>GET /api/accounts?keyword=...&role=...</code>. Bảng hiển thị danh sách tài khoản kèm trạng thái an toàn: <em>"Safe to delete"</em> (chưa có bài viết) hoặc <em>"Has articles (Protected)"</em> (đã có bài viết).</li>
      <li><strong>Thêm mới tài khoản:</strong> Admin bấm <em>"Add New Account"</em> -> Popup Dialog xuất hiện. Nhập Tên, Email, Quyền (Admin/Staff), Mật khẩu -> Bấm Lưu -> Gửi <code>POST /api/accounts</code>. Backend kiểm tra trùng email; nếu trùng báo lỗi, nếu không lưu vào DB và đóng Modal.</li>
      <li><strong>Cập nhật tài khoản:</strong> Admin bấm icon Sửa -> Popup Dialog hiển thị thông tin hiện tại -> Admin chỉnh sửa thông tin (có thể đổi mật khẩu mới hoặc để trống nếu giữ nguyên) -> Gửi <code>PUT /api/accounts/{id}</code> -> Backend cập nhật dữ liệu.</li>
      <li><strong>Xóa tài khoản có kiểm tra ràng buộc (Business Rule):</strong>
        <ul>
          <li>Admin bấm icon Xóa -> Hộp thoại <strong>ConfirmModal</strong> xuất hiện cảnh báo.</li>
          <li>Nếu Admin xác nhận, Axios gửi <code>DELETE /api/accounts/{id}</code>.</li>
          <li>Tại Backend, <code>SystemAccountServiceImpl</code> kiểm tra qua Repository: <code>newsArticleRepository.existsByCreatedBy_AccountID(id)</code>.</li>
          <li><strong>Trường hợp vi phạm:</strong> Nếu tài khoản đã từng tạo bài viết, Service ném <code>BadRequestException("Cannot delete account because it has already created one or more news articles.")</code>. Controller trả về HTTP 400. Client hiển thị thông báo Alert màu đỏ chặn xóa thành công.</li>
          <li><strong>Trường hợp hợp lệ:</strong> Nếu tài khoản chưa tạo bài viết (như tài khoản <em>teststaff@fpt.edu.vn</em>), tài khoản được xóa khỏi DB và danh sách được làm mới.</li>
        </ul>
      </li>
    </ol>
  </div>

  <div class="step-box">
    <div class="step-header">Luồng 5: Staff - Quản lý danh mục và Kiểm soát ràng buộc bài viết</div>
    <ol>
      <li><strong>Xem & Tìm kiếm danh mục:</strong> Staff xem danh sách các danh mục tin tức, trạng thái kích hoạt (Active/Inactive), danh mục cha.</li>
      <li><strong>Thêm mới danh mục:</strong> Bấm <em>"Add New Category"</em> -> Popup Dialog mở ra -> Nhập Tên danh mục, Mô tả, Chọn danh mục cha (tùy chọn) và Trạng thái Active -> Gửi <code>POST /api/categories</code>.</li>
      <li><strong>Cập nhật danh mục:</strong> Bấm icon Sửa -> Popup Dialog mở ra với dữ liệu điền sẵn -> Sửa và lưu qua <code>PUT /api/categories/{id}</code>.</li>
      <li><strong>Xóa danh mục có kiểm tra ràng buộc (Business Rule):</strong>
        <ul>
          <li>Staff bấm icon Xóa -> Hộp thoại <strong>ConfirmModal</strong> xuất hiện.</li>
          <li>Staff bấm xác nhận -> Gửi <code>DELETE /api/categories/{id}</code>.</li>
          <li>Backend kiểm tra 2 điều kiện: <code>newsArticleRepository.existsByCategory_CategoryID(id)</code> và <code>categoryRepository.existsByParentCategory_CategoryID(id)</code>.</li>
          <li>Nếu danh mục đang được bài viết tham chiếu hoặc đang là danh mục cha của danh mục khác: Backend ném <code>BadRequestException</code> chặn xóa và thông báo lý do rõ ràng.</li>
          <li>Nếu danh mục rỗng: Xóa thành công.</li>
        </ul>
      </li>
    </ol>
  </div>

  <div class="step-box">
    <div class="step-header">Luồng 6: Staff - Quản lý bài viết tin tức và Gắn thẻ Tag</div>
    <ol>
      <li><strong>Xem & Lọc bài viết:</strong> Staff xem bảng toàn bộ tin tức gồm cả bài đang xuất bản (Active) và bài nháp (Inactive). Hỗ trợ tìm kiếm theo tiêu đề/nội dung, lọc theo danh mục và trạng thái.</li>
      <li><strong>Tạo mới bài viết qua Popup Modal:</strong>
        <ul>
          <li>Staff bấm <em>"Create News Article"</em> -> Popup Dialog (Modal) xuất hiện.</li>
          <li>Staff nhập: Mã bài viết (tùy chọn hoặc để hệ thống tự sinh mã <code>NA...</code>), Danh mục, Tiêu đề, Headline, Nội dung bài viết, Nguồn tin.</li>
          <li><strong>Gắn thẻ Tag:</strong> Giao diện hiển thị danh sách các thẻ Tag có sẵn dưới dạng nút bấm tương tác. Staff bấm chọn các thẻ phù hợp (hệ thống lưu mảng <code>tagIDs</code>).</li>
          <li>Chọn trạng thái xuất bản: Active (Hiển thị cho công chúng) hoặc Inactive (Lưu bản nháp).</li>
          <li>Bấm Lưu -> Gửi <code>POST /api/news-articles</code> kèm Header <code>X-User-Id</code>.</li>
          <li>Backend gán <code>CreatedByID</code> chính là tài khoản của Staff đang thực hiện, liên kết các bản ghi vào bảng <code>NewsTag</code> trong DB và trả về kết quả thành công.</li>
        </ul>
      </li>
      <li><strong>Chỉnh sửa bài viết qua Popup Modal:</strong> Bấm Sửa -> Popup Modal mở ra -> Cập nhật thông tin -> Gửi <code>PUT /api/news-articles/{id}</code>. Backend tự động cập nhật <code>UpdatedByID</code> và thời gian <code>ModifiedDate</code>.</li>
      <li><strong>Xóa bài viết:</strong> Bấm icon Xóa -> Xác nhận trong ConfirmModal -> Gửi <code>DELETE /api/news-articles/{id}</code>. Backend xóa liên kết trong bảng <code>NewsTag</code> rồi xóa bài viết khỏi cơ sở dữ liệu.</li>
    </ol>
  </div>

  <div class="step-box">
    <div class="step-header">Luồng 7: Staff - Xem lịch sử bài viết của chính mình (My History)</div>
    <ol>
      <li>Staff bấm vào menu <strong>"My History"</strong> trên thanh điều hướng Navbar.</li>
      <li>Axios gửi yêu cầu <code>GET /api/news-articles/history/{currentStaffId}</code>.</li>
      <li>Backend truy vấn trong Repository: <code>findByCreatedBy_AccountIDOrderByCreatedDateDesc(staffId)</code>.</li>
      <li>Giao diện hiển thị:
        <ul>
          <li>Các thẻ số liệu KPI: Tổng số bài đã viết, số bài đang Active (đã xuất bản), số bài Inactive (bản nháp).</li>
          <li>Bảng danh sách chi tiết các bài viết do chính Staff sáng tác được sắp xếp theo thời gian mới nhất trước.</li>
          <li>Hộp tìm kiếm nhanh ngay trong lịch sử cá nhân.</li>
          <li>Nút xem chi tiết từng bài viết bằng Popup Modal.</li>
        </ul>
      </li>
    </ol>
  </div>

  <div class="step-box">
    <div class="step-header">Luồng 8: Quản lý thông tin cá nhân (Profile Management)</div>
    <ol>
      <li>Người dùng bấm vào menu <strong>"Profile"</strong>.</li>
      <li>Màn hình hiển thị thẻ thông tin cá nhân: Mã tài khoản, Họ tên, Email, Vai trò phân quyền (Admin hoặc Staff).</li>
      <li>Người dùng bấm <em>"Edit Profile"</em> -> Popup Dialog xuất hiện.</li>
      <li>Người dùng có thể sửa đổi Họ và tên, Địa chỉ Email.</li>
      <li>Nếu muốn đổi mật khẩu: Người dùng nhập Mật khẩu hiện tại, Mật khẩu mới và Xác nhận mật khẩu mới.</li>
      <li>Gửi <code>PUT /api/accounts/{id}/profile</code> -> Backend kiểm tra mật khẩu cũ; nếu khớp, cập nhật mật khẩu mới và thông tin tài khoản -> Cập nhật lại phiên làm việc trên Client.</li>
    </ol>
  </div>

  <h2>6. DANH MỤC RESTFUL API (SPECIFICATIONS)</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th width="10%">Phương thức</th>
        <th width="30%">Endpoint URL</th>
        <th width="15%">Quyền truy cập</th>
        <th width="45%">Chức năng & Mô tả</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>POST</code></td>
        <td><code>/api/auth/login</code></td>
        <td><span class="badge badge-public">Public</span></td>
        <td>Xác thực đăng nhập bằng email & password, trả về quyền Role.</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/public/news</code></td>
        <td><span class="badge badge-public">Public</span></td>
        <td>Lấy danh sách tin tức công khai có trạng thái Active, hỗ trợ tìm kiếm.</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/public/news/{id}</code></td>
        <td><span class="badge badge-public">Public</span></td>
        <td>Xem chi tiết bài viết công khai theo ID.</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/public/categories</code></td>
        <td><span class="badge badge-public">Public</span></td>
        <td>Lấy danh sách các danh mục đang kích hoạt (Active) phục vụ lọc tin tức.</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/accounts</code></td>
        <td><span class="badge badge-admin">Admin</span></td>
        <td>Xem danh sách tài khoản người dùng, tìm kiếm theo tên/email/vai trò.</td>
      </tr>
      <tr>
        <td><code>POST</code></td>
        <td><code>/api/accounts</code></td>
        <td><span class="badge badge-admin">Admin</span></td>
        <td>Tạo mới tài khoản người dùng (validate email hợp lệ và chưa tồn tại).</td>
      </tr>
      <tr>
        <td><code>PUT</code></td>
        <td><code>/api/accounts/{id}</code></td>
        <td><span class="badge badge-admin">Admin</span></td>
        <td>Cập nhật thông tin tài khoản người dùng.</td>
      </tr>
      <tr>
        <td><code>DELETE</code></td>
        <td><code>/api/accounts/{id}</code></td>
        <td><span class="badge badge-admin">Admin</span></td>
        <td>Xóa tài khoản (bị chặn nếu tài khoản đã từng tạo bài viết).</td>
      </tr>
      <tr>
        <td><code>PUT</code></td>
        <td><code>/api/accounts/{id}/profile</code></td>
        <td><span class="badge badge-staff">Staff / Admin</span></td>
        <td>Cập nhật hồ sơ cá nhân và đổi mật khẩu.</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/categories</code></td>
        <td><span class="badge badge-staff">Staff</span></td>
        <td>Xem toàn bộ danh mục tin tức, lọc theo từ khóa và trạng thái.</td>
      </tr>
      <tr>
        <td><code>POST</code></td>
        <td><code>/api/categories</code></td>
        <td><span class="badge badge-staff">Staff</span></td>
        <td>Tạo mới danh mục tin tức qua Popup Dialog.</td>
      </tr>
      <tr>
        <td><code>PUT</code></td>
        <td><code>/api/categories/{id}</code></td>
        <td><span class="badge badge-staff">Staff</span></td>
        <td>Cập nhật danh mục tin tức qua Popup Dialog.</td>
      </tr>
      <tr>
        <td><code>DELETE</code></td>
        <td><code>/api/categories/{id}</code></td>
        <td><span class="badge badge-staff">Staff</span></td>
        <td>Xóa danh mục (bị chặn nếu đang có bài viết sử dụng hoặc có danh mục con).</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/news-articles</code></td>
        <td><span class="badge badge-staff">Staff</span></td>
        <td>Quản lý toàn bộ bài viết tin tức (Active và Inactive).</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/news-articles/history/{staffId}</code></td>
        <td><span class="badge badge-staff">Staff</span></td>
        <td>Xem lịch sử bài viết do một nhân viên cụ thể sáng tác.</td>
      </tr>
      <tr>
        <td><code>POST</code></td>
        <td><code>/api/news-articles</code></td>
        <td><span class="badge badge-staff">Staff</span></td>
        <td>Tạo mới bài viết và gán thẻ Tag qua Popup Dialog.</td>
      </tr>
      <tr>
        <td><code>PUT</code></td>
        <td><code>/api/news-articles/{id}</code></td>
        <td><span class="badge badge-staff">Staff</span></td>
        <td>Cập nhật bài viết và thẻ Tag qua Popup Dialog.</td>
      </tr>
      <tr>
        <td><code>DELETE</code></td>
        <td><code>/api/news-articles/{id}</code></td>
        <td><span class="badge badge-staff">Staff</span></td>
        <td>Xóa bài viết (kết hợp Confirm Dialog).</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/tags</code></td>
        <td><span class="badge badge-staff">Staff</span></td>
        <td>Lấy danh sách các thẻ từ khóa (Tags) để gắn vào bài viết.</td>
      </tr>
    </tbody>
  </table>

  <h2>7. HƯỚNG DẪN CÀI ĐẶT VÀ VẬN HÀNH HỆ THỐNG</h2>

  <h3>7.1. Cấu hình Cơ sở dữ liệu MS SQL Server</h3>
  <ol>
    <li>Mở SQL Server Management Studio (SSMS).</li>
    <li>Tạo cơ sở dữ liệu mới với tên theo yêu cầu đề bài:
      <pre>CREATE DATABASE A2StudentName_ClassCode;</pre>
    </li>
    <li>Kiểm tra cấu hình tài khoản SA trong tệp <code>src/main/resources/application.properties</code>:
      <pre>
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=A2StudentName_ClassCode;encrypt=true;trustServerCertificate=true;
spring.datasource.username=sa
spring.datasource.password=123456
      </pre>
      <em>(Bạn có thể điều chỉnh mật khẩu sa cho khớp với máy cá nhân của bạn).</em>
    </li>
  </ol>

  <h3>7.2. Khởi chạy Backend (Spring Boot 3)</h3>
  <p>Mở Terminal tại thư mục gốc của dự án và chạy lệnh:</p>
  <pre>./mvnw spring-boot:run</pre>
  <p>Backend sẽ khởi động tại địa chỉ: <code>http://localhost:8080</code>.</p>

  <h3>7.3. Khởi chạy Frontend (ReactJS Client)</h3>
  <p>Mở một cửa sổ Terminal thứ hai, di chuyển vào thư mục ReactJS và khởi động server:</p>
  <pre>
cd A2StudentName_ClassCode
npm run dev
  </pre>
  <p>Ứng dụng Client sẽ mở tại địa chỉ: <code>http://localhost:3000</code>.</p>

  <h3>7.4. Tài khoản kiểm thử mặc định có sẵn trong hệ thống</h3>
  <table class="data-table">
    <thead>
      <tr>
        <th>Vai trò</th>
        <th>Email đăng nhập</th>
        <th>Mật khẩu</th>
        <th>Chức năng thử nghiệm chính</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="badge badge-admin">Admin</span></td>
        <td><code>admin@fpt.edu.vn</code></td>
        <td><code>admin123</code></td>
        <td>Quản lý tài khoản: Thêm, Sửa, Tìm kiếm, Thử xóa tài khoản có bài viết (bị chặn) và tài khoản không có bài viết (thành công).</td>
      </tr>
      <tr>
        <td><span class="badge badge-staff">Staff 1</span></td>
        <td><code>staff1@fpt.edu.vn</code></td>
        <td><code>staff123</code></td>
        <td>Quản lý Danh mục, Quản lý Tin tức (gắn tags), Xem lịch sử bài viết của Staff 1, Sửa hồ sơ cá nhân.</td>
      </tr>
      <tr>
        <td><span class="badge badge-staff">Staff 2</span></td>
        <td><code>staff2@fpt.edu.vn</code></td>
        <td><code>staff123</code></td>
        <td>Đăng nhập để thấy Lịch sử bài viết phân biệt độc lập giữa các Staff khác nhau.</td>
      </tr>
      <tr>
        <td><span class="badge badge-public">Guest / Public</span></td>
        <td><em>(Không cần đăng nhập)</em></td>
        <td><em>—</em></td>
        <td>Xem danh sách tin tức Active, tìm kiếm tin tức, lọc theo danh mục, đọc toàn văn tin tức.</td>
      </tr>
    </tbody>
  </table>

  <br><br>
  <p style="text-align: right; font-style: italic;">
    Báo cáo hoàn thành và xuất bản tự động bởi Antigravity Senior Developer &copy; 2026.
  </p>

</body>
</html>`;

const outputPathDoc = path.resolve('Bao_Cao_Giai_Thich_Luong_Chay_Assignment2.doc');
fs.writeFileSync(outputPathDoc, htmlDocContent, 'utf-8');
console.log('Successfully generated .doc file at:', outputPathDoc);
