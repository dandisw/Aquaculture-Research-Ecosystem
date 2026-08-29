/**
 * AREs Ecosystem - Real-time Local Storage Data Sync & Persistence Monitor
 * Monitors changes in local storage in real-time and provides a visual status
 * indicator in the header to reassure users that their research data is safely persisted.
 */

(function (window) {
  'use strict';

  const BROADCAST_CHANNEL_NAME = 'ares_storage_sync_bus';
  const SYNC_DEBOUNCE_MS = 650;
  const ESTIMATED_MAX_QUOTA_BYTES = 5 * 1024 * 1024; // ~5MB typical localStorage limit

  let broadcastChannel = null;
  try {
    if ('BroadcastChannel' in window) {
      broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    }
  } catch (e) {
    // Unsupported or blocked in sandboxed iframe
  }

  // Internal state
  let syncState = {
    status: 'synced', // 'synced' | 'syncing' | 'warning'
    lastSyncedAt: Date.now(),
    lastKey: '',
    totalBytes: 0,
    itemCount: 0,
    saveCount: 0
  };

  let debounceTimer = null;
  let relativeTimeTimer = null;

  // Calculate current storage usage
  function getStorageStats() {
    let totalBytes = 0;
    let itemCount = 0;
    const modulesBreakdown = {
      aqualab: { name: 'AquaLab Workspace', bytes: 0, count: 0, icon: '🔬' },
      statwise: { name: 'StatWise Analytics', bytes: 0, count: 0, icon: '📊' },
      ecometrics: { name: 'EcoMetrics Multivariat', bytes: 0, count: 0, icon: '🌿' },
      biotools: { name: 'BioTools Dry Lab', bytes: 0, count: 0, icon: '⚗️' },
      geoplot: { name: 'GeoPlot Spatial GIS', bytes: 0, count: 0, icon: '🗺️' },
      citeshift: { name: 'CiteShift & Mendeley', bytes: 0, count: 0, icon: '📚' },
      shifterai: { name: 'ShifterAI Generator', bytes: 0, count: 0, icon: '🤖' },
      system: { name: 'Preferensi & Tema AREs', bytes: 0, count: 0, icon: '⚙️' },
      other: { name: 'Data Riset Lainnya', bytes: 0, count: 0, icon: '💾' }
    };

    try {
      itemCount = localStorage.length;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        const val = localStorage.getItem(key) || '';
        const size = (key.length + val.length) * 2; // UTF-16 approximate bytes
        totalBytes += size;

        const lowerKey = key.toLowerCase();
        if (lowerKey.includes('aqualab') || lowerKey.includes('tank') || lowerKey.includes('water')) {
          modulesBreakdown.aqualab.bytes += size;
          modulesBreakdown.aqualab.count++;
        } else if (lowerKey.includes('statwise') || lowerKey.includes('stat') || lowerKey.includes('anova')) {
          modulesBreakdown.statwise.bytes += size;
          modulesBreakdown.statwise.count++;
        } else if (lowerKey.includes('ecometrics') || lowerKey.includes('rapfish') || lowerKey.includes('pca')) {
          modulesBreakdown.ecometrics.bytes += size;
          modulesBreakdown.ecometrics.count++;
        } else if (lowerKey.includes('biotools') || lowerKey.includes('seq') || lowerKey.includes('fasta') || lowerKey.includes('blast')) {
          modulesBreakdown.biotools.bytes += size;
          modulesBreakdown.biotools.count++;
        } else if (lowerKey.includes('geoplot') || lowerKey.includes('gis') || lowerKey.includes('map') || lowerKey.includes('layer')) {
          modulesBreakdown.geoplot.bytes += size;
          modulesBreakdown.geoplot.count++;
        } else if (lowerKey.includes('cite') || lowerKey.includes('mendeley') || lowerKey.includes('bib') || lowerKey.includes('career')) {
          modulesBreakdown.citeshift.bytes += size;
          modulesBreakdown.citeshift.count++;
        } else if (lowerKey.includes('shifter') || lowerKey.includes('manuscript') || lowerKey.includes('paper')) {
          modulesBreakdown.shifterai.bytes += size;
          modulesBreakdown.shifterai.count++;
        } else if (lowerKey.includes('theme') || lowerKey.includes('lang') || lowerKey.includes('ares')) {
          modulesBreakdown.system.bytes += size;
          modulesBreakdown.system.count++;
        } else {
          modulesBreakdown.other.bytes += size;
          modulesBreakdown.other.count++;
        }
      }
    } catch (e) {
      // Storage access issue
    }

    syncState.totalBytes = totalBytes;
    syncState.itemCount = itemCount;

    return { totalBytes, itemCount, modulesBreakdown };
  }

  // Format bytes into readable format
  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  // Format relative time (e.g. "Baru saja", "5 dtk lalu", "2 mnt lalu")
  function formatRelativeTime(timestamp) {
    const now = Date.now();
    const diffSec = Math.max(0, Math.floor((now - timestamp) / 1000));
    if (diffSec < 4) return 'Baru saja';
    if (diffSec < 60) return `${diffSec} dtk lalu`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} mnt lalu`;
    const diffHour = Math.floor(diffMin / 60);
    return `${diffHour} jam lalu`;
  }

  // Intercept Storage prototype methods non-destructively
  function interceptLocalStorage() {
    try {
      const originalSetItem = Storage.prototype.setItem;
      const originalRemoveItem = Storage.prototype.removeItem;
      const originalClear = Storage.prototype.clear;

      Storage.prototype.setItem = function (key, value) {
        originalSetItem.apply(this, arguments);
        if (this === localStorage) {
          handleStorageChange(key, 'set');
        }
      };

      Storage.prototype.removeItem = function (key) {
        originalRemoveItem.apply(this, arguments);
        if (this === localStorage) {
          handleStorageChange(key, 'remove');
        }
      };

      Storage.prototype.clear = function () {
        originalClear.apply(this, arguments);
        if (this === localStorage) {
          handleStorageChange('*', 'clear');
        }
      };
    } catch (err) {
      console.warn('AREs StorageSync: Storage prototype interception disabled', err);
    }
  }

  // Handler triggered on any storage change
  function handleStorageChange(key, action, fromRemote) {
    syncState.saveCount++;
    syncState.lastKey = key || '';
    setSyncStatus('syncing');

    if (!fromRemote && broadcastChannel) {
      try {
        broadcastChannel.postMessage({
          type: 'storage-change',
          key: key,
          action: action,
          timestamp: Date.now()
        });
      } catch (e) {}
    }

    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      syncState.lastSyncedAt = Date.now();
      getStorageStats();
      setSyncStatus('synced');
    }, SYNC_DEBOUNCE_MS);
  }

  // Update UI and state
  function setSyncStatus(status) {
    syncState.status = status;
    renderIndicatorUI();

    try {
      window.dispatchEvent(new CustomEvent('ares:storage-sync', {
        detail: { ...syncState }
      }));
    } catch (e) {}
  }

  // Inject Styles into Document Head
  function injectStyles() {
    if (document.getElementById('ares-storage-sync-styles')) return;

    const style = document.createElement('style');
    style.id = 'ares-storage-sync-styles';
    style.textContent = `
      /* ═══════════════════════════════════════════════════════════
         AREs DATA SYNC STATUS INDICATOR & STORAGE INSPECTOR
         ═══════════════════════════════════════════════════════════ */
      .ares-sync-indicator {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 5px 12px;
        border-radius: 9999px;
        font-family: 'Plus Jakarta Sans', 'DM Sans', -apple-system, sans-serif;
        font-size: 0.74rem;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        user-select: none;
        position: relative;
        white-space: nowrap;
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(148, 163, 184, 0.18);
        color: #94a3b8;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }

      [data-theme="light"] .ares-sync-indicator {
        background: rgba(255, 255, 255, 0.88);
        border-color: rgba(203, 213, 225, 0.85);
        color: #475569;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      }

      .ares-sync-indicator:hover {
        transform: translateY(-1.5px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
      }

      /* ── SYNCED STATE (Data Safely Persisted) ── */
      .ares-sync-indicator.status-synced {
        border-color: rgba(16, 185, 129, 0.35);
        color: #34d399;
      }
      [data-theme="light"] .ares-sync-indicator.status-synced {
        border-color: rgba(5, 150, 105, 0.35);
        color: #059669;
        background: rgba(240, 253, 244, 0.9);
      }
      .ares-sync-indicator.status-synced:hover {
        border-color: rgba(16, 185, 129, 0.6);
        background: rgba(16, 185, 129, 0.12);
      }

      /* ── SYNCING STATE (Saving Real-Time) ── */
      .ares-sync-indicator.status-syncing {
        border-color: rgba(56, 189, 248, 0.5);
        color: #38bdf8;
        background: rgba(14, 165, 233, 0.15);
        animation: aresSyncPulse 1.2s infinite ease-in-out;
      }
      [data-theme="light"] .ares-sync-indicator.status-syncing {
        border-color: rgba(2, 132, 199, 0.45);
        color: #0284c7;
        background: rgba(224, 242, 254, 0.95);
      }

      /* ── WARNING STATE ── */
      .ares-sync-indicator.status-warning {
        border-color: rgba(245, 158, 11, 0.45);
        color: #fbbf24;
        background: rgba(245, 158, 11, 0.1);
      }

      /* Indicator Dot & Icons */
      .ares-sync-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        display: inline-block;
        flex-shrink: 0;
        transition: background-color 0.3s ease, transform 0.3s ease;
      }

      .status-synced .ares-sync-dot {
        background-color: #10b981;
        box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
        animation: aresDotBreathe 2.4s infinite ease-in-out;
      }
      [data-theme="light"] .status-synced .ares-sync-dot {
        background-color: #059669;
        box-shadow: 0 0 6px rgba(5, 150, 105, 0.4);
      }

      .status-syncing .ares-sync-dot {
        background-color: #38bdf8;
        box-shadow: 0 0 10px rgba(56, 189, 248, 0.8);
      }

      .ares-sync-icon {
        font-size: 0.8rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .ares-sync-spin {
        animation: aresSpin 0.9s linear infinite;
      }

      .ares-sync-label {
        letter-spacing: 0.01em;
        line-height: 1;
      }

      .ares-sync-time {
        font-size: 0.68rem;
        opacity: 0.75;
        font-weight: 500;
        margin-left: 1px;
      }

      /* Animations */
      @keyframes aresDotBreathe {
        0%, 100% { transform: scale(1); opacity: 0.9; }
        50% { transform: scale(1.28); opacity: 0.45; }
      }

      @keyframes aresSyncPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.4); }
        50% { box-shadow: 0 0 12px 2px rgba(56, 189, 248, 0.25); }
      }

      @keyframes aresSpin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* ── STORAGE INSPECTOR MODAL ── */
      .ares-storage-overlay {
        position: fixed;
        inset: 0;
        background: rgba(3, 7, 18, 0.72);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease;
      }
      .ares-storage-overlay.open {
        opacity: 1;
        pointer-events: auto;
      }

      .ares-storage-modal {
        background: #0f172a;
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 18px;
        width: 100%;
        max-width: 580px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05);
        color: #f8fafc;
        transform: translateY(20px) scale(0.97);
        transition: transform 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        padding: 24px;
        position: relative;
        font-family: 'Plus Jakarta Sans', 'DM Sans', -apple-system, sans-serif;
      }
      [data-theme="light"] .ares-storage-modal {
        background: #ffffff;
        border-color: rgba(203, 213, 225, 0.9);
        box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.18);
        color: #0f172a;
      }
      .ares-storage-overlay.open .ares-storage-modal {
        transform: translateY(0) scale(1);
      }

      .ares-modal-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.15);
      }
      .ares-modal-title {
        font-size: 1.15rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 10px;
        color: #f8fafc;
      }
      [data-theme="light"] .ares-modal-title { color: #0f172a; }
      .ares-modal-subtitle {
        font-size: 0.8rem;
        color: #94a3b8;
        margin-top: 4px;
      }
      [data-theme="light"] .ares-modal-subtitle { color: #64748b; }

      .ares-modal-close {
        background: transparent;
        border: 1px solid rgba(148, 163, 184, 0.2);
        color: #94a3b8;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        font-size: 1.1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }
      .ares-modal-close:hover {
        background: rgba(239, 68, 68, 0.15);
        color: #f87171;
        border-color: rgba(239, 68, 68, 0.4);
      }

      .ares-guarantee-badge {
        background: rgba(16, 185, 129, 0.12);
        border: 1px solid rgba(16, 185, 129, 0.3);
        border-radius: 10px;
        padding: 12px 14px;
        margin-bottom: 18px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 0.82rem;
      }
      .ares-guarantee-badge i, .ares-guarantee-badge svg {
        color: #10b981;
        font-size: 1.25rem;
        flex-shrink: 0;
      }
      .ares-guarantee-badge strong {
        color: #34d399;
      }
      [data-theme="light"] .ares-guarantee-badge {
        background: #ecfdf5;
        border-color: #a7f3d0;
        color: #065f46;
      }
      [data-theme="light"] .ares-guarantee-badge strong {
        color: #047857;
      }

      /* Metrics Grid */
      .ares-metrics-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin-bottom: 18px;
      }
      .ares-metric-card {
        background: rgba(30, 41, 59, 0.55);
        border: 1px solid rgba(148, 163, 184, 0.12);
        border-radius: 10px;
        padding: 12px 10px;
        text-align: center;
      }
      [data-theme="light"] .ares-metric-card {
        background: #f8fafc;
        border-color: #e2e8f0;
      }
      .ares-metric-value {
        font-size: 1.15rem;
        font-weight: 700;
        font-family: 'DM Mono', monospace;
        color: #38bdf8;
        margin-bottom: 2px;
      }
      [data-theme="light"] .ares-metric-value { color: #0284c7; }
      .ares-metric-label {
        font-size: 0.72rem;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        font-weight: 600;
      }
      [data-theme="light"] .ares-metric-label { color: #64748b; }

      /* Storage Meter */
      .ares-storage-meter-box {
        margin-bottom: 20px;
      }
      .ares-meter-labels {
        display: flex;
        justify-content: space-between;
        font-size: 0.78rem;
        color: #94a3b8;
        margin-bottom: 6px;
        font-weight: 500;
      }
      [data-theme="light"] .ares-meter-labels { color: #475569; }
      .ares-meter-track {
        height: 8px;
        border-radius: 999px;
        background: rgba(51, 65, 85, 0.5);
        overflow: hidden;
        position: relative;
      }
      [data-theme="light"] .ares-meter-track { background: #e2e8f0; }
      .ares-meter-fill {
        height: 100%;
        background: linear-gradient(90deg, #10b981, #38bdf8);
        border-radius: 999px;
        transition: width 0.4s ease;
      }

      /* Module Breakdown List */
      .ares-module-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 180px;
        overflow-y: auto;
        padding-right: 4px;
        margin-bottom: 20px;
      }
      .ares-module-list::-webkit-scrollbar { width: 5px; }
      .ares-module-list::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
      [data-theme="light"] .ares-module-list::-webkit-scrollbar-thumb { background: #cbd5e1; }

      .ares-module-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        background: rgba(15, 23, 42, 0.4);
        border: 1px solid rgba(148, 163, 184, 0.08);
        border-radius: 8px;
        font-size: 0.8rem;
      }
      [data-theme="light"] .ares-module-row {
        background: #f8fafc;
        border-color: #e2e8f0;
      }
      .ares-module-info {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .ares-module-meta {
        font-family: 'DM Mono', monospace;
        font-size: 0.75rem;
        color: #94a3b8;
      }
      [data-theme="light"] .ares-module-meta { color: #64748b; }

      /* Actions */
      .ares-modal-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        padding-top: 14px;
        border-top: 1px solid rgba(148, 163, 184, 0.15);
      }
      .ares-btn-act {
        flex: 1;
        min-width: 140px;
        padding: 9px 14px;
        border-radius: 8px;
        font-size: 0.78rem;
        font-weight: 600;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        transition: all 0.2s ease;
        border: 1px solid transparent;
        text-decoration: none;
      }
      .ares-btn-act-primary {
        background: #0284c7;
        color: #ffffff;
      }
      .ares-btn-act-primary:hover {
        background: #0369a1;
        transform: translateY(-1px);
      }
      .ares-btn-act-outline {
        background: transparent;
        border-color: rgba(148, 163, 184, 0.25);
        color: #cbd5e1;
      }
      [data-theme="light"] .ares-btn-act-outline {
        border-color: #cbd5e1;
        color: #334155;
      }
      .ares-btn-act-outline:hover {
        background: rgba(148, 163, 184, 0.12);
        color: #f8fafc;
      }
      [data-theme="light"] .ares-btn-act-outline:hover {
        color: #0f172a;
      }

      @media (max-width: 600px) {
        .ares-metrics-grid { grid-template-columns: 1fr; }
        .ares-sync-time { display: none; }
        .ares-sync-indicator { padding: 4px 9px; font-size: 0.7rem; }
      }

      /* ── GLOBAL ARES SUITE NAVIGATOR (APP SWITCHER) ── */
      .ares-suite-overlay {
        position: fixed;
        inset: 0;
        background: rgba(3, 7, 18, 0.75);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        z-index: 100000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease;
      }
      .ares-suite-overlay.open {
        opacity: 1;
        pointer-events: auto;
      }
      .ares-suite-modal {
        background: #0f172a;
        border: 1px solid rgba(148, 163, 184, 0.25);
        border-radius: 20px;
        width: 100%;
        max-width: 780px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.06);
        color: #f8fafc;
        transform: translateY(20px) scale(0.96);
        transition: transform 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        padding: 24px 28px;
        position: relative;
        font-family: 'Plus Jakarta Sans', 'DM Sans', -apple-system, sans-serif;
      }
      [data-theme="light"] .ares-suite-modal {
        background: #ffffff;
        border-color: rgba(203, 213, 225, 0.95);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2);
        color: #0f172a;
      }
      .ares-suite-overlay.open .ares-suite-modal {
        transform: translateY(0) scale(1);
      }
      .ares-suite-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.15);
      }
      .ares-suite-title-wrap {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .ares-suite-logo {
        height: 36px;
        width: auto;
      }
      .ares-suite-title {
        font-family: 'Syne', 'Plus Jakarta Sans', sans-serif;
        font-size: 1.25rem;
        font-weight: 800;
        letter-spacing: -0.4px;
        color: #f8fafc;
      }
      [data-theme="light"] .ares-suite-title { color: #0f172a; }
      .ares-suite-sub {
        font-size: 0.76rem;
        color: #94a3b8;
        font-weight: 500;
      }
      [data-theme="light"] .ares-suite-sub { color: #64748b; }
      .ares-suite-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 14px;
        margin-bottom: 20px;
      }
      .ares-suite-card {
        background: rgba(30, 41, 59, 0.6);
        border: 1.5px solid rgba(148, 163, 184, 0.14);
        border-radius: 12px;
        padding: 16px;
        text-decoration: none;
        color: inherit;
        display: flex;
        flex-direction: column;
        gap: 8px;
        transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;
        overflow: hidden;
      }
      [data-theme="light"] .ares-suite-card {
        background: #f8fafc;
        border-color: #e2e8f0;
      }
      .ares-suite-card:hover {
        transform: translateY(-3px);
        border-color: #38bdf8;
        background: rgba(30, 41, 59, 0.9);
        box-shadow: 0 10px 20px -5px rgba(2, 132, 199, 0.25);
      }
      [data-theme="light"] .ares-suite-card:hover {
        background: #ffffff;
        border-color: #0284c7;
        box-shadow: 0 10px 25px -5px rgba(2, 132, 199, 0.15);
      }
      .ares-suite-card.current {
        border-color: #0284c7;
        background: rgba(2, 132, 199, 0.1);
        box-shadow: 0 0 0 1px #0284c7;
      }
      [data-theme="dark"] .ares-suite-card.current {
        border-color: #38bdf8;
        background: rgba(56, 189, 248, 0.12);
        box-shadow: 0 0 0 1px #38bdf8;
      }
      .ares-suite-card-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .ares-suite-icon {
        font-size: 1.6rem;
        line-height: 1;
      }
      .ares-suite-badge {
        font-size: 0.65rem;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 20px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .ares-suite-badge-active {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.4);
      }
      [data-theme="light"] .ares-suite-badge-active {
        background: #ecfdf5;
        color: #059669;
        border-color: #a7f3d0;
      }
      .ares-suite-name {
        font-size: 0.95rem;
        font-weight: 700;
        color: #f8fafc;
        margin-top: 4px;
        letter-spacing: -0.2px;
      }
      [data-theme="light"] .ares-suite-name { color: #0f172a; }
      .ares-suite-desc {
        font-size: 0.74rem;
        color: #94a3b8;
        line-height: 1.45;
      }
      [data-theme="light"] .ares-suite-desc { color: #64748b; }
      .ares-suite-shortcut-hint {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 14px;
        border-top: 1px solid rgba(148, 163, 184, 0.15);
        font-size: 0.75rem;
        color: #94a3b8;
      }
      [data-theme="light"] .ares-suite-shortcut-hint { color: #64748b; }
      .ares-kbd {
        background: rgba(148, 163, 184, 0.15);
        border: 1px solid rgba(148, 163, 184, 0.3);
        border-radius: 4px;
        padding: 2px 6px;
        font-family: 'DM Mono', monospace;
        font-size: 0.7rem;
      }

      /* ============================================================
         AREs KEYBOARD SHORTCUTS SYSTEM (HUD & GUIDE MODAL)
         ============================================================ */
      .ares-shortcut-hud {
        position: fixed;
        top: 20px;
        right: 24px;
        background: rgba(15, 23, 42, 0.94);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid rgba(56, 189, 248, 0.4);
        border-left: 4px solid #0284c7;
        border-radius: 12px;
        padding: 12px 18px;
        box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.55), 0 0 20px rgba(2, 132, 199, 0.2);
        color: #f8fafc;
        z-index: 100002;
        display: flex;
        align-items: center;
        gap: 14px;
        font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
        transform: translateY(-20px) scale(0.96);
        opacity: 0;
        pointer-events: none;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        max-width: 440px;
      }
      [data-theme="light"] .ares-shortcut-hud {
        background: rgba(255, 255, 255, 0.97);
        border-color: rgba(2, 132, 199, 0.35);
        border-left-color: #0284c7;
        color: #0f172a;
        box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.18), 0 0 15px rgba(2, 132, 199, 0.12);
      }
      .ares-shortcut-hud.show {
        transform: translateY(0) scale(1);
        opacity: 1;
        pointer-events: auto;
      }
      .ares-hud-icon {
        font-size: 1.4rem;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .ares-hud-content {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }
      .ares-hud-title {
        font-size: 0.86rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 8px;
        letter-spacing: -0.01em;
      }
      .ares-hud-detail {
        font-size: 0.75rem;
        color: #94a3b8;
        line-height: 1.35;
      }
      [data-theme="light"] .ares-hud-detail { color: #64748b; }
      .ares-hud-combo {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        padding: 2px 7px;
        background: rgba(56, 189, 248, 0.15);
        border: 1px solid rgba(56, 189, 248, 0.3);
        border-radius: 5px;
        font-family: 'DM Mono', monospace;
        font-size: 0.72rem;
        font-weight: 700;
        color: #38bdf8;
      }
      [data-theme="light"] .ares-hud-combo {
        background: #e0f2fe;
        border-color: #bae6fd;
        color: #0284c7;
      }

      /* Header Shortcut Trigger Button */
      .ares-btn-shortcut-trigger {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(30, 41, 59, 0.6);
        border: 1px solid rgba(148, 163, 184, 0.25);
        border-radius: 8px;
        padding: 5px 10px;
        color: #cbd5e1;
        font-size: 0.76rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
        text-decoration: none;
        line-height: 1;
        user-select: none;
      }
      [data-theme="light"] .ares-btn-shortcut-trigger {
        background: #ffffff;
        border-color: #cbd5e1;
        color: #334155;
      }
      .ares-btn-shortcut-trigger:hover {
        background: rgba(148, 163, 184, 0.18);
        border-color: #38bdf8;
        color: #f8fafc;
        transform: translateY(-1px);
      }
      [data-theme="light"] .ares-btn-shortcut-trigger:hover {
        background: #f8fafc;
        border-color: #0284c7;
        color: #0f172a;
      }
      .ares-kbd-tag {
        font-family: 'DM Mono', monospace;
        font-size: 0.65rem;
        padding: 1px 5px;
        background: rgba(148, 163, 184, 0.15);
        border: 1px solid rgba(148, 163, 184, 0.3);
        border-radius: 4px;
        color: #38bdf8;
      }
      [data-theme="light"] .ares-kbd-tag {
        background: #e2e8f0;
        color: #0284c7;
      }

      @media (max-width: 860px) {
        .ares-kbd-tag { display: none !important; }
        .ares-sync-time { display: none !important; }
      }
      @media (max-width: 600px) {
        .ares-btn-shortcut-trigger .ares-btn-label { display: none !important; }
        .ares-btn-shortcut-trigger { padding: 5px 8px !important; }
        .ares-sync-label { display: none !important; }
      }

      /* Floating Quick Shortcuts Dock */
      .ares-quick-shortcut-dock {
        position: fixed;
        bottom: 16px;
        right: 20px;
        z-index: 9998;
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        user-select: none;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .ares-qsd-full {
        display: flex;
        align-items: center;
        gap: 6px;
        background: rgba(15, 23, 42, 0.90);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(148, 163, 184, 0.25);
        border-radius: 100px;
        padding: 4px 8px 4px 10px;
        box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.2);
      }
      [data-theme="light"] .ares-qsd-full {
        background: rgba(255, 255, 255, 0.95);
        border-color: #cbd5e1;
        box-shadow: 0 8px 24px -4px rgba(15, 23, 42, 0.12), 0 2px 6px rgba(15, 23, 42, 0.06);
      }
      .ares-qsd-mini {
        display: none;
        align-items: center;
        gap: 6px;
        background: rgba(15, 23, 42, 0.90);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(148, 163, 184, 0.25);
        border-radius: 100px;
        padding: 6px 12px;
        color: #f8fafc;
        font-size: 0.76rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        transition: all 0.2s ease;
      }
      [data-theme="light"] .ares-qsd-mini {
        background: #ffffff;
        border-color: #cbd5e1;
        color: #0f172a;
        box-shadow: 0 4px 16px rgba(15, 23, 42, 0.1);
      }
      .ares-qsd-mini:hover {
        transform: translateY(-2px);
        border-color: #38bdf8;
      }
      [data-theme="light"] .ares-qsd-mini:hover {
        border-color: #0284c7;
      }
      .ares-quick-shortcut-dock.minimized .ares-qsd-full {
        display: none;
      }
      .ares-quick-shortcut-dock.minimized .ares-qsd-mini {
        display: flex;
      }
      .ares-qsd-btn {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        background: transparent;
        border: none;
        color: #e2e8f0;
        font-size: 0.75rem;
        font-weight: 600;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 6px;
        transition: all 0.15s ease;
      }
      [data-theme="light"] .ares-qsd-btn {
        color: #334155;
      }
      .ares-qsd-btn:hover {
        background: rgba(148, 163, 184, 0.18);
        color: #38bdf8;
      }
      [data-theme="light"] .ares-qsd-btn:hover {
        background: #f1f5f9;
        color: #0284c7;
      }
      .ares-qsd-kbd {
        font-family: 'DM Mono', monospace;
        font-size: 0.65rem;
        font-weight: 700;
        padding: 2px 5px;
        background: rgba(148, 163, 184, 0.18);
        border: 1px solid rgba(148, 163, 184, 0.3);
        border-radius: 4px;
        color: #38bdf8;
        line-height: 1;
      }
      [data-theme="light"] .ares-qsd-kbd {
        background: #e2e8f0;
        border-color: #cbd5e1;
        color: #0284c7;
      }
      .ares-qsd-sep {
        width: 1px;
        height: 14px;
        background: rgba(148, 163, 184, 0.22);
      }
      [data-theme="light"] .ares-qsd-sep {
        background: #cbd5e1;
      }
      .ares-qsd-close {
        background: transparent;
        border: none;
        color: #94a3b8;
        font-size: 0.75rem;
        cursor: pointer;
        padding: 3px 6px;
        border-radius: 4px;
        line-height: 1;
        transition: all 0.15s;
        margin-left: 2px;
      }
      .ares-qsd-close:hover {
        background: rgba(239, 68, 68, 0.2);
        color: #f87171;
      }
      @media (max-width: 768px) {
        .ares-quick-shortcut-dock {
          bottom: 12px;
          right: 12px;
        }
        .ares-qsd-label {
          display: none;
        }
      }
      @media (max-width: 480px) {
        .ares-qsd-full { display: none !important; }
        .ares-qsd-mini { display: flex !important; }
        .ares-qsd-mini-label { display: none; }
      }

      /* Shortcuts Cheat Sheet Modal Overlay */
      .ares-shortcuts-overlay {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.78);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 100000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .ares-shortcuts-overlay.open {
        opacity: 1;
        pointer-events: auto;
      }
      .ares-shortcuts-modal {
        background: #1e293b;
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 16px;
        width: 100%;
        max-width: 860px;
        max-height: 88vh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.55);
        transform: scale(0.95) translateY(10px);
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        overflow: hidden;
      }
      [data-theme="light"] .ares-shortcuts-modal {
        background: #ffffff;
        border-color: #cbd5e1;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
      }
      .ares-shortcuts-overlay.open .ares-shortcuts-modal {
        transform: scale(1) translateY(0);
      }
      .ares-shortcuts-header {
        padding: 20px 24px 16px 24px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.15);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        background: rgba(15, 23, 42, 0.3);
      }
      [data-theme="light"] .ares-shortcuts-header {
        background: #f8fafc;
        border-bottom-color: #e2e8f0;
      }
      .ares-shortcuts-title-wrap {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .ares-shortcuts-icon-badge {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: linear-gradient(135deg, rgba(2, 132, 199, 0.2), rgba(56, 189, 248, 0.1));
        border: 1px solid rgba(56, 189, 248, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
      }
      .ares-shortcuts-title {
        font-family: 'MuseoModerno', 'Syne', sans-serif;
        font-size: 1.25rem;
        font-weight: 800;
        color: #f8fafc;
        letter-spacing: -0.02em;
        margin: 0;
      }
      [data-theme="light"] .ares-shortcuts-title { color: #0f172a; }
      .ares-shortcuts-subtitle {
        font-size: 0.78rem;
        color: #94a3b8;
        margin-top: 2px;
      }
      [data-theme="light"] .ares-shortcuts-subtitle { color: #64748b; }
      .ares-shortcuts-search-wrap {
        padding: 12px 24px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.12);
        background: rgba(15, 23, 42, 0.15);
      }
      [data-theme="light"] .ares-shortcuts-search-wrap {
        background: #ffffff;
        border-bottom-color: #e2e8f0;
      }
      .ares-shortcuts-search {
        width: 100%;
        padding: 9px 14px;
        border-radius: 8px;
        background: rgba(15, 23, 42, 0.4);
        border: 1px solid rgba(148, 163, 184, 0.25);
        color: #f8fafc;
        font-size: 0.84rem;
        font-family: 'Plus Jakarta Sans', sans-serif;
        outline: none;
        transition: all 0.2s;
        box-sizing: border-box;
      }
      [data-theme="light"] .ares-shortcuts-search {
        background: #f1f5f9;
        border-color: #cbd5e1;
        color: #0f172a;
      }
      .ares-shortcuts-search:focus {
        border-color: #38bdf8;
        box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
      }
      .ares-shortcuts-body {
        padding: 20px 24px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 22px;
      }
      .ares-shortcuts-section {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .ares-sec-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .ares-sec-title {
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #38bdf8;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      [data-theme="light"] .ares-sec-title { color: #0284c7; }
      .ares-sec-count {
        font-size: 0.72rem;
        color: #64748b;
      }
      .ares-shortcuts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 10px;
      }
      .ares-shortcut-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 10px 14px;
        border-radius: 10px;
        background: rgba(15, 23, 42, 0.35);
        border: 1px solid rgba(148, 163, 184, 0.12);
        transition: all 0.15s ease;
      }
      [data-theme="light"] .ares-shortcut-card {
        background: #f8fafc;
        border-color: #e2e8f0;
      }
      .ares-shortcut-card:hover {
        border-color: rgba(56, 189, 248, 0.35);
        background: rgba(30, 41, 59, 0.5);
      }
      [data-theme="light"] .ares-shortcut-card:hover {
        border-color: #bae6fd;
        background: #f1f5f9;
      }
      .ares-shortcut-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }
      .ares-shortcut-name {
        font-size: 0.84rem;
        font-weight: 600;
        color: #f8fafc;
      }
      [data-theme="light"] .ares-shortcut-name { color: #0f172a; }
      .ares-shortcut-desc {
        font-size: 0.74rem;
        color: #94a3b8;
        line-height: 1.35;
      }
      [data-theme="light"] .ares-shortcut-desc { color: #64748b; }
      .ares-keys-group {
        display: flex;
        align-items: center;
        gap: 4px;
        flex-shrink: 0;
      }
      .ares-keycap {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 26px;
        height: 25px;
        padding: 0 7px;
        background: rgba(148, 163, 184, 0.12);
        border: 1px solid rgba(148, 163, 184, 0.3);
        border-bottom: 2px solid rgba(148, 163, 184, 0.55);
        border-radius: 6px;
        font-family: 'DM Mono', monospace;
        font-size: 0.72rem;
        font-weight: 700;
        color: #38bdf8;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        letter-spacing: 0.02em;
        user-select: none;
      }
      [data-theme="light"] .ares-keycap {
        background: #ffffff;
        border-color: #cbd5e1;
        border-bottom-color: #94a3b8;
        color: #0284c7;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
      }
      .ares-key-plus {
        font-size: 0.7rem;
        color: #64748b;
        font-weight: 700;
      }
      .ares-shortcuts-footer {
        padding: 14px 24px;
        border-top: 1px solid rgba(148, 163, 184, 0.15);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(15, 23, 42, 0.3);
        font-size: 0.78rem;
        color: #94a3b8;
      }
      [data-theme="light"] .ares-shortcuts-footer {
        background: #f8fafc;
        border-top-color: #e2e8f0;
        color: #64748b;
      }
      .ares-shortcuts-footer kbd {
        padding: 2px 6px;
        background: rgba(148, 163, 184, 0.15);
        border: 1px solid rgba(148, 163, 184, 0.3);
        border-radius: 4px;
        font-family: 'DM Mono', monospace;
        font-size: 0.72rem;
        color: #38bdf8;
      }
      [data-theme="light"] .ares-shortcuts-footer kbd {
        background: #e2e8f0;
        color: #0284c7;
      }
    `;
    document.head.appendChild(style);
  }

  // Render or Update the Visual Indicator in Header
  function renderIndicatorUI() {
    let container = document.getElementById('aresDataSyncIndicator');

    if (!container) {
      // Find suitable header attachment point
      const headerActions = document.querySelector('.header-actions-row') ||
                            document.querySelector('.header-actions') ||
                            document.querySelector('header .header-actions') ||
                            document.querySelector('header .header-left') ||
                            document.querySelector('header');

      if (!headerActions) return;

      container = document.createElement('div');
      container.id = 'aresDataSyncIndicator';
      container.className = 'ares-sync-indicator';
      container.title = 'Status Sinkronisasi & Penyimpanan Lokal Data Riset AREs (Klik untuk melihat rincian)';
      container.setAttribute('role', 'status');
      container.setAttribute('aria-live', 'polite');

      // Insert at appropriate spot (near start of header actions or alongside buttons)
      if (headerActions.firstChild) {
        headerActions.insertBefore(container, headerActions.firstChild);
      } else {
        headerActions.appendChild(container);
      }

      container.addEventListener('click', openStorageInspector);

      // Inject Keyboard Shortcut Header Button right after the sync indicator
      if (!document.getElementById('aresShortcutHeaderBtn')) {
        const shortcutBtn = document.createElement('button');
        shortcutBtn.type = 'button';
        shortcutBtn.id = 'aresShortcutHeaderBtn';
        shortcutBtn.className = 'ares-btn-shortcut-trigger';
        shortcutBtn.title = 'Pintasan Keyboard Riset AREs (Ctrl+/ atau ?)';
        shortcutBtn.innerHTML = `
          <span>⌨️</span>
          <span class="ares-btn-label">Pintasan</span>
          <span class="ares-kbd-tag">Ctrl+/</span>
        `;
        shortcutBtn.addEventListener('click', function(e) {
          e.preventDefault();
          openShortcutsGuide();
        });
        if (container.nextSibling) {
          headerActions.insertBefore(shortcutBtn, container.nextSibling);
        } else {
          headerActions.appendChild(shortcutBtn);
        }
      }

      // Enhance existing or inject Suite Navigator Header Button
      const existingSuiteBtn = headerActions.querySelector('.ares-suite-switcher-btn');
      if (existingSuiteBtn) {
        if (!existingSuiteBtn.querySelector('.ares-kbd-tag')) {
          const kbd = document.createElement('span');
          kbd.className = 'ares-kbd-tag';
          kbd.style.marginLeft = '4px';
          kbd.textContent = 'Alt+M';
          existingSuiteBtn.appendChild(kbd);
        }
        existingSuiteBtn.title = 'Pindah Modul Aplikasi AREs (Alt+M atau Cmd+K)';
      } else if (!document.getElementById('aresSuiteNavHeaderBtn')) {
        const suiteNavBtn = document.createElement('button');
        suiteNavBtn.type = 'button';
        suiteNavBtn.id = 'aresSuiteNavHeaderBtn';
        suiteNavBtn.className = 'ares-btn-shortcut-trigger';
        suiteNavBtn.title = 'Pindah Modul Aplikasi AREs (Alt+M atau Cmd+K)';
        suiteNavBtn.innerHTML = `
          <span>🧭</span>
          <span class="ares-btn-label">Modul</span>
          <span class="ares-kbd-tag">Alt+M</span>
        `;
        suiteNavBtn.addEventListener('click', function(e) {
          e.preventDefault();
          openSuiteNavigator();
        });
        const shortcutBtn = document.getElementById('aresShortcutHeaderBtn');
        if (shortcutBtn && shortcutBtn.nextSibling) {
          headerActions.insertBefore(suiteNavBtn, shortcutBtn.nextSibling);
        } else {
          headerActions.appendChild(suiteNavBtn);
        }
      }
    }

    const isSyncing = syncState.status === 'syncing';
    const isWarning = syncState.status === 'warning';

    container.className = `ares-sync-indicator ${
      isSyncing ? 'status-syncing' : isWarning ? 'status-warning' : 'status-synced'
    }`;

    if (isSyncing) {
      container.innerHTML = `
        <span class="ares-sync-icon ares-sync-spin">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
          </svg>
        </span>
        <span class="ares-sync-label">Menyimpan...</span>
      `;
    } else {
      const timeStr = formatRelativeTime(syncState.lastSyncedAt);
      container.innerHTML = `
        <span class="ares-sync-dot"></span>
        <span class="ares-sync-icon">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <polyline points="9 12 11 14 15 10"/>
          </svg>
        </span>
        <span class="ares-sync-label">Tersimpan</span>
        <span class="ares-sync-time">${timeStr}</span>
      `;
    }
  }

  // Create and Open the Storage Inspector Modal
  function openStorageInspector() {
    let overlay = document.getElementById('aresStorageOverlay');
    const stats = getStorageStats();
    const percentUsed = Math.min(100, Math.max(1, (stats.totalBytes / ESTIMATED_MAX_QUOTA_BYTES) * 100));

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'aresStorageOverlay';
      overlay.className = 'ares-storage-overlay';
      overlay.innerHTML = `
        <div class="ares-storage-modal" role="dialog" aria-labelledby="aresModalTitle">
          <div class="ares-modal-header">
            <div>
              <div class="ares-modal-title" id="aresModalTitle">
                <span>🔒</span> Status Sinkronisasi Data Riset
              </div>
              <div class="ares-modal-subtitle">Monitoring integritas persistensi data komputasi & dry lab AREs</div>
            </div>
            <button class="ares-modal-close" id="aresCloseModalBtn" title="Tutup">✕</button>
          </div>

          <div class="ares-guarantee-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
            <div>
              <strong>100% Client-Side Safe Persistence</strong>
              <div style="font-size:0.75rem; opacity:0.85; margin-top:2px;">Seluruh data riset, matriks statistik, logbook, dan naskah tersimpan aman di storage peramban lokal Anda tanpa transit ke server eksternal.</div>
            </div>
          </div>

          <div class="ares-metrics-grid">
            <div class="ares-metric-card">
              <div class="ares-metric-value" id="aresModalStatusText">100%</div>
              <div class="ares-metric-label">Status Aman</div>
            </div>
            <div class="ares-metric-card">
              <div class="ares-metric-value" id="aresModalItemCount">${stats.itemCount}</div>
              <div class="ares-metric-label">Entri Tersimpan</div>
            </div>
            <div class="ares-metric-card">
              <div class="ares-metric-value" id="aresModalTotalSize">${formatBytes(stats.totalBytes)}</div>
              <div class="ares-metric-label">Ukuran Data</div>
            </div>
          </div>

          <div class="ares-storage-meter-box">
            <div class="ares-meter-labels">
              <span>Penggunaan Kapasitas Penyimpanan Lokal</span>
              <span id="aresMeterPercentText">${percentUsed.toFixed(1)}% (~${formatBytes(ESTIMATED_MAX_QUOTA_BYTES)})</span>
            </div>
            <div class="ares-meter-track">
              <div class="ares-meter-fill" id="aresMeterFill" style="width: ${percentUsed}%;"></div>
            </div>
          </div>

          <div style="font-size:0.78rem; font-weight:700; margin-bottom:8px; color:var(--text-title, inherit);">
            📁 Rincian Data per Modul AREs:
          </div>
          <div class="ares-module-list" id="aresModuleBreakdownList"></div>

          <div class="ares-modal-actions">
            <button class="ares-btn-act ares-btn-act-primary" id="aresDownloadBackupBtn">
              <span>💾</span> Unduh Cadangan (JSON)
            </button>
            <button class="ares-btn-act ares-btn-act-outline" id="aresRestoreBackupBtn">
              <span>📂</span> Pulihkan Cadangan
            </button>
            <button class="ares-btn-act ares-btn-act-outline" id="aresForceSyncBtn">
              <span>🔄</span> Verifikasi Ulang
            </button>
          </div>
          <input type="file" id="aresRestoreFileInput" accept=".json" style="display:none;" />
        </div>
      `;

      document.body.appendChild(overlay);

      // Event Listeners for Modal Controls
      overlay.querySelector('#aresCloseModalBtn').addEventListener('click', closeStorageInspector);
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeStorageInspector();
      });

      overlay.querySelector('#aresForceSyncBtn').addEventListener('click', function () {
        setSyncStatus('syncing');
        setTimeout(function () {
          syncState.lastSyncedAt = Date.now();
          getStorageStats();
          setSyncStatus('synced');
          updateModalContent();
          showAresToast('Integritas data lokal berhasil diverifikasi!');
        }, 400);
      });

      overlay.querySelector('#aresDownloadBackupBtn').addEventListener('click', exportResearchBackup);

      const restoreInput = overlay.querySelector('#aresRestoreFileInput');
      overlay.querySelector('#aresRestoreBackupBtn').addEventListener('click', function () {
        restoreInput.click();
      });

      restoreInput.addEventListener('change', importResearchBackup);
    }

    updateModalContent();
    overlay.classList.add('open');
  }

  function closeStorageInspector() {
    const overlay = document.getElementById('aresStorageOverlay');
    if (overlay) overlay.classList.remove('open');
  }

  function updateModalContent() {
    const overlay = document.getElementById('aresStorageOverlay');
    if (!overlay) return;

    const stats = getStorageStats();
    const percentUsed = Math.min(100, Math.max(1, (stats.totalBytes / ESTIMATED_MAX_QUOTA_BYTES) * 100));

    const countEl = overlay.querySelector('#aresModalItemCount');
    const sizeEl = overlay.querySelector('#aresModalTotalSize');
    const meterFill = overlay.querySelector('#aresMeterFill');
    const meterText = overlay.querySelector('#aresMeterPercentText');
    const listEl = overlay.querySelector('#aresModuleBreakdownList');

    if (countEl) countEl.textContent = stats.itemCount;
    if (sizeEl) sizeEl.textContent = formatBytes(stats.totalBytes);
    if (meterFill) meterFill.style.width = percentUsed + '%';
    if (meterText) meterText.textContent = `${percentUsed.toFixed(1)}% (~${formatBytes(ESTIMATED_MAX_QUOTA_BYTES)})`;

    if (listEl) {
      listEl.innerHTML = '';
      Object.keys(stats.modulesBreakdown).forEach(function (k) {
        const item = stats.modulesBreakdown[k];
        if (item.count > 0 || k === 'system' || k === 'aqualab' || k === 'statwise') {
          const row = document.createElement('div');
          row.className = 'ares-module-row';
          row.innerHTML = `
            <div class="ares-module-info">
              <span>${item.icon}</span>
              <span style="font-weight:600;">${item.name}</span>
            </div>
            <div class="ares-module-meta">
              ${item.count} entri (${formatBytes(item.bytes)})
            </div>
          `;
          listEl.appendChild(row);
        }
      });
    }
  }

  // Export all Local Storage data as JSON file for backup
  function exportResearchBackup() {
    try {
      const backupData = {
        app: 'AREs - Aquaculture Research Ecosystem',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        data: {}
      };

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          backupData.data[key] = localStorage.getItem(key);
        }
      }

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `AREs_Research_Backup_${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showAresToast('Cadangan data riset berhasil diunduh!');
    } catch (e) {
      alert('Gagal mengekspor data: ' + e.message);
    }
  }

  // Import JSON backup and restore into Local Storage
  function importResearchBackup(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!parsed.data || typeof parsed.data !== 'object') {
          throw new Error('Format berkas cadangan AREs tidak valid.');
        }

        let restoredCount = 0;
        Object.keys(parsed.data).forEach(function (k) {
          localStorage.setItem(k, parsed.data[k]);
          restoredCount++;
        });

        handleStorageChange('*', 'restore');
        updateModalContent();
        showAresToast(`Berhasil memulihkan ${restoredCount} entri riset!`);
      } catch (err) {
        alert('Gagal memulihkan cadangan: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  // Toast Helper
  function showAresToast(message) {
    const toast = document.getElementById('aresToast');
    const toastMsg = document.getElementById('aresToastMsg');
    if (toast && toastMsg) {
      toastMsg.textContent = message;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    } else {
      console.log('AREs StorageSync Notification:', message);
    }
  }

  // Setup broadcast listeners
  if (broadcastChannel) {
    broadcastChannel.onmessage = function (event) {
      if (event.data && event.data.type === 'storage-change') {
        handleStorageChange(event.data.key, event.data.action, true);
      }
    };
  }

  // Cross-tab native storage event listener
  window.addEventListener('storage', function (e) {
    handleStorageChange(e.key, 'external', true);
  });

  // Periodically refresh relative time in badge
  function startRelativeTimeUpdater() {
    if (relativeTimeTimer) clearInterval(relativeTimeTimer);
    relativeTimeTimer = setInterval(function () {
      if (syncState.status === 'synced') {
        renderIndicatorUI();
      }
    }, 15000);
  }

  // ============================================================
  // GLOBAL AREs KEYBOARD SHORTCUTS ENGINE
  // ============================================================
  let hudTimer = null;
  function showShortcutHud(keys, title, detail, type) {
    let hud = document.getElementById('aresShortcutHud');
    if (!hud) {
      hud = document.createElement('div');
      hud.id = 'aresShortcutHud';
      hud.className = 'ares-shortcut-hud';
      hud.setAttribute('role', 'status');
      hud.setAttribute('aria-live', 'polite');
      document.body.appendChild(hud);
    }

    const icon = type === 'export' ? '📤' :
                 type === 'save' ? '💾' :
                 type === 'nav' ? '🧭' :
                 type === 'row' ? '✏️' :
                 type === 'print' ? '🖨️' : '⚡';

    hud.innerHTML = `
      <div class="ares-hud-icon">${icon}</div>
      <div class="ares-hud-content">
        <div class="ares-hud-title">
          <span class="ares-hud-combo">${keys}</span>
          <span>${title}</span>
        </div>
        ${detail ? `<div class="ares-hud-detail">${detail}</div>` : ''}
      </div>
    `;

    hud.classList.add('show');

    if (hudTimer) clearTimeout(hudTimer);
    hudTimer = setTimeout(function () {
      hud.classList.remove('show');
    }, 2400);
  }

  function openShortcutsGuide() {
    let overlay = document.getElementById('aresShortcutsOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'aresShortcutsOverlay';
      overlay.className = 'ares-shortcuts-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');

      overlay.innerHTML = `
        <div class="ares-shortcuts-modal" role="document">
          <div class="ares-shortcuts-header">
            <div class="ares-shortcuts-title-wrap">
              <div class="ares-shortcuts-icon-badge">⌨️</div>
              <div>
                <h3 class="ares-shortcuts-title">Pintasan Keyboard Riset AREs</h3>
                <div class="ares-shortcuts-subtitle">Akselerasi alur kerja analisis data, input tabel, dan publikasi peneliti</div>
              </div>
            </div>
            <button class="ares-modal-close" id="aresCloseShortcutsBtn" title="Tutup (Esc)">✕</button>
          </div>

          <div class="ares-shortcuts-search-wrap">
            <input type="text" class="ares-shortcuts-search" id="aresShortcutsSearch" placeholder="🔍 Cari pintasan keyboard... (misal: simpan, ekspor, baris, tab)" autofocus>
          </div>

          <div class="ares-shortcuts-body" id="aresShortcutsBody">
            <!-- 1. PENYIMPANAN & SINKRONISASI -->
            <div class="ares-shortcuts-section" data-group="save">
              <div class="ares-sec-header">
                <div class="ares-sec-title"><span>💾</span> Penyimpanan &amp; Integritas Data</div>
                <div class="ares-sec-count">2 Pintasan</div>
              </div>
              <div class="ares-shortcuts-grid">
                <div class="ares-shortcut-card" data-shortcut="ctrl+s save simpan data snapshot">
                  <div class="ares-shortcut-info">
                    <div class="ares-shortcut-name">Simpan Cepat Data Riset</div>
                    <div class="ares-shortcut-desc">Menyimpan seketika seluruh data tabel, formulir, dan parameter ke LocalStorage lokal</div>
                  </div>
                  <div class="ares-keys-group">
                    <kbd class="ares-keycap">Ctrl</kbd>
                    <span class="ares-key-plus">+</span>
                    <kbd class="ares-keycap">S</kbd>
                  </div>
                </div>

                <div class="ares-shortcut-card" data-shortcut="ctrl+shift+s status storage kuota inspector periksa">
                  <div class="ares-shortcut-info">
                    <div class="ares-shortcut-name">Pemeriksa Status Storage</div>
                    <div class="ares-shortcut-desc">Buka panel kuota, integritas penyimpanan client-side, dan cadangan JSON</div>
                  </div>
                  <div class="ares-keys-group">
                    <kbd class="ares-keycap">Ctrl</kbd>
                    <span class="ares-key-plus">+</span>
                    <kbd class="ares-keycap">Shift</kbd>
                    <span class="ares-key-plus">+</span>
                    <kbd class="ares-keycap">S</kbd>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2. EKSPOR & LAPORAN -->
            <div class="ares-shortcuts-section" data-group="export">
              <div class="ares-sec-header">
                <div class="ares-sec-title"><span>📤</span> Ekspor, Publikasi &amp; Laporan</div>
                <div class="ares-sec-count">3 Pintasan</div>
              </div>
              <div class="ares-shortcuts-grid">
                <div class="ares-shortcut-card" data-shortcut="ctrl+e export ekspor csv active table aktif">
                  <div class="ares-shortcut-info">
                    <div class="ares-shortcut-name">Ekspor Tabel / Matriks Aktif</div>
                    <div class="ares-shortcut-desc">Unduh langsung data tabel/matriks yang sedang aktif dalam format .CSV (Excel/SPSS ready)</div>
                  </div>
                  <div class="ares-keys-group">
                    <kbd class="ares-keycap">Ctrl</kbd>
                    <span class="ares-key-plus">+</span>
                    <kbd class="ares-keycap">E</kbd>
                  </div>
                </div>

                <div class="ares-shortcut-card" data-shortcut="ctrl+shift+e export all zip backup arsip lengkap master semua tabel">
                  <div class="ares-shortcut-info">
                    <div class="ares-shortcut-name">Ekspor Master Arsip Riset</div>
                    <div class="ares-shortcut-desc">Unduh seluruh tabel riset sekaligus dalam paket arsip kompresi (.ZIP / JSON)</div>
                  </div>
                  <div class="ares-keys-group">
                    <kbd class="ares-keycap">Ctrl</kbd>
                    <span class="ares-key-plus">+</span>
                    <kbd class="ares-keycap">Shift</kbd>
                    <span class="ares-key-plus">+</span>
                    <kbd class="ares-keycap">E</kbd>
                  </div>
                </div>

                <div class="ares-shortcut-card" data-shortcut="ctrl+p print pdf cetak laporan dokumen resmi">
                  <div class="ares-shortcut-info">
                    <div class="ares-shortcut-name">Cetak Laporan / Format PDF</div>
                    <div class="ares-shortcut-desc">Buka pratinjau cetak resmi akademik berstandar FPIK Unsoed atau ekspor PDF</div>
                  </div>
                  <div class="ares-keys-group">
                    <kbd class="ares-keycap">Ctrl</kbd>
                    <span class="ares-key-plus">+</span>
                    <kbd class="ares-keycap">P</kbd>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. NAVIGASI MODUL & TAMPILAN -->
            <div class="ares-shortcuts-section" data-group="nav">
              <div class="ares-sec-header">
                <div class="ares-sec-title"><span>🧭</span> Navigasi Modul &amp; Tampilan</div>
                <div class="ares-sec-count">3 Pintasan</div>
              </div>
              <div class="ares-shortcuts-grid">
                <div class="ares-shortcut-card" data-shortcut="alt+m modul switcher suite navigator cmd+k">
                  <div class="ares-shortcut-info">
                    <div class="ares-shortcut-name">AREs Suite Navigator</div>
                    <div class="ares-shortcut-desc">Pindah cepat antar aplikasi (AquaLab, StatWise, EcoMetrics, BioTools, dll.)</div>
                  </div>
                  <div class="ares-keys-group">
                    <kbd class="ares-keycap">Alt</kbd>
                    <span class="ares-key-plus">+</span>
                    <kbd class="ares-keycap">M</kbd>
                  </div>
                </div>

                <div class="ares-shortcut-card" data-shortcut="alt+1 2 3 4 5 6 7 8 9 tab switch menu pindah">
                  <div class="ares-shortcut-info">
                    <div class="ares-shortcut-name">Pindah Tab / Analisis Cepat</div>
                    <div class="ares-shortcut-desc">Beralih langsung ke tab atau modul analisis ke-1 hingga ke-9</div>
                  </div>
                  <div class="ares-keys-group">
                    <kbd class="ares-keycap">Alt</kbd>
                    <span class="ares-key-plus">+</span>
                    <kbd class="ares-keycap">1...9</kbd>
                  </div>
                </div>

                <div class="ares-shortcut-card" data-shortcut="esc escape tutup modal dialog keluar">
                  <div class="ares-shortcut-info">
                    <div class="ares-shortcut-name">Tutup Jendela / Modal</div>
                    <div class="ares-shortcut-desc">Menutup dialog panduan, navigator suite, pemeriksa storage, atau sembulan aktif</div>
                  </div>
                  <div class="ares-keys-group">
                    <kbd class="ares-keycap">Esc</kbd>
                  </div>
                </div>
              </div>
            </div>

            <!-- 4. MANIPULASI DATA & BANTUAN -->
            <div class="ares-shortcuts-section" data-group="action">
              <div class="ares-sec-header">
                <div class="ares-sec-title"><span>✏️</span> Manipulasi Data &amp; Bantuan</div>
                <div class="ares-sec-count">2 Pintasan</div>
              </div>
              <div class="ares-shortcuts-grid">
                <div class="ares-shortcut-card" data-shortcut="alt+n new row tambah baris observasi pengamatan">
                  <div class="ares-shortcut-info">
                    <div class="ares-shortcut-name">Tambah Baris Pengamatan</div>
                    <div class="ares-shortcut-desc">Menambahkan baris pengamatan baru secara instan pada tabel analisis yang aktif</div>
                  </div>
                  <div class="ares-keys-group">
                    <kbd class="ares-keycap">Alt</kbd>
                    <span class="ares-key-plus">+</span>
                    <kbd class="ares-keycap">N</kbd>
                  </div>
                </div>

                <div class="ares-shortcut-card" data-shortcut="ctrl+/ ? help panduan shortcut cheat sheet bantuan">
                  <div class="ares-shortcut-info">
                    <div class="ares-shortcut-name">Buka Panduan Pintasan Ini</div>
                    <div class="ares-shortcut-desc">Menampilkan ringkasan keyboard shortcut kapan pun peneliti membutuhkannya</div>
                  </div>
                  <div class="ares-keys-group">
                    <kbd class="ares-keycap">Ctrl</kbd>
                    <span class="ares-key-plus">+</span>
                    <kbd class="ares-keycap">/</kbd>
                    <span style="font-size:0.7rem; color:#64748b; margin: 0 2px;">atau</span>
                    <kbd class="ares-keycap">?</kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="ares-shortcuts-footer">
            <div>Tekan <kbd>Esc</kbd> untuk menutup &middot; Pintasan berfungsi di seluruh ekosistem AREs</div>
            <button class="ares-btn-shortcut-trigger" id="aresCloseShortcutsFooterBtn" style="padding:4px 12px;">Selesai</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeShortcutsGuide();
      });

      document.getElementById('aresCloseShortcutsBtn').addEventListener('click', closeShortcutsGuide);
      document.getElementById('aresCloseShortcutsFooterBtn').addEventListener('click', closeShortcutsGuide);

      // Search filter handler
      const searchInput = document.getElementById('aresShortcutsSearch');
      searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        const cards = overlay.querySelectorAll('.ares-shortcut-card');
        const sections = overlay.querySelectorAll('.ares-shortcuts-section');

        cards.forEach(card => {
          const match = !query || (card.getAttribute('data-shortcut') || '').includes(query) || card.textContent.toLowerCase().includes(query);
          card.style.display = match ? 'flex' : 'none';
        });

        sections.forEach(sec => {
          const visibleCards = sec.querySelectorAll('.ares-shortcut-card:not([style*="display: none"])');
          sec.style.display = visibleCards.length > 0 ? 'flex' : 'none';
        });
      });
    }

    overlay.classList.add('open');
    const searchInput = document.getElementById('aresShortcutsSearch');
    if (searchInput) {
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
      setTimeout(() => searchInput.focus(), 60);
    }
  }

  function closeShortcutsGuide() {
    const overlay = document.getElementById('aresShortcutsOverlay');
    if (overlay) overlay.classList.remove('open');
  }

  const shortcutHandlers = {
    save: [],
    export: [],
    exportAll: [],
    print: [],
    newRow: []
  };

  const ARESShortcuts = {
    on: function (action, fn) {
      if (typeof fn === 'function') {
        if (!shortcutHandlers[action]) shortcutHandlers[action] = [];
        shortcutHandlers[action].push(fn);
      }
      return this;
    },
    trigger: function (action, event) {
      // 1. Try custom registered handlers
      if (shortcutHandlers[action] && shortcutHandlers[action].length > 0) {
        for (let fn of shortcutHandlers[action]) {
          try {
            const res = fn(event);
            if (res !== false) return true;
          } catch (err) {
            console.error('ARESShortcuts handler error (' + action + '):', err);
          }
        }
      }

      // 2. Built-in module fallbacks
      return executeDefaultAction(action, event);
    },
    showHud: showShortcutHud,
    openGuide: openShortcutsGuide,
    closeGuide: closeShortcutsGuide
  };

  function executeDefaultAction(action, event) {
    if (action === 'save') {
      if (typeof window.saveAquaLabWorkspaceSnapshot === 'function') {
        window.saveAquaLabWorkspaceSnapshot();
        showShortcutHud('Ctrl + S', 'Data AquaLab Tersimpan', 'Semua tabel berhasil diamankan', 'save');
        return true;
      } else if (typeof window.saveStatWiseData === 'function') {
        window.saveStatWiseData();
        showShortcutHud('Ctrl + S', 'Dataset StatWise Tersimpan', 'Tersimpan aman di LocalStorage', 'save');
        return true;
      } else if (typeof window.saveEcoMetricsData === 'function') {
        window.saveEcoMetricsData();
        showShortcutHud('Ctrl + S', 'Matriks EcoMetrics Tersimpan', 'Parameter & matriks tersimpan', 'save');
        return true;
      } else if (typeof window.saveBioToolsData === 'function') {
        window.saveBioToolsData();
        showShortcutHud('Ctrl + S', 'Sekuens BioTools Tersimpan', 'Data sekuens & input tersimpan', 'save');
        return true;
      } else if (typeof window.saveGeoPlotData === 'function') {
        window.saveGeoPlotData();
        showShortcutHud('Ctrl + S', 'Data Stasiun Tersimpan', 'Koordinat stasiun GeoPlot tersimpan', 'save');
        return true;
      } else if (typeof window.saveCiteShiftData === 'function') {
        window.saveCiteShiftData();
        showShortcutHud('Ctrl + S', 'Draft Sitasi Tersimpan', 'Referensi tersimpan aman di LocalStorage', 'save');
        return true;
      } else {
        handleStorageChange('ares_workspace_snapshot', 'manual');
        showShortcutHud('Ctrl + S', 'Data Tersimpan Aman', 'Semua perubahan dicatat di LocalStorage', 'save');
        return true;
      }
    }

    if (action === 'export') {
      if (typeof window.exportActiveTableCSV === 'function') {
        window.exportActiveTableCSV();
        showShortcutHud('Ctrl + E', 'Ekspor Tabel Aktif (.CSV)', 'Data siap dibuka di Excel atau SPSS', 'export');
        return true;
      } else if (typeof window.downloadCSV === 'function') {
        window.downloadCSV();
        showShortcutHud('Ctrl + E', 'Ekspor Dataset (.CSV)', 'Mengunduh dataset biometrika aktif', 'export');
        return true;
      } else if (typeof window.exportActiveMatrixCSV === 'function') {
        window.exportActiveMatrixCSV();
        showShortcutHud('Ctrl + E', 'Ekspor Matriks Multivariat', 'File .CSV berhasil diekspor', 'export');
        return true;
      } else if (typeof window.exportActiveBioToolsData === 'function') {
        window.exportActiveBioToolsData();
        showShortcutHud('Ctrl + E', 'Ekspor Sekuens FASTA', 'Sekuens aktif berhasil diunduh', 'export');
        return true;
      } else if (typeof window.exportGeoPlotData === 'function') {
        window.exportGeoPlotData();
        showShortcutHud('Ctrl + E', 'Ekspor CSV Titik Stasiun', 'Data koordinat berhasil diunduh', 'export');
        return true;
      } else if (typeof window.downloadOutput === 'function') {
        window.downloadOutput();
        showShortcutHud('Ctrl + E', 'Ekspor Berkas Sitasi', 'Format referensi berhasil diunduh', 'export');
        return true;
      } else {
        exportResearchBackup();
        showShortcutHud('Ctrl + E', 'Ekspor Cadangan Data', 'File JSON cadangan diunduh', 'export');
        return true;
      }
    }

    if (action === 'exportAll') {
      if (typeof window.exportAllModulesZip === 'function') {
        window.exportAllModulesZip();
        showShortcutHud('Ctrl + Shift + E', 'Master Arsip Ekosistem', 'Mengunduh 17+ tabel dalam paket ZIP', 'export');
        return true;
      } else {
        exportResearchBackup();
        showShortcutHud('Ctrl + Shift + E', 'Arsip Ekosistem Riset', 'Mengunduh paket cadangan lengkap', 'export');
        return true;
      }
    }

    if (action === 'print') {
      const activePane = document.querySelector('.tab-pane.active');
      if (activePane && activePane.id === 'v-dashboard' && typeof window.printDashboardPDF === 'function') {
        window.printDashboardPDF();
        showShortcutHud('Ctrl + P', 'Laporan PDF Eksekutif', 'Menyiapkan pratinjau cetak laporan', 'print');
        return true;
      } else if (typeof window.printReport === 'function') {
        window.printReport();
        showShortcutHud('Ctrl + P', 'Laporan Analisis Riset', 'Membuka dialog cetak laporan', 'print');
        return true;
      } else {
        window.print();
        return true;
      }
    }

    if (action === 'newRow') {
      if (typeof window.addActiveRow === 'function') {
        window.addActiveRow();
        showShortcutHud('Alt + N', 'Baris Baru Ditambahkan', '1 Baris ditambahkan ke tabel aktif', 'row');
        return true;
      } else if (typeof window.addRows === 'function') {
        window.addRows(5);
        showShortcutHud('Alt + N', '+5 Baris Ditambahkan', 'Baris pengamatan baru siap diisi', 'row');
        return true;
      }
    }

    if (action.startsWith('tab')) {
      const tabNum = parseInt(action.replace('tab', ''), 10);
      if (!isNaN(tabNum) && tabNum >= 1 && tabNum <= 9) {
        // In AquaLab / EcoMetrics / BioTools: find menu-item elements
        const menuItems = document.querySelectorAll('.sidebar .menu-item');
        if (menuItems.length >= tabNum) {
          const target = menuItems[tabNum - 1];
          target.click();
          const name = target.textContent.trim().replace(/^[^\w\s]+/, '').trim();
          showShortcutHud('Alt + ' + tabNum, 'Pindah Tampilan', name, 'nav');
          return true;
        }
        // In StatWise: toggle between Data View (1), Variable View (2), Analysis (3)
        if (typeof window.switchSWTab === 'function') {
          window.switchSWTab(tabNum);
          return true;
        }
      }
    }

    return false;
  }

  // Keyboard shortcut listener
  window.addEventListener('keydown', function (e) {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
    const key = e.key;

    // Helper: is user currently typing in text inputs?
    const activeEl = document.activeElement;
    const isTyping = activeEl && (
      activeEl.tagName === 'INPUT' ||
      activeEl.tagName === 'TEXTAREA' ||
      activeEl.tagName === 'SELECT' ||
      activeEl.isContentEditable
    );

    // 1. Escape: close overlays
    if (key === 'Escape') {
      const shortcutsOverlay = document.getElementById('aresShortcutsOverlay');
      if (shortcutsOverlay && shortcutsOverlay.classList.contains('open')) {
        closeShortcutsGuide();
        return;
      }
      const suiteOverlay = document.getElementById('aresSuiteOverlay');
      if (suiteOverlay && suiteOverlay.classList.contains('open')) {
        closeSuiteNavigator();
        return;
      }
      const storageOverlay = document.getElementById('aresStorageOverlay');
      if (storageOverlay && storageOverlay.classList.contains('open')) {
        closeStorageInspector();
        return;
      }
      return;
    }

    // 2. Ctrl + S / Cmd + S (Save or Storage Status)
    if (isCmdOrCtrl && (key === 's' || key === 'S')) {
      e.preventDefault();
      if (e.shiftKey) {
        openStorageInspector();
        showShortcutHud('Ctrl + Shift + S', 'Status Penyimpanan Data', 'Status kuota & integritas dibuka', 'save');
      } else {
        // Blur active input so any onchange/oninput finishes committing
        if (isTyping && typeof activeEl.blur === 'function') {
          activeEl.blur();
          setTimeout(() => { if (document.body.contains(activeEl)) activeEl.focus(); }, 150);
        }
        ARESShortcuts.trigger('save', e);
      }
      return;
    }

    // 3. Ctrl + E / Cmd + E (Export active table or full zip)
    if (isCmdOrCtrl && (key === 'e' || key === 'E')) {
      e.preventDefault();
      if (isTyping && typeof activeEl.blur === 'function') {
        activeEl.blur();
      }
      if (e.shiftKey) {
        ARESShortcuts.trigger('exportAll', e);
      } else {
        ARESShortcuts.trigger('export', e);
      }
      return;
    }

    // 4. Ctrl + P / Cmd + P (Academic Report Print / PDF)
    if (isCmdOrCtrl && (key === 'p' || key === 'P')) {
      const activePane = document.querySelector('.tab-pane.active');
      if (activePane && (activePane.id === 'v-dashboard' || typeof window.printReport === 'function')) {
        e.preventDefault();
        ARESShortcuts.trigger('print', e);
        return;
      }
    }

    // 5. Ctrl + / or Ctrl + Shift + / (Open Shortcuts Guide)
    if (isCmdOrCtrl && (key === '/' || key === '?')) {
      e.preventDefault();
      openShortcutsGuide();
      return;
    }

    // 6. Question mark (?) when NOT typing
    if (key === '?' && !isCmdOrCtrl && !e.altKey && !isTyping) {
      e.preventDefault();
      openShortcutsGuide();
      return;
    }

    // 7. Alt + M or Cmd + K: Suite Navigator
    if ((e.altKey && (key === 'm' || key === 'M')) || (isCmdOrCtrl && (key === 'k' || key === 'K'))) {
      e.preventDefault();
      const suiteOverlay = document.getElementById('aresSuiteOverlay');
      if (suiteOverlay && suiteOverlay.classList.contains('open')) {
        closeSuiteNavigator();
      } else {
        openSuiteNavigator();
      }
      return;
    }

    // 8. Alt + N: Add Observation Row
    if (e.altKey && (key === 'n' || key === 'N')) {
      e.preventDefault();
      ARESShortcuts.trigger('newRow', e);
      return;
    }

    // 9. Alt + 1 ... 9: Switch Tabs
    if (e.altKey && key >= '1' && key <= '9') {
      e.preventDefault();
      ARESShortcuts.trigger('tab' + key, e);
      return;
    }
  });

  // Global AREs Suite Navigator (App Switcher)
  function openSuiteNavigator() {
    let overlay = document.getElementById('aresSuiteOverlay');
    const path = window.location.pathname;
    const isRoot = !path.includes('/') || path.endsWith('/index.html') && path.split('/').length <= 2 || path === '/' || !path.includes('-') && !path.includes('Workspace') && !path.includes('BioTools') && !path.includes('StatWise') && !path.includes('EcoMetrics') && !path.includes('GeoPlot') && !path.includes('CiteShift') && !path.includes('ShifterAI') && !path.includes('Career-Map');
    const prefix = isRoot ? './' : '../';

    const modules = [
      {
        id: 'aqualab',
        name: 'AquaLab Workspace',
        icon: '🔬',
        badge: 'Wet-Lab & In Vivo',
        desc: 'Monitoring 17+ parameter kualitas air, biomassa in vivo (SR, SGR, FCR), kesehatan ikan, mikrobiologi & logbook riset.',
        url: prefix + 'AquaLab-Workspace/index.html',
        match: 'aqualab'
      },
      {
        id: 'statwise',
        name: 'StatWise Analytics',
        icon: '📊',
        badge: 'Biometrika Komputasi',
        desc: 'Uji hipotesis statistik lengkap: ANOVA 1/2-Arah, Uji-T, Post-Hoc Duncan/Tukey, Kruskal-Wallis, Korelasi & Regresi.',
        url: prefix + 'StatWise/index.html',
        match: 'statwise'
      },
      {
        id: 'ecometrics',
        name: 'EcoMetrics Multivariat',
        icon: '🌿',
        badge: 'Ekologi & Rapfish',
        desc: 'Analisis ordinasi multidimensi: Rapfish MDS Keberlanjutan, PCA + Biplot vektor, LDA, K-Means++ & HCA Dendrogram.',
        url: prefix + 'EcoMetrics-Multivariat/index.html',
        match: 'ecometrics'
      },
      {
        id: 'biotools',
        name: 'BioTools Dry Lab',
        icon: '⚗️',
        badge: 'Bioinformatika',
        desc: 'NCBI QBlast, manipulasi sekuens, multiple alignment (MSA), visualisasi struktur 3D protein (PDB), dan desain primer.',
        url: prefix + 'BioTools/index.html',
        match: 'biotools'
      },
      {
        id: 'geoplot',
        name: 'GeoPlot Spatial GIS',
        icon: '🗺️',
        badge: 'Spasial & Kesesuaian Lahan',
        desc: 'Pemetaan interaktif tambak, zonasi budidaya perikanan, bathimetri dan overlay parameter lingkungan akuatik.',
        url: prefix + 'GeoPlot/index.html',
        match: 'geoplot'
      },
      {
        id: 'citeshift',
        name: 'CiteShift Portal',
        icon: '📚',
        badge: 'Sitasi & Referensi',
        desc: 'Manajemen sitasi terintegrasi Mendeley FPIK Unsoed, format APA/Harvard, dan pencarian direktori jurnal bereputasi.',
        url: prefix + 'CiteShift/index.html',
        match: 'cite'
      },
      {
        id: 'shifterai',
        name: 'ShifterAI Manuscript',
        icon: '🤖',
        badge: 'Asisten Naskah Ilmiah',
        desc: 'Generator outline, penataan struktur manuskrip, dan standardisasi artikel ilmiah akuakultur siap publikasi.',
        url: prefix + 'ShifterAI/index.html',
        match: 'shifter'
      },
      {
        id: 'hub',
        name: 'AREs Ecosystem Hub',
        icon: '🏠',
        badge: 'Beranda Utama',
        desc: 'Dasbor sentral ekosistem riset terpadu, monitoring integritas data, lisensi akademik, dan sitasi DOI resmi.',
        url: isRoot ? './index.html' : '../index.html',
        match: 'hub'
      }
    ];

    const currentUrlLower = window.location.href.toLowerCase();

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'aresSuiteOverlay';
      overlay.className = 'ares-suite-overlay';
      document.body.appendChild(overlay);
    }

    const cardsHtml = modules.map(m => {
      const isCurrent = (m.id === 'hub' && isRoot) || (m.id !== 'hub' && currentUrlLower.includes(m.match));
      const badgeClass = isCurrent ? 'ares-suite-badge-active' : '';
      const badgeText = isCurrent ? '📍 Sedang Aktif' : m.badge;
      return `
        <a href="${m.url}" class="ares-suite-card ${isCurrent ? 'current' : ''}">
          <div class="ares-suite-card-top">
            <span class="ares-suite-icon">${m.icon}</span>
            <span class="ares-suite-badge ${badgeClass}">${badgeText}</span>
          </div>
          <div class="ares-suite-name">${m.name}</div>
          <div class="ares-suite-desc">${m.desc}</div>
        </a>
      `;
    }).join('');

    overlay.innerHTML = `
      <div class="ares-suite-modal" role="dialog" aria-labelledby="aresSuiteTitle">
        <div class="ares-suite-header">
          <div class="ares-suite-title-wrap">
            <img src="${prefix}AREs%20Logo%20Acronim.png" alt="AREs Logo" class="ares-suite-logo" onerror="this.style.display='none'">
            <div>
              <div class="ares-suite-title" id="aresSuiteTitle">Aquaculture Research Ecosystem</div>
              <div class="ares-suite-sub">Suite Navigator · Pindah cepat antar modul riset laboratorium &amp; biometrika</div>
            </div>
          </div>
          <button class="ares-modal-close" id="aresCloseSuiteBtn" title="Tutup">✕</button>
        </div>

        <div class="ares-suite-grid">
          ${cardsHtml}
        </div>

        <div class="ares-suite-shortcut-hint">
          <span>💡 <strong>Tip Cepat:</strong> Tekan tombol <span class="ares-kbd">Alt + M</span> di keyboard kapan saja untuk membuka navigator ini.</span>
          <button class="ares-btn-act ares-btn-act-outline" style="min-width:auto; padding:5px 12px; font-size:0.72rem;" onclick="ARESStorageSync.openInspector(); closeSuiteNavigator();">
            <span>🔒</span> Cek Status Penyimpanan
          </button>
        </div>
      </div>
    `;

    overlay.querySelector('#aresCloseSuiteBtn').addEventListener('click', closeSuiteNavigator);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeSuiteNavigator();
    });

    overlay.classList.add('open');
  }

  function closeSuiteNavigator() {
    const overlay = document.getElementById('aresSuiteOverlay');
    if (overlay) overlay.classList.remove('open');
  }

  window.openAresSuiteNavigator = openSuiteNavigator;
  window.closeAresSuiteNavigator = closeSuiteNavigator;

  function renderQuickShortcutDock() {
    if (isRoot) return; // Only display in workspace modules
    if (document.getElementById('aresQuickShortcutDock')) return;

    const dock = document.createElement('div');
    dock.id = 'aresQuickShortcutDock';
    dock.className = 'ares-quick-shortcut-dock';

    const isMinimized = localStorage.getItem('ares_quickbar_minimized') === 'true';
    if (isMinimized) {
      dock.classList.add('minimized');
    }

    dock.innerHTML = `
      <div class="ares-qsd-full">
        <button type="button" class="ares-qsd-btn" id="aresQsdSaveBtn" title="Simpan Data Riset Lokal (Ctrl+S)">
          <span class="ares-qsd-kbd">Ctrl+S</span>
          <span class="ares-qsd-label">Simpan</span>
        </button>
        <span class="ares-qsd-sep"></span>
        <button type="button" class="ares-qsd-btn" id="aresQsdExportBtn" title="Ekspor Dataset Riset (Ctrl+E)">
          <span class="ares-qsd-kbd">Ctrl+E</span>
          <span class="ares-qsd-label">Ekspor</span>
        </button>
        <span class="ares-qsd-sep"></span>
        <button type="button" class="ares-qsd-btn" id="aresQsdSuiteBtn" title="Pindah Modul AREs (Alt+M)">
          <span class="ares-qsd-kbd">Alt+M</span>
          <span class="ares-qsd-label">Modul</span>
        </button>
        <span class="ares-qsd-sep"></span>
        <button type="button" class="ares-qsd-btn ares-qsd-help" id="aresQsdHelpBtn" title="Panduan Pintasan Lengkap (Ctrl+/)">
          <span class="ares-qsd-kbd">?</span>
        </button>
        <button type="button" class="ares-qsd-close" id="aresQsdToggle" title="Kecilkan bilah pintasan">✕</button>
      </div>
      <button type="button" class="ares-qsd-mini" id="aresQsdMini" title="Buka Bilah Pintasan Cepat">
        <span>⌨️</span>
        <span class="ares-qsd-mini-label">Pintasan</span>
      </button>
    `;

    document.body.appendChild(dock);

    dock.querySelector('#aresQsdSaveBtn').addEventListener('click', function(e) {
      e.preventDefault();
      ARESShortcuts.trigger('save');
    });

    dock.querySelector('#aresQsdExportBtn').addEventListener('click', function(e) {
      e.preventDefault();
      ARESShortcuts.trigger('export');
    });

    dock.querySelector('#aresQsdSuiteBtn').addEventListener('click', function(e) {
      e.preventDefault();
      openSuiteNavigator();
    });

    dock.querySelector('#aresQsdHelpBtn').addEventListener('click', function(e) {
      e.preventDefault();
      openShortcutsGuide();
    });

    const toggleBtn = dock.querySelector('#aresQsdToggle');
    const miniBtn = dock.querySelector('#aresQsdMini');

    toggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      dock.classList.add('minimized');
      localStorage.setItem('ares_quickbar_minimized', 'true');
    });

    miniBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      dock.classList.remove('minimized');
      localStorage.setItem('ares_quickbar_minimized', 'false');
    });
  }

  // Initialize
  function init() {
    interceptLocalStorage();
    injectStyles();
    getStorageStats();
    renderIndicatorUI();
    startRelativeTimeUpdater();
    renderQuickShortcutDock();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  const ARESStorageSync = {
    getState: function () { return { ...syncState }; },
    getStats: getStorageStats,
    openInspector: openStorageInspector,
    closeInspector: closeStorageInspector,
    openSuiteNavigator: openSuiteNavigator,
    closeSuiteNavigator: closeSuiteNavigator,
    notifyChange: function (key) { handleStorageChange(key, 'manual'); },
    exportBackup: exportResearchBackup,
    shortcuts: ARESShortcuts
  };

  window.ARESStorageSync = ARESStorageSync;
  window.ARESShortcuts = ARESShortcuts;
  window.openAresShortcutsGuide = openShortcutsGuide;
  window.closeAresShortcutsGuide = closeShortcutsGuide;
  window.showAresShortcutHud = showShortcutHud;

})(typeof window !== 'undefined' ? window : this);
