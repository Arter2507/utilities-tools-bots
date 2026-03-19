# 🛡️ SECURITY STANDARDS / TIÊU CHUẨN BẢO MẬT

Tài liệu này quy định các quy tắc bảo mật cốt lõi cho hệ thống Trợ lý AI, đảm bảo an toàn vận hành và bảo vệ dữ liệu người dùng.
(This document specifies the core security rules for the AI Assistant system, ensuring operational safety and protecting user data.)

---

## 🔐 1. ACCESS CONTROL / KIỂM SOÁT TRUY CẬP

### 👤 Assistant Model (One-User Policy) / Mô hình Trợ lý (Chính sách Một Người dùng)

- **Scope First**: Hệ thống được thiết kế cho mô hình trợ lý cá nhân. (The system is designed for a personal assistant model.)
- **Isolation**: Không sử dụng chung môi trường làm việc cho nhiều người dùng không tin tưởng. (Do not share a workspace environment among untrusted users.)

### ✉️ Messaging Policy / Chính sách Tin nhắn

- **Access Gating**: Mặc định yêu cầu xác thực trước khi phản hồi. (Require authentication before responding by default.)
- **Group Gating**: AI chỉ phản hồi khi được gọi trực tiếp (ví dụ qua `@mention`) trong nhóm. (In groups, AI only responds when explicitly called (e.g., via `@mention`).)

---

## 🛠️ 2. TOOL & RUNTIME SAFETY / AN TOÀN CÔNG CỤ & RUNTIME

### 🚫 Restricted Tools / Công cụ Bị hạn chế

- **System Level**: Cấm AI tự ý thay đổi cấu trúc hệ điều hành. (AI is forbidden from altering core OS structures autonomously.)
- **Write Access**: Hạn chế quyền ghi trừ khi thực hiện các tác vụ lập trình cụ thể. (Limit write access unless performing specific authorized programming tasks.)

---

## 🔑 4. SECRETS & DATA PRIVACY / BẢO MẬT DỮ LIỆU & BÍ MẬT

- **Zero Secrets**: Cấm tuyệt đối ghi trực tiếp khóa API, mật khẩu vào mã nguồn. (Strictly prohibit hardcoding API keys or passwords in source code.)
- **Secret Management**: Sử dụng file `.env` hoặc hệ thống quản lý bí mật. (Use `.env` files or secret management systems.)

---

## 🚀 5. INCIDENT RESPONSE / QUY TRÌNH SỰ CỐ

Khi phát hiện sự cố bảo mật: (Upon discovering a security incident:)
1. **Contain**: Dừng ngay các tiến trình, ngắt kết nối mạng. (Stop processes, disconnect network.)
2. **Rotate**: Thu hồi và tạo mới TẤT CẢ các khóa API. (Revoke and rotate ALL API keys.)
3. **Audit**: Kiểm tra nhật ký để xác định ảnh hưởng. (Audit logs to determine impact.)

---

> **"Security is not a product, but a process."**
