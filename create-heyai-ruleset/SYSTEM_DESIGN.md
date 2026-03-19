# 🏗️ SYSTEM DESIGN & AESTHETICS / KIẾN TRÚC & THẨM MỸ

## 🌐 Language / Ngôn ngữ
- `VI`: Nội dung chuẩn mô tả kiến trúc và thẩm mỹ. (Standard content describing architecture and aesthetics).
- `EN`: AI must preserve equivalent English meaning when applying design/system rules. (AI phải bảo toàn ý nghĩa tiếng Anh tương đương khi áp dụng quy tắc thiết kế/hệ thống).
- Trigger mode: with `Hey, AI`, responses should follow the user's primary language choice. (Chế độ kích hoạt: với `Hey, AI`, phản hồi theo lựa chọn ngôn ngữ chính của người dùng).

Tài liệu này quy định kiến trúc kỹ thuật, tiêu chuẩn thiết kế và các công cụ mặc định cho dự án.
(This document specifies the technical architecture, design standards, and default tools for the project.)

---

## 🏛️ 1. ARCHITECTURE & TECH STACK / KIẾN TRÚC & CÔNG NGHỆ

- **Frontend**: React 19, Next.js 15, Tailwind CSS v4.
- **Backend**: Node.js (TypeScript) hoặc Python (FastAPI).
- **Database**: PostgreSQL (Prisma/Drizzle), Redis cho caching.
- **AI Integration**: Hệ thống hỗ trợ đa Model (GPT-4, Claude 3.5/3.7, Gemini 2.0) thông qua API Gateway. (Multi-model support via API Gateway.)

---

## 🎨 2. DESIGN SYSTEM / HỆ THỐNG THIẾT KẾ (Aesthetics)

Dự án theo đuổi phong cách **Hiện đại, Đơn giản, Tối giản (Minimalist)**.
(The project follows a **Modern, Simple, Minimalist** style.)

### 🌓 Color Palettes / Bảng màu

| Chế độ (Mode) | Tông màu chủ đạo (Primary Colors) | Cảm hứng (Theme) |
| :--- | :--- | :--- |
| **Lightmode** | Vani/Sữa, Trắng nhẹ, Cam pastel | Thanh lịch (Elegant) |
| **Darkmode** | Hồng và Xanh pastel | Aesthetic, Cosmic, Galaxy |

### 📐 Typography & Layout

- **Font**: Montserrat, Inter hoặc Roboto.
- **Layout**: Bento Grid, Glassmorphism (đối với Darkmode).

---

## 🛠️ 3. DEFAULT KITS & SKILLS / CÔNG CỤ & KỸ NĂNG MẶC ĐỊNH

1. **UI/UX Pro Max**: [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
2. **AntiGravity Kit**: [antigravity-kit](https://github.com/vudovn/antigravity-kit)
3. **AntiGravity IDE**: [antigravity-ide](https://github.com/Dokhacgiakhoa/antigravity-ide)
4. **Global Skills**: [Microsoft Skills](https://github.com/microsoft/skills), [Stitch Skills](https://github.com/google-labs-code/stitch-skills).

---

## 📏 4. PROJECT RULES / QUY TẮC DỰ ÁN

- **PDCA Cycle**: Lập kế hoạch -> Thực hiện -> Kiểm tra -> Tối ưu. (Plan -> Do -> Check -> Act.)
- **Socratic Gate**: Hỏi để làm rõ yêu cầu trước khi thực thi. (Ask to clarify requirements before execution.)
- **Zero-Bug Tolerance**: Chống lỗi tuyệt đối qua kiểm thử. (Zero tolerance for bugs via testing.)

---

> **"Simplicity is the ultimate sophistication."**
