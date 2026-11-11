(function () {
  "use strict";
  var nav = document.getElementById("main-nav");
  var menu = document.querySelector(".menu-button");
  var theme = document.querySelector(".theme-button");
  var dialog = document.getElementById("figure-dialog");
  var trigger;

  menu.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      nav.classList.remove("open");
      menu.setAttribute("aria-expanded", "false");
      menu.focus();
    }
  });
  function themeLabel() {
    theme.setAttribute("aria-label", "Switch to " + (document.documentElement.classList.contains("dark") ? "light" : "dark") + " theme");
  }
  themeLabel();
  theme.addEventListener("click", function () {
    var dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("lorenzo-theme", dark ? "dark" : "light");
    } catch (error) {
      /* Storage is optional. */
    }
    themeLabel();
  });
  document.querySelectorAll("[data-figure]").forEach(function (button) {
    button.addEventListener("click", function () {
      trigger = button;
      var thumbnail = button.querySelector("img");
      var full = document.getElementById("full-figure");
      full.src = button.getAttribute("data-full-figure");
      full.alt = thumbnail.alt;
      document.getElementById("figure-title").textContent = thumbnail.alt;
      dialog.showModal();
    });
  });
  document.querySelector(".close-dialog").addEventListener("click", function () {
    dialog.close();
  });
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", function () {
    if (trigger) trigger.focus();
  });
  dialog.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      event.preventDefault();
      dialog.close();
    }
  });
  document.querySelector(".skip").addEventListener("click", function (event) {
    event.preventDefault();
    var main = document.getElementById("main");
    main.tabIndex = -1;
    main.focus();
  });
  var back = document.querySelector(".back-to-top");
  function showBackToTop() {
    back.hidden = window.scrollY < 700;
  }
  window.addEventListener("scroll", showBackToTop, { passive: true });
  showBackToTop();
  back.addEventListener("click", function () {
    window.scrollTo(0, 0);
  });

  // Preserve links shared during the local design review and older homepage anchors.
  if (document.querySelector("#home")) {
    var destinations = {
      publications: "publications/",
      "policy-reports": "policy-reports/",
      "current-research": "current-research/",
      "working-papers": "current-research/",
      projects: "projects/",
      teaching: "teaching/",
      talks: "talks/",
      cv: "cv/",
    };
    var target = destinations[window.location.hash.slice(1)];
    if (target) window.location.replace(document.querySelector("#main-nav a").href + target);
  }
})();
