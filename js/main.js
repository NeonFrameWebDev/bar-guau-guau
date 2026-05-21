/* Bar Guau Guau - main.js
   Handles: branded loader, age-gate, nav,
   ember particles, mouse glow, scroll reveal + stagger,
   gallery lightbox, event tonight highlight, open-now badge,
   neon divider reveals, scroll cue, nav scroll class, footer year.
*/
"use strict";

/* ── Utilities ───────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ── Branded Loader (first visit only) ──────────────────────── */
(function initLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;

  // Return visits: skip the cinematic intro
  const isReturn = localStorage.getItem("ggAgePassed") === "1";

  if (isReturn) {
    // Minimal load: just remove loader quickly
    const bar = loader.querySelector(".loader-bar-fill");
    let p = 0;
    const t = setInterval(() => {
      p += 20;
      if (bar) bar.style.width = Math.min(p, 100) + "%";
      if (p >= 100) {
        clearInterval(t);
        setTimeout(() => {
          loader.classList.add("fade-out");
          setTimeout(() => {
            loader.style.display = "none";
            document.body.classList.remove("loading");
          }, 500);
        }, 100);
      }
    }, 40);
    return;
  }

  // First visit: cinematic 2.2s intro
  // Diamond draws at 0.1s (CSS), G + wordmark fade at 1.2s/1.5s (CSS)
  // Flash fires at 2.0s (CSS) -- we just control the progress bar
  const bar = loader.querySelector(".loader-bar-fill");
  let p = 0;
  const duration = 2200; // ms total
  const intervalMs = 40;
  const steps = duration / intervalMs;
  const increment = 100 / steps;

  const t = setInterval(() => {
    p += increment;
    if (bar) bar.style.width = Math.min(p, 90) + "%"; // stop at 90, jump to 100 at end
    if (p >= 100) {
      clearInterval(t);
      if (bar) bar.style.width = "100%";
    }
  }, intervalMs);

  // Always auto-exit after 2.4s; age gate sits below loader (z-index) and
  // becomes visible once the loader fades -- it handles its own click flow.
  setTimeout(() => {
    if (bar) bar.style.width = "100%";
    setTimeout(() => {
      loader.classList.add("fade-out");
      setTimeout(() => {
        loader.style.display = "none";
        document.body.classList.remove("loading");
      }, 500);
    }, 200);
  }, 2400);
})();

/* ── Age Gate ─────────────────────────────────────────────── */
(function initAgeGate() {
  const gate = document.getElementById("age-gate");
  if (!gate) return;

  if (localStorage.getItem("ggAgePassed") === "1") {
    gate.style.display = "none";
    document.body.style.overflow = "";
    return;
  }

  document.body.style.overflow = "hidden";

  const enterBtn = document.getElementById("age-enter");
  const exitBtn = document.getElementById("age-exit");
  const loader = document.getElementById("loader");

  if (enterBtn) {
    enterBtn.addEventListener("click", () => {
      localStorage.setItem("ggAgePassed", "1");
      gate.style.transition = "opacity 0.45s ease";
      gate.style.opacity = "0";
      setTimeout(() => {
        gate.style.display = "none";
        document.body.style.overflow = "";
      }, 460);
    });
  }

  if (exitBtn) {
    exitBtn.addEventListener("click", () => {
      window.location.href = "https://www.google.com";
    });
  }
})();

/* ── Nav Hamburger ──────────────────────────────────────────── */
(function initNav() {
  const ham = $(".nav-hamburger");
  const drawer = document.getElementById("nav-drawer");
  if (!ham || !drawer) return;

  ham.addEventListener("click", () => {
    const open = ham.getAttribute("aria-expanded") === "true";
    ham.setAttribute("aria-expanded", String(!open));
    ham.classList.toggle("open", !open);
    drawer.classList.toggle("open", !open);
  });

  $$("a", drawer).forEach((a) => {
    a.addEventListener("click", () => {
      ham.setAttribute("aria-expanded", "false");
      ham.classList.remove("open");
      drawer.classList.remove("open");
    });
  });
})();

/* ── Nav scroll class ────────────────────────────────────────── */
(function initNavScroll() {
  const nav = $("nav");
  if (!nav) return;
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  }, { passive: true });
})();

/* ── Mouse glow on hero (desktop only) ──────────────────────── */
(function initMouseGlow() {
  const hero = document.getElementById("hero");
  if (!hero) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const glowEl = hero.querySelector(".hero-mouse-glow");
  if (!glowEl) return;

  let entered = false;
  hero.addEventListener("mouseenter", () => {
    entered = true;
    glowEl.style.opacity = "1";
  });
  hero.addEventListener("mouseleave", () => {
    entered = false;
    glowEl.style.opacity = "0";
  });
  hero.addEventListener("mousemove", (e) => {
    if (!entered) return;
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    glowEl.style.background = `radial-gradient(circle 220px at ${x}% ${y}%, rgba(230,0,35,0.1) 0%, transparent 70%)`;
  });
})();

/* ── Scroll Cue (bounce arrow) ──────────────────────────────── */
(function initScrollCue() {
  const cue = $(".scroll-cue");
  if (!cue) return;
  window.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
      cue.style.opacity = "0";
      cue.style.pointerEvents = "none";
    } else {
      cue.style.opacity = "1";
      cue.style.pointerEvents = "auto";
    }
  }, { passive: true });
})();

/* ── Scroll Reveal + Stagger ────────────────────────────────── */
(function initReveal() {
  const items = $$(".reveal");
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("revealed");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  items.forEach((el) => io.observe(el));

  // Stagger child cards
  $$(".stagger-parent").forEach((parent) => {
    $$(".stagger-child", parent).forEach((child, i) => {
      child.style.transitionDelay = (i * 90) + "ms";
    });
  });
})();

/* ── Neon Divider reveal ─────────────────────────────────────── */
(function initNeonDividers() {
  const dividers = $$(".neon-divider");
  if (!dividers.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("revealed");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  dividers.forEach((d) => io.observe(d));
})();

/* ── Gallery Lightbox (upgraded) ────────────────────────────── */
(function initLightbox() {
  const gallery = $(".gallery-grid");
  if (!gallery) return;

  const allItems = $$(".gallery-item", gallery);
  let currentIndex = 0;

  const overlay = document.createElement("div");
  overlay.id = "lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Imagen ampliada / Full image");
  overlay.innerHTML = `
    <button class="lb-close" aria-label="Cerrar / Close">&#10005;</button>
    <button class="lb-prev" aria-label="Anterior / Previous">&#8592;</button>
    <div class="lb-img-wrap">
      <img class="lb-img" src="" alt="" />
      <div class="lb-caption"></div>
    </div>
    <button class="lb-next" aria-label="Siguiente / Next">&#8594;</button>
  `;
  document.body.appendChild(overlay);

  const lbImgWrap = overlay.querySelector(".lb-img-wrap");
  const lbImg     = overlay.querySelector(".lb-img");
  const lbCaption = overlay.querySelector(".lb-caption");
  const lbClose   = overlay.querySelector(".lb-close");
  const lbPrev    = overlay.querySelector(".lb-prev");
  const lbNext    = overlay.querySelector(".lb-next");

  function openLb(index) {
    currentIndex = index;
    const item = allItems[currentIndex];
    const img  = $("img", item);
    lbImg.src  = img ? img.src : "";
    lbImg.alt  = img ? (img.alt || "") : "";
    lbCaption.textContent = item.dataset.caption || "";
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";

    // Reset animation
    lbImgWrap.style.animation = "none";
    lbImgWrap.offsetHeight; // reflow
    lbImgWrap.style.animation = "";

    lbClose.focus();
  }

  function closeLb() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    lbImg.src = "";
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + allItems.length) % allItems.length;
    const item = allItems[currentIndex];
    const img  = $("img", item);
    // Quick swap with micro-animation
    lbImg.style.opacity = "0";
    lbImg.style.transform = dir > 0 ? "translateX(20px)" : "translateX(-20px)";
    setTimeout(() => {
      lbImg.src = img ? img.src : "";
      lbImg.alt = img ? (img.alt || "") : "";
      lbCaption.textContent = item.dataset.caption || "";
      lbImg.style.transition = "opacity 0.25s ease, transform 0.25s ease";
      lbImg.style.opacity = "1";
      lbImg.style.transform = "translateX(0)";
    }, 140);
  }

  // Inject caption overlays and wire clicks
  allItems.forEach((item, i) => {
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", `Ver foto: ${item.dataset.caption || (i + 1)}`);

    // Build caption overlay HTML if not already there
    if (!$(".gallery-caption-overlay", item)) {
      const captDiv = document.createElement("div");
      captDiv.className = "gallery-caption-overlay";
      const captSpan = document.createElement("span");
      captSpan.className = "gallery-caption-text";
      captSpan.textContent = item.dataset.caption || "";
      captDiv.appendChild(captSpan);
      item.appendChild(captDiv);
    }

    const activate = () => openLb(i);
    item.addEventListener("click", activate);
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); }
    });
  });

  lbClose.addEventListener("click", closeLb);
  lbPrev.addEventListener("click", () => navigate(-1));
  lbNext.addEventListener("click", () => navigate(1));
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeLb(); });
  document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("open")) return;
    if (e.key === "Escape")     closeLb();
    if (e.key === "ArrowLeft")  navigate(-1);
    if (e.key === "ArrowRight") navigate(1);
  });
})();

/* ── Event card "Tonight" highlight ─────────────────────────── */
(function initTonightHighlight() {
  const cards = $$(".event-card-full[data-day]");
  if (!cards.length) return;

  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

  // Map day numbers to our event data-day values
  const dayMap = {
    1: "monday",
    2: "tuesday",
    5: "friday",
    6: "saturday",
    0: "sunday"
  };

  const todayKey = dayMap[dayOfWeek];

  cards.forEach((card) => {
    if (card.dataset.day === todayKey) {
      card.classList.add("tonight");
    }
  });
})();

/* ── Open Now badge ──────────────────────────────────────────── */
(function initOpenNow() {
  const badges = $$(".open-now-badge");
  if (!badges.length) return;

  const now   = new Date();
  const hour  = now.getHours(); // 0-23
  // Open 7 PM (19) to 3 AM (3)
  const isOpen = hour >= 19 || hour < 3;

  badges.forEach((badge) => {
    if (isOpen) {
      badge.classList.add("visible");
    }
  });
})();

/* ── Nav active section highlight ────────────────────────────── */
(function initNavActive() {
  const sections = $$("section[id]");
  const navLinks = $$(".nav-links a[href^='#']");
  if (!sections.length || !navLinks.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      navLinks.forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === "#" + id);
      });
    });
  }, { rootMargin: "-40% 0px -55% 0px" });

  sections.forEach((s) => io.observe(s));
})();

/* ── Footer year ─────────────────────────────────────────────── */
(function setYear() {
  $$(".copyright-year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
