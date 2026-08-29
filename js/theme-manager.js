/**
 * AREs Ecosystem - Central Theme Management Utility
 * Synchronizes theme ('dark' | 'light') across all AREs sub-applications
 * (AquaLab, StatWise, GeoPlot, EcoMetrics, BioTools, etc.)
 * using a central EventBus in local storage and BroadcastChannel.
 */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'ares_theme';
  const ALT_STORAGE_KEY = 'theme';
  const EVENT_BUS_KEY = 'ares_theme_sync_bus';
  const CUSTOM_EVENT_NAME = 'ares:theme-changed';
  const BROADCAST_CHANNEL_NAME = 'ares_theme_channel';

  let currentTheme = getInitialTheme();
  const listeners = new Set();
  let broadcastChannel = null;

  try {
    if ('BroadcastChannel' in window) {
      broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    }
  } catch (e) {
    // BroadcastChannel unsupported or restricted in sandbox iframe
  }

  function getInitialTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY) || localStorage.getItem(ALT_STORAGE_KEY) || 'dark';
    } catch (e) {
      return 'dark';
    }
  }

  function applyThemeToDOM(theme) {
    if (!document.documentElement) return;
    document.documentElement.setAttribute('data-theme', theme);
    
    // Synchronize meta theme-color tag if present
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0F172A' : '#0284c7');
    }
  }

  // Apply DOM theme immediately on script execution
  applyThemeToDOM(currentTheme);

  function setTheme(newTheme, options) {
    options = options || {};
    const sync = options.sync !== false;
    const notifyUI = options.notifyUI !== false;

    if (newTheme !== 'dark' && newTheme !== 'light') {
      newTheme = newTheme === 'light' ? 'light' : 'dark';
    }

    currentTheme = newTheme;
    applyThemeToDOM(currentTheme);

    if (sync) {
      try {
        localStorage.setItem(STORAGE_KEY, currentTheme);
        localStorage.setItem(ALT_STORAGE_KEY, currentTheme);
        localStorage.setItem(EVENT_BUS_KEY, JSON.stringify({
          theme: currentTheme,
          timestamp: Date.now(),
          origin: window.location.href
        }));
      } catch (e) {
        console.warn('AREs ThemeManager: LocalStorage write blocked', e);
      }

      if (broadcastChannel) {
        try {
          broadcastChannel.postMessage({ theme: currentTheme, timestamp: Date.now() });
        } catch (e) {}
      }
    }

    // Trigger registered subscribers
    listeners.forEach(function (cb) {
      try { cb(currentTheme); } catch (err) { console.error('AREs Theme subscriber error:', err); }
    });

    // Dispatch DOM custom event
    try {
      window.dispatchEvent(new CustomEvent(CUSTOM_EVENT_NAME, {
        detail: { theme: currentTheme, sync: sync }
      }));
    } catch (e) {}

    if (notifyUI) {
      updatePageThemeUI(currentTheme);
    }
  }

  function updatePageThemeUI(theme) {
    const isDark = theme === 'dark';

    // Update common buttons or theme badges
    const themeBtn = document.getElementById('theme-btn') || document.querySelector('.theme-btn-top') || document.getElementById('themeToggleBtn');
    if (themeBtn) {
      const iconSpan = themeBtn.querySelector('.dsw-icon-styled') || themeBtn.querySelector('i');
      if (iconSpan) {
        if (iconSpan.tagName && iconSpan.tagName.toLowerCase() === 'i') {
          iconSpan.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
        }
      }
      const textSpan = themeBtn.querySelector('.btn-text') || themeBtn.querySelector('span:not(.dsw-icon-styled)');
      if (textSpan && (textSpan.textContent.includes('Tema') || textSpan.textContent.includes('Mode'))) {
        textSpan.textContent = isDark ? 'Mode Gelap' : 'Mode Terang';
      }
    }

    // Invoke sub-app specific theme callback if exists
    if (typeof window.onAresThemeChanged === 'function') {
      try { window.onAresThemeChanged(theme); } catch (e) {}
    }
  }

  function toggleTheme() {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme, { sync: true, notifyUI: true });
    return nextTheme;
  }

  function subscribe(callback) {
    if (typeof callback === 'function') {
      listeners.add(callback);
      try { callback(currentTheme); } catch (e) {}
    }
    return function unsubscribe() {
      listeners.delete(callback);
    };
  }

  // Cross-tab / Cross-iframe EventBus listener via 'storage' event
  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY || e.key === EVENT_BUS_KEY) {
      let incomingTheme = currentTheme;
      if (e.key === STORAGE_KEY && e.newValue) {
        incomingTheme = e.newValue;
      } else if (e.key === EVENT_BUS_KEY && e.newValue) {
        try {
          const payload = JSON.parse(e.newValue);
          incomingTheme = payload.theme;
        } catch (err) {}
      }

      if (incomingTheme && (incomingTheme === 'dark' || incomingTheme === 'light') && incomingTheme !== currentTheme) {
        setTheme(incomingTheme, { sync: false, notifyUI: true });
      }
    }
  });

  // Listener for BroadcastChannel
  if (broadcastChannel) {
    broadcastChannel.onmessage = function (event) {
      if (event.data && event.data.theme && (event.data.theme === 'dark' || event.data.theme === 'light') && event.data.theme !== currentTheme) {
        setTheme(event.data.theme, { sync: false, notifyUI: true });
      }
    };
  }

  // DOM ready check
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      applyThemeToDOM(currentTheme);
      updatePageThemeUI(currentTheme);
    });
  } else {
    applyThemeToDOM(currentTheme);
    updatePageThemeUI(currentTheme);
  }

  // Expose global API
  const ARESThemeManager = {
    getTheme: function () { return currentTheme; },
    setTheme: function (theme) { setTheme(theme, { sync: true, notifyUI: true }); },
    toggleTheme: toggleTheme,
    subscribe: subscribe,
    onThemeChange: subscribe,
    EVENT_NAME: CUSTOM_EVENT_NAME,
    STORAGE_KEY: STORAGE_KEY
  };

  window.ARESTheme = ARESThemeManager;
  window.ARESThemeManager = ARESThemeManager;

  // Override global toggleTheme for drop-in compatibility across legacy sub-apps
  window.toggleTheme = function () {
    return ARESThemeManager.toggleTheme();
  };

})(typeof window !== 'undefined' ? window : this);
