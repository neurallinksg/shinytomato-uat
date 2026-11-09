import Lenis from "/shinytomato-uat/node_modules/lenis/dist/lenis.mjs";

var style = document.createElement("style");
style.textContent = [
  "html.lenis,html.lenis body{height:auto}",
  ".lenis:not(.lenis-autoToggle).lenis-stopped{overflow:clip}",
  ".lenis [data-lenis-prevent],.lenis [data-lenis-prevent-wheel],.lenis [data-lenis-prevent-touch]{overscroll-behavior:contain}",
  /* Native hash fallback when JS/Lenis is unavailable. */
  "html{scroll-padding-top:var(--st-anchor-offset,150px)}"
].join("");
document.head.appendChild(style);

var PREVENT_SELECTOR = [
  ".st-dropdown",
  ".nav-dropdown",
  ".dropdown-menu",
  ".st-nav",
  "header .nav",
  ".modal",
  ".lightbox",
  ".lightbox-panel",
  "[role='dialog']"
].join(",");

var active = null;
var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function markNativeScrollAreas() {
  document.querySelectorAll(PREVENT_SELECTOR).forEach(function (element) {
    element.setAttribute("data-lenis-prevent", "");
  });
}

function stickyHeaderOffset() {
  var header = document.querySelector(".st-site-header, .site-header, header.header");
  if (!header) return 150;
  return Math.ceil(header.getBoundingClientRect().height) + 16;
}

function syncAnchorOffset() {
  var offset = stickyHeaderOffset();
  document.documentElement.style.setProperty("--st-anchor-offset", offset + "px");
  return offset;
}

function resolveHashTarget(hash) {
  if (!hash || hash === "#") return null;
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch (err) {
    return null;
  }
}

function currentScrollY(lenis) {
  if (lenis && typeof lenis.scroll === "number") return lenis.scroll;
  return window.scrollY || window.pageYOffset || 0;
}

function targetScrollTop(target, lenis) {
  var offset = syncAnchorOffset();
  return Math.max(0, target.getBoundingClientRect().top + currentScrollY(lenis) - offset);
}

function scrollToHash(lenis, hash, immediate) {
  var target = resolveHashTarget(hash);
  if (!target) return false;
  var top = targetScrollTop(target, lenis);
  if (lenis) {
    lenis.scrollTo(top, { immediate: !!immediate, lock: true });
  } else {
    window.scrollTo({
      top: top,
      behavior: immediate || reduceMotion.matches ? "auto" : "smooth"
    });
  }
  return true;
}

function afterLayout(fn) {
  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(fn);
  });
}

function scrollToStart(lenis) {
  if (window.location.hash) {
    afterLayout(function () {
      scrollToHash(lenis, window.location.hash, true);
    });
    return;
  }
  lenis.scrollTo(0, { immediate: true });
}

function samePageHash(anchor) {
  if (!anchor || !anchor.hash || anchor.hasAttribute("download") || anchor.target === "_blank") {
    return null;
  }
  var href = anchor.getAttribute("href") || "";
  if (href.charAt(0) === "#") return anchor.hash;
  try {
    var url = new url(anchor.href, window.location.href);
    // Same document path counts as in-page even if a preview/cache-bust query differs.
    if (url.pathname === window.location.pathname && url.hash) {
      return url.hash;
    }
  } catch (err) {
    return null;
  }
  return null;
}

function onAnchorClick(event) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }
  var anchor = event.target && event.target.closest ? event.target.closest("a[href]") : null;
  var hash = samePageHash(anchor);
  if (!hash) return;
  var target = resolveHashTarget(hash);
  if (!target) return;
  event.preventDefault();
  if (history.pushState) {
    history.pushState(null, "", hash);
  } else {
    window.location.hash = hash;
  }
  scrollToHash(active && active.lenis ? active.lenis : null, hash, false);
}

function onHashChange() {
  scrollToHash(active && active.lenis ? active.lenis : null, window.location.hash, false);
}

function mount() {
  syncAnchorOffset();
  if (active) return;

  if (reduceMotion.matches) {
    if (window.location.hash) {
      afterLayout(function () {
        scrollToHash(null, window.location.hash, true);
      });
    }
    return;
  }

  markNativeScrollAreas();
  var lenis = new Lenis({
    duration: 1.1,
    easing: function (t) {
      return Math.min(1, 1.001 - Math.pow(2, -10 * t));
    },
    smoothWheel: true,
    touchMultiplier: 1.2,
    prevent: function (node) {
      return Boolean(node.closest && node.closest("[data-lenis-prevent]"));
    }
  });
  var rafId = 0;
  function raf(time) {
    lenis.raf(time);
    rafId = window.requestAnimationFrame(raf);
  }
  rafId = window.requestAnimationFrame(raf);
  scrollToStart(lenis);
  active = {
    lenis: lenis,
    destroy: function () {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
      active = null;
    }
  };
}

function unmount() {
  if (active) active.destroy();
}

document.addEventListener("click", onAnchorClick);
window.addEventListener("hashchange", onHashChange);
window.addEventListener("resize", syncAnchorOffset);

mount();
window.addEventListener("pagehide", unmount);
window.addEventListener("pageshow", function (event) {
  if (event.persisted) mount();
});
reduceMotion.addEventListener("change", function () {
  if (reduceMotion.matches) {
    unmount();
    syncAnchorOffset();
  } else {
    mount();
  }
});
