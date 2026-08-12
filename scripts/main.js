/* ============================================================
   Better Roofing 57. Minimal interactivity.
   One orchestrated hero load-in + FAQ accordion + form submit.
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
          other.querySelector(".faq__q").setAttribute("aria-expanded", "false");
          other.querySelector(".faq__a").style.maxHeight = null;
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

  // ---- Contact form ----
  // Posts to Web3Forms (no backend). Replace access_key in the HTML with the
  // client's key. Falls back to a graceful confirmation if the key is the
  // placeholder, so the site works for review before the client signs up.
  var form = document.getElementById("estimate-form");
  var sent = document.getElementById("form-sent");
  if (form) {
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
  }
})();
