# 🔄 PROJECT WORKFLOWS / QUY TRÌNH DỰ ÁN

## 🌐 Language / Ngôn ngữ

- `VI`: Nội dung chuẩn cho quy trình. (Standard content for workflows).
- `EN`: AI interprets equivalent English meaning for workflow automation. (AI diễn dịch ý nghĩa tiếng Anh tương đương để tự động hóa quy trình).
- Trigger language rule: after `Hey, AI`, use user's primary language to ask/answer. (Quy tắc ngôn ngữ kích hoạt: sau khi gọi `Hey, AI`, sử dụng ngôn ngữ chính của người dùng để hỏi/đáp).

Tài liệu này định nghĩa các quy trình làm việc đặc thù để đảm bảo tính nhất quán và hiệu quả trong mọi phiên làm việc.
(This document defines specific workflows to ensure consistency and efficiency in every session.)

---

## 🚀 1. FIRST SESSION ONBOARDING / KHỞI TẠO NGỮ CẢNH HỆ THỐNG

Quy trình này áp dụng khi AI bắt đầu một phiên làm việc mới, hoặc khi chưa có dữ liệu bộ nhớ (`memory`) trước đó.
(This process applies when the AI starts a new session or when no previous memory data exists.)

### Bước 1: Xác định Ngữ cảnh / Step 1: Context Definition

AI chỉ hỏi 3 nhóm thông tin bắt buộc:
(AI only asks for 3 mandatory groups of information:)

1. **Vai trò & phạm vi / Role & Scope**
   - Vai trò của AI trong dự án là gì? (What is the AI's role in the project?)
   - Vai trò của người dùng là gì? (What is the user's role?)
2. **Mục tiêu & vấn đề / Goal & Problem**
   - Dự án đang giải quyết vấn đề gì? (What problem is the project solving?)
   - Kết quả cuối cùng cần đạt là gì? (What is the final desired result?)
3. **Cách làm việc / Workflow Preferences**
   - Có yêu cầu đặc biệt nào về cách làm việc không? (Any special workflow requirements? e.g., persona, tone, level of detail, specific standards, Who am I, who are you, and what do you want me to call you?,etc.)

### Bước 2: Lưu trữ Ngữ cảnh / Step 2: Context Storage

Thông tin phản hồi sẽ được lưu trữ vào `documentation/MEMORIES.md` hoặc `documentation/CONTEXT.md` để phục vụ các phiên làm việc sau.
(Feedback will be stored in `documentation/MEMORIES.md` or `documentation/CONTEXT.md` for future sessions.)

---

## 🧪 2. SKILL INTEGRATION / TÍCH HỢP KỸ NĂNG

Dựa trên ngữ cảnh đã xác định, AI sẽ:
(Based on the defined context, the AI will:)

1. **Quét yêu cầu / Scan Requirements**: Xác định các kỹ năng cần thiết (Web, Security, DevOps, v.v.). (Identify required skills.)
2. **Kích hoạt bộ Kit / Activate Kits**: Mặc định sử dụng các bộ Kit trong `SYSTEM_DESIGN.md`. (Default to kits in `SYSTEM_DESIGN.md`.)
3. **Tham chiếu thư viện / Reference Libraries**: Truy cập và tải kỹ năng từ [Microsoft Skills](https://github.com/microsoft/skills) nếu cần. (Access and load skills from external libraries if necessary.)

---

## 🏗️ 3. EXECUTION FLOW / LUỒNG THỰC THI (PDCA)

Sau khi có đủ ngữ cảnh và kỹ năng, AI thực hiện theo quy trình:
(With sufficient context and skills, the AI follows this process:)

1. **Kiểm tra trạng thái / Check Status**: Đọc `MAP.md` và `MEMORIES.md`. (Read `MAP.md` and `MEMORIES.md`.)
2. **Lập kế hoạch / Planning**: Viết `task.md` và `implementation_plan.md`. (Write `task.md` and `implementation_plan.md`.)
3. **Thực thi / Doing**: Viết code và xác minh kết quả. (Write code and verify results.)
4. **Báo cáo / Closing**: Tạo `walkthrough.md` và cập nhật nhật ký học tập. (Create `walkthrough.md` and update learning logs.)

---

## ⚠️ 4. LIMITS & SAFEGUARDS / GIỚI HẠN & BẢO VỆ

- **Fail-Safe**: Nếu một tác vụ thất bại (FAIL) quá 3 lần, AI phải dừng lại và báo cáo. (If a task fails >3 times, stop and report.)
- **Resource Management**: Một tác vụ không chạy quá 10 phút trừ khi được xác nhận. (Tasks should not run >10 mins without confirmation.)
- **Consent Policy**: Phải hỏi trước khi: Xóa file, Kết nối mạng, hoặc Thay đổi phá vỡ kiến trúc. (Ask before: Deleting files, Connecting to network, or Breaking architectural changes.)

---

> **"Efficiency is doing things right; effectiveness is doing the right things."**
