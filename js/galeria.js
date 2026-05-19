/* galeria.js -- Bar Guau Guau
   Handles:
   - Hero parallax (transform, not position:fixed)
   - Scroll cue fade
   - Masonry lightbox (premium: scale-in open, swap nav, swipe, counter)
   - i18n caption sync
*/
"use strict";

/* ── Utility ──────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ── Hero Parallax ────────────────────────────────────────────── */
(function initHeroParallax() {
  const hero    = $(".gal-hero");
  const heroImg = $(".gal-hero-img");
  if (!hero || !heroImg) return;

  // Only run on desktop to avoid compositing cost on mobile
  const canParallax = window.innerWidth >= 768 &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!canParallax) return;

  function onScroll() {
    const scrolled = window.scrollY;
    // Image sits inside overflow:hidden, 130% tall -- translateY by 30% of scroll
    heroImg.style.transform = "translateY(" + (scrolled * 0.28) + "px)";
  }

  window.addEventListener("scroll", onScroll, { passive: true });
})();

/* ── Scroll Cue Fade ──────────────────────────────────────────── */
(function initScrollCue() {
  const cue = $(".gal-scroll-cue");
  if (!cue) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 90) {
      cue.style.opacity = "0";
      cue.style.pointerEvents = "none";
    } else {
      cue.style.opacity = "1";
      cue.style.pointerEvents = "auto";
    }
  }, { passive: true });
})();

/* ── Premium Lightbox ─────────────────────────────────────────── */
(function initGalLightbox() {
  const masonry  = $("#galMasonry");
  const lightbox = $("#gal-lightbox");
  if (!masonry || !lightbox) return;

  const allTiles  = $$(".gal-tile", masonry);
  const totalTiles = allTiles.length;

  const glbImg    = $("#glbImg");
  const glbCap    = $("#glbCaption");
  const glbCount  = $("#glbCounter");
  const glbClose  = $(".glb-close", lightbox);
  const glbPrev   = $(".glb-prev",  lightbox);
  const glbNext   = $(".glb-next",  lightbox);

  let currentIndex = 0;
  let isOpen = false;

  /* ── Language helper: read i18n.js lang state ─────────────── */
  function getLang() {
    return document.body.dataset.lang || "es";
  }

  function getCaptionForTile(tile) {
    const lang = getLang();
    return tile.dataset[lang] || tile.dataset.es || "";
  }

  /* ── Update counter ──────────────────────────────────────── */
  function updateCounter(idx) {
    if (glbCount) {
      glbCount.textContent = (idx + 1) + " / " + totalTiles;
    }
  }

  /* ── Open lightbox ───────────────────────────────────────── */
  function openLightbox(index) {
    currentIndex = index;
    const tile = allTiles[currentIndex];

    // Set image
    const tileImg = $("img", tile);
    glbImg.src = tileImg ? tileImg.src : (tile.dataset.src || "");
    glbImg.alt = tileImg ? (tileImg.alt || "") : "";

    // Set caption
    glbCap.textContent = getCaptionForTile(tile);

    // Counter
    updateCounter(currentIndex);

    // Show lightbox
    lightbox.classList.add("glb-open");
    document.body.style.overflow = "hidden";
    isOpen = true;

    // Focus management
    setTimeout(() => { glbClose && glbClose.focus(); }, 50);

    // ARIA
    lightbox.setAttribute("aria-hidden", "false");
  }

  /* ── Close lightbox ──────────────────────────────────────── */
  function closeLightbox() {
    if (!isOpen) return;
    lightbox.classList.remove("glb-open");
    document.body.style.overflow = "";
    isOpen = false;

    // ARIA
    lightbox.setAttribute("aria-hidden", "true");

    // Return focus to tile that opened it
    const originTile = allTiles[currentIndex];
    if (originTile) {
      setTimeout(() => { originTile.focus(); }, 100);
    }

    // Clear src after transition
    setTimeout(() => {
      if (!isOpen) glbImg.src = "";
    }, 300);
  }

  /* ── Navigate: dir = 1 (next) or -1 (prev) ──────────────── */
  function navigate(dir) {
    if (!isOpen) return;

    const nextIndex = (currentIndex + dir + totalTiles) % totalTiles;
    const tile = allTiles[nextIndex];

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isReduced) {
      // Hard swap for reduced-motion users
      currentIndex = nextIndex;
      const tileImg = $("img", tile);
      glbImg.src = tileImg ? tileImg.src : (tile.dataset.src || "");
      glbImg.alt = tileImg ? (tileImg.alt || "") : "";
      glbCap.textContent = getCaptionForTile(tile);
      updateCounter(currentIndex);
      return;
    }

    // Slide-swap animation
    const outDir = dir > 0 ? "" : "glb-prev-dir";

    // Phase 1: swap-out current image
    glbImg.classList.remove("glb-swap-in", "glb-swap-out", "glb-prev-dir", "glb-visible");
    void glbImg.offsetWidth; // force reflow
    glbImg.classList.add("glb-swap-out");
    if (dir < 0) glbImg.classList.add("glb-prev-dir");

    setTimeout(() => {
      // Phase 2: update data
      currentIndex = nextIndex;
      const tileImg = $("img", tile);
      glbImg.src = tileImg ? tileImg.src : (tile.dataset.src || "");
      glbImg.alt = tileImg ? (tileImg.alt || "") : "";
      glbCap.textContent = getCaptionForTile(tile);
      updateCounter(currentIndex);

      // Phase 3: swap-in
      glbImg.classList.remove("glb-swap-out", "glb-prev-dir");
      glbImg.classList.add("glb-swap-in");
      if (dir > 0) glbImg.classList.add("glb-prev-dir"); // reverse for in-direction
      void glbImg.offsetWidth;
      glbImg.classList.add("glb-visible");

      setTimeout(() => {
        glbImg.classList.remove("glb-swap-in", "glb-prev-dir", "glb-visible");
      }, 220);
    }, 155);
  }

  /* ── Wire tiles ──────────────────────────────────────────── */
  allTiles.forEach((tile, i) => {
    tile.setAttribute("tabindex", "0");
    tile.setAttribute("role", "button");
    tile.setAttribute("aria-label",
      "Ver foto " + (i + 1) + " de " + totalTiles +
      " / View photo " + (i + 1) + " of " + totalTiles
    );

    tile.addEventListener("click", () => openLightbox(i));
    tile.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(i);
      }
    });
  });

  /* ── Control buttons ─────────────────────────────────────── */
  if (glbClose) glbClose.addEventListener("click", closeLightbox);
  if (glbPrev)  glbPrev.addEventListener("click",  () => navigate(-1));
  if (glbNext)  glbNext.addEventListener("click",  () => navigate(1));

  /* Click outside stage to close */
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  /* ── Keyboard ────────────────────────────────────────────── */
  document.addEventListener("keydown", (e) => {
    if (!isOpen) return;
    if (e.key === "Escape")                    closeLightbox();
    if (e.key === "ArrowRight" || e.key === "ArrowDown")  navigate(1);
    if (e.key === "ArrowLeft"  || e.key === "ArrowUp")    navigate(-1);
  });

  /* ── Touch swipe ─────────────────────────────────────────── */
  let touchStartX = 0;
  let touchStartY = 0;

  lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  lightbox.addEventListener("touchend", (e) => {
    if (!isOpen) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    // Only register as horizontal swipe if X travel > Y travel and > 45px
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) {
      if (dx < 0) navigate(1);  // swipe left = next
      else        navigate(-1); // swipe right = prev
    }
  }, { passive: true });

  /* ── i18n caption sync when language toggles ─────────────── */
  // i18n.js does not dispatch a custom event; we observe the lang-toggle
  // buttons directly and re-read the tile caption after the toggle fires.
  document.querySelectorAll(".lang-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      // i18n.js processes the toggle synchronously, so by next tick body.dataset.lang
      // is already updated.
      requestAnimationFrame(() => {
        if (isOpen) {
          const tile = allTiles[currentIndex];
          if (tile) glbCap.textContent = getCaptionForTile(tile);
        }
      });
    });
  });

  /* ── Initial ARIA hidden ─────────────────────────────────── */
  lightbox.setAttribute("aria-hidden", "true");

})();
