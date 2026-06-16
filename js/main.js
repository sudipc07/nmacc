/* ============================================================
   LOAY NOFAL — site behaviour
   Minimal, dependency-free. Everything degrades gracefully.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Theme toggle ----------
     Dark (red) is the default. The inline <head> script applies any saved
     theme before paint; here we keep the button state and theme-color in sync
     and persist changes.
  -------------------------------------------------------------- */
  var root = document.documentElement;
  var themeBtn = document.getElementById("theme-toggle");
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function setTheme(theme) {
    var light = theme === "light";
    root.setAttribute("data-theme", light ? "light" : "dark");
    if (themeBtn) themeBtn.setAttribute("aria-pressed", String(light));
    if (themeMeta) themeMeta.setAttribute("content", light ? "#e7e9ec" : "#0a0a0a");
  }

  setTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark");

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      setTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    // Close the menu after tapping a link
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Scroll reveal (respects reduced-motion) ---------- */
  var prefersReduced = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  var revealTargets = document.querySelectorAll(
    ".section-head, .approach-body, .spec-sheet, .module, .outcome, " +
    ".industry, .warn-panel, .capacity-bar, .engage-card, .network-note, " +
    ".contact-form-wrap, .contact-side, .hero-main, .hero-side"
  );

  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (el) { el.classList.add("in"); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("reveal"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealTargets.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Inquiry form ----------
     The form is Formspree-ready. Behaviour:
     - If `action` points at a real endpoint -> AJAX submit to it.
     - If `action` is empty (no endpoint wired yet) -> validate + show a
       clear "not connected" message instead of silently doing nothing.
  -------------------------------------------------------------- */
  var form = document.getElementById("inquiry-form");
  var note = document.getElementById("form-note");

  function setNote(msg, kind) {
    if (!note) return;
    note.textContent = msg;
    note.className = "form-note" + (kind ? " " + kind : "");
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Native validation first
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var endpoint = (form.getAttribute("action") || "").trim();

      if (!endpoint) {
        // No backend wired yet — make that explicit rather than failing silently.
        setNote(
          "FORM NOT YET CONNECTED — add a Formspree endpoint to enable sending.",
          "err"
        );
        return;
      }

      var submitBtn = form.querySelector(".btn-submit");
      var original = submitBtn ? submitBtn.innerHTML : "";
      if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = "SENDING…"; }
      setNote("Transmitting inquiry…", "");

      fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            setNote("Inquiry received. I'll be in touch shortly.", "ok");
          } else {
            setNote("Something went wrong. Please try again.", "err");
          }
        })
        .catch(function () {
          setNote("Network error. Please try again.", "err");
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = original; }
        });
    });
  }
})();
