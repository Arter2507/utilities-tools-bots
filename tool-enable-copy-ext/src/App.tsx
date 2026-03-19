import { useEffect, useState } from 'react'
import './App.css'

interface State {
  enabled: boolean
  previewEnabled: boolean
  globalPreviewEnabled: boolean
  loading: boolean
  hostname: string
}

function App() {
  const [state, setState] = useState<State>({
    enabled: true,
    previewEnabled: true,
    globalPreviewEnabled: true,
    loading: true,
    hostname: '',
  })

  // Load current state from background on mount
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0]
      let hostname = tab?.url ?? ''
      try {
        hostname = new URL(tab?.url ?? '').hostname
      } catch {
        hostname = 'this page'
      }

      chrome.runtime.sendMessage({ type: 'GET_STATE' }, (response) => {
        if (chrome.runtime.lastError) {
          setState((s) => ({ ...s, loading: false, hostname }))
          return
        }
        setState({
          enabled: response?.enabled ?? true,
          previewEnabled: response?.previewEnabled ?? true,
          globalPreviewEnabled: response?.globalPreviewEnabled ?? true,
          loading: false,
          hostname,
        })
      })
    })
  }, [])

  const handleToggle = () => {
    const newEnabled = !state.enabled
    setState((s) => ({ ...s, enabled: newEnabled }))
    chrome.runtime.sendMessage({ type: 'SET_STATE', enabled: newEnabled })
  }

  const handlePreviewToggle = () => {
    const newPreviewEnabled = !state.previewEnabled
    setState((s) => ({ ...s, previewEnabled: newPreviewEnabled }))
    chrome.runtime.sendMessage({ type: 'SET_STATE', previewEnabled: newPreviewEnabled })
  }

  const handleGlobalPreviewToggle = () => {
    const newGlobalPreviewEnabled = !state.globalPreviewEnabled
    setState((s) => ({ ...s, globalPreviewEnabled: newGlobalPreviewEnabled }))
    chrome.runtime.sendMessage({ type: 'SET_STATE', globalPreviewEnabled: newGlobalPreviewEnabled })
  }

  return (
    <div className="popup-root">
      {/* Header */}
      <div className="popup-header">
        <div className="logo-wrapper">
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
            <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="logo-title">Enable Copy</span>
        </div>
        <span className="version-badge">MV3</span>
      </div>

      {/* Status Card */}
      <div className={`status-card ${state.enabled ? 'active' : 'inactive'}`}>
        <div className="status-indicator">
          <div className={`status-dot ${state.enabled ? 'pulse' : ''}`} />
          <span className="status-text">
            {state.loading ? 'Loading...' : state.enabled ? 'Active' : 'Disabled'}
          </span>
        </div>

        {/* Toggle */}
        <button
          id="toggle-btn"
          className={`toggle-btn ${state.enabled ? 'on' : 'off'}`}
          onClick={handleToggle}
          disabled={state.loading}
          aria-label={state.enabled ? 'Disable' : 'Enable'}
        >
          <div className="toggle-thumb" />
        </button>
      </div>

      {/* Site info */}
      <div className="site-info">
        <svg viewBox="0 0 24 24" fill="none" className="site-icon">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="2"/>
          <path d="M2 12h20" stroke="currentColor" strokeWidth="2"/>
        </svg>
        <span className="hostname" title={state.hostname}>{state.hostname || 'Unknown site'}</span>
      </div>

      {/* Feature list */}
      <div className="features">
        <h3 className="features-title">Unblocked on this site</h3>
        <ul className="feature-list">
          {['Right-click menu', 'Text selection', 'Copy & paste', 'Drag & drop'].map((feat) => (
            <li key={feat} className={`feature-item ${state.enabled ? 'enabled' : 'disabled'}`}>
              <span className="feature-check">{state.enabled ? '✓' : '○'}</span>
              {feat}
            </li>
          ))}
        </ul>
      </div>

      {/* Settings */}
      <div className="settings">
        <div className="setting-card">
          <div className="setting-copy">
            <div className="setting-title">Global preview</div>
            <div className="setting-sub">Enable preview on all sites</div>
          </div>
          <button
            className={`toggle-btn small ${state.globalPreviewEnabled ? 'on' : 'off'}`}
            onClick={handleGlobalPreviewToggle}
            disabled={state.loading}
            aria-label={state.globalPreviewEnabled ? 'Disable global preview' : 'Enable global preview'}
          >
            <div className="toggle-thumb" />
          </button>
        </div>
        <div className="setting-card">
          <div className="setting-copy">
            <div className="setting-title">Clipboard preview</div>
            <div className="setting-sub">
              {state.globalPreviewEnabled
                ? 'Show a small popup after copy'
                : 'Disabled globally'}
            </div>
          </div>
          <button
            className={`toggle-btn small ${state.previewEnabled ? 'on' : 'off'}`}
            onClick={handlePreviewToggle}
            disabled={state.loading || !state.enabled || !state.globalPreviewEnabled}
            aria-label={state.previewEnabled ? 'Disable preview' : 'Enable preview'}
          >
            <div className="toggle-thumb" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="popup-footer">
        <span>Setting applies to <strong>{state.hostname || 'this site'}</strong> only</span>
      </div>
    </div>
  )
}

export default App
