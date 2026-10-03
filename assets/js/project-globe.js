(() => {
  "use strict";

  const API =
    "https://api.github.com/users/sathwik-svg/repos?per_page=100&sort=updated";

  const globe = document.getElementById("project-globe");
  const nodesLayer = document.getElementById("globe-projects");
  const searchInput = document.getElementById("project-search");
  const countEl = document.getElementById("project-count");
  const resultsEl = document.getElementById("project-explorer-results");
  const filters = document.querySelectorAll("[data-sphere-filter]");

  if (!globe || !nodesLayer) {
    console.warn("Project globe elements not found.");
    return;
  }

  let projects = [];
  let visibleProjects = [];
  let activeFilter = "all";

  let rotationX = -8;
  let rotationY = 0;

  let velocityX = 0;
  let velocityY = 0;

  let dragging = false;
  let paused = false;

  let lastX = 0;
  let lastY = 0;

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function normalise(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function classify(repo) {
    const text = normalise(
      `${repo.name} ${repo.description || ""} ${(repo.topics || []).join(" ")}`
    );

    const categories = [];

    if (/aws|cloud|serverless|lambda|s3|terraform/.test(text))
      categories.push("cloud");

    if (/devops|ci cd|cicd|github actions|pipeline|deployment/.test(text))
      categories.push("devops");

    if (/kubernetes|k8s|minikube/.test(text))
      categories.push("kubernetes");

    if (/terraform/.test(text))
      categories.push("terraform");

    if (/docker|container|compose/.test(text))
      categories.push("docker");

    if (/ai|ml|machine learning|artificial intelligence|search|compiler/.test(text))
      categories.push("ai");

    if (
      /btech|college|student|semester|database|operating system|algorithm|java|microprocessor|automata/.test(
        text
      )
    )
      categories.push("academic");

    return categories.length ? categories : ["academic"];
  }

  function projectMatches(repo) {
    if (activeFilter === "all") return true;

    return repo.categories.includes(activeFilter);
  }

  function searchMatches(repo) {
    const query = normalise(searchInput?.value);

    if (!query) return true;

    return normalise(
      `${repo.name} ${repo.description || ""} ${repo.categories.join(" ")}`
    ).includes(query);
  }

  function updateVisibleProjects() {
    visibleProjects = projects.filter(
      repo => projectMatches(repo) && searchMatches(repo)
    );

    if (countEl) {
      countEl.textContent =
        `${visibleProjects.length} of ${projects.length} projects`;
    }

    renderResults();
    renderNodes();
  }

  function renderResults() {
    if (!resultsEl) return;

    if (!visibleProjects.length) {
      resultsEl.innerHTML = `
        <div class="project-empty-state">
          No projects match your current search/filter.
        </div>
      `;
      return;
    }

    resultsEl.innerHTML = visibleProjects
      .slice(0, 12)
      .map((repo, index) => {
        const number = String(index + 1).padStart(2, "0");

        return `
          <button
            class="sphere-result-card"
            type="button"
            data-repo-name="${escapeHtml(repo.name)}"
          >
            <span class="sphere-result-number">${number}</span>
            <span class="sphere-result-content">
              <strong>${escapeHtml(repo.name)}</strong>
              <small>${escapeHtml(
                repo.description || repo.categories.join(" · ")
              )}</small>
            </span>
            <span class="sphere-result-arrow">→</span>
          </button>
        `;
      })
      .join("");

    resultsEl.querySelectorAll("[data-repo-name]").forEach(button => {
      button.addEventListener("click", () => {
        const repo = projects.find(
          item => item.name === button.dataset.repoName
        );

        if (repo) openProject(repo);
      });
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderNodes() {
    nodesLayer.innerHTML = "";

    const maxNodes = 53;
    const displayProjects = visibleProjects.slice(0, maxNodes);

    displayProjects.forEach((repo, index) => {
      const node = document.createElement("button");

      node.type = "button";
      node.className = "globe-project-node";
      node.dataset.repoName = repo.name;

      const number = String(index + 1).padStart(2, "0");

      node.innerHTML = `
        <span class="globe-node-number">${number}</span>
        <strong>${escapeHtml(repo.name)}</strong>
        <small>${escapeHtml(repo.categories[0] || "project")}</small>
      `;

      node.addEventListener("click", event => {
        event.stopPropagation();
        openProject(repo);
      });

      node.addEventListener("mouseenter", () => {
        paused = true;
      });

      node.addEventListener("mouseleave", () => {
        paused = false;
      });

      nodesLayer.appendChild(node);
    });

    positionNodes();
  }

  function positionNodes() {
    const nodes = [...nodesLayer.children];

    if (!nodes.length) return;

    const rect = globe.getBoundingClientRect();

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const radius = Math.min(rect.width, rect.height) * 0.34;

    const total = nodes.length;

    nodes.forEach((node, index) => {
      /*
       * Fibonacci sphere distribution.
       * This creates a natural, evenly distributed planetary surface.
       */
      const y = 1 - (index / Math.max(total - 1, 1)) * 2;

      const radiusAtY = Math.sqrt(
        Math.max(0, 1 - y * y)
      );

      const goldenAngle = Math.PI * (3 - Math.sqrt(5));

      const theta =
        goldenAngle * index;

      let x =
        Math.cos(theta) * radiusAtY;

      let z =
        Math.sin(theta) * radiusAtY;

      /*
       * Y-axis rotation.
       */
      const ry = rotationY * Math.PI / 180;

      const rotatedX =
        x * Math.cos(ry) -
        z * Math.sin(ry);

      const rotatedZ =
        x * Math.sin(ry) +
        z * Math.cos(ry);

      x = rotatedX;
      z = rotatedZ;

      /*
       * X-axis rotation.
       */
      const rx = rotationX * Math.PI / 180;

      const rotatedY =
        y * Math.cos(rx) -
        z * Math.sin(rx);

      z =
        y * Math.sin(rx) +
        z * Math.cos(rx);

      /*
       * Depth-based perspective.
       */
      const depth =
        (z + 1) / 2;

      const scale =
        0.62 + depth * 0.58;

      const opacity =
        0.28 + depth * 0.72;

      const px =
        centerX + x * radius;

      const py =
        centerY + rotatedY * radius;

      node.style.transform =
        `translate3d(${px}px, ${py}px, ${z * radius}px) translate(-50%, -50%) scale(${scale})`;

      node.style.opacity = opacity.toFixed(3);

      node.style.zIndex =
        String(Math.round(100 + depth * 100));
    });
  }

  function animate() {
    if (!dragging && !paused && !prefersReducedMotion) {
      rotationY += 0.055 + velocityY;
      rotationX += velocityX;

      velocityX *= 0.94;
      velocityY *= 0.94;
    }

    positionNodes();
    requestAnimationFrame(animate);
  }

  function pointerDown(event) {
    dragging = true;

    const point =
      event.touches ? event.touches[0] : event;

    lastX = point.clientX;
    lastY = point.clientY;

    globe.classList.add("is-dragging");
  }

  function pointerMove(event) {
    if (!dragging) return;

    const point =
      event.touches ? event.touches[0] : event;

    const dx = point.clientX - lastX;
    const dy = point.clientY - lastY;

    rotationY += dx * 0.35;
    rotationX -= dy * 0.18;

    velocityY = dx * 0.015;
    velocityX = -dy * 0.008;

    lastX = point.clientX;
    lastY = point.clientY;

    event.preventDefault();
  }

  function pointerUp() {
    dragging = false;
    globe.classList.remove("is-dragging");
  }

  function openProject(repo) {
    /*
     * First try to find an existing project card/detail trigger.
     */
    const repoName = normalise(repo.name);

    const candidates = [
      ...document.querySelectorAll(
        ".project-card, .project-item, [data-project], a, button"
      )
    ];

    const match = candidates.find(element => {
      const text = normalise(element.textContent);
      const data = normalise(
        element.getAttribute("data-project") || ""
      );

      return (
        text.includes(repoName) ||
        repoName.includes(text) ||
        data === repoName
      );
    });

    if (match) {
      match.click();
      return;
    }

    /*
     * Fallback: open the real GitHub repository.
     */
    if (repo.html_url) {
      window.open(
        repo.html_url,
        "_blank",
        "noopener,noreferrer"
      );
    }
  }

  function setupFilters() {
    filters.forEach(filter => {
      filter.addEventListener("click", () => {
        filters.forEach(item =>
          item.classList.remove("active")
        );

        filter.classList.add("active");

        activeFilter =
          filter.dataset.sphereFilter || "all";

        updateVisibleProjects();
      });
    });
  }

  function setupSearch() {
    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
      updateVisibleProjects();
    });
  }

  function setupPointerControls() {
    globe.addEventListener("mousedown", pointerDown);

    window.addEventListener("mousemove", pointerMove);

    window.addEventListener("mouseup", pointerUp);

    globe.addEventListener(
      "touchstart",
      pointerDown,
      { passive: false }
    );

    window.addEventListener(
      "touchmove",
      pointerMove,
      { passive: false }
    );

    window.addEventListener(
      "touchend",
      pointerUp
    );

    globe.addEventListener("mouseenter", () => {
      paused = true;
    });

    globe.addEventListener("mouseleave", () => {
      paused = false;
    });

    window.addEventListener("resize", positionNodes);
  }

  async function loadRepositories() {
    if (countEl) {
      countEl.textContent = "Loading GitHub projects...";
    }

    try {
      const response = await fetch(API, {
        headers: {
          Accept: "application/vnd.github+json"
        }
      });

      if (!response.ok) {
        throw new Error(
          `GitHub API returned ${response.status}`
        );
      }

      const repos = await response.json();

      projects = repos
        .filter(repo => !repo.fork)
        .map(repo => ({
          ...repo,
          categories: classify(repo)
        }))
        .sort((a, b) =>
          a.name.localeCompare(b.name)
        );

      updateVisibleProjects();

      console.log(
        `Project Globe loaded ${projects.length} GitHub repositories.`
      );

      animate();

    } catch (error) {
      console.error(
        "Project Globe GitHub loading failed:",
        error
      );

      if (countEl) {
        countEl.textContent =
          "GitHub projects unavailable";
      }

      if (resultsEl) {
        resultsEl.innerHTML = `
          <div class="project-empty-state">
            Unable to load GitHub projects right now.
            Please refresh the page.
          </div>
        `;
      }
    }
  }

  setupFilters();
  setupSearch();
  setupPointerControls();
  loadRepositories();

})();
