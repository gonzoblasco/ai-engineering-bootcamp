/* ===== AI-Driven Engineering Specialist — Landing Page JS ===== */

(function () {
  "use strict";

  /* ===== NAVBAR SCROLL EFFECT ===== */
  const navbar = document.getElementById("navbar");

  function handleNavbarScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleNavbarScroll, { passive: true });

  /* ===== MOBILE MENU TOGGLE ===== */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  navToggle.addEventListener("click", function () {
    const isActive = navLinks.classList.toggle("active");
    navToggle.classList.toggle("active");
    navToggle.setAttribute("aria-expanded", isActive);
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("active");
      navToggle.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ===== REVEAL ON SCROLL (IntersectionObserver) ===== */
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all elements
    revealElements.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ===== ANIMATED STAT COUNTERS ===== */
  const stats = document.querySelectorAll(".stat");

  function animateCounter(element) {
    const target = parseInt(element.dataset.target, 10);
    const numberEl = element.querySelector(".stat-number");
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      numberEl.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        numberEl.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  if ("IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    stats.forEach(function (stat) {
      statsObserver.observe(stat);
    });
  } else {
    stats.forEach(function (stat) {
      const target = parseInt(stat.dataset.target, 10);
      stat.querySelector(".stat-number").textContent = target;
    });
  }

  /* ===== CONTACT FORM VALIDATION ===== */
  const form = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");

  const fields = {
    name: {
      el: document.getElementById("name"),
      error: document.getElementById("error-name"),
      validate: function (value) {
        if (!value.trim()) return "El nombre es obligatorio";
        if (value.trim().length < 2) return "Mínimo 2 caracteres";
        return null;
      },
    },
    email: {
      el: document.getElementById("email"),
      error: document.getElementById("error-email"),
      validate: function (value) {
        if (!value.trim()) return "El email es obligatorio";
        // Simple email regex
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Email no válido";
        return null;
      },
    },
    message: {
      el: document.getElementById("message"),
      error: document.getElementById("error-message"),
      validate: function (value) {
        if (!value.trim()) return "El mensaje es obligatorio";
        if (value.trim().length < 10) return "Mínimo 10 caracteres";
        return null;
      },
    },
  };

  function showError(field, message) {
    field.el.classList.add("error");
    field.error.textContent = message;
    field.error.classList.add("visible");
  }

  function clearError(field) {
    field.el.classList.remove("error");
    field.error.textContent = "";
    field.error.classList.remove("visible");
  }

  // Real-time validation on blur
  Object.keys(fields).forEach(function (key) {
    var field = fields[key];
    field.el.addEventListener("blur", function () {
      var error = field.validate(field.el.value);
      if (error) {
        showError(field, error);
      } else {
        clearError(field);
      }
    });

    // Clear error on input
    field.el.addEventListener("input", function () {
      if (field.el.classList.contains("error")) {
        var error = field.validate(field.el.value);
        if (!error) clearError(field);
      }
    });
  });

  // Submit handler
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var hasErrors = false;

    Object.keys(fields).forEach(function (key) {
      var field = fields[key];
      var error = field.validate(field.el.value);
      if (error) {
        showError(field, error);
        hasErrors = true;
      } else {
        clearError(field);
      }
    });

    if (hasErrors) {
      // Focus first field with error
      var firstError = Object.keys(fields).find(function (key) {
        return fields[key].el.classList.contains("error");
      });
      if (firstError) fields[firstError].el.focus();
      return;
    }

    // Simulate success (no backend)
    formSuccess.classList.add("visible");
    form.reset();

    // Hide success message after 5 seconds
    setTimeout(function () {
      formSuccess.classList.remove("visible");
    }, 5000);
  });

  /* ===== SMOOTH SCROLL FALLBACK ===== */
  // CSS handles smooth scroll, but add fallback for older browsers
  if (!("scrollBehavior" in document.documentElement.style)) {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        var targetId = this.getAttribute("href");
        if (targetId === "#") return;
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }
})();