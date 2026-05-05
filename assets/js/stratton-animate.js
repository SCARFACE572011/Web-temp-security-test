(function () {
  "use strict";

  /* ---- Scroll-reveal via IntersectionObserver ---- */
  function initScrollReveal() {
    var targets = document.querySelectorAll(
      ".about-one .sec-title, .about-one .stratton-about-lede," +
      ".services-one .sec-title, .services-one__right-content .outer-box," +
      ".stratton-field .sec-title, .stratton-field__tile," +
      ".slogan-one .slogan-one__content-box," +
      ".counter-one__single"
    );

    targets.forEach(function (el, i) {
      el.classList.add("sr-fadeup");
      var level = (i % 6) + 1;
      el.classList.add("sr-delay-" + level);
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("sr-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.10 }
    );

    document.querySelectorAll(".sr-fadeup, .sr-fadeleft, .sr-faderight, .sr-scale").forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---- Service cards, why items, about elements scroll-reveal ---- */
  function initElementReveal() {
    var groups = [
      { selector: ".stratton-service-card", cls: "sr-fadeup" },
      { selector: ".stratton-why__item",    cls: "sr-scale"  },
      { selector: ".stratton-values",       cls: "sr-fadeleft" },
      { selector: ".stratton-about-imgwrap",cls: "sr-fadeup" },
      { selector: ".stratton-about-stack figure", cls: "sr-fadeup" },
      { selector: ".contact-one__form",     cls: "sr-faderight" },
      { selector: ".stratton-contact__details", cls: "sr-fadeleft" },
    ];

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("sr-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10 });

    groups.forEach(function (group) {
      document.querySelectorAll(group.selector).forEach(function (el, i) {
        el.classList.add(group.cls);
        el.classList.add("sr-delay-" + Math.min((i % 6) + 1, 6));
        io.observe(el);
      });
    });
  }

  /* ---- Hero slide: reset & replay CSS animations on slide change ---- */
  function initHeroSlideAnimReset() {
    var slider = document.querySelector(".main-slider-one__carousel");
    if (!slider) return;

    function replayAnim(slide) {
      var animated = slide.querySelectorAll(
        ".stratton-hero-logo-badge, .stratton-slide-title h2, .stratton-hero-tagline, .stratton-hero-cta"
      );
      animated.forEach(function (el) {
        el.style.animation = "none";
        void el.offsetWidth;
        el.style.animation = "";
      });
    }

    var mo = new MutationObserver(function (mutations) {
      mutations.forEach(function (mut) {
        if (
          mut.type === "attributes" &&
          mut.attributeName === "class" &&
          mut.target.classList.contains("swiper-slide-active")
        ) {
          replayAnim(mut.target);
        }
      });
    });

    slider.querySelectorAll(".swiper-slide").forEach(function (slide) {
      mo.observe(slide, { attributes: true });
    });
  }

  /* ---- Logo spin on hover (header) ---- */
  function initLogoHover() {
    var logoImg = document.querySelector(".stratton-logo .stratton-logo__img");
    if (!logoImg) return;
    logoImg.addEventListener("mouseenter", function () {
      logoImg.style.transition = "transform 0.6s cubic-bezier(0.34,1.56,0.64,1)";
      logoImg.style.transform = "scale(1.12) rotate(8deg)";
    });
    logoImg.addEventListener("mouseleave", function () {
      logoImg.style.transform = "scale(1) rotate(0deg)";
    });
  }

  /* ---- Animated dot particles in hero ---- */
  function initHeroParticles() {
    var container = document.querySelector(".stratton-hero-particles");
    if (!container) return;

    var count = 22;
    for (var i = 0; i < count; i++) {
      var dot = document.createElement("span");
      var size  = Math.random() * 5 + 2;
      var alpha = Math.random() * 0.38 + 0.08;
      var dur   = Math.random() * 16 + 8;
      var delay = -Math.random() * 12;
      dot.style.cssText = [
        "position:absolute",
        "border-radius:50%",
        "pointer-events:none",
        "background:rgba(209,26,26," + alpha + ")",
        "width:" + size + "px",
        "height:" + size + "px",
        "left:" + (Math.random() * 100) + "%",
        "top:" + (Math.random() * 100) + "%",
        "animation:dotFloat " + dur + "s ease-in-out " + delay + "s infinite alternate",
      ].join(";");
      container.appendChild(dot);
    }

    if (!document.getElementById("stratton-dot-kf")) {
      var style = document.createElement("style");
      style.id = "stratton-dot-kf";
      style.textContent =
        "@keyframes dotFloat{" +
        "0%{transform:translate(0,0) scale(1);opacity:0.4}" +
        "50%{transform:translate(" + randomRange(-40, 40) + "px," + randomRange(-60, 60) + "px) scale(1.5);opacity:0.9}" +
        "100%{transform:translate(" + randomRange(-30, 30) + "px," + randomRange(-40, 40) + "px) scale(0.8);opacity:0.3}" +
        "}";
      document.head.appendChild(style);
    }
  }

  /* ---- Subtle parallax tilt on field tiles (desktop only) ---- */
  function initTileTilt() {
    if (window.matchMedia("(hover: none)").matches) return;
    var tiles = document.querySelectorAll(".stratton-field__tile");
    tiles.forEach(function (tile) {
      tile.addEventListener("mousemove", function (e) {
        var rect = tile.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width  - 0.5;
        var y = (e.clientY - rect.top)  / rect.height - 0.5;
        tile.style.transform = "translateY(-4px) rotateX(" + (-y * 4) + "deg) rotateY(" + (x * 4) + "deg)";
      });
      tile.addEventListener("mouseleave", function () {
        tile.style.transform = "";
      });
    });
  }

  /* ---- Counter number sparkle on odometer finish ---- */
  function initCounterSparkle() {
    var counters = document.querySelectorAll(".counter-one__single");
    if (!counters.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          setTimeout(function () {
            el.style.transition = "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)";
            el.style.transform = "scale(1.06)";
            setTimeout(function () { el.style.transform = ""; }, 320);
          }, 1600);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { io.observe(c); });
  }

  /* ---- Service card border-left color pulse on viewport entry ---- */
  function initCardEntry() {
    var cards = document.querySelectorAll(".stratton-service-card");
    if (!cards.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.style.borderLeftColor = "var(--red-bright)";
          setTimeout(function () {
            el.style.transition = "border-left-color 0.6s ease";
            el.style.borderLeftColor = "";
          }, 400);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.15 });
    cards.forEach(function (c) { io.observe(c); });
  }

  function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  /* ---- Init ---- */
  document.addEventListener("DOMContentLoaded", function () {
    initScrollReveal();
    initElementReveal();
    initHeroSlideAnimReset();
    initLogoHover();
    initHeroParticles();
    initTileTilt();
    initCounterSparkle();
    initCardEntry();
  });
})();
