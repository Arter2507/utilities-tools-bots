# 🌿 GIT WORKFLOW & COLLABORATION / QUY TRÌNH GIT & CỘNG TÁC

Quy trình làm việc với Git, cách đặt tên nhánh và định dạng Commit message.
(Workflows for Git, branching strategies, and commit message formats.)

---

## 🌿 1. BRANCHING STRATEGY / CHIẾN LƯỢC NHÁNH

- `main`: Nhánh chính, mã nguồn ổn định (Production-ready).
- `dev`: Nhánh tích hợp tính năng mới. (New feature integration branch).
- `feature/[name]`: Phát triển tính năng mới. (New feature development).
- `bugfix/[name]`: Sửa lỗi. (Bug fixing).
- `hotfix/[name]`: Sửa lỗi khẩn cấp trực tiếp cho Production (Fixes urgent bugs directly for Production.).

---

## 💬 2. COMMIT MESSAGE FORMAT / ĐỊNH DẠNG COMMIT

Sử dụng tiêu chuẩn **Conventional Commits**: `<type>(<scope>): <description>`

- **feat**: Tính năng mới (New feature).
- **fix**: Sửa lỗi (Bug fix).
- **docs**: Thay đổi tài liệu (Documentation changes).
- **refactor**: Tái cấu trúc (Code refactoring).
- **perf**: Cải thiện hiệu năng (Performance improvements).
- **test**: Thêm hoặc sửa các đoạn mã kiểm thử (Add or modify test code).
- **chore**: Các thay đổi về build process hoặc công cụ phụ trợ (Changes to build process or auxiliary tools).

---

## 🚀 3. PULL REQUEST (PR) PROTOCOL / GIAO THỨC PULL REQUEST

Mọi PR phải đảm bảo: (Every PR must ensure:)

1. **Planning Reference**: Có liên kết đến `implementation_plan.md`. (Link to the implementation plan.)
2. **Lint & Build**: Vượt qua kiểm tra cú pháp và build. (Pass lint and build checks.)
3. **Walkthrough**: Có file `walkthrough.md`. (Include a `walkthrough.md`.)
4. **Test Evidence**: Có bằng chứng (Logs/Screenshots) chứng minh tính năng hoạt động. (Test evidence (Logs/Screenshots) proving functionality.)
5. **Review**: Ít nhất một AI Orchestrator hoặc Người dùng phê duyệt. (At least one AI Orchestrator or User approval.)

---

## 🧹 4. REPO HYGIENE

- **Small Commits**: Ưu tiên các commit nhỏ, tập trung vào một thay đổi duy nhất. (Prefer small, focused commits.)
- **No Secrets**: Tuyệt đối không commit file `.env` hoặc thông tin nhạy cảm. (Strictly prohibit committing `.env` files or sensitive information.)
- **Git Ignore**: Luôn cập nhật `.gitignore` để loại bỏ các tàn dư của IDE/OS. (Always update `.gitignore` to remove IDE/OS artifacts.)

---

> **"Clean Git history is as important as clean code."**
