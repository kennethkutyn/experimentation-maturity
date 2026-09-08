/* =============================================================
 * Analytics initialization.
 *   Amplitude   → all custom analytics events + Session Replay
 *   Statsig     → feature gates / experiments / dynamic configs
 *                 (SDK auto-logs exposure events; we do NOT fire
 *                  custom events to it)
 *
 * Exposes:
 *   window.__track(name, props)    → Amplitude only
 *   window.__identify(props)       → Amplitude user properties
 *   window.__statsig               → the StatsigClient once ready,
 *                                    for getFeatureGate / getExperiment
 * Safe if a script is blocked: helpers no-op, calls never throw.
 * ============================================================= */
(function () {
  var AMP_KEY = "747996c8c152e54584e72357295fb42e";
  var STATSIG_KEY = "client-dl0oamz4b3WHpHZUrb2tD6LOjlJgFRMDfieBlY5HBfr";

  /* Stable anonymous ID reused as both Amplitude deviceId and Statsig userID
     so users are correlated across the two tools. Persisted in
     localStorage; regenerated only if the browser wipes storage. */
  function getStableUserId() {
    try {
      var id = localStorage.getItem("em_user_id");
      if (id) return id;
      id = (window.crypto && crypto.randomUUID)
        ? crypto.randomUUID()
        : ("u-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2));
      try { localStorage.setItem("em_user_id", id); } catch (e) {}
      return id;
    } catch (e) {
      return "u-" + Date.now();
    }
  }

  var userId = getStableUserId();

  /* -------------------- Amplitude -------------------- */
  var ampReady = false;
  if (window.amplitude && typeof window.amplitude.init === "function") {
    try {
      if (window.sessionReplay && typeof window.sessionReplay.plugin === "function") {
        window.amplitude.add(window.sessionReplay.plugin({ sampleRate: 1 }));
      }
    } catch (e) {}
    try {
      window.amplitude.init(AMP_KEY, {
        deviceId: userId,
        autocapture: {
          attribution: true,
          pageViews: true,
          sessions: true,
          formInteractions: false,
          fileDownloads: false,
          elementInteractions: false
        }
      });
      ampReady = true;
    } catch (e) {}
  }

  /* -------------------- Statsig -------------------- */
  /* Initialized only so the SDK can serve feature gates / experiments /
     dynamic configs. The SDK auto-logs exposure events as those APIs
     are called. We intentionally do not send custom events here. */
  function StatsigCtor() {
    return (window.Statsig && window.Statsig.StatsigClient)
        || window.StatsigClient
        || null;
  }

  /* Exposed so app code can await Statsig before reading gates /
     experiments / parameter stores. Resolves either way (fulfilled
     when client is ready, or rejected if init fails / SDK missing). */
  window.__statsigReady = new Promise(function (resolve, reject) {
    var Ctor = StatsigCtor();
    if (!Ctor) { reject(new Error("Statsig SDK not loaded")); return; }
    try {
      var client = new Ctor(STATSIG_KEY, { userID: userId });
      client.initializeAsync()
        .then(function () { window.__statsig = client; resolve(client); })
        .catch(reject);
    } catch (e) { reject(e); }
  });
  /* Prevent unhandled-rejection noise in the console if Statsig fails. */
  window.__statsigReady.catch(function () {});

  /* -------------------- Public API -------------------- */
  window.__track = function (name, properties) {
    if (!ampReady) return;
    try { window.amplitude.track(name, properties || {}); } catch (e) {}
  };

  window.__identify = function (props) {
    if (!ampReady) return;
    try {
      var id = new window.amplitude.Identify();
      Object.keys(props || {}).forEach(function (k) { id.set(k, props[k]); });
      window.amplitude.identify(id);
    } catch (e) {}
  };
})();
