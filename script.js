(function () {
  "use strict";

  /* ---------- header glass effect on scroll ---------- */
  var header = document.getElementById("site-header");
  function syncHeader() {
    header.classList.toggle("scrolled", window.pageYOffset > 90);
  }
  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobile-menu");
  function setMenu(open) {
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", function () {
    setMenu(!menu.classList.contains("is-open"));
  });
  menu.querySelectorAll("[data-close-menu]").forEach(function (el) {
    el.addEventListener("click", function () { setMenu(false); });
  });

  /* ---------- before / after slider ---------- */
  var frame = document.getElementById("ba-frame");
  var afterImg = document.getElementById("ba-after-img");
  var line = document.getElementById("ba-line");
  var handle = document.getElementById("ba-handle");
  var range = document.getElementById("ba-range");

  function setSplit(pct) {
    pct = Math.max(2, Math.min(98, pct));
    afterImg.style.clipPath = "inset(0 " + (100 - pct) + "% 0 0)";
    line.style.left = pct + "%";
    handle.style.left = pct + "%";
    range.value = pct;
  }
  range.addEventListener("input", function () { setSplit(Number(range.value)); });
  range.addEventListener("focus", function () { handle.classList.add("focused"); });
  range.addEventListener("blur", function () { handle.classList.remove("focused"); });

  function pctFromClientX(clientX) {
    var r = frame.getBoundingClientRect();
    return (clientX - r.left) / r.width * 100;
  }
  var dragging = false;
  function onDown(e) {
    dragging = true;
    var x = e.touches ? e.touches[0].clientX : e.clientX;
    setSplit(pctFromClientX(x));
  }
  function onMove(e) {
    if (!dragging) return;
    var x = e.touches ? e.touches[0].clientX : e.clientX;
    setSplit(pctFromClientX(x));
  }
  function onUp() { dragging = false; }
  frame.addEventListener("mousedown", onDown);
  frame.addEventListener("touchstart", onDown, { passive: true });
  window.addEventListener("mousemove", onMove);
  window.addEventListener("touchmove", onMove, { passive: true });
  window.addEventListener("mouseup", onUp);
  window.addEventListener("touchend", onUp);

  // settle animation on load, mirrors the original slight-peek effect
  setTimeout(function () { setSplit(78); }, 800);
  setTimeout(function () { setSplit(48); }, 1800);

  /* ---------- quote form ---------- */
  var form = document.getElementById("quote-form");
  var formWrap = document.getElementById("quote-form-wrap");
  var sent = document.getElementById("quote-sent");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    formWrap.hidden = true;
    sent.hidden = false;
  });

  /* ---------- reviews marquee (built from data so markup stays small) ---------- */
  var reviews = [
    { t: "They offer exceptional customer service with personable, quick response and excellent communications. The schedule was set and they delivered.", n: "Brittany D" },
    { t: "After another company damaged my pool pump, I was in a tough spot. Prell came out on short notice and squeezed me into their already busy schedule.", n: "Beth Gilbert-Crowell" },
    { t: "Our pool lights hadn't worked in years. I called Prell and they had us on the schedule for the next day, diagnosed it, and came right back to finish.", n: "J D" },
    { t: "We can't say enough about Laura, Pete and their staff. They opened our pool and told us what it needed without ever being pushy.", n: "Jessica Bird" },
    { t: "First time in 27 years I used a company to close my pool, and I was extremely happy. Jordan and Jeremy were professional, respectful and did a fantastic job.", n: "Lynda Altieri" },
    { t: "From the office staff to Sean, who serviced our pool: top notch, polite, professional, informative and patient. They won a lifetime customer.", n: "Missy Holm" },
    { t: "Jordan and Jeremy arrived and got right to work. They took the time to educate me on my system rather than rushing off.", n: "Cleck Family" },
    { t: "Openings and closings have gone like clockwork, no matter which team is attending the service. I could not be more grateful.", n: "Brian Ruvolo" },
    { t: "After calling so many pool places, I finally found one that responded quickly and fixed our issues just as quick. The whole process was perfect.", n: "Diana Costanzo" },
    { t: "Always on time, competitive pricing, the most personalized service, and beautiful blue water in our pool all the time. What more could we ask for?", n: "Christy L" }
  ];
  var track = document.getElementById("marquee-track");
  function cardHTML(r) {
    var fig = document.createElement("figure");
    fig.className = "review-card";
    fig.innerHTML =
      '<p class="stars">★★★★★</p>' +
      "<blockquote>“" + r.t + "”</blockquote>" +
      '<figcaption>' + r.n + ' <span>/ Google review</span></figcaption>';
    return fig;
  }
  reviews.concat(reviews).forEach(function (r) { track.appendChild(cardHTML(r)); });

  /* ---------- scroll reveal ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }
})();
