function getQuoteLabels() {
  return quoteCopy[currentLanguage] || quoteCopy.en;
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
  setText("quote-required-note", labels.requiredNote);
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
  syncVisibleQuoteRows();

  return Object.entries(quoteSelectionState)
    .filter(([, state]) => state.selected)
    .map(([productId, state]) => {
      const product = i18n.products.find((item) => item.id === productId);
      const customValue = Number(state.customValue);
      const selectValue = Number(state.selectValue);

      return {
        product,
        selected: true,
        cases: customValue > 0 ? customValue : selectValue
      };
    })
    .filter((item) => item.product);
}

function syncVisibleQuoteRows() {
  const elements = getQuoteElements();
  if (!elements.products) return;

  elements.products.querySelectorAll(".quote-product-row:not(.quote-product-head)").forEach((row) => {
    const productId = row.dataset.productId;
    const checkbox = row.querySelector(".quote-product-checkbox");
    const select = row.querySelector(".quote-case-select");
    const custom = row.querySelector(".quote-custom-input");

    if (productId && checkbox && select && custom) {
      updateQuoteSelectionState(productId, checkbox, select, custom);
    }
  });
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

  if (!customer.businessName || !customer.contactName || !customer.email || !customer.phone) {
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
