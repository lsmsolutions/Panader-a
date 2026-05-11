const DEFAULT_LANGUAGE = "en";
const SUPPORTED_LANGUAGES = ["en", "es"];
const categoryOrder = ["breads", "bunsCakes", "snacks", "traditional"];
// Change these paths if the custom Formspree redirect pages move.
const quoteRedirectPaths = {
  en: "thank-you.html",
  es: "gracias.html"
};
const caseUnitsByProductId = {
  "curry-powder-spicy": "6",
  "mild-jerk-seasoning": "6",
  "hot-jerk-seasoning": "6",
  "pan-de-fruta": "12",
  "easter-bun": "12",
  "hardough-bread": "12",
  "multi-grand-hardough": "12",
  "whole-wheat-bread": "12",
  "spice-bun-28oz": "12",
  "bulla-4-pack": "12",
  "ackee-in-brine": "24",
  "walkerswood-mild-jerk-seasoning-10oz": "24",
  "coconut-roll": "24",
  "cinnamon-roll": "24",
  "jamaican-fruit-cake": "36",
  "bammy-sticks": "48",
  "mini-bammy": "48",
  "ginger-cake": "50",
  "spice-bun": "50",
  "banana-bread": "50",
  "coconut-bread": "50",
  "corn-bread": "50",
  "raisin-bread": "50",
  "tutti-fruitti": "50"
};
const quoteCopy = {
  en: {
    button: "Request Quote",
    eyebrow: "Wholesale Quote",
    title: "Request Quote",
    intro: "Select the products you want quoted and enter the number of cases for each item.",
    businessName: "Business Name",
    contactName: "Contact Name",
    email: "Email",
    phone: "Phone",
    notes: "Notes",
    products: "Products",
    productsHelp: "Choose at least one product and enter cases greater than 0.",
    cases: "Cases",
    unitsPerCase: "Units per case",
    productColumn: "Product",
    quantityColumn: "Quantity (cases)",
    selectQuantity: "Select",
    customQuantity: "Custom",
    or: "or",
    pendingUnits: "Pending units per case",
    reviewButton: "Review Request",
    reviewEyebrow: "Review",
    reviewTitle: "Review Request",
    edit: "Back / Edit Selection",
    send: "Send Request",
    customer: "Customer Details",
    selectedProducts: "Selected Products",
    noNotes: "No notes provided.",
    confirmCloseMessage: "You have unsaved quote information. Do you want to close this form?",
    requiredError: "Please complete all required customer fields.",
    emailError: "Please enter a valid email address.",
    productError: "Select at least one product.",
    quantityError: "Each selected product must have a case quantity greater than 0.",
    endpointMissing: "Formspree endpoint pending. Add the endpoint to the form action attribute before sending live requests.",
    sending: "Sending request...",
    submitError: "We could not send the request. Please try again."
  },
  es: {
    button: "Solicitar presupuesto",
    eyebrow: "Presupuesto mayorista",
    title: "Solicitar presupuesto",
    intro: "Selecciona los productos que quieres cotizar e introduce la cantidad de cajas para cada uno.",
    businessName: "Nombre de empresa",
    contactName: "Nombre de contacto",
    email: "Email",
    phone: "Teléfono",
    notes: "Notas",
    products: "Productos",
    productsHelp: "Elige al menos un producto e introduce cajas mayores que 0.",
    cases: "Cajas",
    unitsPerCase: "Unidades por caja",
    productColumn: "Producto",
    quantityColumn: "Cantidad (cajas)",
    selectQuantity: "Seleccionar",
    customQuantity: "Personalizada",
    or: "o",
    pendingUnits: "Unidades por caja pendientes",
    reviewButton: "Revisar solicitud",
    reviewEyebrow: "Revisión",
    reviewTitle: "Revisar solicitud",
    edit: "Volver / Editar selección",
    send: "Enviar solicitud",
    customer: "Datos del cliente",
    selectedProducts: "Productos seleccionados",
    noNotes: "Sin notas.",
    confirmCloseMessage: "Tienes información de presupuesto sin guardar. ¿Quieres cerrar este formulario?",
    requiredError: "Completa todos los campos obligatorios del cliente.",
    emailError: "Introduce un email válido.",
    productError: "Selecciona al menos un producto.",
    quantityError: "Cada producto seleccionado debe tener una cantidad de cajas mayor que 0.",
    endpointMissing: "Endpoint de Formspree pendiente. Añade el endpoint al atributo action del formulario antes de enviar solicitudes reales.",
    sending: "Enviando solicitud...",
    submitError: "No pudimos enviar la solicitud. Inténtalo de nuevo."
  }
};

let activeCategory = "all";
let quoteActiveCategory = "all";
let quoteSelectionState = {};
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

function getQuoteLabels() {
  return quoteCopy[currentLanguage] || quoteCopy.en;
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

function getQuoteCaseValue(row) {
  const customValue = Number(row.querySelector(".quote-custom-input")?.value);
  const selectValue = Number(row.querySelector(".quote-case-select")?.value);
  return customValue > 0 ? customValue : selectValue;
}

function getQuoteElements() {
  return {
    openButton: document.querySelector("#quote-open-button"),
    modal: document.querySelector("#quote-modal"),
    closeButton: document.querySelector("#quote-close-button"),
    confirmModal: document.querySelector("#quote-confirm"),
    confirmContinue: document.querySelector("#quote-confirm-continue-button"),
    confirmLeave: document.querySelector("#quote-confirm-leave-button"),
    formView: document.querySelector("#quote-form-view"),
    reviewView: document.querySelector("#quote-review-view"),
    form: document.querySelector("#quote-form"),
    products: document.querySelector("#quote-products"),
    error: document.querySelector("#quote-error"),
    reviewButton: document.querySelector("#quote-review-button"),
    editButton: document.querySelector("#quote-edit-button"),
    submitButton: document.querySelector("#quote-submit-button"),
    reviewSummary: document.querySelector("#quote-review-summary"),
    submitStatus: document.querySelector("#quote-submit-status"),
    productsSummary: document.querySelector("#quote-products-summary")
  };
}

function getQuoteFilteredProducts() {
  return quoteActiveCategory === "all"
    ? i18n.products
    : i18n.products.filter((product) => product.category === quoteActiveCategory);
}

function renderQuoteFilterButtons(labels) {
  const filterItems = ["all", ...categoryOrder];

  return `
    <div class="quote-filter-bar" role="toolbar" aria-label="${escapeHtml(i18n.catalog.filtersLabel)}">
      ${filterItems.map((category) => {
        const label = category === "all" ? i18n.catalog.all : getCategoryLabel(category);

        return `
          <button
            type="button"
            class="quote-filter${category === quoteActiveCategory ? " is-active" : ""}"
            data-category="${escapeHtml(category)}"
            aria-pressed="${String(category === quoteActiveCategory)}"
          >
            ${escapeHtml(label)}
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function setupQuoteModalFilters() {
  const elements = getQuoteElements();
  if (!elements.products) return;

  elements.products.querySelectorAll(".quote-filter").forEach((button) => {
    button.addEventListener("click", () => {
      quoteActiveCategory = button.dataset.category || "all";
      renderQuoteForm();
    });
  });
}

function updateQuoteSelectionState(productId, checkbox, select, custom) {
  quoteSelectionState[productId] = {
    selected: checkbox.checked,
    selectValue: select.value,
    customValue: custom.value
  };
}

function renderQuoteForm() {
  const labels = getQuoteLabels();
  const elements = getQuoteElements();
  if (!elements.openButton || !elements.products) return;

  elements.openButton.textContent = labels.button;
  setText("quote-eyebrow", labels.eyebrow);
  setText("quote-title", labels.title);
  setText("quote-intro", labels.intro);
  setText("quote-business-label", labels.businessName);
  setText("quote-contact-label", labels.contactName);
  setText("quote-email-label", labels.email);
  setText("quote-phone-label", labels.phone);
  setText("quote-notes-label", labels.notes);
  setText("quote-products-title", labels.products);
  setText("quote-products-help", labels.productsHelp);
  setText("quote-review-button", labels.reviewButton);
  setText("quote-review-eyebrow", labels.reviewEyebrow);
  setText("quote-review-title", labels.reviewTitle);
  setText("quote-edit-button", labels.edit);
  setText("quote-submit-button", labels.send);

  const quantityOptions = ["", "1", "2", "3", "4", "5", "10", "15", "20", "25", "50", "100"];
  const optionMarkup = quantityOptions
    .map((value) => `<option value="${value}">${value || labels.selectQuantity}</option>`)
    .join("");
  const filterMarkup = renderQuoteFilterButtons(labels);
  const products = getQuoteFilteredProducts();

  document.querySelectorAll("#quote-open-button, #quote-open-button-nav").forEach((button) => {
    button.textContent = labels.button;
  });

  elements.products.innerHTML = `
    ${filterMarkup}
    <div class="quote-product-table" role="table" aria-label="${escapeHtml(labels.products)}">
      <div class="quote-product-row quote-product-head" role="row">
        <span></span>
        <span>${escapeHtml(labels.productColumn)}</span>
        <span>${escapeHtml(labels.unitsPerCase)}</span>
        <span>${escapeHtml(labels.quantityColumn)}</span>
      </div>
      ${products.map((product) => {
        const productState = quoteSelectionState[product.id] || {};
        const checked = productState.selected ? "checked" : "";
        const selectValue = productState.selectValue || "";
        const customValue = productState.customValue || "";
        const disabledAttr = productState.selected ? "" : "disabled";

        return `
          <div class="quote-product-row" role="row" data-product-id="${escapeHtml(product.id)}">
            <label class="quote-check-cell" aria-label="${escapeHtml(product.name)}">
              <input type="checkbox" class="quote-product-checkbox" value="${escapeHtml(product.id)}" ${checked}>
            </label>
            <div class="quote-product-info">
              <img src="${escapeHtml(product.image || "img/Logo1.png")}" alt="${escapeHtml(product.name)}">
              <div>
                <strong>${escapeHtml(product.name)}</strong>
                <small>${escapeHtml(getCategoryLabel(product.category))}</small>
              </div>
            </div>
            <div class="quote-units-cell">
              <span>${escapeHtml(getProductUnitsText(product, labels))}</span>
            </div>
            <div class="quote-case-controls">
              <select class="quote-case-select" ${disabledAttr}>
                ${quantityOptions.map((value) => `
                  <option value="${value}" ${value === selectValue ? "selected" : ""}>${value || labels.selectQuantity}</option>
                `).join("")}
              </select>
              <span class="quote-or">${escapeHtml(labels.or)}</span>
              <input
                type="number"
                class="quote-custom-input"
                min="1"
                step="1"
                inputmode="numeric"
                placeholder="${escapeHtml(labels.customQuantity)}"
                value="${escapeHtml(customValue)}"
                ${disabledAttr}
              >
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;

  setupQuoteModalFilters();

  elements.products.querySelectorAll(".quote-product-row:not(.quote-product-head)").forEach((row) => {
    const productId = row.dataset.productId;
    const checkbox = row.querySelector(".quote-product-checkbox");
    const select = row.querySelector(".quote-case-select");
    const custom = row.querySelector(".quote-custom-input");

    const updateState = () => {
      updateQuoteSelectionState(productId, checkbox, select, custom);
    };

    checkbox.addEventListener("change", () => {
      select.disabled = !checkbox.checked;
      custom.disabled = !checkbox.checked;
      if (checkbox.checked && getQuoteCaseValue(row) < 1) {
        select.value = "1";
      }
      if (!checkbox.checked) {
        select.value = "";
        custom.value = "";
      }
      updateState();
    });
    select.addEventListener("change", () => {
      if (select.value) {
        custom.value = "";
      }
      updateState();
    });
    custom.addEventListener("input", () => {
      if (custom.value) {
        select.value = "";
      }
      updateState();
    });
  });
}
function getQuoteSelection() {
  const elements = getQuoteElements();
  if (!elements.products) return [];

  return Array.from(elements.products.querySelectorAll(".quote-product-row:not(.quote-product-head)"))
    .map((row) => {
      const checkbox = row.querySelector(".quote-product-checkbox");
      const product = i18n.products.find((item) => item.id === checkbox.value);

      return {
        product,
        selected: checkbox.checked,
        cases: getQuoteCaseValue(row)
      };
    })
    .filter((item) => item.selected);
}

function resetQuoteForm() {
  const elements = getQuoteElements();
  if (!elements.form || !elements.products) return;

  quoteSelectionState = {};
  quoteActiveCategory = "all";
  elements.form.reset();
  if (elements.productsSummary) {
    elements.productsSummary.value = "";
  }
  if (elements.error) {
    elements.error.textContent = "";
  }
  if (elements.submitStatus) {
    elements.submitStatus.textContent = "";
  }
  if (elements.reviewView) {
    elements.reviewView.hidden = true;
  }
  if (elements.formView) {
    elements.formView.hidden = false;
  }

  renderQuoteForm();
}

function buildQuoteSummary(selection, labels) {
  return selection
    .map((item) => `${item.product.name} - ${item.cases} ${labels.cases.toLowerCase()}`)
    .join("\n");
}

function getCustomerData() {
  return {
    businessName: document.querySelector("#quote-business-name")?.value.trim() || "",
    contactName: document.querySelector("#quote-contact-name")?.value.trim() || "",
    email: document.querySelector("#quote-email")?.value.trim() || "",
    phone: document.querySelector("#quote-phone")?.value.trim() || "",
    notes: document.querySelector("#quote-notes")?.value.trim() || ""
  };
}

function hasQuoteUnsavedChanges() {
  const selection = getQuoteSelection();
  if (selection.length > 0) return true;

  const customer = getCustomerData();
  return Boolean(
    customer.businessName ||
    customer.contactName ||
    customer.email ||
    customer.phone ||
    customer.notes
  );
}

function handleQuoteBackdropClose() {
  if (hasQuoteUnsavedChanges()) {
    showQuoteConfirmModal();
    return;
  }

  closeQuoteModal();
}

function showQuoteConfirmModal() {
  const elements = getQuoteElements();
  if (!elements.confirmModal) return;
  elements.confirmModal.hidden = false;
}

function hideQuoteConfirmModal() {
  const elements = getQuoteElements();
  if (!elements.confirmModal) return;
  elements.confirmModal.hidden = true;
}

function validateQuote() {
  const labels = getQuoteLabels();
  const customer = getCustomerData();
  const selection = getQuoteSelection();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!customer.businessName || !customer.contactName || !customer.email) {
    return { valid: false, message: labels.requiredError };
  }

  if (!emailPattern.test(customer.email)) {
    return { valid: false, message: labels.emailError };
  }

  if (selection.length === 0) {
    return { valid: false, message: labels.productError };
  }

  if (selection.some((item) => !Number.isFinite(item.cases) || item.cases <= 0)) {
    return { valid: false, message: labels.quantityError };
  }

  return { valid: true, customer, selection };
}

function showQuoteReview() {
  const labels = getQuoteLabels();
  const elements = getQuoteElements();
  const validation = validateQuote();

  if (!validation.valid) {
    elements.error.textContent = validation.message;
    return;
  }

  const { customer, selection } = validation;
  elements.error.textContent = "";
  elements.submitStatus.textContent = "";
  elements.productsSummary.value = `${labels.products}:\n${buildQuoteSummary(selection, labels)}`;

  const productRows = selection.map((item) => {
    const unitsText = getProductUnitsText(item.product, labels);
    return `
      <li class="quote-review-product">
        <img src="${escapeHtml(item.product.image || "img/Logo1.png")}" alt="${escapeHtml(item.product.name)}">
        <div>
          <strong>${escapeHtml(item.product.name)}</strong>
          <small>${escapeHtml(unitsText)}</small>
        </div>
        <span>${item.cases} ${escapeHtml(labels.cases.toLowerCase())}</span>
      </li>
    `;
  }).join("");
  elements.reviewSummary.innerHTML = `
    <section>
      <h3>${escapeHtml(labels.customer)}</h3>
      <p><strong>${escapeHtml(labels.businessName)}:</strong> ${escapeHtml(customer.businessName)}</p>
      <p><strong>${escapeHtml(labels.contactName)}:</strong> ${escapeHtml(customer.contactName)}</p>
      <p><strong>${escapeHtml(labels.email)}:</strong> ${escapeHtml(customer.email)}</p>
      ${customer.phone ? `<p><strong>${escapeHtml(labels.phone)}:</strong> ${escapeHtml(customer.phone)}</p>` : ""}
    </section>
    <section>
      <h3>${escapeHtml(labels.selectedProducts)}</h3>
      <ul>${productRows}</ul>
    </section>
    <section>
      <h3>${escapeHtml(labels.notes)}</h3>
      <p>${escapeHtml(customer.notes || labels.noNotes)}</p>
    </section>
  `;

  elements.formView.hidden = true;
  elements.reviewView.hidden = false;
}

function openQuoteModal() {
  const elements = getQuoteElements();
  if (!elements.modal) return;

  hideQuoteConfirmModal();
  elements.modal.hidden = false;
  document.body.classList.add("quote-modal-open");
  elements.formView.hidden = false;
  elements.reviewView.hidden = true;
  elements.error.textContent = "";
  elements.submitStatus.textContent = "";
  document.querySelector("#quote-business-name")?.focus();
}

function closeQuoteModal() {
  const elements = getQuoteElements();
  if (!elements.modal) return;

  hideQuoteConfirmModal();
  elements.modal.hidden = true;
  document.body.classList.remove("quote-modal-open");
}

function setupQuoteModal() {
  const elements = getQuoteElements();
  if (!elements.openButton || !elements.modal || !elements.form) return;

   const quoteOpenButtons = document.querySelectorAll("#quote-open-button, #quote-open-button-nav");
  quoteOpenButtons.forEach((button) => {
    button.addEventListener("click", openQuoteModal);
  });

  elements.closeButton?.addEventListener("click", closeQuoteModal);
  elements.modal.querySelectorAll("[data-quote-close]").forEach((element) => {
    element.addEventListener("click", handleQuoteBackdropClose);
  });
  elements.modal.querySelectorAll("[data-quote-confirm-close]").forEach((element) => {
    element.addEventListener("click", hideQuoteConfirmModal);
  });
  elements.confirmContinue?.addEventListener("click", hideQuoteConfirmModal);
  elements.confirmLeave?.addEventListener("click", () => {
    resetQuoteForm();
    closeQuoteModal();
  });
  elements.reviewButton?.addEventListener("click", showQuoteReview);
  elements.editButton?.addEventListener("click", () => {
    elements.reviewView.hidden = true;
    elements.formView.hidden = false;
    elements.submitStatus.textContent = "";
  });
  elements.submitButton?.addEventListener("click", () => {
    elements.form.requestSubmit();
  });
  elements.form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const action = elements.form.getAttribute("action");
    if (!action) {
      elements.submitStatus.textContent = getQuoteLabels().endpointMissing;
      return;
    }

    const labels = getQuoteLabels();
    elements.submitButton.disabled = true;
    elements.submitStatus.textContent = labels.sending;

    try {
      const response = await fetch(action, {
        method: "POST",
        body: new FormData(elements.form),
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Formspree request failed");
      }

      const redirectPath = quoteRedirectPaths[currentLanguage] || quoteRedirectPaths.en;
      window.location.href = new URL(redirectPath, window.location.href).href;
    } catch (error) {
      console.error(error);
      elements.submitStatus.textContent = labels.submitError;
      elements.submitButton.disabled = false;
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.modal.hidden) {
      if (elements.confirmModal && !elements.confirmModal.hidden) {
        hideQuoteConfirmModal();
        return;
      }
      closeQuoteModal();
    }
  });
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
  renderQuoteForm();
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
  setupQuoteModal();

  try {
    await setLanguage(getSavedLanguage());
  } catch (error) {
    console.error(error);
  }
}

init();
