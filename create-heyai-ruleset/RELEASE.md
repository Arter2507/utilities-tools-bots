# NPM Release Checklist / Danh sách Kiểm tra Phát hành

## 1. Local preflight / Kiểm tra nội bộ

```bash
npm install
npm run release:check
```

## 2. Version bump / Cập nhật phiên bản

```bash
npm version patch
```

## 3. Push tag / Đẩy tag lên GitHub

```bash
git push origin main
git tag vX.Y.Z
git push origin vX.Y.Z
```

This triggers GitHub Actions `Publish npm`. (Thao tác này sẽ kích hoạt GitHub Actions `Publish npm`).

---

## 4. Authentication / Xác thực

Preferred: npm trusted publishing via GitHub OIDC. (Ưu tiên: npm trusted publishing qua GitHub OIDC).
- Enable trusted publishing in npm settings for this GitHub repo. (Bật trusted publishing trong cài đặt npm cho repo này).
- Workflow uses `npm publish --provenance`. (Workflow sử dụng `npm publish --provenance`).

---

> **"Release often, release early."**
