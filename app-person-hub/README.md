<div align="center">
  <img src="antigravity-ide-logo.svg" alt="AntiGravity IDE Logo" width="120">

  # AntiGravity IDE
  ### Activate Senior Engineer Mindset for AI

  [English](./README.md) | [Tiếng Việt](./README.vi.md)

  > **Biến AI Agent từ một Thực tập viên thành Kỹ sư trưởng.**
  > 
  > Đây không phải là trình soạn thảo code — Đây là **Hệ điều hành Tư duy** giúp nạp tiêu chuẩn chuyên nghiệp (PDCA, Security, Architecture) trực tiếp vào não bộ AI.

<a href="https://badge.fury.io/js/antigravity-ide"><img src="https://img.shields.io/npm/v/antigravity-ide?color=red" alt="npm version"></a> <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-orange" alt="License: MIT"></a> <a href="https://npmjs.com/package/antigravity-ide"><img src="https://img.shields.io/npm/dm/antigravity-ide?color=yellow" alt="Downloads"></a> <a href="https://github.com/Dokhacgiakhoa/google-antigravity/stargazers"><img src="https://img.shields.io/github/stars/Dokhacgiakhoa/google-antigravity?color=green" alt="GitHub stars"></a> <a href="https://github.com/Dokhacgiakhoa/google-antigravity/graphs/contributors"><img src="https://img.shields.io/github/contributors/Dokhacgiakhoa/google-antigravity?color=blue" alt="Contributors"></a> <a href="https://github.com/Dokhacgiakhoa/google-antigravity/commits/main"><img src="https://img.shields.io/github/last-commit/Dokhacgiakhoa/google-antigravity?color=blueviolet" alt="Last Commit"></a> <a href="https://github.com/Dokhacgiakhoa/google-antigravity"><img src="https://img.shields.io/github/languages/code-size/Dokhacgiakhoa/google-antigravity?color=ff69b4" alt="Code Size"></a>

| **573** Skills | **38** Specialist Agents | **33** Patterns | **25** Rules | **20** Shared Libs |
| :---: | :---: | :---: | :---: | :---: |
| Enterprise Standard | Role-Based Personas | PDCA Cycle | Security Armor | Shared Knowledge |

</div>

---

## 🗺️ Project Navigation (Context Discovery)
> [!TIP]
> **Dành cho AI Agent:** Đọc **[MAP.md](./MAP.md)** hoặc gõ lệnh `/map` để nắm bắt kiến trúc và hiện trạng dự án MyProj một cách nhanh chóng và tiết kiệm token nhất.

---

# 🛸 Personal Hub (MyProj)

Một hệ sinh thái ứng dụng Web cá nhân tập trung (All-in-one Dashboard), được thiết kế để tối ưu hóa năng suất và quản lý dữ liệu cá nhân một cách bảo mật tại chỗ (local-first).

### ✨ Tính năng cốt lõi:
- **📊 Finance Budget**: Quản lý thu chi thông minh với biểu đồ trực quan (Recharts).
- **🩹 Health Tracker**: Theo dõi chu kỳ, cân nặng và tâm trạng hàng ngày.
- **📋 Project Board**: Quản lý công việc dạng Trello với tính năng kéo thả (dnd-kit).
- **📅 Smart Calendar**: Lịch cá nhân tích hợp âm lịch và thông báo deadline tự động.
- **🗺️ Journey Timeline**: Lưu giữ nhật ký hành trình với hình ảnh và ghi chú nhanh.
- **💖 Love Tracker**: Bộ đếm ngày kỷ niệm cùng giao diện Pastel lãng mạn.

### 🛠️ Công nghệ sử dụng:
- **Core**: React 18, TypeScript, Vite.
- **Styling**: Tailwind CSS (Dark/Light Mode).
- **State Management**: Zustand / Context API + Selector Hooks (Tối ưu re-render).
- **Security**: Zod Validation, XSS Sanitizer, Error Boundary.
- **Performance**: Code Splitting, List Virtualization (react-window).

### 🎯 Mục tiêu dự án:
Cung cấp một giải pháp quản lý cá nhân mượt mà, bảo mật và có thể mở rộng dễ dàng nhờ kiến trúc dạng Module.

---

## 🚀 1. Quick Start (Scaffolding)

Sử dụng CLI để thiết lập môi trường tác chiến trong 30 giây:

```sh
# 1. New Project (Khuyên dùng - Luôn tải bản mới nhất)
npx antigravity-ide@latest project_name

# 2. Install trực tiếp vào thư mục hiệnại
npx antigravity-ide@latest
```

> [!WARNING]
> **Lưu ý quan trọng:** Không nên cài đặt Global (`npm install -g antigravity-ide`) vì sẽ gây xung đột phiên bản. Luôn dùng `npx ...@latest` để đảm bảo Project được khởi tạo với Engine mới nhất.

### ✨ Setup Wizard (v4.2.1)
Trải nghiệm Premium CLI với 3 cấp độ tài nguyên Resource:

1.  **🌿 ECO (Basic - 96 Skills)**:
    - **Mục tiêu**: Gemini 1.5 Flash / Free Tier.
    - **Capabilities**: Core Skills (Scaffolding, Patterns, Debugging).
    - **Hiệu năng**: Nhẹ, siêu tốc, tiết kiệm token tối đa.

2.  **🏢 PRO (Professional - 216 Skills)**:
    - **Mục tiêu**: Gemini 1.5 Pro / Paid Account.
    - **Capabilities**: Bổ sung DevOps, Security Audit, Cloud Architecture, TDD.
    - **Hiệu năng**: Cân bằng hoàn hảo giữa sức mạnh và ngữ cảnh. Enterprise Standard.

3.  **🌌 ULTRA (Enterprise - 573 Skills)**:
    - **Mục tiêu**: Gemini 1.5 Ultra / Large Context Model (2M+ tokens).
    - **Capabilities**: Full Fractal Knowledge. Bao gồm Vertical Skills (Fintech, Edtech), Deep Research và Multi-Agent Orchestration.
    - **Hiệu năng**: Sức mạnh không giới hạn.

---

## 2. Documentation System (Offline Docs)
Bộ tài liệu chi tiết được cài sẵn trong thư mục `docs/`. Bạn có thể tra cứu Offline bất cứ lúc nào.

### 📘 Core Guides
- **[Quick Install Guide](./docs/INSTALL_NPX_GUIDE.vi.md)**:
  *Các bước cài đặt nhanh và troubleshooting cho người mới.*
- **[Master Guide](./docs/MASTER_GUIDE.vi.md)**:
  *Triết lý thiết kế, các concept cốt lõi và kiến trúc hệ thống Antigravity.*
- **[Operational Flow](./docs/OPERATIONAL_FLOW.vi.md)**:
  *Standard PDCA Operational Workflow (Plan-Do-Check-Act) với AI.*

### 📙 Reference Manuals
- **[Skills Catalog](./docs/SKILLS_GUIDE.vi.md)**:
  *Danh sách chi tiết 573 Skills, triggers và ví dụ.*
- **[Agent Roster](./docs/AGENTS_GUIDE.vi.md)**:
  *Profile năng lực của 42 Specialist Agents (Frontend, Backend, Security...).*
- **[Workflow Library](./docs/WORKFLOW_GUIDE.vi.md)**:
  *Thư viện 21 Standard Workflows (ví dụ: /plan, /create, /deploy).*
- **[Rules & Protocols](./docs/RULES_GUIDE.vi.md)**:
  *Rules, Security Standards và Coding Protocols.*

### 🛠️ Support
- **[Glossary](./docs/GLOSSARY.vi.md)**: *Định nghĩa thuật ngữ (Fractal, PDCA, MCP).*
- **[Troubleshooting](./docs/TROUBLESHOOTING.vi.md)**: *Các lỗi phổ biến và giải pháp xử lý.*


    > **"wake up [agent-name]"**
    
    *(Ví dụ: "wake up Jarvis")*

AI sẽ tự động đọc file cấu hình `.agent/GEMINI.md` và tải toàn bộ Skills vào bộ nhớ đệm.

---

## 🧠 2. The Heart of System: Thư mục `.agent`

Thư mục `.agent` chứa toàn bộ "Brain" của hệ thống:

- **Specialist Agent Personas**: Planner, Backend/Frontend Specialists, Security Auditor và Orchestrator.
- **PDCA Workflow (Plan-Do-Check-Act)**: AI không code tùy tiện. Nó phải Plan -> Execute -> Check -> Approve.
- **Shared Knowledge (`.shared/`)**: Chứa Project DNA như API Standards, DB Schema, Compliance Docs và các Domain Blueprints (Fintech, Edtech...).

---

## ⚡ 3. Slash Commands (`/`) & Updates

Kích hoạt các Workflows chuyên sâu ngay trong chat:

- `/plan`: Project Planner & Phân rã Task.
- `/create`: Xây dựng cấu trúc Project Foundation.
- `/ui-ux-pro-max`: Thiết kế Premium UI/UX & Micro-interactions.
- `/orchestrate`: Orchestrate Multi-Agent giải quyết bài toán phức tạp.
- `/log-error`: Tự động log error kèm phân tích nguyên nhân và giải pháp.
- `/research`: (Mới) Kích hoạt **FastCode Search** tra cứu mã nguồn siêu tốc (Native Node.js).
- `/design-2026`: (New) Áp dụng **Frontend Trends 2026** (Liquid Glass, Bento Grid...).

### System Update
Để cập nhật Antigravity Brain lên bản mới nhất mà không mất các cấu hình custom:
```sh
npx antigravity-ide update
```

---

## 📊 Resource Matrix (Chỉ số tài nguyên)

<div align="center">

| Chế độ (Mode) | Skills | Agents | Workflows | Rules | Shared Modules |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **🌿 ECO** | 151 | 5 | 6 | 2 | 3 |
| **🏢 PRO** | 296 | 10 | 11 | 5 | 10 |
| **🌌 ULTRA** | 573 | 38 | 33 | 25 | 20 |

</div>

## 📂 Project Structure

```text
project-name/
├── .agent/           # 🧠 THE BRAIN: Agent DNA, Skills & Rules
│   ├── .shared/      # ⛩️ Master Knowledge (API, DB, Design)
│   ├── agents/       # 🎭 Specialist Agent Personas
│   └── skills/       # 🛠️ 550+ Combat Tools
├── src/              # 🏗️ YOUR APPLICATION SOURCE CODE 
├── docs/             # 📘 Offline Documentation
├── GEMINI.md         # ⚙️ Agent Configuration (Root Context)
├── ERRORS.md         # 🐛 Auto-generated Error Log
└── README.md         # 📖 Project Guide
```

---

## ️ Philosophy "Vietnamese Shell - English Core"

- **Giao tiếp**: Tiếng Việt (Trực quan, súc tích).
- **Kỹ thuật**: Tiếng Anh (Biến, hàm, logic - Đảm bảo hiệu suất AI cao nhất).

---

**Antigravity IDE** - Phá bỏ mọi giới hạn, đưa dự án của bạn lên tầm cao mới. 🛰️🚀
