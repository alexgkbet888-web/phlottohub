(function () {
  const config = window.PH_LOTTO_ANALYTICS || {};
  const state = {
    ga4Ready: false,
    clarityReady: false
  };

  function hasValue(value) {
    return typeof value === "string" && value.trim().length > 0;
  }

  function loadScript(src, onload) {
    const script = document.createElement("script");
    script.async = true;
    script.src = src;
    if (onload) script.onload = onload;
    document.head.appendChild(script);
  }

  function logDebug(message, payload) {
    if (!config.enableDebug) return;
    console.info(`[PH Lotto Analytics] ${message}`, payload || "");
  }

  function initGa4() {
    if (!hasValue(config.ga4MeasurementId)) return;
    const measurementId = config.ga4MeasurementId.trim();
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      send_page_view: false
    });
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`, () => {
      state.ga4Ready = true;
      logDebug("GA4 ready", measurementId);
    });
  }

  function initClarity() {
    if (!hasValue(config.clarityProjectId)) return;
    const projectId = config.clarityProjectId.trim();
    window.clarity = window.clarity || function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    loadScript(`https://www.clarity.ms/tag/${encodeURIComponent(projectId)}`, () => {
      state.clarityReady = true;
      logDebug("Clarity ready", projectId);
    });
  }

  function insertVerificationMeta(name, content) {
    if (!hasValue(content) || document.querySelector(`meta[name="${name}"]`)) return;
    const meta = document.createElement("meta");
    meta.name = name;
    meta.content = content.trim();
    document.head.appendChild(meta);
  }

  window.phTrack = function (eventName, params) {
    const payload = params || {};
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, payload);
    }
    if (typeof window.clarity === "function") {
      window.clarity("event", eventName);
    }
    logDebug(eventName, payload);
  };

  window.phPageView = function (route, params) {
    const path = `${window.location.pathname}${window.location.hash || ""}`;
    const payload = {
      page_title: document.title,
      page_location: window.location.href,
      page_path: path,
      route,
      ...(params || {})
    };
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", payload);
    }
    window.phTrack("route_view", { route, page_path: path });
  };

  initGa4();
  initClarity();
  insertVerificationMeta("google-site-verification", config.googleSiteVerification);
  insertVerificationMeta("msvalidate.01", config.bingSiteVerification);
})();
