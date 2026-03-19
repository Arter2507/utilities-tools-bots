// Background Service Worker - Enable Copy Extension
// Manages extension state and communicates with content scripts

const STORAGE_KEY = 'enableCopyState';
const GLOBAL_PREVIEW_KEY = 'enableCopyGlobalPreview';

interface SiteState {
  enabled: boolean;
  previewEnabled: boolean;
}

const DEFAULT_STATE: SiteState = {
  enabled: true,
  previewEnabled: true,
};
const DEFAULT_GLOBAL_PREVIEW = true;

// Initialize default state on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('[EnableCopy] Extension installed.');
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener(
  (
    message: {
      type: string;
      enabled?: boolean;
      previewEnabled?: boolean;
      globalPreviewEnabled?: boolean;
    },
    _sender: chrome.runtime.MessageSender,
    sendResponse: (
      response: {
        success: boolean;
        enabled?: boolean;
        previewEnabled?: boolean;
        globalPreviewEnabled?: boolean;
      }
    ) => void
  ) => {
    if (message.type === 'GET_STATE') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (!tab?.id || !tab.url) {
          sendResponse({ success: false });
          return;
        }
        const key = getStorageKey(tab.url);
        chrome.storage.local.get([key, GLOBAL_PREVIEW_KEY], (result) => {
          const storage = result as Record<string, SiteState | boolean>;
          const state: SiteState = (storage[key] as SiteState) ?? DEFAULT_STATE;
          const globalPreviewEnabled: boolean =
            (storage[GLOBAL_PREVIEW_KEY] as boolean) ?? DEFAULT_GLOBAL_PREVIEW;
          sendResponse({
            success: true,
            enabled: state.enabled,
            previewEnabled: state.previewEnabled,
            globalPreviewEnabled,
          });
        });
      });
      return true; // Keep channel open for async
    }

    if (message.type === 'SET_STATE') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (!tab?.id || !tab.url) {
          if (typeof message.globalPreviewEnabled === 'boolean') {
            chrome.storage.local.set(
              { [GLOBAL_PREVIEW_KEY]: message.globalPreviewEnabled },
              () => {
                sendResponse({
                  success: true,
                  globalPreviewEnabled: message.globalPreviewEnabled,
                });
              }
            );
            return;
          }
          sendResponse({ success: false });
          return;
        }
        const key = getStorageKey(tab.url);
        chrome.storage.local.get([key, GLOBAL_PREVIEW_KEY], (result) => {
          const storage = result as Record<string, SiteState | boolean>;
          const current: SiteState = (storage[key] as SiteState) ?? DEFAULT_STATE;
          const currentGlobal: boolean =
            (storage[GLOBAL_PREVIEW_KEY] as boolean) ?? DEFAULT_GLOBAL_PREVIEW;
          const state: SiteState = {
            enabled: message.enabled ?? current.enabled,
            previewEnabled: message.previewEnabled ?? current.previewEnabled,
          };
          const globalPreviewEnabled =
            message.globalPreviewEnabled ?? currentGlobal;
          chrome.storage.local.set(
            { [key]: state, [GLOBAL_PREVIEW_KEY]: globalPreviewEnabled },
            () => {
              // Notify content script to update behavior
              if (tab.id) {
                chrome.tabs.sendMessage(tab.id, {
                  type: 'UPDATE_STATE',
                  enabled: state.enabled,
                  previewEnabled: state.previewEnabled,
                  globalPreviewEnabled,
                });
              }
              sendResponse({
                success: true,
                enabled: state.enabled,
                previewEnabled: state.previewEnabled,
                globalPreviewEnabled,
              });
            }
          );
        });
      });
      return true;
    }

    return false;
  }
);

// When a tab is updated (navigated), inject fresh state
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const key = getStorageKey(tab.url);
    chrome.storage.local.get([key, GLOBAL_PREVIEW_KEY], (result) => {
      const storage = result as Record<string, SiteState | boolean>;
      const state: SiteState = (storage[key] as SiteState) ?? DEFAULT_STATE;
      const globalPreviewEnabled: boolean =
        (storage[GLOBAL_PREVIEW_KEY] as boolean) ?? DEFAULT_GLOBAL_PREVIEW;
      chrome.tabs.sendMessage(tabId, {
        type: 'UPDATE_STATE',
        enabled: state.enabled,
        previewEnabled: state.previewEnabled,
        globalPreviewEnabled,
      }).catch(() => {
        // Content script may not be ready yet, ignore
      });
    });
  }
});

function getStorageKey(url: string): string {
  try {
    const { hostname } = new URL(url);
    return `${STORAGE_KEY}_${hostname}`;
  } catch {
    return STORAGE_KEY;
  }
}
