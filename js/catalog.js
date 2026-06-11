function renderAbout() {
  const aboutParagraphs = document.querySelector("#about-paragraphs");
  if (!aboutParagraphs || !i18n.about?.paragraphs) return;

  aboutParagraphs.innerHTML = i18n.about.paragraphs
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");
}

function splitProductDescription(description) {
  const match = description.match(/<br><br><strong>([^<]+):<\/strong>\s*([\s\S]*)/i);

  if (!match) {
    return {
      summary: description,
      detailsLabel: "",
      detailsBody: ""
    };
  }

  return {
    summary: description.slice(0, match.index),
    detailsLabel: match[1].trim(),
    detailsBody: match[2].trim()
  };
}

function getCategoryLabel(category) {
  return i18n.catalog.categories[category] || category;
}

function groupProductsByCategory() {
  return categoryOrder
    .map((category) => ({
      category,
      products: i18n.products.filter((product) => product.category === category)
    }))
    .filter((group) => group.products.length > 0);
}

function renderCategoryFilters() {
  const filters = document.querySelector("#catalog-filters");
  if (!filters) return;

  filters.setAttribute("aria-label", i18n.catalog.filtersLabel);

  const filterItems = ["all", ...categoryOrder];
  filters.innerHTML = filterItems.map((category) => {
    const label = category === "all" ? i18n.catalog.all : getCategoryLabel(category);

    return `
      <button
        type="button"
        class="catalog-filter${category === activeCategory ? " is-active" : ""}"
        data-category="${category}"
        aria-pressed="${String(category === activeCategory)}"
      >
        ${label}
      </button>
    `;
  }).join("");

  filters.querySelectorAll(".catalog-filter").forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      renderCategoryFilters();
      renderProductGrid();
    });
  });
}

function renderProductGrid() {
  const productGrid = document.querySelector("#product-grid");
  if (!productGrid) return;

  const groups = groupProductsByCategory();
  const filteredGroups = activeCategory === "all"
    ? groups
    : groups.filter(({ category }) => category === activeCategory);

  productGrid.innerHTML = filteredGroups.map(({ category, products: categoryProducts }) => {
    const cards = categoryProducts.map((product) => {
      const content = splitProductDescription(product.description);

      return `
        <article class="product-card">
          <div class="product-media">
            ${product.image
              ? `<img src="${product.image}" alt="${product.name}">`
              : `<div class="product-media-placeholder">${i18n.catalog.imagePending}</div>`}
          </div>
          <div class="product-copy">
            <h3>${product.name}</h3>
            <p>${content.summary}</p>
            ${content.detailsBody ? `
              <details class="product-details">
                <summary>${escapeHtml(i18n.catalog.productDetails || content.detailsLabel)}</summary>
                <div class="product-details-body">${content.detailsBody}</div>
              </details>
            ` : ""}
          </div>
        </article>
      `;
    }).join("");

    return `
      <section class="catalog-group">
        <div class="catalog-group-heading">
          <span class="catalog-group-badge">${getCategoryLabel(category)}</span>
        </div>
        <div class="product-grid category-grid">
          ${cards}
        </div>
      </section>
    `;
  }).join("");
}

function setupMenuToggle() {
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");
  if (!menuToggle || !siteNav) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function renderHeroCarousel() {
  const carousel = document.querySelector("#hero-carousel");
  if (!carousel) return;

  carousel.setAttribute("aria-label", i18n.catalog.featuredProducts);

  const composition = carousel.querySelector("#hero-composition");
  if (!composition) return;

  const seenHeroGroups = new Set();
  const heroProducts = i18n.products.filter((product) => {
    if (!product.image) return false;

    const group = product.id.includes("bulla") ? "bulla" : product.id;
    if (seenHeroGroups.has(group)) return false;

    seenHeroGroups.add(group);
    return true;
  });
  if (heroProducts.length === 0) return;

  if (heroTimer) {
    clearInterval(heroTimer);
  }

  composition.innerHTML = heroProducts.map((product) => `
    <div class="hero-slide">
      <img src="${product.image}" alt="${product.name}">
    </div>
  `).join("");

  const slides = Array.from(composition.querySelectorAll(".hero-slide"));
  if (slides.length < 2) return;

  let activeIndex = 0;
  const roleSetsDesktop = ["is-far-left", "is-left", "is-center", "is-right", "is-far-right"];
  const roleSetsTablet = ["is-left", "is-center", "is-right"];
  const roleSetsMobile = ["is-left", "is-center", "is-right"];

  const getRoleSet = () => {
    if (window.innerWidth <= 780) return roleSetsMobile;
    if (window.innerWidth <= 1024) return roleSetsTablet;
    return roleSetsDesktop;
  };

  const updateComposition = () => {
    const roles = getRoleSet();
    slides.forEach((slide) => {
      slide.className = "hero-slide";
    });

    const centerOffset = Math.floor(roles.length / 2);
    roles.forEach((role, index) => {
      const slideIndex = (activeIndex + index - centerOffset + slides.length) % slides.length;
      slides[slideIndex].classList.add(role);
    });
  };

  window.addEventListener("resize", updateComposition);
  updateComposition();

  heroTimer = setInterval(() => {
    activeIndex = (activeIndex + 1) % slides.length;
    updateComposition();
  }, 3600);
}

function renderPrintCatalog() {
  const printGrid = document.querySelector("#print-grid");
  if (!printGrid) return;

  const groups = groupProductsByCategory();

  printGrid.innerHTML = groups.map(({ category, products: categoryProducts }) => `
    <section class="print-group">
      <div class="print-group-heading">${getCategoryLabel(category)}</div>
      ${categoryProducts.map((product) => `
        <article class="print-card">
          <div class="print-card-media">
            ${product.image
              ? `<img src="${product.image}" alt="${product.name}">`
              : `<div class="product-media-placeholder print-media-placeholder">${i18n.catalog.imagePending}</div>`}
          </div>
          <div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
          </div>
        </article>
      `).join("")}
    </section>
  `).join("");
}
