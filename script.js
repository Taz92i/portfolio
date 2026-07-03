/* ================================================================
   PORTFOLIO — SCRIPT PRINCIPAL
   Vanilla JavaScript uniquement. Aucune dépendance, aucun tracker,
   aucun cookie. Animations discrètes uniquement, jamais de gadget.
   Le site reste utilisable sans JavaScript (les ancres fonctionnent
   nativement) : ce script n'apporte que des améliorations.
   ================================================================ */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* -------------------------------------------------------------
     1. Année automatique dans le pied de page
  ------------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* -------------------------------------------------------------
     2. Menu de navigation mobile
  ------------------------------------------------------------- */
  var navToggle = document.getElementById("nav-toggle");
  var mainNav = document.getElementById("main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Ouvrir le menu");
      });
    });
  }

  /* -------------------------------------------------------------
     3. Lien de navigation actif selon la section visible
  ------------------------------------------------------------- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".nav-link");

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            navLinks.forEach(function (link) {
              var isMatch = link.getAttribute("href") === "#" + id;
              if (isMatch) {
                link.setAttribute("aria-current", "true");
              } else {
                link.removeAttribute("aria-current");
              }
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  /* -------------------------------------------------------------
     4. Apparition discrète des blocs au défilement
     (désactivée si l'utilisateur préfère un mouvement réduit)
  ------------------------------------------------------------- */
  var revealEls = document.querySelectorAll("[data-reveal]");

  if (revealEls.length && "IntersectionObserver" in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* -------------------------------------------------------------
     5. Légère élévation de l'en-tête après le début du défilement
     (repère visuel discret, pas d'effet de flou ni de gadget)
  ------------------------------------------------------------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var applyHeaderState = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    applyHeaderState();
    window.addEventListener("scroll", applyHeaderState, { passive: true });
  }
})();
