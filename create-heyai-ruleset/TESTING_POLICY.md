# 🧪 TESTING POLICY / CHÍNH SÁCH KIỂM THỬ

Chất lượng mã nguồn được đảm bảo thông qua quy trình kiểm thử tự động nghiêm ngặt. **Zero-Bug Tolerance** là mục tiêu cao nhất.
(Code quality is ensured through rigorous automated testing. **Zero-Bug Tolerance** is the ultimate goal.)

---

## 📐 1. THE TESTING PYRAMID / KIM TỰ THÁP KIỂM THỬ

1. **Unit Tests (Đáy/Bottom)**: Kiểm tra từng hàm/component riêng lẻ (Vitest/Pytest). (Test individual functions/components.)
2. **Integration Tests (Giữa/Middle)**: Kiểm tra sự tương tác giữa các module. (Test interaction between modules.)
3. **End-to-End (E2E) Tests (Đỉnh/Top)**: Kiểm tra toàn bộ luồng người dùng (Playwright). (Test entire user flows.)

---

## 🛠️ 2. TESTING TOOLS & STACK / CÔNG CỤ KIỂM THỬ

- **Core Engine**: Vitest.
- **Browser Automation**: Playwright.
- **Component Testing**: Testing Library.
- **Mocking**: MSW (Mock Service Worker).

---

## 📜 3. MANDATORY PROCEDURES / QUY TRÌNH BẮT BUỘC

- **Test-First (TDD)**: Khuyến khích viết test trước khi code cho các logic nghiệp vụ quan trọng. (Encourage writing tests before code for important business logic.)
- **Failure Analysis**: Mọi test fail PHẢI được phân tích nguyên nhân gốc rễ và sửa đổi trước khi merge. (Every failed test MUST be analyzed for root cause and fixed before merge.)
- **Regression Testing**: Mọi bug mới được phát hiện phải có một bản test đi kèm để đảm bảo nó không xuất hiện lại trong tương lai. (Every new bug discovered MUST have a corresponding test to ensure it does not reappear in the future.)
- **Evidence Reporting**: Logs kết quả test PHẢI được đính kèm vào `walkthrough.md`. (Test results logs MUST be included in `walkthrough.md`.)

---

## 📊 4. COVERAGE GOALS

- **Logic nghiệp vụ (Business Logic)**: Đảm bảo độ bao phủ > 80%. (Ensure coverage > 80%.)
- **Các thành phần giao diện (UI Components)**: Tập trung vào các trạng thái quan trọng (Error, Loading, Success). (Focus on critical states (Error, Loading, Success).)
- **API Endpoints**: 100% các endpoint chính phải được kiểm tra (Success & Error cases). (100% of main endpoints must be tested (Success & Error cases).)

---

> **"If it's not tested, it's broken."**
