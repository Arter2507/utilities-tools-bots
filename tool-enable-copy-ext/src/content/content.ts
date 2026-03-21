// Content Script - Enable Copy Extension
// Injects into all pages and removes copy/right-click restrictions

let isEnabled = true;
let previewEnabled = true;
let globalPreviewEnabled = true;

// Events to unblock
const BLOCKED_EVENTS = [
  'contextmenu',
  'copy',
  'cut',
  'selectstart',
  'mousedown',
  'keydown',
  'dragstart',
];

// CSS properties used to disable selection
const SELECTION_DISABLING_PROPS = [
  'user-select',
  '-webkit-user-select',
  '-moz-user-select',
  '-ms-user-select',
];

const PREVIEW_ROOT_ID = 'enable-copy-preview-root';
const PREVIEW_MAX_LENGTH = 160;

let previewHost: HTMLDivElement | null = null;
let previewWrap: HTMLDivElement | null = null;
let previewText: HTMLDivElement | null = null;
let previewTimer: number | null = null;

// --- Event Handlers ---

/**
 * Universal event unblocker: stop propagation of blocked events
 * by capturing at the document level (useCapture = true) and
 * stopping immediate propagation so site handlers never fire.
 */
function handleBlockedEvent(event: Event): void {
  if (!isEnabled) return;

  if (event.type === 'copy' && isPreviewActive()) {
    const selected = getSelectionText();
    showCopyPreview(selected);
  }

  // We previously added event.preventDefault() here to stop sites from showing warnings.
  // HOWEVER, calling preventDefault() on 'copy' or 'contextmenu' actually stops the BROWSER 
  // from copying to clipboard or opening the right-click menu! 
  // We MUST NOT call preventDefault() on these events.
  // Stopping propagation is enough to prevent the site's anti-copy script from firing.

  // Smart Event Unblocking
  let shouldStopPropagation = true;

  if (event.type === 'mousedown') {
    const mouseEvent = event as MouseEvent;
    if (mouseEvent.button === 0) {
      const target = event.target as HTMLElement;
      if (target && target.closest) {
        // Nhận diện Web App (VD: nút bấm, thẻ a, hoặc các item của Drive)
        const interactiveSelector = 'a, button, input, textarea, select, option, details, summary, label, [role="button"], [role="link"], [role="menuitem"], [role="option"], [role="tab"], [role="treeitem"], [contenteditable="true"]';
        if (target.closest(interactiveSelector)) {
          // Cho phép event đi qua để Google Drive bắt được click
          shouldStopPropagation = false;
        } else {
          // Bấm vào vùng văn bản bị chặn: Chặn event ko cho truyền xuống site!
          shouldStopPropagation = true;
        }
      }
    } else if (mouseEvent.button !== 2) {
      shouldStopPropagation = false;
    }
  } else if (event.type === 'keydown') {
    // Only stop propagation for common shortcuts.
    const e = event as KeyboardEvent;
    const isShortcut = (e.ctrlKey || e.metaKey) && ['c', 'x', 'a', 'v', 'p'].includes(e.key.toLowerCase());
    // Also protect F12, Ctrl+Shift+I
    const isDevelperTools = e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i');
    if (!isShortcut && !isDevelperTools) {
      shouldStopPropagation = false;
    }
  } else if (event.type === 'dragstart') {
    shouldStopPropagation = false;
  } else if (event.type === 'selectstart') {
    // BẮT BUỘC chặn selectstart để chống lại các trang web ngăn bôi đen bản địa
    shouldStopPropagation = true;
  }

  if (shouldStopPropagation) {
    event.stopImmediatePropagation();
  }
}

/**
 * Apply selection fixes with minimal DOM work.
 * - Inject a global override style (covers stylesheet rules).
 * - Only fix inline styles where necessary (user-select: none).
 */
function startSelectionOverrides(): void {
  if (!isEnabled) return;
  injectStyleOverride();
  scanInlineSelectionBlocks();
  startSelectionObserver();
}

let styleOverrideEl: HTMLStyleElement | null = null;

function injectStyleOverride(): void {
  if (styleOverrideEl) return;
  styleOverrideEl = document.createElement('style');
  styleOverrideEl.id = 'enable-copy-ext-override';
  styleOverrideEl.textContent = `
    html, body, div, p, span, h1, h2, h3, h4, h5, h6, article, section, main, header, footer, aside, nav, blockquote, q, cite, code, pre, td, th {
      user-select: text !important;
      -webkit-user-select: text !important;
      -moz-user-select: text !important;
      -ms-user-select: text !important;
    }
  `;
  document.documentElement.appendChild(styleOverrideEl);
}

function removeStyleOverride(): void {
  if (styleOverrideEl) {
    styleOverrideEl.remove();
    styleOverrideEl = null;
  }
}

// --- Lifecycle ---

function enableUnblocking(): void {
  BLOCKED_EVENTS.forEach((eventName) => {
    document.addEventListener(eventName, handleBlockedEvent, true);
  });
  startSelectionOverrides();
}

function disableUnblocking(): void {
  BLOCKED_EVENTS.forEach((eventName) => {
    document.removeEventListener(eventName, handleBlockedEvent, true);
  });
  removeStyleOverride();
  removeCopyPreview();
  stopSelectionObserver();
}

// MutationObserver to handle dynamically added elements
const pendingInline = new Set<HTMLElement>();
let pendingFrame: number | null = null;
let selectionObserver: MutationObserver | null = null;

function scheduleInlineFix(el: HTMLElement): void {
  pendingInline.add(el);
  if (pendingFrame !== null) return;
  pendingFrame = window.requestAnimationFrame(() => {
    pendingInline.forEach((node) => fixInlineSelection(node));
    pendingInline.clear();
    pendingFrame = null;
  });
}

function fixInlineSelection(el: HTMLElement): void {
  const style = el.style;
  SELECTION_DISABLING_PROPS.forEach((prop) => {
    if (style.getPropertyValue(prop) === 'none' || style.getPropertyValue(prop) === 'auto') {
      style.setProperty(prop, 'text', 'important');
    }
  });
}

function scanInlineSelectionBlocks(): void {
  document.querySelectorAll<HTMLElement>('[style]').forEach((el) => {
    scheduleInlineFix(el);
  });
}

function startSelectionObserver(): void {
  if (selectionObserver) return;
  selectionObserver = new MutationObserver((mutations) => {
    if (!isEnabled) return;
    for (const mutation of mutations) {
      if (mutation.type === 'attributes') {
        if (mutation.target instanceof HTMLElement) {
          scheduleInlineFix(mutation.target);
        }
      }
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            // Fix the node itself if it has inline style
            if (node.hasAttribute('style')) {
              scheduleInlineFix(node);
            }
            // Only scan children if really needed, but try to be efficient
            // Instead of querySelectorAll on every mutation, we can rely on 
            // the fact that most things are covered by global CSS override.
            // We'll only do a shallow check or skip if it's too heavy.
          }
        });
      }
    }
  });

  selectionObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class'],
  });
}

function stopSelectionObserver(): void {
  if (selectionObserver) {
    selectionObserver.disconnect();
    selectionObserver = null;
  }
  if (pendingFrame !== null) {
    window.cancelAnimationFrame(pendingFrame);
    pendingFrame = null;
  }
  pendingInline.clear();
}

// --- Clipboard Preview ---

function ensurePreviewElements(): void {
  if (previewHost) return;

  previewHost = document.createElement('div');
  previewHost.id = PREVIEW_ROOT_ID;
  previewHost.style.position = 'fixed';
  previewHost.style.zIndex = '2147483647';
  previewHost.style.pointerEvents = 'none';
  previewHost.style.inset = '0';

  const shadow = previewHost.attachShadow({ mode: 'open' });
  shadow.innerHTML = `
    <style>
      .wrap {
        position: fixed;
        right: 18px;
        bottom: 18px;
        max-width: min(320px, calc(100vw - 32px));
        padding: 12px 14px;
        border-radius: 12px;
        background: linear-gradient(135deg, rgba(21, 26, 38, 0.92), rgba(15, 19, 25, 0.92));
        border: 1px solid rgba(108, 142, 245, 0.4);
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45);
        color: #e8eaf0;
        font-family: 'Inter', system-ui, sans-serif;
        opacity: 0;
        transform: translateY(8px) scale(0.98);
        transition: opacity 180ms ease, transform 180ms ease;
        display: grid;
        gap: 6px;
      }

      .wrap.show {
        opacity: 1;
        transform: translateY(0) scale(1);
      }

      .chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.6px;
        text-transform: uppercase;
        color: #9fb5ff;
      }

      .chip::before {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: #4ade80;
        box-shadow: 0 0 8px rgba(74, 222, 128, 0.55);
      }

      .text {
        font-size: 12px;
        line-height: 1.4;
        color: #cbd5f5;
        word-break: break-word;
      }
    </style>
    <div class="wrap" role="status" aria-live="polite">
      <div class="chip">Copied</div>
      <div class="text"></div>
    </div>
  `;

  previewWrap = shadow.querySelector<HTMLDivElement>('.wrap');
  previewText = shadow.querySelector<HTMLDivElement>('.text');

  document.documentElement.appendChild(previewHost);
}

function removeCopyPreview(): void {
  if (previewTimer) {
    window.clearTimeout(previewTimer);
    previewTimer = null;
  }
  if (previewHost) {
    previewHost.remove();
    previewHost = null;
    previewWrap = null;
    previewText = null;
  }
}

function showCopyPreview(text: string): void {
  ensurePreviewElements();
  if (!previewWrap || !previewText) return;

  const trimmed = text.trim();
  const snippet = trimmed.length > PREVIEW_MAX_LENGTH
    ? `${trimmed.slice(0, PREVIEW_MAX_LENGTH - 3)}...`
    : trimmed;

  previewText.textContent = snippet || 'Clipboard updated';
  previewWrap.classList.add('show');

  if (previewTimer) window.clearTimeout(previewTimer);
  previewTimer = window.setTimeout(() => {
    previewWrap?.classList.remove('show');
  }, 1800);
}

function getSelectionText(): string {
  const selection = window.getSelection();
  if (selection && selection.toString()) {
    return selection.toString();
  }

  const active = document.activeElement;
  if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) {
    const start = active.selectionStart ?? 0;
    const end = active.selectionEnd ?? 0;
    if (end > start) {
      return active.value.slice(start, end);
    }
  }

  return '';
}

function isPreviewActive(): boolean {
  return isEnabled && previewEnabled && globalPreviewEnabled;
}

// --- Bootstrap ---

// Get initial state from background
chrome.runtime.sendMessage({ type: 'GET_STATE' }, (response) => {
  if (chrome.runtime.lastError) return;
  if (response?.success) {
    isEnabled = response.enabled ?? true;
    previewEnabled = response.previewEnabled ?? true;
    globalPreviewEnabled = response.globalPreviewEnabled ?? true;
    if (isEnabled) enableUnblocking();
  }
});

// Listen for state updates from popup
chrome.runtime.onMessage.addListener(
  (message: {
    type: string;
    enabled?: boolean;
    previewEnabled?: boolean;
    globalPreviewEnabled?: boolean;
  }) => {
    if (message.type === 'UPDATE_STATE') {
      isEnabled = message.enabled ?? true;
      previewEnabled = message.previewEnabled ?? true;
      globalPreviewEnabled = message.globalPreviewEnabled ?? true;
      if (!isPreviewActive()) removeCopyPreview();
      if (isEnabled) {
        enableUnblocking();
      } else {
        disableUnblocking();
      }
    }
  }
);

// Run on DOMContentLoaded to catch early restrictions
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (isEnabled) startSelectionOverrides();
  });
} else {
  if (isEnabled) startSelectionOverrides();
}
