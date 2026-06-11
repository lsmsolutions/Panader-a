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

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function setText(id, value) {
  const element = document.querySelector(`#${id}`);
  if (element) {
    element.textContent = value;
  }
}

function getProductUnitsText(product, labels) {
  const units = caseUnitsByProductId[product.id];
  return units ? `${units} ${labels.unitsPerCase.toLowerCase()}` : labels.pendingUnits;
}
