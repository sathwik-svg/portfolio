const themeToggleBtn = document.getElementById("theme-toggle");
const mobileToggleBtn = document.getElementById("mobile-toggle");
const navLinks = document.getElementById("nav-links");
const themeIcon = document.getElementById("theme-icon");

// Theme Management
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
const savedTheme = localStorage.getItem("theme") || systemTheme;
document.documentElement.setAttribute("data-theme", savedTheme);
updateThemeIcon(savedTheme);

themeToggleBtn.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  if (theme === "dark") {
    // Sun Icon
    themeIcon.innerHTML =
      '<path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18.75a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75ZM6.166 18.894a.75.75 0 0 1-1.06-1.06l1.59-1.591a.75.75 0 1 1 1.061 1.06l-1.59 1.591ZM2.25 12a.75.75 0 0 1 .75-.75H5.25a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75ZM6.166 6.166a.75.75 0 0 1 1.06-1.06l1.59 1.591a.75.75 0 1 1-1.061 1.06l-1.59-1.591Z" />';
  } else {
    // Moon Icon
    themeIcon.innerHTML = '<path fill-rule="evenodd" clip-rule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" />';
  }
}

// Mobile Navigation Toggle
mobileToggleBtn.addEventListener("click", () => {
  const isActive = navLinks.classList.toggle("active");
  document.body.style.overflow = isActive ? "hidden" : "";

  // Toggle icon between hamburger and close (X)
  if (isActive) {
    mobileToggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>`;
  } else {
    mobileToggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
      </svg>`;
  }
});

// Close mobile menu when a navigation link is clicked
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    document.body.style.overflow = "";
    mobileToggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
      </svg>`;
  });
});

// Update Year in Footer
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Active Nav Link
const currentPage = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.classList.remove("active");
  const linkPage = link.getAttribute("href").split("/").pop();
  if (linkPage === currentPage) link.classList.add("active");
});

// Carousel Logic (About Page)
const slideEls = document.querySelectorAll(".carousel-slide");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

if (slideEls.length && prevBtn && nextBtn) {
  let index = 0;
  slideEls[index].classList.add("active");

  function goTo(i) {
    slideEls[index].classList.remove("active");
    index = (i + slideEls.length) % slideEls.length;
    slideEls[index].classList.add("active");
  }

  prevBtn.addEventListener("click", () => goTo(index - 1));
  nextBtn.addEventListener("click", () => goTo(index + 1));
}

// Contact Form Logic (Contact Page)
// This form is frontend-only. To enable email sending, integrate a service
// such as EmailJS, Formspree, or a custom backend endpoint.
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    // Simulate submission feedback (no actual sending occurs)
    const btnSpan = submitBtn.querySelector("span");
    const originalText = btnSpan.textContent;
    btnSpan.textContent = "Sending...";
    submitBtn.disabled = true;
    formStatus.textContent = "";
    formStatus.className = "form-status";

    setTimeout(() => {
      formStatus.textContent = "Thanks for your message! I'll get back to you soon.";
      formStatus.className = "form-status success";
      contactForm.reset();
      btnSpan.textContent = originalText;
      submitBtn.disabled = false;
    }, 800);
  });
}


// Automatic GitHub Projects
fetch("https://api.github.com/users/sathwik-svg/repos?sort=updated&per_page=100")
  .then(response => response.json())
  .then(repos => {
    const container = document.getElementById("github-projects");
    if (!container) return;

    container.innerHTML = repos
      .filter(repo => !repo.fork)
      .map(repo => `
        <div class="project-card">
          <div class="project-info">
            <h2 class="project-title">${repo.name}</h2>
            <p class="project-desc">
              ${repo.description || "Cloud, DevOps, software engineering and technology project by Sathwik Ganji."}
            </p>
            <div class="project-tags">
              <span class="tag">${repo.language || "GitHub"}</span>
              <span class="tag">⭐ ${repo.stargazers_count}</span>
            </div>
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="btn-primary">
              View on GitHub →
            </a>
          </div>
        </div>
      `)
      .join("");
  })
  .catch(() => {
    const container = document.getElementById("github-projects");
    if (container) {
      container.innerHTML = "<p>GitHub projects could not be loaded.</p>";
    }
  });


/* =========================================================
   PORTFOLIO MOTION ENGINE
   ========================================================= */

(() => {
  const reducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Lightweight background particles */
  if (
    !reducedMotion &&
    !document.getElementById("portfolio-particles")
  ) {
    const field = document.createElement("div");

    field.id = "portfolio-particles";
    field.setAttribute("aria-hidden", "true");

    const count = window.innerWidth <= 768 ? 8 : 16;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("span");

      particle.className = "portfolio-particle";

      particle.style.left =
        Math.random() * 100 + "%";

      particle.style.setProperty(
        "--particle-duration",
        10 + Math.random() * 12 + "s"
      );

      particle.style.setProperty(
        "--particle-delay",
        -Math.random() * 14 + "s"
      );

      particle.style.opacity =
        (0.10 + Math.random() * 0.18).toFixed(2);

      field.appendChild(particle);
    }

    document.body.prepend(field);
  }

  /* Scroll reveal */
  const revealSelectors = [
    ".page-container > *",
    ".project-card",
    ".project-section",
    ".exp-item",
    ".info-item",
    ".contact-card",
    ".resume-container",
    ".carousel",
    ".credentials-section",
    "footer"
  ];

  const revealItems =
    document.querySelectorAll(
      revealSelectors.join(",")
    );

  revealItems.forEach((element, index) => {
    element.classList.add("scroll-reveal");

    element.style.setProperty(
      "--reveal-delay",
      Math.min((index % 6) * 70, 350) + "ms"
    );
  });

  if (
    reducedMotion ||
    !("IntersectionObserver" in window)
  ) {
    revealItems.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else {
    const observer =
      new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add(
              "is-visible"
            );

            obs.unobserve(entry.target);
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -45px 0px"
        }
      );

    revealItems.forEach((element) => {
      observer.observe(element);
    });
  }

  /* Optional animated counters */
  document
    .querySelectorAll("[data-count]")
    .forEach((element) => {
      const target =
        Number(element.dataset.count);

      if (!Number.isFinite(target)) return;

      const suffix =
        element.dataset.suffix || "";

      if (reducedMotion) {
        element.textContent =
          target + suffix;
        return;
      }

      let started = false;

      const counterObserver =
        new IntersectionObserver(
          (entries, obs) => {
            if (
              !entries[0].isIntersecting ||
              started
            ) {
              return;
            }

            started = true;

            const start =
              performance.now();

            const duration = 1200;

            const tick = (now) => {
              const progress =
                Math.min(
                  (now - start) /
                    duration,
                  1
                );

              const eased =
                1 -
                Math.pow(
                  1 - progress,
                  3
                );

              element.textContent =
                Math.round(
                  target * eased
                ) + suffix;

              if (progress < 1) {
                requestAnimationFrame(tick);
              }
            };

            requestAnimationFrame(tick);
            obs.disconnect();
          }
        );

      counterObserver.observe(element);
    });
})();

