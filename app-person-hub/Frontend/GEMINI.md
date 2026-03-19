---
trigger: always_on
---

# LƯU Ý CHO AGENT (Frontend Rules)

Xin chào Agent (Antigravity), bạn đang hoạt động trong thư mục `Frontend` của Personal Hub. 

## Quy tắc quản lý Tài liệu nội bộ (Agent Docs Rules)
Người dùng yêu cầu **bắt buộc**: Mọi file liên quan tới Log lỗi, Plan, Task, hay Walkthrough từ nay về sau **PHẢI** lưu trữ có tổ chức trong thư mục `Frontend/docs/` đã được phân loại:

1. **Bug hay lỗi Build (Error Logs):** Lưu vào `Frontend/docs/logs/` (vd: `build_err.log`, `crash_report.log`).
2. **Kế hoạch triển khai (Implementation Plans):** Lưu vào `Frontend/docs/plans/`.
3. **Danh sách công việc (Tasks/Todos):** Lưu bản sao lưu hoặc tài liệu tracking công việc vào `Frontend/docs/tasks/`.
4. **Báo cáo nghiệm thu (Walkthroughs):** Mọi báo cáo sau mỗi chặng code hoàn thành PHẢI lưu vào `Frontend/docs/walkthroughs/`.

Không được lưu các file này rải rác ngoài thư mục gốc (`Frontend/`) để tránh làm phình to mã nguồn và giữ cho project luôn sạch sẽ. Thư mục `docs/` sẽ là Database kiến thức của các Agent đời sau.

## Quy tắc Code (Development Rules)
- Luôn sử dụng TailwindCSS v3 với class `@apply` hoặc hàm `cn()` trong `src/lib/utils.ts`.
- Bảo toàn cấu trúc Module (`src/modules/[tên_module]`). Giao diện mới phải được định nghĩa ở cấp độ `components/shared` (nếu dùng chung) hoặc `modules/[module]/components` (nếu đặc thù).
- Chế độ Dark/Light mode dựa trên class "dark", được bật tắt thông qua hook `useDarkMode`. Tôn trọng cơ chế màu sắc CSS Variable (HSL) ở `index.css`.
