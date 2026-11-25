(() => {
  const measurementId = "G-FDMBBCY845";
  const consentKey = "fluxo-analytics-v1";
  const readChoice = () => {
    try { return localStorage.getItem(consentKey); } catch { return null; }
  };
  let choice = readChoice();
  let loaded = false;

  function start() {
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    const url = new URL(location.href);
    const campaign = new URLSearchParams();
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
      const value = url.searchParams.get(key);
      if (value && /^[a-z0-9_-]{1,80}$/i.test(value)) campaign.set(key, value);
    }
    const page = url.origin + url.pathname + (campaign.size ? "?" + campaign.toString() : "");
    const referrer = document.referrer ? new URL(document.referrer).origin : "";
    window.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      send_page_view: false,
      page_location: page,
      page_referrer: referrer
    });
    window.gtag("event", "page_view", { page_location: page, page_referrer: referrer });
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
    document.head.append(script);
  }

  const controls = document.createElement("section");
  controls.setAttribute("aria-label", "Preferências de medição");
  controls.style.cssText = "margin:1rem auto;padding:1rem;max-width:52rem;font:inherit";
  const panel = document.createElement("div");
  const copy = document.createElement("p");
  copy.textContent = "Podemos usar o Google Analytics para entender quais páginas e links da fluxo.yz são usados. Essa medição é opcional.";
  const change = addButton("Preferências de medição", () => { panel.hidden = !panel.hidden; });
  const accept = addButton("Permitir medição", () => choose("yes"));
  const reject = addButton("Recusar", () => choose("no"));
  panel.append(copy, accept, reject);
  controls.append(panel, change);

  function addButton(text, action) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.style.cssText = "padding:.45rem .7rem;margin:.25rem;cursor:pointer";
    button.addEventListener("click", action);
    return button;
  }

  function choose(value) {
    try { localStorage.setItem(consentKey, value); } catch {}
    choice = value;
    panel.hidden = true;
    if (value === "yes") {
      window["ga-disable-" + measurementId] = false;
      if (loaded) window.gtag("consent", "update", { analytics_storage: "granted" });
      start();
    } else if (loaded) {
      window["ga-disable-" + measurementId] = true;
      window.gtag("consent", "update", { analytics_storage: "denied" });
    }
  }

  if (choice === "yes") start();
  panel.hidden = choice !== null;
  if (!choice) {
    const main = document.querySelector("main");
    if (main) main.prepend(controls);
    else document.body.prepend(controls);
  } else {
    const footer = document.querySelector("footer");
    if (footer) footer.append(controls);
    else document.body.append(controls);
  }
})();