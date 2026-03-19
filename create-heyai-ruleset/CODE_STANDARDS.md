# 💻 CODE STANDARDS / QUY CHUẨN MÃ NGUỒN

## 🌐 Language / Ngôn ngữ
- `VI`: Mô tả quy chuẩn bằng tiếng Việt. (Vietnamese description of standards).
- `EN`: AI keeps English-equivalent interpretation to implement code consistently. (AI giữ diễn dịch tiếng Anh tương đương để thực thi code nhất quán).
- Trigger language behavior: on `Hey, AI`, AI responds in the user's primary language. (Hành vi ngôn ngữ kích hoạt: khi gọi `Hey, AI`, AI phản hồi bằng ngôn ngữ chính của người dùng).

Tài liệu này quy định các tiêu chuẩn viết mã, cấu trúc thư mục và các mẫu thiết kế (Patterns) bắt buộc cho dự án.
(This document specifies coding standards, directory structures, and mandatory design patterns for the project.)

---

## 🏗️ 1. PROJECT STRUCTURE / CẤU TRÚC THƯ MỤC

Dự án sử dụng cơ chế **Feature-based Architecture**. (The project uses a **Feature-based Architecture**.)

### Frontend (Next.js 15 App Router)
- `src/app/`: Định nghĩa Routes (Pages, Layouts). (Defines Routes.)
- `src/components/ui/`: Các thành phần giao diện cơ bản (shadcn/ui). (Base UI components.)
- `src/components/features/`: Các thành phần gắn liền với logic nghiệp vụ. (Business logic components.)
- `src/hooks/`: Các custom React Hooks. (Custom React Hooks.)
- `src/lib/`: Các thư viện tiện ích và cấu hình (Prisma, Cloudinary, v.v.). (Utility libraries and config.)

### Backend (Node.js / FastAPI)
- `api/routes/`: Định nghĩa các Endpoints. (Endpoint definitions.)
- `api/controllers/`: Xử lý logic nghiệp vụ chính. (Business logic handling.)
- `api/models/`: Định nghĩa cấu trúc dữ liệu và Schema. (Data structure definitions.)

---

## 📝 2. NAMING CONVENTIONS / QUY TẮC ĐẶT TÊN

- **Files & Folders**: Sử dụng `kebab-case` (ví dụ: `user-profile.tsx`, `api-gateway/`).
- **Components**: Sử dụng `PascalCase` (ví dụ: `UserProfileCard`).
- **Variables & Functions**: Sử dụng `camelCase` (ví dụ: `fetchUserData`).
- **Constants**: Sử dụng `UPPER_SNAKE_CASE` (ví dụ: `MAX_LIMIT`).

---

## ⚡ 3. DEVELOPMENT PATTERNS / MẪU PHÁT TRIỂN

### React 19 & Next.js 15
- **Server Components (RSC)**: Luôn ưu tiên Server Components làm mặc định. (Always prioritize Server Components by default.)
- **Data Fetching**: Sử dụng Server Actions cho các thao tác thay đổi dữ liệu. (Use Server Actions for mutations.)

### Backend Principles
- **Stateless API**: Mọi API phải là stateless. (All APIs must be stateless.)
- **Validation**: Sử dụng `Zod` hoặc `Pydantic` để xác thực dữ liệu đầu vào. (Use `Zod` or `Pydantic` for data validation.)

---

## 🧹 4. CODE QUALITY / CHẤT LƯỢNG MÃ NGUỒN

- **No Over-engineering**: Ưu tiên giải pháp đơn giản và dễ hiểu. (Prioritize simple and understandable solutions.)
- **DRY (Don't Repeat Yourself)**: Tái sử dụng code qua Components/Utilities. (Reuse code through Components/Utilities.)
- **Comments**: Chỉ viết comment cho logic phức tạp. (Only write comments for complex logic.)

---

> **"Code is read more often than it is written."**
