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
      /* gentle stagger: cap at 6 delay levels */
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
      { threshold: 0.12 }
    );

    document.querySelectorAll(".sr-fadeup, .sr-fadeleft, .sr-faderight").forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---- Hero slide: reset & replay CSS animations on slide change ---- */
  function initHeroSlideAnimReset() {
    var slider = document.querySelector(".main-slider-one__carousel");
    if (!slider) return;

    function replayAnim(slide) {
      var animated = slide.querySelectorAll(
        ".stratton-hero-logo-badge, .stratton-slide-title h2, .stratton-hero-tagline"
      );
      animated.forEach(function (el) {
        el.style.animation = "none";
        /* force reflow */
        void el.offsetWidth;
        el.style.animation = "";
      });
    }

    /* Watch for swiper-slide-active class changes */
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

    var count = 18;
    for (var i = 0; i < count; i++) {
      var dot = document.createElement("span");
      dot.style.cssText = [
        "position:absolute",
        "border-radius:50%",
        "pointer-events:none",
        "background:rgba(209,26,26," + (Math.random() * 0.35 + 0.08) + ")",
        "width:" + (Math.random() * 5 + 2) + "px",
        "height:" + (Math.random() * 5 + 2) + "px",
        "left:" + (Math.random() * 100) + "%",
        "top:" + (Math.random() * 100) + "%",
        "animation:dotFloat " + (Math.random() * 14 + 8) + "s ease-in-out " + (-Math.random() * 10) + "s infinite alternate",
      ].join(";");
      container.appendChild(dot);
    }

    /* inject the keyframe if not already present */
    if (!document.getElementById("stratton-dot-kf")) {
      var style = document.createElement("style");
      style.id = "stratton-dot-kf";
      style.textContent =
        "@keyframes dotFloat{" +
        "0%{transform:translate(0,0) scale(1);opacity:0.4}" +
        "50%{transform:translate(" + randomRange(-40, 40) + "px," + randomRange(-60, 60) + "px) scale(1.4);opacity:0.9}" +
        "100%{transform:translate(" + randomRange(-30, 30) + "px," + randomRange(-40, 40) + "px) scale(0.8);opacity:0.3}" +
        "}";
      document.head.appendChild(style);
    }
  }

  function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  /* ---- Init ---- */
  document.addEventListener("DOMContentLoaded", function () {
    initScrollReveal();
    initHeroSlideAnimReset();
    initLogoHover();
    initHeroParticles();
  });
})();
