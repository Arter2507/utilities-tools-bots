# 🛡️ Báo cáo Kiểm định Bảo mật (Security Audit) - Personal Hub MVP

Dựa trên việc rà soát mã nguồn hiện tại (Sprints 1-5), dưới đây là các vấn đề bảo mật quan trọng cần lưu ý và kế hoạch khắc phục.

## 🚨 Vấn đề Ưu tiên cao (High Priority)

### 1. Dữ liệu nhạy cảm lưu trữ không an toàn (LocalStorage)
- **Vấn đề:** Toàn bộ dữ liệu về **Tài chính**, **Sức khỏe (Chu kỳ, Tâm trạng)**, và **Nhật ký cá nhân (Journey)** đang được lưu trữ dưới dạng văn bản thuần (plain text) trong `localStorage`.
- **Rủi ro:** Bất kỳ mã độc (script) nào chạy trên cùng domain (ví dụ: qua một lỗ hổng XSS hoặc tiện ích mở rộng trình duyệt độc hại) đều có thể truy cập và đánh cắp toàn bộ thông tin cá nhân này.
- **Khuyến nghị:** 
  - Sử dụng cơ chế mã hóa dữ liệu trước khi lưu vào `localStorage` (ví dụ: `crypto-js` với một key do người dùng cung cấp).
  - Chuyển sang `IndexedDB` để quản lý dữ liệu lớn hơn và khó bị script truy cập tùy tiện hơn.

### 2. Thiếu lớp Xác thực (Authentication) & Quyền riêng tư
- **Vấn đề:** Dự án chưa có hệ thống Login. Dữ liệu hiển thị ngay lập tức khi mở ứng dụng.
- **Rủi ro:** Bất kỳ ai sử dụng chung máy tính/trình duyệt đều có thể xem được các thông tin cực kỳ riêng tư (Love Tracker, Health, Finance).
- **Khuyến nghị:** Thiết lập mã PIN hoặc mật khẩu tối thiểu để truy cập ứng dụng (Lock screen).

---

## ⚠️ Vấn đề Ưu tiên trung bình (Medium Priority)

### 3. Nguy cơ XSS (Cross-Site Scripting)
- **Vấn đề:** Mặc dù React tự động escape nội dung, nhưng các trường như `content` của Journey hoặc `note` của Health Log có thể trở thành mục tiêu nếu sau này ứng dụng hỗ trợ Render HTML (ví dụ: cho định dạng Rich Text).
- **Rủi ro:** Inject mã script thực thi trong ngữ cảnh trình duyệt.
- **Khuyến nghị:** Sử dụng thư viện `dompurify` để sanitize mọi đầu vào từ người dùng trước khi lưu trữ hoặc render, đặc biệt là các trường văn bản dài.

### 4. Rò rỉ thông tin qua Log (Information Leakage)
- **Vấn đề:** Quy tắc dự án yêu cầu lưu `build_err_log` và các file `logs` vào thư mục `Frontend/docs/`.
- **Rủi ro:** Nếu các log này chứa đường dẫn hệ thống tuyệt đối, thông tin môi trường, hoặc dữ liệu nhạy cảm từ các biến `.env` bị lỗi, chúng có thể bị commit vào Git và lộ ra ngoài.
- **Khuyến nghị:** Đảm bảo `docs/logs/` nằm trong `.gitignore` hoặc chỉ lưu thông tin lỗi kỹ thuật thuần túy đã được lọc (stripped).

---

## 💡 Đề xuất Cải thiện (Best Practices)

1. **Content Security Policy (CSP):** Thiết lập thẻ meta CSP để chặn việc thực thi các script lạ hoặc gửi dữ liệu đến các server không tin tưởng.
2. **Data Integrity:** Thêm mã băm (hash/checksum) cho các khối dữ liệu trong `localStorage` để phát hiện nếu dữ liệu bị thay đổi bên ngoài ứng dụng.
3. **Environment Secrets:** Luôn kiểm tra `.env` và không bao giờ commit các giá trị cấu hình nhạy cảm (mặc dù hiện tại dự án đang dùng mock).

---
> [!IMPORTANT]
> **Kết luận:** Đối với một Personal Hub lưu trữ dữ liệu riêng tư, việc **Mã hóa dữ liệu tại chỗ (At-rest encryption)** và **Xác thực truy cập (Auth)** là hai bước tiếp theo quan trọng nhất để đảm bảo an toàn cho người dùng.
