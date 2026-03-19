# Enable Copy Extension Implementation Plan

This document outlines the architecture and implementation details for the "Enable Copy" Chrome/Edge extension.

## Goal Description

The goal is to build a browser extension that bypasses website restrictions on right-clicking and text copying. It will also display a sleek, modern popup box previewing the copied text directly on the page. The extension will feature a modern React-based UI for settings.

## Proposed Changes

We will build the extension using the existing React/Vite setup, modifying it to compile into a standard Manifest V3 extension.

### 1. Build & Manifest Configuration
- **Update Vite Config**: We'll use `@crxjs/vite-plugin` for seamless Vite integration with Manifest V3. This allows HMR (Hot Module Replacement) during development for the extension.
- **`manifest.json`**: Define permissions (`activeTab`, `scripting`, `storage`, `contextMenus`, `clipboardWrite`), background scripts, content scripts, and the popup action.

### 2. Extension Architecture
- **Popup UI (`src/popup`)**: A modern React application to toggle settings (e.g., Enable/Disable the extension globally, Enable/Disable the preview box).
- **Background Script (`src/background`)**: Manages state, extension lifecycle, and potentially coordinates settings if needed.
- **Content Script (`src/content`)**: 
  - Injected into web pages.
  - Overrides document & element event listeners (`contextmenu`, `selectstart`, `copy`, `cut`, `dragstart`) to prevent websites from calling `preventDefault()` or `stopPropagation()`.
  - Injects dynamic CSS to force `user-select: text !important` everywhere.
  - Intercepts successful copy actions to trigger the Clipboard Preview Box UI.

### 3. Clipboard Preview Box Feature
- Rendered natively in the content script via a generic DOM node or a shadow DOM (to avoid CSS conflicts with the host website).
- Uses a sleek, modern UI design (Tailwind/Vanilla CSS) that momentarily pops up at the bottom or corner of the screen when text is copied, showing a snippet of the clipboard data, then fading out automatically.

## User Review Required

> [!NOTE] 
> Please review this plan. We will use the existing React + Vite foundation. We will need to adjust the [package.json](file:///c:/Workspaces/enable-copy-ext/enable_copy_ex/package.json) to install `@crxjs/vite-plugin` and configure Vite to build a Chrome Extension.
> If acceptable, I will proceed with the setup.

## Verification Plan

### Automated Tests
- N/A for this phase, the primary test is manual capability logic.
 
### Manual Verification
- Run `npm run build`.
- Load the "unpacked extension" into Chrome/Edge pointing to the `dist` folder.
- Visit a site known to block right-click/copy (or create a local test HTML file with these restrictions) and verify the extension bypasses them successfully. We will also test the pop-up clipboard preview.
