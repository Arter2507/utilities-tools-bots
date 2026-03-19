# @heyai-rules/heyai-ruleset 🤖

**Bộ công cụ chuẩn hoá tri thức và quy tắc cho AI Agent trong dự án của bạn.**
(A standardized toolkit for AI Agent knowledge and rules in your project.)

[![npm version](https://img.shields.io/npm/v/@heyai-rules/heyai-ruleset.svg)](https://www.npmjs.com/package/@heyai-rules/heyai-ruleset)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 Mục đích dự án / Project Purpose

`heyai-ruleset` được thiết kế để giải quyết vấn đề "mất ngữ cảnh" và "thiếu nhất quán" khi làm việc với các AI Coding Assistant (như Cursor, GitHub Copilot, Gemini). 
Công cụ này giúp bạn nhanh chóng cài đặt một bộ quy tắc (ruleset) chuẩn hoá, giúp AI hiểu sâu về project, tuân thủ đúng quy trình làm việc và giữ vững phong cách thiết kế của bạn.

(`heyai-ruleset` is designed to solve the problem of "context loss" and "inconsistency" when working with AI Coding Assistants. It provides a standardized ruleset, helping the AI understand your project, follow workflows, and maintain your design style.)

## ✨ Tính năng chính / Key Features

- **Cài đặt 1-Click (Scalable Scaffolder)**: Tự động khởi tạo bộ rule trong thư mục `.heyai-ruleset`.
- **Hệ thống Kit linh hoạt (Flexible Kits)**: Chọn từ các bộ kit mặc định hoặc nạp bộ kit riêng từ GitHub.
- **Tuỳ biến thẩm mỹ (Design Customization)**: Cấu hình nhanh giao diện (Light/Dark mode) cho AI ngay từ lúc cài đặt.
- **Quản lý Agent (Agent Registry)**: Tạo file `HEYAI.agent.md` để AI tự nhận diện danh tính và cơ chế kích hoạt.
- **Báo cáo cài đặt (Installation Reports)**: Theo dõi mọi thay đổi và các thư viện đã tích hợp.

## 🏗️ Kiến trúc quy tắc / Ruleset Architecture

Hệ thống được tổ chức theo ma trận 7 nhóm tài liệu chính giúp AI nạp tri thức một cách logic:
(The system is organized into 7 core document groups for logical knowledge loading:)

1.  **MAP**: Sơ đồ điều hướng và cấu trúc dự án. (Project navigation and structure.)
2.  **IDENTITY & SOUL**: Nhân dạng, vai trò và triết lý của Agent. (Agent identity, roles, and philosophy.)
3.  **PROTOCOLS**: Các quy tắc vận hành bất biến. (Immutable operational rules.)
4.  **RULES**: Hiến chương và các quy ước bắt buộc. (Mandatory project rules and conventions.)
5.  **WORKFLOWS**: Quy trình thực thu (PDCA) và xử lý nhiệm vụ. (Operational workflows and task handling.)
6.  **CODE STANDARDS**: Tiêu chuẩn viết mã và ngôn ngữ lập trình. (Coding and language standards.)
7.  **SYSTEM DESIGN**: Kiến trúc kỹ thuật và thẩm mỹ hệ thống. (Technical architecture and aesthetics.)

## 🚀 Hướng dẫn nhanh / Quick Start

Sử dụng trực tiếp qua NPM mà không cần cài đặt trước:
(Use directly via NPM without prior installation:)

```bash
# Sử dụng npx (Khuyên dùng)
npx @heyai-rules/heyai-ruleset@latest

# Hoặc qua npm create
npm create @heyai-rules/heyai-ruleset@latest

# Hoặc qua pnpm create
pnpm create @heyai-rules/heyai-ruleset
```

## 🎮 Cách sử dụng / Usage Guide

### 1. Chế độ tương tác (Interactive Mode)
Chỉ cần chạy lệnh trên, CLI sẽ dẫn dắt bạn qua các bước:
- Chọn bộ quy tắc (Kits) phù hợp.
- Thiết lập định hướng thẩm mỹ (Aesthetics).
- Đặt tên cho Agent của bạn.

### 2. Chế độ CI / Tự động (Non-interactive)
Dành cho việc tích hợp vào script hoặc CI:

```bash
npx @heyai-rules/heyai-ruleset@latest --non-interactive --no-kits --agent-name MyAI
```

## 🛠️ Tuỳ chọn CLI / CLI Options

| Flag | Mô tả / Description |
| :--- | :--- |
| `-y, --yes` | Sử dụng mặc định và bỏ qua mọi câu hỏi. (Use defaults and skip prompts.) |
| `--non-interactive` | Tắt chế độ hỏi đáp (Dùng cho CI). (Disable prompts for CI.) |
| `-t, --target <path>` | Đường dẫn dự án đích. (Target project path.) |
| `--kits <indexes>` | Chỉ định các kit theo số thứ tự (ví dụ: 1,2). (Specify kit indexes.) |
| `--agent-name <name>` | Đặt tên nhân dạng cho AI (mặc định: AI). (Set Agent name.) |
| `--overwrite` | Ghi đè cấu hình cũ nếu đã tồn tại. (Overwrite existing config.) |

## 🤖 Cơ chế Agent / Agent Mechanism

Sau khi cài đặt, file `HEYAI.agent.md` sẽ được tạo ở root dự án. AI sẽ tự động kích hoạt khi bạn sử dụng lời chào:
(After installation, `HEYAI.agent.md` is created at the root. The AI triggers via:)

- `Hey, AI` hoặc `Hey, [AgentName]`

AI sẽ nạp các file trong `.heyai-ruleset/` theo thứ tự ưu tiên từ chiến lược đến kỹ thuật để hỗ trợ bạn tốt nhất.

---

## 🤝 Cộng đồng & Góp ý / Community & Contributing

Dự án này là mã nguồn mở và chúng tôi rất trân trọng mọi sự đóng góp từ cộng đồng. 
(This project is open-source and we welcome all contributions.)

- **[Hướng dẫn góp ý / Contributing Guide](CONTRIBUTING.md)**
- **[Quy tắc ứng xử / Code of Conduct](CODE_OF_CONDUCT.md)**
- **[Tài liệu chi tiết / Detailed Docs](docs/ARCHITECTURE.md)**
- **[Báo cáo bảo mật / Security Policy](.github/SECURITY.md)**
- **[Giấy phép / License](LICENSE)**

---

> **"Orchestrating the technology of the future with discipline and soul."**
