/* ============================================================
   Tennessee Septic and Pumping LLC. Minimal interactivity.
   One orchestrated hero load-in + a transparent header that turns
   solid on scroll + FAQ accordion + a service request form
   (posts to Web3Forms). No scroll-fade-everywhere. Restraint.
   ============================================================ */

(function () {
  "use strict";

  // ---- Hero load-in: the one orchestrated moment ----
  document.documentElement.classList.add("is-loaded");

  // ---- Header: transparent over the hero, solid white once scrolled ----
  var head = document.getElementById("site-head");
  if (head) {
    var toggle = function () {
      if (window.scrollY > 40) head.classList.add("is-scrolled");
      else head.classList.remove("is-scrolled");
    };
    toggle();
    window.addEventListener("scroll", toggle, { passive: true });
    window.addEventListener("resize", toggle, { passive: true });
  }

  // ---- Footer year ----
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // ---- FAQ accordion ----
  var items = document.querySelectorAll(".faq__item");
  items.forEach(function (item) {
    var btn = item.querySelector(".faq__q");
    var ans = item.querySelector(".faq__a");
    if (!btn || !ans) return;

    btn.addEventListener("click", function () {
      var isOpen = item.getAttribute("data-open") === "true";
      // close others (one open at a time, cleaner rhythm)
      items.forEach(function (other) {
        if (other !== item) {
          other.setAttribute("data-open", "false");
          var ob = other.querySelector(".faq__q");
          if (ob) ob.setAttribute("aria-expanded", "false");
          var oa = other.querySelector(".faq__a");
          if (oa) oa.style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.setAttribute("data-open", "false");
        btn.setAttribute("aria-expanded", "false");
        ans.style.maxHeight = null;
      } else {
        item.setAttribute("data-open", "true");
        btn.setAttribute("aria-expanded", "true");
        ans.style.maxHeight = ans.scrollHeight + "px";
      }
    });
  });

  // ---- Service request form (hero + contact). Posts to a Make webhook. ----
  // The webhook receives a JSON object with the form fields and the
  // subject/from_name hidden values. Make responds with 2xx on success
  // (often an empty body), so we treat any 2xx as success.
  var WEBHOOK = "https://hook.us2.make.com/jmuvtw4jfyjjia5zpfrrmk3a2w4uatlr";
  var forms = document.querySelectorAll("form[data-estimate]");
  forms.forEach(function (form) {
    var sent = form.querySelector(".form__sent");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Build a JSON payload from the form's named fields.
      var payload = {};
      new FormData(form).forEach(function (value, key) {
        if (key === "_botcheck") return; // honeypot, drop it
        payload[key] = value;
      });
      // text/plain body avoids a CORS preflight; Make reads JSON fine.
      fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload),
      })
        .then(function (r) {
          if (r.ok) {
            if (sent) sent.hidden = false;
            form.reset();
          } else {
            throw new Error("Bad status " + r.status);
          }
        })
        .catch(function () {
          alert("Sorry, the form didn't send. Please call (931) 560-9818.");
        });
    });
  });
})();