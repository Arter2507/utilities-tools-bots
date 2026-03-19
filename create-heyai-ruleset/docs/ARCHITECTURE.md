# Tổng quan kiến trúc / Architecture Overview 🏗️

Tài liệu này mô tả cấu trúc nội bộ và logic của `@heyai-rules/heyai-ruleset`.
(This document describes the internal structure and logic of the @heyai-rules/heyai-ruleset.)

## 1. Logic cốt lõi / Core Logic
CLI được xây dựng bằng Node.js và sử dụng luồng sau:
(The CLI is built with Node.js and uses the following flow:)
1. **Đầu vào người dùng (User Input)**: Các câu hỏi tương tác để thu thập tùy chọn dự án.
   (Interactive prompts to gather project preferences.)
2. **Lựa chọn Template (Template Selection)**: Dựa trên các "Kits" đã chọn (định nghĩa trong `SYSTEM_DESIGN.md`).
   (Based on chosen Kits defined in SYSTEM_DESIGN.md.)
3. **Khởi tạo bộ rule (Scaffolding)**: Sao chép các tệp từ template nội bộ sang thư mục đích (`.heyai-ruleset/`).
   (Copying files from the internal templates to the target directory.)
4. **Tích hợp Agent (Agent Injection)**: Tạo tệp `HEYAI.agent.md` và sửa đổi `AGENTS.md`.
   (Generating HEYAI.agent.md and modifying AGENTS.md.)

## 2. Ma trận quy tắc 7 nhóm / The 7-Group Ruleset Matrix
Kiến trúc của chúng tôi tập trung vào 7 tệp cốt lõi cung cấp ngữ cảnh đầy đủ cho AI:
(Our architecture is centered around 7 core files that provide a complete context for AI:)

- **MAP.md**: Sơ đồ điều hướng mã nguồn. (High-level map of the codebase.)
- **IDENTITY_SOUL.md**: "Tính cách" và vai trò của Agent. (The personality and role of the AI Agent.)
- **PROTOCOLS.md**: Quy chuẩn vận hành tiêu chuẩn. (Standard operating procedures.)
- **RULES.md**: Ràng buộc về code và cộng tác. (Coding and collaboration constraints.)
- **WORKFLOWS.md**: Hướng dẫn thực thi nhiệm vụ từng bước. (Step-by-step task execution guides.)
- **CODE_STANDARDS.md**: Các quy ước kỹ thuật. (Technical conventions.)
- **SYSTEM_DESIGN.md**: Triết lý UI/UX và kiến trúc. (UI/UX and architectural philosophy.)

## 3. Tự động hóa (Automation)
Chúng tôi sử dụng `semantic-release` để tự động hóa chu kỳ phát hành, tuân thủ nghiêm ngặt [Conventional Commits](https://www.conventionalcommits.org/):
(We use semantic-release to automate our release cycle, strictly following Conventional Commits:)
- `feat:` -> Tăng phiên bản Minor. (Minor version bump.)
- `fix:` -> Tăng phiên bản Patch. (Patch version bump.)
- `BREAKING CHANGE:` -> Tăng phiên bản Major. (Major version bump.)
