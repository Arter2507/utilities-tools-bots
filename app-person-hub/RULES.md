# 📜 PROJECT RULES & CONVENTIONS (MyProj)

> **MANDATORY FOR ALL AGENTS:** Tất cả các Agent làm việc trên dự án này PHẢI tuân thủ nghiêm ngặt các quy tắc dưới đây để đảm bảo tính nhất quán, bảo mật và hiệu quả token.

---

## 🤖 1. Identity & Communication
- **Tên Agent:** Antigravity.
- **Ngôn ngữ Giao tiếp:** Sử dụng **TIẾNG VIỆT** cho mọi cuộc hội thoại, giải thích và báo cáo.
- **Ngôn ngữ Tài liệu:** Mọi file `.md` (Task, Plan, Walkthrough, Log) phải viết bằng **TIẾNG VIỆT**.
- **Ngôn ngữ Mã nguồn:** 
  - Tên biến, hàm, lớp, file: **TIẾNG ANH** (camelCase, snake_case).
  - Comment trong mã nguồn: **TIẾNG ANH**.

---

## 📂 2. File Organization & Lifecycle
- **Trung tâm Tài liệu:** Tuyệt đối KHÔNG tạo file log, plan, task bừa bãi tại Root.
- **Vị trí bắt buộc:** Mọi artifact phát sinh trong quá trình phát triển Frontend PHẢI được lưu vào:
  - `Frontend/docs/plans/`: Kế hoạch triển khai (`implementation_plan.md`).
  - `Frontend/docs/tasks/`: Danh sách công việc (`todo.md`) và bài học kinh nghiệm (`lessons.md`).
  - `Frontend/docs/logs/`: Log lỗi build, log debug.
  - `Frontend/docs/walkthroughs/`: Báo cáo kết quả sau khi hoàn thành.
- **Cập nhật MAP:** Sau mỗi tính năng lớn, hãy cập nhật `MAP.md` tại Root để Agent kế sau nắm bắt trạng thái mới nhanh nhất.

---

## 🏗️ 3. Workflow Orchestration
- **Plan Mode First:** Luôn vào chế độ Planning cho bất kỳ nhiệm vụ nào không hiển nhiên (trên 3 bước hoặc có quyết định kiến trúc). Viết spec chi tiết trước khi code.
- **Re-plan Immediately:** Nếu có vấn đề phát sinh bất ngờ, hãy DỪNG LẠI và lập kế hoạch lại ngay lập tức - đừng cố đẩy tiếp.
- **Subagent Strategy:** Sử dụng Subagents linh hoạt để giữ context window chính sạch sẽ. Một nhiệm vụ cụ thể cho một Subagent.
- **Verification Before Done:** Không bao giờ đánh dấu hoàn thành nếu chưa chứng minh được nó hoạt động. Chạy test, kiểm tra log, và so sánh hành vi.
- **Demand Elegance:** Đối với các thay đổi lớn, hãy tự hỏi "có cách nào thanh lịch hơn không?". Tránh các bản vá tạm thời (hacky fix).
- **Autonomous Bug Fixing:** Khi nhận báo cáo lỗi, hãy chủ động sửa dựa trên log/error mà không cần cầm tay chỉ việc. Sau khi sửa, PHẢI ghi nhận vào `ERRORS.md` tại Root.
- **Error Transparency:** Mọi lỗi nghiêm trọng (Build/Runtime) đều PHẢI được ghi vào `ERRORS.md` để Agent sau có thể tránh hoặc biết cách xử lý nhanh.
- **Security First:** Mọi input từ người dùng phải được sanitize; URL phải được whitelist `http/https`. Không dùng `dangerouslySetInnerHTML`.
- **Performance Hygiene:** Tách module bằng lazy import khi module lớn; dùng selector hook/context nhỏ để giảm re-render.
- **Workflow Update:** Khi thay đổi quy trình làm việc, PHẢI cập nhật `RULES.md` + `MAP.md` trước khi tiếp tục.

---

## 📝 4. Task Management (Protocol)
1. **Plan First:** Viết kế hoạch vào `Frontend/docs/tasks/todo.md` với các mục có thể tích chọn.
2. **Verify Plan:** Xác nhận với người dùng trước khi bắt đầu thực thi.
3. **Track Progress:** Đánh dấu hoàn thành các mục khi tiến hành.
4. **Explain Changes:** Tóm tắt ở mức cao tại mỗi bước thực hiện.
5. **Document Results:** Thêm phần Review vào `todo.md` sau khi xong.
6. **Capture Lessons:** 
   - Lỗi kỹ thuật/lặp lại: Ghi vào `ERRORS.md` (Root) bằng lệnh `/log-error`.
   - Quy trình/Kinh nghiệm: Ghi vào `Frontend/docs/tasks/lessons.md`.
   - Cảnh báo bảo mật: Ghi vào `SECURITY.md` (nếu có).

---

## 💻 5. Technical Standards
- **Stack:** React + TypeScript + Vite.
- **Styling:** Tailwind CSS v3.4 (Ưu tiên class utilities).
- **Theme:** Hỗ trợ Dark/Light mode (sử dụng class `.dark`).
- **Icons:** Sử dụng `lucide-react`.
- **Architecture:** Thiết kế dạng **Module** (`src/modules/[module-name]`). Tách nhỏ components.
- **Layout:** Tuân thủ `MainLayout` với Sidebar (có thể thu gọn) và Topbar.
- **State Management:** Tách store thành các context nhỏ (`src/store/*`) và bọc bằng `StoreProvider`.
- **Security Headers:** Thêm CSP header ở config deploy (`Frontend/public/_headers`) và meta CSP ở `Frontend/index.html`.
- **Testing:** Unit tests tối thiểu cho sanitizer và schema validation (`vitest`).

---

## 🌟 6. Core Principles
- **Simplicity First:** Làm mọi thay đổi đơn giản nhất có thể. Tác động tối thiểu đến mã nguồn không liên quan.
- **No Laziness:** Tìm nguyên nhân gốc rễ. Không sửa tạm. Tiêu chuẩn Senior Developer.
- **Context Discovery:** Luôn chạy `/map` hoặc đọc `MAP.md` + `RULES.md` khi bắt đầu session mới.
- **Git Hygiene:** Không commit/push `node_modules`, `.env`, `.[folder]`, hoặc file chứa thông tin nhạy cảm.

---
*Failure to follow these rules will result in context rot and project degradation.*
