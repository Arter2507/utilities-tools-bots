# 🗺️ Project Map & Context Entrypoint (MyProj)

> **Dành cho Agent (Antigravity/Gemini):** Đọc file này trước tiên để hiểu cấu trúc và trạng thái dự án mà không cần liệt kê toàn bộ thư mục, giúp tiết kiệm quota.

## 🚀 1. Tech Stack & Rules
- **Core Rules:** Xem **[RULES.md](./RULES.md)** (Bắt buộc tuân thủ).
- **Frontend:** React + TypeScript + Vite (`Frontend/`)
- **UI Kit:** UI/UX Pro Max (`.agent/skills/ui-ux-pro-max`)
- **Styling:** Tailwind CSS v3.4 (Dark/Light mode via `.dark` class)
- **Icons:** Lucide-React
- **Architecture:** Modular Features (`src/modules/[name]`)

## 📂 2. Directory "Cheat Sheet"
- `RULES.md`: Quy tắc và luật lệ dự án (Read this first!).
- `ERRORS.md`: Nhật ký lỗi và cách khắc phục (Check for recurring issues).
- `WORKFLOW.md`: Quy trình làm việc chi tiết.
- `Frontend/src/components/shared`: Sidebar, Topbar, Reusable UI.

- `Frontend/src/layouts`: `MainLayout` (Grid/Flex layout chính).
- `Frontend/src/modules/dashboard`: Dashboard widgets logic & mock data.
- `Frontend/src/modules/calendar`: CalendarManager + lunar + CRUD.
- `Frontend/src/modules/project-board`: Trello Clone (ProjectBoard).
- `Frontend/src/modules/finance`: FinanceBudget (charts + transactions).
- `Frontend/src/modules/health`: HealthTracker (cycle calendar + wellness charts).
- `Frontend/src/modules/journey`: Journey timeline (rich text + image mock).
- `Frontend/src/modules/love`: LoveTracker (big counter + anniversaries).
- `Frontend/src/store/provider.tsx`: StoreProvider gộp các context nhỏ.
- `Frontend/src/store/*`: Store tách nhỏ (calendar, tasks, finance, health, journey, love, notifications).
- `Frontend/src/store/AppDataContext.tsx`: Legacy store (không còn dùng).
- `Frontend/src/components/shared/BaseModal.tsx`: Base modal dùng chung.
- `Frontend/src/lib/sanitize.ts`: Sanitize text/URL để giảm XSS cơ bản.
- `Frontend/public/_headers`: CSP header cho deploy.
- `Frontend/docs/`: **[QUAN TRỌNG]** Chứa lịch sử thực thi (Plans, Tasks, Logs, Walkthroughs).
  - Đọc `Frontend/docs/walkthroughs/` để biết tính năng nào đã xong.
  - Đọc `Frontend/docs/plans/` để biết thiết kế hệ thống.
  - Đọc `Frontend/docs/tasks/todo.md` để xem danh sách việc cần làm.


## ⚙️ 3. Thao tác vận hành
- **Build Server:** `cd Frontend && npm run dev`
- **Build Build:** `cd Frontend && npm run build`
- **Test:** `cd Frontend && npm run test` (unit tests)
- **Giao thức Doc:** Mọi log/plan/task mới phải đẩy vào `Frontend/docs/[folder]/`.

## 📜 4. Status hiện tại (Snapshot)
- Đã hoàn thành bộ khung Dashboard với 6 Widgets (Finance, Health, Trello, Calendar, Journey, Love Tracker).
- Đã cấu hình Dark Mode chuẩn và Sidebar Responsive.
- Đã hoàn thành CalendarManager + ProjectBoard (Trello Clone) với đồng bộ dữ liệu và quick access.
- Đã hoàn thành FinanceBudget + HealthTracker (charts + quick add) và cải tiến Calendar UX.
- Đã hoàn thành Journey + LoveTracker, đồng bộ thông báo chung.
- Đã tối ưu re-render bằng selector hook + virtualize Journey + ErrorBoundary.
- Đã tách store thành các context nhỏ + StoreProvider, thêm unit tests cho sanitizer/zod.
- Đã thêm CSP header cho deploy.
- Đã tích hợp hệ thống quản lý lỗi tập trung (`ERRORS.md` + `/log-error`).
- Project đã sẵn sàng để tích hợp API thật.

---
*Lưu ý: Luôn tuân thủ `Frontend/GEMINI.md` khi làm việc trong thư mục mã nguồn.*
