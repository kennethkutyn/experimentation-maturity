/* =============================================================
 * Amplitude Analytics + Session Replay initialization
 * Loaded after the Amplitude project loader script.
 * Precision tracking of user actions lives in app.js/admin.js
 * via window.__track(name, properties).
 * ============================================================= */
(function () {
  var API_KEY = "747996c8c152e54584e72357295fb42e";

  if (!window.amplitude) {
    /* Loader script blocked (ad blocker, offline, etc.) — provide a
       no-op tracker so app.js calls never throw. */
    window.__track = function () {};
    window.__identify = function () {};
    return;
  }

  try {
    if (window.sessionReplay && typeof window.sessionReplay.plugin === "function") {
      window.amplitude.add(window.sessionReplay.plugin({ sampleRate: 1 }));
    }
  } catch (e) {
    /* Session Replay plugin missing/failed — proceed without it. */
  }

  window.amplitude.init(API_KEY, {
    autocapture: {
      attribution: true,
      pageViews: true,
      sessions: true,
      formInteractions: false,
      fileDownloads: false,
      elementInteractions: false
    }
  });

  window.__track = function (name, properties) {
    try { window.amplitude.track(name, properties || {}); } catch (e) {}
  };

  window.__identify = function (props) {
    try {
      var id = new window.amplitude.Identify();
      Object.keys(props || {}).forEach(function (k) { id.set(k, props[k]); });
      window.amplitude.identify(id);
    } catch (e) {}
  };
})();
