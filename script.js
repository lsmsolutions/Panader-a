const DEFAULT_LANGUAGE = "en";
const SUPPORTED_LANGUAGES = ["en", "es"];
const categoryOrder = ["bunsCakes", "breads", "snacks", "traditional"];

let activeCategory = "all";
let currentLanguage = DEFAULT_LANGUAGE;
let i18n = null;
let heroTimer = null;

function getSavedLanguage() {
  const savedLanguage = localStorage.getItem("language");
  return SUPPORTED_LANGUAGES.includes(savedLanguage) ? savedLanguage : DEFAULT_LANGUAGE;
}

function getValueByPath(source, path) {
  return path.split(".").reduce((value, part) => {
    if (value && Object.prototype.hasOwnProperty.call(value, part)) {
      return value[part];
    }
    return undefined;
  }, source);
}

async function loadTranslations(language) {
  const response = await fetch(`i18n/${language}.json`);
  if (!response.ok) {
    throw new Error(`Unable to load language file: ${language}`);
  }
  return response.json();
}

function applyStaticTranslations() {
  document.documentElement.lang = currentLanguage;

  if (i18n.meta) {
    const isPrintCatalog = document.body.classList.contains("catalog-print");
    document.title = isPrintCatalog ? i18n.meta.catalogTitle : i18n.meta.title;

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute(
        "content",
        isPrintCatalog ? i18n.meta.catalogDescription : i18n.meta.description
      );
    }
  }

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = getValueByPath(i18n, element.dataset.i18n);
    if (typeof value === "string") {
      element.textContent = value;
    }
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    const value = getValueByPath(i18n, element.dataset.i18nAriaLabel);
    if (typeof value === "string") {
      element.setAttribute("aria-label", value);
    }
  });

  document.querySelectorAll(".language-button").forEach((button) => {
    const isActive = button.dataset.lang === currentLanguage;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function renderPricing() {
  const pricingTableBody = document.querySelector("#pricing-table-body");
  if (pricingTableBody && i18n.pricing?.table?.rows) {
    pricingTableBody.innerHTML = i18n.pricing.table.rows.map((row) => `
      <tr>
        <td>${row.product}</td>
        <td>${row.packSize}</td>
        <td class="price-value">${row.casePrice}</td>
      </tr>
    `).join("");
  }

  const pricingHighlights = document.querySelector("#pricing-highlights");
  if (pricingHighlights && i18n.pricing?.cards) {
    pricingHighlights.innerHTML = i18n.pricing.cards.map((card) => `
      <article class="pricing-card">
        <h3>${card.title}</h3>
        <p>${card.body}</p>
      </article>
    `).join("");
  }
}

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
                <summary>${content.detailsLabel}</summary>
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

  const heroProducts = i18n.products.filter((product) => product.image);
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

function renderPage() {
  applyStaticTranslations();
  renderPricing();
  renderAbout();
  renderCategoryFilters();
  renderProductGrid();
  renderHeroCarousel();
  renderPrintCatalog();
}

async function setLanguage(language) {
  const nextLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE;
  currentLanguage = nextLanguage;
  i18n = await loadTranslations(nextLanguage);
  localStorage.setItem("language", nextLanguage);
  renderPage();
}

function setupLanguageSwitcher() {
  document.querySelectorAll(".language-button").forEach((button) => {
    button.addEventListener("click", () => {
      setLanguage(button.dataset.lang);
    });
  });
}

function setupScrollTopButton() {
  const scrollTopButton = document.querySelector(".scroll-top-button");
  if (!scrollTopButton) return;

  const updateVisibility = () => {
    scrollTopButton.classList.toggle("is-visible", window.scrollY > 520);
  };

  scrollTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  window.addEventListener("scroll", updateVisibility, { passive: true });
  updateVisibility();
}

async function init() {
  setupMenuToggle();
  setupLanguageSwitcher();
  setupScrollTopButton();

  try {
    await setLanguage(getSavedLanguage());
  } catch (error) {
    console.error(error);
  }
}

init();
