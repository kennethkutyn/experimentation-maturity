/* =============================================================
 * Analytics initialization: Amplitude (+ Session Replay) and Statsig.
 * Exposes:
 *   window.__track(name, props)    fires to both SDKs
 *   window.__identify(props)       user props → Amplitude
 *   window.__statsig               the StatsigClient once ready
 * Safe if a script is blocked: the helpers no-op, calls never throw.
 * ============================================================= */
(function () {
  var AMP_KEY = "747996c8c152e54584e72357295fb42e";
  var STATSIG_KEY = "client-dl0oamz4b3WHpHZUrb2tD6LOjlJgFRMDfieBlY5HBfr";

  /* Stable anonymous ID reused as both Amplitude deviceId and Statsig userID
     so users are correlated across the two tools. Persisted in
     localStorage — regenerated only if the browser wipes storage. */
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
  var statsigClient = null;
  var statsigQueue = [];

  function StatsigCtor() {
    return (window.Statsig && window.Statsig.StatsigClient)
        || window.StatsigClient
        || null;
  }

  (function initStatsig() {
    var Ctor = StatsigCtor();
    if (!Ctor) return; /* Script blocked or not loaded yet. */
    try {
      var client = new Ctor(STATSIG_KEY, { userID: userId });
      client.initializeAsync()
        .then(function () {
          statsigClient = client;
          window.__statsig = client;
          /* Flush queued events. */
          statsigQueue.forEach(function (ev) {
            try { client.logEvent(ev); } catch (e) {}
          });
          statsigQueue = [];
        })
        .catch(function () { /* offline / blocked — silent */ });
    } catch (e) {}
  })();

  /* Statsig event metadata must be flat string-keyed strings.
     Coerce non-string values (numbers, bools, objects) safely. */
  function normalizeMetadata(props) {
    var out = {};
    Object.keys(props || {}).forEach(function (k) {
      var v = props[k];
      if (v == null) return;
      out[k] = (typeof v === "object") ? JSON.stringify(v) : String(v);
    });
    return out;
  }

  /* -------------------- Public API -------------------- */
  window.__track = function (name, properties) {
    var props = properties || {};

    /* Amplitude */
    if (ampReady) {
      try { window.amplitude.track(name, props); } catch (e) {}
    }

    /* Statsig */
    var ev = { eventName: name, metadata: normalizeMetadata(props) };
    if (statsigClient) {
      try { statsigClient.logEvent(ev); } catch (e) {}
    } else {
      statsigQueue.push(ev);
    }
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
