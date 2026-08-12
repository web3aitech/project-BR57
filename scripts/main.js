/* ============================================================
   Better Roofing 57. Minimal interactivity.
   One orchestrated hero load-in + FAQ accordion + two estimate
   forms (both post to Web3Forms) + a past-work carousel.
   No scroll-fade-everywhere. Restraint.
   ============================================================ */

(function () {
  "use strict";

  // ---- Hero load-in: the one orchestrated moment ----
  document.documentElement.classList.add("is-loaded");

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

  // ---- Estimate forms (hero + contact). Both post to Web3Forms. ----
  // Replace the access_key value in the HTML with the client's key.
  // With the placeholder key still in place, the form shows a local
  // confirmation without sending, so the site works for review before
  // the client signs up.
  var forms = document.querySelectorAll("form[data-estimate]");
  forms.forEach(function (form) {
    var sent = form.querySelector(".form__sent");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var key = (form.querySelector('[name="access_key"]') || {}).value;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Placeholder key: show confirmation locally without sending.
      if (!key || key.indexOf("REPLACE_WITH") === 0) {
        if (sent) sent.hidden = false;
        form.reset();
        return;
      }

      var body = new FormData(form);
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: body,
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.success) {
            if (sent) sent.hidden = false;
            form.reset();
          } else {
            alert("Sorry, something went wrong. Please call (901) 484-5717.");
          }
        })
        .catch(function () {
          alert("Sorry, the form didn't send. Please call (901) 484-5717.");
        });
    });
  });

  // ---- Past-work carousel: prev / next buttons scroll one slide ----
  var carousels = document.querySelectorAll("[data-carousel]");
  carousels.forEach(function (carousel) {
    var track = carousel.querySelector("[data-track]");
    var prev = carousel.querySelector("[data-prev]");
    var next = carousel.querySelector("[data-next]");
    if (!track) return;

    function step() {
      var slide = track.querySelector(".slide");
      if (!slide) return track.clientWidth * 0.8;
      // gap + slide width advances roughly one slide
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 16;
      return slide.getBoundingClientRect().width + gap;
    }

    if (prev) {
      prev.addEventListener("click", function () {
        track.scrollBy({ left: -step(), behavior: "smooth" });
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        track.scrollBy({ left: step(), behavior: "smooth" });
      });
    }
  });
})();