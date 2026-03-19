# 📜 MANDATORY AI PROTOCOLS / Giao thức AI Bắt buộc

## 🌐 Language / Ngôn ngữ
- `VI`: Nội dung vận hành gốc. (Original operational content).
- `EN`: English equivalent interpretation is mandatory for all protocol decisions. (Bản dịch tiếng Anh tương đương là bắt buộc cho mọi quyết định giao thức).
- Trigger language mode: after `Hey, AI`, AI responds in the user's primary language (`choose language` when unclear). (Sau khi gọi `Hey, AI`, AI phản hồi bằng ngôn ngữ chính của người dùng hoặc yêu cầu chọn nếu không rõ).

Tài liệu này định nghĩa các quy tắc vận hành bất biến mà mọi AI Agent PHẢI tuân thủ tuyệt đối khi làm việc trong hệ thống này. Xem chi tiết quy trình cụ thể tại [WORKFLOWS.md](WORKFLOWS.md).
(This document defines the immutable operational rules that every AI Agent MUST strictly follow when working in this system. See [WORKFLOWS.md](WORKFLOWS.md) for specific processes.)

---

## 🌐 1. LANGUAGE & COMMUNICATION / NGÔN NGỮ & GIAO TIẾP

Để đảm bảo tính nhất quán và hiệu quả, AI phải tuân thủ quy tắc ngôn ngữ sau:
(To ensure consistency and efficiency, AI must follow these language rules:)

- **Giao tiếp & Giải thích**: Sử dụng **ngôn ngữ chính của người dùng** cho mọi cuộc hội thoại, báo cáo và giải thích. (Communication & Explanation: Use the **user's primary language** for all conversations, reports, and explanations.)
- **Tài liệu dự án**: Các file tài liệu (`.md`) phát sinh nên tuân theo ngôn ngữ ưu tiên của người dùng hoặc ngôn ngữ chính của dự án. (Project Documentation: Generated `.md` files should follow the user's preferred language or the project's primary language.)
- **Kỹ thuật & Mã nguồn**: (Technical & Source Code:)
  - Tên biến, hàm, lớp, file: **TIẾNG ANH** (camelCase hoặc snake_case). (Names for variables, functions, classes, files: **ENGLISH**).
  - Chú thích (Comments) trong mã nguồn: **TIẾNG ANH**. (Source code comments: **ENGLISH**).

---

## 🔄 2. PDCA CYCLE / CHU TRÌNH PDCA (Vòng đời Quản trị)

Mọi tác vụ lớn (Tính năng/Tái cấu trúc/Sửa lỗi) phải tuân thủ nghiêm ngặt chu trình 4 bước:
(All major tasks (Feature/Refactor/Fix) must strictly follow the 4-step cycle:)

1. **PLAN (Lập kế hoạch)**: Phân tích yêu cầu, liệt kê file bị ảnh hưởng và đề xuất giải pháp kỹ thuật rõ ràng. Luôn lập kế hoạch trước khi thực hiện các tác vụ phức tạp. (Analyze requirements, list affected files, and propose clear technical solutions. Always plan before complex tasks.)
2. **DO (Thực thi)**: Thực hiện công việc sau khi kế hoạch được phê duyệt. Tuân thủ tiêu chuẩn mã nguồn sạch (Clean Code). (Execute work after plan approval. Adhere to Clean Code standards.)
3. **CHECK (Kiểm tra)**: Chạy kiểm thử, kiểm tra lỗi cú pháp (Lint) và xác minh kết quả. **Bằng chứng trước khẳng định**. (Run tests, linting, and verify results. **Proof before assertion**.)
4. **ACT (Tối ưu)**: Khắc phục lỗi phát sinh, cập nhật tài liệu và đóng phiên làm việc. Nếu gặp vấn đề bất ngờ, hãy DỪNG LẠI và lập lại kế hoạch (Re-plan). (Fix errors, update docs, and close session. If unexpected issues arise, STOP and re-plan.)

---

## 📂 3. ORGANIZATION & LIFECYCLE / TỔ CHỨC & VÒNG ĐỜI

- **Vị trí Artifacts**: Tuyệt đối không để các file tạm, log, hoặc plan bừa bãi tại thư mục gốc. Sử dụng đúng các thư mục chức năng trong [MAP.md](MAP.md). (Artifact Location: Never leave temporary files, logs, or plans in the root. Use functional directories defined in [MAP.md](MAP.md).)
- **Technical Excellence**: AI PHẢI tuân thủ các tiêu chuẩn kỹ thuật cụ thể tại: (Technical Excellence: AI MUST follow technical standards in:)
  - [CODE_STANDARDS.md](CODE_STANDARDS.md) (Mã nguồn / Source Code).
  - [GIT_WORKFLOW.md](GIT_WORKFLOW.md) (Phiên bản / Versioning).
  - [TESTING_POLICY.md](TESTING_POLICY.md) (Chống lỗi / Zero-Bug).
- **Context Hygiene**: Luôn đọc `MAP.md` và `IDENTITY_SOUL.md` khi bắt đầu một phiên làm việc mới. (Context Hygiene: Always read `MAP.md` and `IDENTITY_SOUL.md` at the start of a new session.)

---

## 🛑 4. SOCRATIC GATE / CỔNG KIỂM SOÁT SOCRATIC

**Luật Bất Biến**: Không bao giờ thực hiện công việc ngay khi nhận yêu cầu mơ hồ hoặc có rủi ro cao. AI phải chủ động:
(Immutable Law: Never perform work immediately upon receiving vague or high-risk requests. AI must proactively:)

- Làm rõ cấu trúc Dữ liệu đầu vào/đầu ra. -> Nếu chưa rõ: **HỎI**. (Clarify Input/Output data structures. -> If unclear: **ASK**.)
- Đánh giá rủi ro ảnh hưởng đến hệ thống hiện tại. -> Nếu có rủi ro: **CẢNH BÁO**. (Assess risks to the existing system. -> If risky: **WARN**.)
- **No Laziness**: Tìm kiếm nguyên nhân gốc rễ (Root Cause) thay vì chỉ sửa chữa bề nổi. (Find Root Cause instead of surface fixes.)
- Dừng lại nếu thất bại quá 3 lần. Giới hạn 10 phút/tác vụ trừ khi được xác nhận. (Stop if failed >3 times. Limit 10 mins/task unless confirmed.)
- Luôn hỏi trước khi hành động, xóa file, hoặc kết nối mạng. (Always ask before acting, deleting files, or network connections.)

---

## 🛡️ 5. SECURITY & PRIVACY / AN TOÀN & RIÊNG TƯ

- **Zero Secrets**: Cấm tuyệt đối lưu trữ API Keys, mật khẩu vào Git. (Zero Secrets: Never store API Keys or passwords in Git.)
- **Scope Integrity**: Chỉ thao tác trong phạm vi thư mục được cấp quyền. (Scope Integrity: Operate only within authorized directories.)
- **Sanitization**: Kiểm tra kỹ các đầu vào (Input) và sử dụng Whitelist cho kết nối mạng. (Sanitization: Validate inputs and use whitelists for network connections.)

---

## 🧹 6. TECHNICAL STANDARDS / TIÊU CHUẨN KỸ THUẬT

- **Simplicity First**: Luêu tiên giải pháp đơn giản và thanh lịch nhất. (Prioritize the simplest and most elegant solution.)
- **Autonomous Fixing**: Chủ động phát hiện và sửa lỗi dựa trên log. (Proactively detect and fix errors based on logs.)
- **Documentation Sync**: Mọi thay đổi kiến trúc phải cập nhật vào `MAP.md`. (Sync architectural changes with `MAP.md`.)
- **Model Selection by Task**: AI tự chọn model phù hợp (flash cho planning/rà soát, pro cho coding/debug sâu). (Auto-select models: flash for planning/review, pro for coding/deep debug.)

---

> **"A protocol is only as strong as its enforcement."**
