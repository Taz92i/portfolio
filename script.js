/* ================================================================
   SITE VITRINE — SCRIPT PRINCIPAL
   Vanilla JavaScript uniquement, aucune dépendance externe.
   Aucun cookie, aucun tracker, aucun appel réseau.
   ================================================================ */

(function () {
  "use strict";

  // Respecte la préférence "mouvement réduit" du système d'exploitation.
  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Détecte un pointeur précis (souris) pour n'activer l'effet 3D
  // qu'sur desktop, jamais sur mobile/tactile.
  var hasFinePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  /* -------------------------------------------------------------
     1. Année automatique dans le pied de page
  ------------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* -------------------------------------------------------------
     2. Menu de navigation mobile (hamburger)
  ------------------------------------------------------------- */
  var navToggle = document.getElementById("nav-toggle");
  var mainNav = document.getElementById("main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute(
        "aria-label",
        isOpen ? "Fermer le menu" : "Ouvrir le menu"
      );
    });

    // Ferme le menu automatiquement après avoir cliqué un lien
    // (pratique sur mobile pour ne pas devoir refermer manuellement).
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* -------------------------------------------------------------
     3. Mise en évidence du lien de navigation actif au défilement
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
              var match = link.getAttribute("href") === "#" + id;
              link.classList.toggle("is-active", match);
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
     4. Apparition progressive des blocs au défilement
     (respecte prefers-reduced-motion : tout reste visible d'emblée)
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
    // Sans IntersectionObserver ou avec mouvement réduit : tout affiché directement.
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* -------------------------------------------------------------
     5. Remplissage animé des barres de compétences
  ------------------------------------------------------------- */
  var skillBars = document.querySelectorAll(".skill-bar span");

  if (skillBars.length && "IntersectionObserver" in window) {
    var skillObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-filled");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    skillBars.forEach(function (bar) {
      skillObserver.observe(bar);
    });
  } else {
    skillBars.forEach(function (bar) {
      bar.classList.add("is-filled");
    });
  }

  /* -------------------------------------------------------------
     6. Effet 3D léger : inclinaison du pipeline commercial (hero)
     et des cartes projets, au mouvement de la souris.
     Désactivé sur tactile et si "mouvement réduit" est demandé.
  ------------------------------------------------------------- */
  if (hasFinePointer && !prefersReducedMotion) {
    var pipeline = document.getElementById("pipeline");

    if (pipeline) {
      var pipelineScene = pipeline.parentElement;

      pipelineScene.addEventListener("mousemove", function (event) {
        var bounds = pipelineScene.getBoundingClientRect();
        var relX = (event.clientX - bounds.left) / bounds.width - 0.5; // -0.5 à 0.5
        var relY = (event.clientY - bounds.top) / bounds.height - 0.5;

        var rotateY = relX * -18 - 10; // amplitude limitée, garde un rendu sobre
        var rotateX = relY * 14 + 6;

        pipeline.style.transform =
          "rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)";
      });

      pipelineScene.addEventListener("mouseleave", function () {
        pipeline.style.transform = "rotateX(6deg) rotateY(-10deg)";
      });
    }

    // Légère inclinaison des cartes projets au survol (profondeur discrète).
    var tiltCards = document.querySelectorAll("[data-tilt-card]");
    tiltCards.forEach(function (card) {
      card.addEventListener("mousemove", function (event) {
        var bounds = card.getBoundingClientRect();
        var relX = (event.clientX - bounds.left) / bounds.width - 0.5;
        var relY = (event.clientY - bounds.top) / bounds.height - 0.5;

        card.style.transform =
          "rotateX(" + (relY * -6) + "deg) rotateY(" + (relX * 8) + "deg) translateY(-4px)";
      });

      card.addEventListener("mouseleave", function () {
        card.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0)";
      });
    });
  }
})();
