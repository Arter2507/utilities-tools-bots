# 🧠 AI SESSION MEMORIES (Ký ức Hệ thống)

Đây là kho lưu trữ tri thức và ký ức của các phiên làm việc. Mục tiêu là giúp AI ở phiên tiếp theo nhanh chóng "tải" được bối cảnh, các quyết định quan trọng và trạng thái dự án mà không cần người dùng nhắc lại.

---

## 📅 [2026-03-18] - Standardizing AI Identity & Operations

### 🎯 Objective

- Thiết lập hệ thống tài liệu cốt lõi cho lực lượng AI (Agent Fleet).
- Định nghĩa danh tính (AGENTS), triết lý vận hành (SOULS) và bản đồ dự án (MAP).

### ✅ Key Decisions

- **Standardized Navigation**: Di chuyển các file lẻ tẻ vào `documentation/` và cập nhật `MAP.md` làm cổng vào duy nhất.
- **Identity Enforcement**: Hợp nhất danh tính và triết lý vận hành vào `IDENTITY_SOUL.md` để AI hiểu mình là một phần của Task Force, không phải chatbot đơn lẻ.
- **Synergy Protocol**: Thiết lập trong `IDENTITY_SOUL.md` rằng AI là đối tác phản biện (Senior Architect), ưu tiên "Deep Reasoning".
- **Zero-Bug Linting**: Thực hiện Clean Rewrite cho mọi file tài liệu để đảm bảo không có lỗi markdown lint.

### 💡 Lessons Learned

- Việc sử dụng `multi_replace_file_content` đôi khi gây ra sự trùng lặp nếu range không chuẩn. **Clean Rewrite** (dùng `write_to_file`) là phương pháp an toàn hơn khi file còn nhỏ và cần độ chuẩn xác cao.

### 🚀 Pending Tasks / Future Context

- Tiếp tục duy trì `MEMORIES.md` sau mỗi phiên làm việc lớn.
- Tích hợp thêm các báo cáo từ `security_audit.md` vào workflow thực tế.
- Luôn kiểm tra `IDENTITY_SOUL.md` khi bắt đầu task mới để đảm bảo đúng "vibe" làm việc.

---

## 📝 Format Hướng dẫn (Cho AI phiên sau)

*Mỗi phiên làm việc nên được append vào file này theo cấu trúc:*

1. **📅 [Ngày] - Tiêu đề phiên**: Tóm tắt ngắn gọn.
2. **🎯 Objective**: Mục tiêu chính đã thực hiện.
3. **✅ Key Decisions**: Những quyết định kiến trúc hoặc logic quan trọng.
4. **💡 Lessons Learned**: Những bug hóc búa đã sửa hoặc kinh nghiệm rút ra.
5. **🚀 Pending Tasks**: Việc cần làm tiếp theo hoặc lưu ý cho AI sau.

---

## "Memory is the bridge between instructions and execution."
