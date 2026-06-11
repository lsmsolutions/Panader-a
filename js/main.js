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

/*
function setupScrollTopButton() {
  const scrollTopButton = document.querySelector(".scroll-top-button");
  if (!scrollTopButton) return;

  const updateVisibility = () => {
    scrollTopButton.classList.toggle("is-visible", window.scrollY > 120);
  };

  scrollTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  window.addEventListener("scroll", updateVisibility, { passive: true });
  updateVisibility();
}*/

function setupScrollTopButton() {
  const scrollTopButton = document.querySelector(".scroll-top-button");
  if (!scrollTopButton) return;

  const updateVisibility = () => {
    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    if (scrollTop > 80) {
      scrollTopButton.classList.add("is-visible");
    } else {
      scrollTopButton.classList.remove("is-visible");
    }
  };

  scrollTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  window.addEventListener("scroll", updateVisibility, { passive: true });
  document.addEventListener("scroll", updateVisibility, { passive: true });

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
