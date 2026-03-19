# Enable Copy Extension (enable_copy_ex)

**Enable Copy** là tiện ích mở rộng Chrome giúp khôi phục thao tác cơ bản trên các website chặn chuột phải, bôi đen và sao chép/dán. Extension chạy theo **Manifest V3**, có **popup UI** để bật/tắt theo từng website, đồng thời hỗ trợ **clipboard preview** (theo site và theo global).

## Tính năng chính

1. Khôi phục chuột phải (context menu).
2. Khôi phục bôi đen/chọn văn bản.
3. Mở khóa copy/cut/paste và phím tắt phổ biến.
4. Clipboard preview hiển thị sau khi copy.
5. Bật/tắt theo domain (per-site) để tránh ảnh hưởng các web đặc thù.
6. UI popup trực quan.

## Bảo mật & quyền riêng tư

- Chỉ dùng quyền cần thiết để hoạt động.
- Không thu thập dữ liệu người dùng.
- Không gửi dữ liệu ra ngoài.
- Trạng thái lưu trong `chrome.storage.local`.

## Performance

- Giảm quét DOM toàn cục: chỉ xử lý **inline style** có khả năng chặn chọn văn bản.
- Batch xử lý bằng `requestAnimationFrame` để giảm giật lag.
- `MutationObserver` được quản lý chặt và cleanup khi tắt để tránh memory leak.

## Kiến trúc

```
enable_copy_ex/
├── src/
│   ├── background/        # Service Worker: lưu state theo domain + global
│   ├── content/           # Content Script: bypass chặn copy/select
│   ├── popup/             # Popup React UI
│   ├── App.tsx            # UI chính
│   └── App.css            # Styles
├── public/                # Icons
├── manifest.json
└── vite.config.ts
```

## Cài đặt cho người dùng (không cần build)

1. Tải file `.zip` bản phát hành (đã build sẵn).
2. Giải nén, bạn sẽ có thư mục `dist/`.
3. Mở `chrome://extensions/`.
4. Bật **Developer mode**.
5. Chọn **Load unpacked** và trỏ tới thư mục `dist`.

## Build cho developer

```
npm install
npm run build
```

## Walkthrough nhanh

1. Mở popup và bật **Enable Copy**.
2. Bật **Global preview** (áp dụng cho mọi site).
3. Bật **Clipboard preview** (áp dụng cho site hiện tại).
4. Copy văn bản để xem preview.

## Manual test nội bộ

- File test: `docs/manual_test_blocked_copy.html`.
- Mở file này để kiểm tra các thao tác bị chặn và khả năng khôi phục.

## Đóng gói để phát hành

- Chrome Web Store yêu cầu **zip** của thư mục build.
- Gói cần chứa `manifest.json`, `service worker`, `content script`, assets đã build.
- Thư mục `dist/` là bản phát hành sẵn sàng.

---

Nếu cần tối ưu thêm, ưu tiên: giảm DOM scan, hạn chế observer nặng, và tránh thao tác đồng bộ tốn kém trên trang lớn.
