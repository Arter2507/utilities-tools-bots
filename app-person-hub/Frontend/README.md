# Personal Hub - Frontend Application

Dự án **Personal Hub** là một ứng dụng quản lý cá nhân toàn diện, được xây dựng theo kiến trúc hiện đại, hỗ trợ chuẩn UI/UX từ bộ guideline của hệ thống Antigravity (`ui-ux-pro-max`).

## 🚀 Công nghệ sử dụng (Tech Stack)
- **Framework:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS v3.4 (kèm hỗ trợ Dark Mode class strategy)
- **Icons:** Lucide-React
- **Routing:** React Router v6

## 📂 Kiến trúc Dự án (Architecture)

Dự án tuân theo kiến trúc Modular nghiêm ngặt (Feature-based folder structure):
```
Frontend/
├── docs/                      # 📚 Tài liệu, log, kế hoạch do Agent sinh ra
│   ├── logs/                  # Chứa các file build_err.log hoặc debug thông tin
│   ├── plans/                 # Kế hoạch triển khai (implementation_plan.md)
│   ├── tasks/                 # Danh sách nhiệm vụ cụ thể (task.md)
│   └── walkthroughs/          # Báo cáo đầu ra của các sprint
├── src/
│   ├── components/shared/     # Các component dùng chung (Sidebar, Topbar, v.v.)
│   ├── hooks/                 # Reusable React Hooks (useDarkMode, v.v.)
│   ├── layouts/               # Component bọc ngoài cùng (MainLayout)
│   ├── modules/               # Nơi chứa logic rời rạc từng module
│   │   └── dashboard/         # Module Dashboard (Widgets, Mock Data, Config)
│   ├── lib/                   # Thư viện tiện ích core (utils.ts kết hợp twMerge+clsx)
│   └── App.tsx                # App Root file
└── ...
```

## ⚙️ Các Module Hiện Có (Widgets)
- **Finance Widget**: Quản lý tổng thu chi, số dư và lịch sử giao dịch.
- **Health Widget**: Theo dõi chỉ số Calories, Step walk, Sleep và Water hydration.
- **Trello (Tasks)**: Tick-box nhanh gọn để theo dõi công việc trong ngày.
- **Calendar & Journey**: Quản lý sự kiện sắp tới và lộ trình du lịch.
- **Love Tracker**: Cập nhật kỷ niệm và trạng thái mối quan hệ bằng phong cách Tối giản.

## 🛠 Hướng dẫn Khởi chạy (Getting Started)

Cài đặt NPM modules:
```bash
npm install
```

Chạy Development server:
```bash
npm run dev
```

Biên dịch cho Production:
```bash
npm run build
```

---
*Dự án được khởi tạo & quản lý bởi Agent Antigravity.*
