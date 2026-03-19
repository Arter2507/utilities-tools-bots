# Hướng dẫn bắt đầu cho nhà phát triển / Getting Started for Developers 🛠️

Chào mừng bạn! Hướng dẫn này sẽ giúp bạn thiết lập dự án cục bộ để đóng góp cho `heyai-ruleset`.
(Welcome! This guide will help you set up the project locally to contribute to heyai-ruleset.)

## 1. Điều kiện tiên quyết / Prerequisites
- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0

## 2. Thiết lập / Setup
1. Fork và Clone repository. (Fork and Clone the repository.)
2. Cài đặt các dependency: (Install dependencies:)
   ```bash
   npm install
   ```

## 3. Chạy cục bộ / Running Locally
Bạn có thể kiểm tra CLI mà không cần phát hành:
(You can test the CLI without publishing:)
```bash
node index.js --target ./test-project
```

## 4. Quy trình phát triển / Development Workflow
- **Cập nhật Rules**: Chỉnh sửa template trong `index.js` hoặc các tệp markdown ở root.
  (Rules updates: Modify templates in index.js or the markdown files in the root.)
- **Cập nhật Logic**: Chỉnh sửa `index.js`.
  (Logic updates: Modify index.js.)
- **Xác thực (Validation)**:
  ```bash
  npm run check
  ```

## 5. Bảo mật / Security
Mọi mã nguồn đều được quét mã độc. Chúng tôi sử dụng quy trình đánh giá nghiêm ngặt cho bất kỳ PR nào sửa đổi logic scaffolding để ngăn chặn các cuộc tấn công chuỗi cung ứng.
(All code is scanned for malware. We use a strict review process for any PR that modifies the scaffolding logic to prevent supply-chain attacks.)
