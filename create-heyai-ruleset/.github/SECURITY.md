# Chính sách bảo mật Open Source / Open Source Security Policy 🛡️

## Các phiên bản được hỗ trợ / Supported Versions

Chúng tôi chỉ cung cấp các bản cập nhật bảo mật cho phiên bản ổn định mới nhất của `heyai-ruleset`.
(We only provide security updates for the latest stable version of heyai-ruleset.)

| Phiên bản / Version | Hỗ trợ / Supported |
| ------------------- | ------------------ |
| 1.x                 | :white_check_mark: |
| < 1.0               | :x:                |

## Báo cáo lỗ hổng / Reporting a Vulnerability

**KHÔNG mở issue công khai.** Nếu bạn tìm thấy lỗ hổng bảo mật, vui lòng báo cáo riêng tư để đảm bảo an toàn cho người dùng của chúng tôi.
(Do NOT open a public issue. If you find a security vulnerability, please report it privately to ensure the safety of our users.)

Vui lòng gửi báo cáo của bạn tới [insert email] với các thông tin sau:
(Please send your report to [insert email] with the following information:)
- Mô tả về lỗ hổng. (Description of the vulnerability.)
- Các bước để tái hiện. (Steps to reproduce.)
- Tác động tiềm tàng. (Potential impact.)

Chúng tôi sẽ xác nhận báo cáo của bạn trong vòng 48 giờ và cung cấp lộ trình khắc phục.
(We will acknowledge your report within 48 hours and provide a timeline for a fix.)

## Ngăn chặn mã độc và Backdoor / Malware & Backdoor Prevention
Là một dự án mã nguồn mở, chúng tôi rất coi trọng vấn đề bảo mật:
(As an Open Source project, we take security seriously:)
- Tất cả các Pull Request đều được xem xét thủ công để tìm mã hoặc logic đáng ngờ.
  (All Pull Requests are manually reviewed for suspicious code or logic.)
- Chúng tôi giảm thiểu các dependency bên ngoài để giảm rủi ro chuỗi cung ứng.
  (We minimize external dependencies to reduce supply-chain risks.)
- Chúng tôi sử dụng tính năng quét bí mật (secret scanning) tự động trên mỗi commit.
  (We use automated secret scanning on every commit.)
