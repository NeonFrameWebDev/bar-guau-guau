/* Bar Guau Guau - main.js
   Handles: age-gate, loader, nav hamburger, parallax (desktop only),
   scroll reveal with stagger, gallery lightbox, scroll cue.
*/
"use strict";

/* ── Age Gate ─────────────────────────────────────────────── */
(function initAgeGate() {
  const gate = document.getElementById("age-gate");
  if (!gate) return;

  // Check localStorage before showing anything
  if (localStorage.getItem("ggAgePassed") === "1") {
    gate.style.display = "none";
    document.body.style.overflow = "";
    return;
  }

  // Gate is visible: lock scroll
  document.body.style.overflow = "hidden";

  const enterBtn = document.getElementById("age-enter");
  const exitBtn = document.getElementById("age-exit");

  if (enterBtn) {
    enterBtn.addEventListener("click", () => {
      localStorage.setItem("ggAgePassed", "1");
      gate.style.transition = "opacity 0.4s ease";
      gate.style.opacity = "0";
      setTimeout(() => {
        gate.style.display = "none";
        document.body.style.overflow = "";
      }, 420);
    });
  }

  if (exitBtn) {
    exitBtn.addEventListener("click", () => {
      window.location.href = "https://www.google.com";
    });
  }
})();

/* ── Loader ─────────────────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;

  // Do not run loader logic until age gate is cleared
  function runLoader() {
    const bar = loader.querySelector(".loader-bar-fill");
    let progress = 0;
    const tick = setInterval(() => {
      progress += 7;
      if (bar) bar.style.width = Math.min(progress, 100) + "%";
      if (progress >= 100) {
        clearInterval(tick);
        setTimeout(() => {
          loader.classList.add("fade-out");
          loader.style.pointerEvents = "none";
          setTimeout(() => {
            loader.style.display = "none";
            document.body.classList.remove("loading");
          }, 400);
        }, 150);
      }
    }, 80);
  }

  // If age gate already passed (return visitor), run loader immediately
  if (localStorage.getItem("ggAgePassed") === "1") {
    runLoader();
    return;
  }

  // First visit: wait for age gate exit, then run loader
  const enterBtn = document.getElementById("age-enter");
  if (enterBtn) {
    enterBtn.addEventListener("click", () => {
      setTimeout(runLoader, 450);
    });
  } else {
    runLoader();
  }
})();

/* ── Nav Hamburger ──────────────────────────────────────────── */
(function initNav() {
  const ham = document.querySelector(".nav-hamburger");
  const drawer = document.getElementById("nav-drawer");
  if (!ham || !drawer) return;

  ham.addEventListener("click", () => {
    const open = ham.getAttribute("aria-expanded") === "true";
    ham.setAttribute("aria-expanded", String(!open));
    ham.classList.toggle("open", !open);
    drawer.classList.toggle("open", !open);
  });

  drawer.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      ham.setAttribute("aria-expanded", "false");
      ham.classList.remove("open");
      drawer.classList.remove("open");
    });
  });
})();

/* ── Parallax (desktop only) ────────────────────────────────── */
(function initParallax() {
  const heroImg = document.querySelector(".hero-img");
  if (!heroImg) return;

  // Gate: desktop only, no will-change on mobile (compositing layer memory)
  if (window.innerWidth < 768) return;

  heroImg.style.willChange = "transform";

  function onScroll() {
    const y = window.scrollY;
    heroImg.style.transform = "translateY(" + (y * 0.3) + "px)";
  }

  window.addEventListener("scroll", onScroll, { passive: true });
})();

/* ── Scroll Cue (bounce arrow) ──────────────────────────────── */
(function initScrollCue() {
  const cue = document.querySelector(".scroll-cue");
  if (!cue) return;

  function checkScroll() {
    if (window.scrollY > 100) {
      cue.style.opacity = "0";
      cue.style.pointerEvents = "none";
    } else {
      cue.style.opacity = "1";
      cue.style.pointerEvents = "auto";
    }
  }

  window.addEventListener("scroll", checkScroll, { passive: true });
})();

/* ── Scroll Reveal ──────────────────────────────────────────── */
(function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("revealed");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((el) => io.observe(el));

  // Stagger child cards
  document.querySelectorAll(".stagger-parent").forEach((parent) => {
    const children = parent.querySelectorAll(".stagger-child");
    children.forEach((child, i) => {
      child.style.transitionDelay = (i * 80) + "ms";
    });
  });
})();

/* ── Gallery Lightbox ───────────────────────────────────────── */
(function initLightbox() {
  const gallery = document.querySelector(".gallery-grid");
  if (!gallery) return;

  const allItems = gallery.querySelectorAll(".gallery-item");
  let currentIndex = 0;

  // Build lightbox DOM
  const overlay = document.createElement("div");
  overlay.id = "lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Imagen ampliada / Full image");
  overlay.innerHTML = `
    <button class="lb-close" aria-label="Cerrar / Close">&#10005;</button>
    <button class="lb-prev" aria-label="Anterior / Previous">&#8592;</button>
    <img class="lb-img" src="" alt="" />
    <button class="lb-next" aria-label="Siguiente / Next">&#8594;</button>
  `;
  document.body.appendChild(overlay);

  const lbImg = overlay.querySelector(".lb-img");
  const lbClose = overlay.querySelector(".lb-close");
  const lbPrev = overlay.querySelector(".lb-prev");
  const lbNext = overlay.querySelector(".lb-next");

  function openLb(index) {
    currentIndex = index;
    const item = allItems[currentIndex];
    const img = item.querySelector("img");
    lbImg.src = img.src;
    lbImg.alt = img.alt || "";
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    lbClose.focus();
  }

  function closeLb() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    lbImg.src = "";
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + allItems.length) % allItems.length;
    const item = allItems[currentIndex];
    const img = item.querySelector("img");
    lbImg.src = img.src;
    lbImg.alt = img.alt || "";
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % allItems.length;
    const item = allItems[currentIndex];
    const img = item.querySelector("img");
    lbImg.src = img.src;
    lbImg.alt = img.alt || "";
  }

  allItems.forEach((item, i) => {
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");

    const activate = () => openLb(i);
    item.addEventListener("click", activate);
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    });
  });

  lbClose.addEventListener("click", closeLb);
  lbPrev.addEventListener("click", showPrev);
  lbNext.addEventListener("click", showNext);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeLb();
  });

  document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "ArrowRight") showNext();
  });
})();

/* ── Nav active section highlight ───────────────────────────── */
(function initNavActive() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
  if (!sections.length || !navLinks.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        navLinks.forEach((a) => {
          a.classList.toggle("active", a.getAttribute("href") === "#" + id);
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((s) => io.observe(s));
})();

/* ── Footer year ─────────────────────────────────────────────── */
(function setYear() {
  document.querySelectorAll(".copyright-year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
