(function () {
  "use strict";
  var root = document.querySelector(".st-site-header");
  if (!root) return;
  var toggle = root.querySelector(".st-menu-btn");
  var nav = root.querySelector(".st-nav");
  var groups = Array.prototype.slice.call(root.querySelectorAll(".st-group"));

  function closeGroups(except) {
    groups.forEach(function (group) {
      if (group !== except) {
        group.classList.remove("st-open");
        var button = group.querySelector("button");
        if (button) button.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("st-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "✕" : "☰";
      if (!open) closeGroups();
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("st-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "☰";
        closeGroups();
      });
    });
  }

  groups.forEach(function (group) {
    var button = group.querySelector("button");
    if (!button) return;
    button.addEventListener("click", function (event) {
      event.stopPropagation();
      var open = !group.classList.contains("st-open");
      closeGroups(group);
      group.classList.toggle("st-open", open);
      button.setAttribute("aria-expanded", String(open));
    });
  });

  document.addEventListener("click", function (event) {
    if (!root.contains(event.target)) closeGroups();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeGroups();
      if (nav) nav.classList.remove("st-open");
      if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "☰";
        toggle.focus();
      }
    }
  });
})();
