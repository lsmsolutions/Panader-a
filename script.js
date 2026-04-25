const products = [
  {
    image: "img/BB.png",
    name: "Banana Bread",
    category: "Snack Items",
    description: "Moist and flavorful banana bread made with ripe bananas. Perfect for breakfast, snacks, or dessert.<br><br><strong>Nutrition Facts:</strong> Serving Size 85g. Calories 350. Total Fat 33g (41%), Saturated Fat 7g (33%), Trans Fat 1g. Cholesterol 50mg (31%). Sodium 280mg (12%). Total Carbohydrate 11g (4%), Dietary Fiber 1g (4%), Total Sugars 7g (includes added sugars). Protein 3g. Vitamin D 0mcg, Calcium 7mg, Iron 1mg, Potassium 120mg."
  },
  {
    image: "img/BreadMejorado.png",
    name: "Hardough Bread",
    category: "Breads",
    description: "Soft and freshly sliced hard dough bread with a light texture, perfect for sandwiches, toast, or everyday meals.<br><br><strong>Nutrition Facts:</strong> Serving Size 1 slice. Calories 120. Total Fat 1g (1%), Saturated Fat 0g (0%), Trans Fat 0g. Cholesterol 0mg (0%). Sodium 180mg (8%). Total Carbohydrate 23g (8%), Dietary Fiber 1g (4%), Total Sugars 2g (includes added sugars). Protein 4g. Vitamin D 0mcg, Calcium 30mg (2%), Iron 1.6mg (8%), Potassium 40mg (0%)."
  },
  {
    image: "img/coconutMejorada.png",
    name: "Coconut Bread",
    category: "Snack Items",
    description: "Soft and sweet coconut bread with a rich tropical flavor and moist texture. Perfect for breakfast, snacks, or dessert.<br><br><strong>Nutrition Facts:</strong> Serving Size 4oz (113g). Calories 140. Total Fat 2.5g (4%), Saturated Fat 1g (5%), Trans Fat 0g. Cholesterol 0mg (0%). Sodium 150mg (6%). Total Carbohydrate 28g (10%), Dietary Fiber 3g (12%), Total Sugars 9g (includes 4g added sugars). Protein 4g. Vitamin A 2%, Vitamin C 0%, Iron 4%, Calcium 4%."
  },
  {
    image: "",
    name: "Coconut Roll",
    category: "Snack Items",
    description: "Sweet coconut roll prepared for snack display and wholesale packaged distribution. Image pending.<br><br><strong>Product Details:</strong> Pack size 4 oz x 24."
  },
  {
    image: "",
    name: "Cinnamon Roll",
    category: "Snack Items",
    description: "Soft cinnamon roll designed for convenience retail and snack merchandising. Image pending.<br><br><strong>Product Details:</strong> Pack size 5 oz x 36."
  },
  {
    image: "img/cornMejorada.png",
    name: "Corn Bread",
    category: "Snack Items",
    description: "Soft and slightly sweet corn bread with a rich, golden texture and traditional flavor. Perfect for breakfast, snacks, or as a side for any meal.<br><br><strong>Nutrition Facts:</strong> Serving Size 4oz (113g). Calories 140. Total Fat 2.5g (4%), Saturated Fat 1g (5%), Trans Fat 0g. Cholesterol 0mg (0%). Sodium 150mg (6%). Total Carbohydrate 28g (10%), Dietary Fiber 3g (12%), Total Sugars 9g (includes 4g added sugars). Protein 4g. Vitamin A 2%, Vitamin C 0%, Iron 4%, Calcium 4%."
  },
  {
    image: "img/FruitCakeMejorada.png",
    name: "Jamaican Fruit Cake",
    category: "Buns & Cakes",
    description: "Rich and traditional Jamaican fruit cake made with a blend of dried fruits and spices, offering a dense texture and deep, authentic flavor. Perfect for celebrations, desserts, or special occasions.<br><br><strong>Nutrition Facts:</strong> Serving Size 1 slice (122g). Calories 350. Total Fat 33g (41%), Saturated Fat 14g (33%), Trans Fat 1g. Cholesterol 50mg (31%). Sodium 210mg (9%). Total Carbohydrate 70g (26%), Dietary Fiber 3g (6%), Total Sugars 39g (includes added sugars). Protein 8g. Vitamin D 0mcg, Calcium 70mg (6%), Iron 3mg (16%), Potassium 2%."
  },
  {
    image: "",
    name: "Christmas Bun",
    category: "Buns & Cakes",
    description: "Traditional seasonal bun prepared for packaged distribution with a rich Jamaican-style flavor profile. Image pending.<br><br><strong>Product Details:</strong> Pack size 32 oz x 12."
  },
  {
    image: "",
    name: "Easter Bun",
    category: "Buns & Cakes",
    description: "Traditional Easter bun created for retail shelves and wholesale bakery presentation. Image pending.<br><br><strong>Product Details:</strong> Pack size 36 oz x 12."
  },
  {
    image: "",
    name: "Rum & Raisin Cake",
    category: "Buns & Cakes",
    description: "Rich rum and raisin cake developed for commercial bakery merchandising and wholesale distribution. Image pending.<br><br><strong>Product Details:</strong> Pack size 5 oz x 50."
  },
  {
    image: "img/GingerMejorada .png",
    name: "Ginger Cake",
    category: "Buns & Cakes",
    description: "Rich and aromatic ginger cake with a warm, spiced flavor and soft, moist texture. Perfect for desserts, snacks, or enjoying with coffee or tea.<br><br><strong>Nutrition Facts:</strong> Serving Size 1 slice (142g). Calories 580. Total Fat 26g (33%), Saturated Fat 7g (35%), Trans Fat 0g. Cholesterol 0mg (0%). Sodium 200mg (9%). Total Carbohydrate 79g (29%), Dietary Fiber 2g (7%), Total Sugars 39g (includes added sugars). Protein 6g. Vitamin D 0mcg, Calcium 60mg (4%), Iron 2mg (10%), Potassium 4%."
  },
  {
    image: "img/multimejjorado.png",
    name: "Multi Grand Hardough",
    category: "Breads",
    description: "Nutritious multi-grain hard dough bread made with a blend of 12 grains and seeds, offering a hearty texture and rich, wholesome flavor. Perfect for sandwiches, toast, or a healthy daily diet.<br><br><strong>Nutrition Facts:</strong> Serving Size 1 slice (43g). Calories 110. Total Fat 1.5g (2%), Saturated Fat 0g (0%), Trans Fat 0g. Cholesterol 0mg (0%). Sodium 190mg (8%). Total Carbohydrate 19g (7%), Dietary Fiber 3g (11%), Total Sugars 4g (includes 4g added sugars). Protein 5g. Vitamin D 0mcg, Calcium 30mg (2%), Iron 1.3mg (8%), Potassium 150mg (4%)."
  },
  {
    image: "img/PanFruta.jpeg",
    name: "Pan de Fruta",
    category: "Traditional",
    description: "Traditional fruit bread made with a rich blend of dried fruits, offering a soft texture and naturally sweet flavor. Perfect for breakfast, snacks, or enjoying with butter and cheese.<br><br><strong>Product Details:</strong> Net Weight 36 oz (1020g)."
  },
  {
    image: "img/raising mejorada.png",
    name: "Raisin Bread",
    category: "Breads",
    description: "Soft and flavorful wheat raisin bread made with sweet raisins and a rich, wholesome texture. Perfect for breakfast, toast, or enjoying with butter and spreads.<br><br><strong>Nutrition Facts:</strong> Serving Size 1/3 loaf (114g). Calories 180. Total Fat 3g (4%), Saturated Fat 1g (4%), Trans Fat 0g. Cholesterol 0mg (0%). Sodium 213mg (9%). Total Carbohydrate 35g (12%), Dietary Fiber 2g (6%), Total Sugars 7g (includes 3g added sugars). Protein 5g. Calcium 50mg (5%), Iron 0.8mg (4%), Potassium 130mg (2%)."
  },
  {
    image: "img/Spice mejorada.png",
    name: "Spice Bun",
    category: "Buns & Cakes",
    description: "Soft and aromatic spice bun with a warm blend of spices and a slightly sweet, rich flavor. Perfect for breakfast, snacks, or enjoying with butter or cheese.<br><br><strong>Product Details:</strong> Net Weight 4 oz (114g)."
  },
  {
    image: "img/Tutti.png",
    name: "Tutti Fruitti",
    category: "Snack Items",
    description: "Soft and colorful tutti frutti bread made with candied fruits, offering a sweet flavor and moist texture. Perfect for breakfast, snacks, or as a light dessert.<br><br><strong>Nutrition Facts:</strong> Serving Size 1 package (170g). Calories 580. Total Fat 33g (51%), Saturated Fat 13g (65%), Trans Fat 0g. Cholesterol 0mg (0%). Sodium 260mg (11%). Total Carbohydrate 70g (25%), Dietary Fiber 2g (7%), Total Sugars 37g (includes added sugars). Protein 6g. Vitamin D 0mcg, Calcium 80mg (6%), Iron 1mg (6%), Potassium 120mg (2%)."
  },
  {
    image: "img/wholemejorado.png",
    name: "Whole Wheat Bread",
    category: "Breads",
    description: "Wholesome whole wheat bread made with enriched wheat flour, offering a soft texture and balanced, hearty flavor. Perfect for sandwiches, toast, or a healthy daily diet.<br><br><strong>Nutrition Facts:</strong> Serving Size 1.5oz (43g). Calories 120. Total Fat 1g (2%), Saturated Fat 0g (0%), Trans Fat 0g. Cholesterol 0mg (0%). Sodium 230mg (10%). Total Carbohydrate 23g (8%), Dietary Fiber 1g (4%), Total Sugars 2g (includes 2g added sugars). Protein 4g. Vitamin D 0mcg, Calcium 80mg (6%), Iron 1.65mg (8%), Potassium 42mg (0%)."
  },
  {
    image: "img/AckeeModificada.png",
    name: "Ackee in Brine",
    category: "Traditional",
    description: "Ackee in brine prepared for traditional Caribbean cooking and retail distribution.<br><br><strong>Ingredients:</strong> Ackee, Water, Salt.<br><br><strong>Nutrition Facts:</strong> About 6 Serving Per Container. Serving size 1/4 cup (53g/1.9oz). Calories 80. Total Fat 7g (8%), Saturated Fat 2.5g (12%), Trans Fat 0g. Sodium 200mg (6%). Total Carbohydrate 0g (0%). Protein 2g. Potassium 100mg (2%), Vitamin C 25%."
  },
  {
    image: "",
    name: "Bulla 4-Pack",
    category: "Traditional",
    description: "Traditional bulla assortment including ginger, coconut, and banana flavors in a 4-pack presentation. Image pending.<br><br><strong>Product Details:</strong> 4-pack assortment."
  },
  {
    image: "",
    name: "Bammy Sticks",
    category: "Traditional",
    description: "Traditional bammy sticks prepared for Caribbean foodservice and retail distribution. Image pending.<br><br><strong>Product Details:</strong> Pack size 10 x 397g x 24."
  }
];

const categoryOrder = [
  "Buns & Cakes",
  "Breads",
  "Snack Items",
  "Traditional"
];

let activeCategory = "All";

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

function groupProductsByCategory() {
  return categoryOrder
    .map((category) => ({
      category,
      products: products.filter((product) => product.category === category)
    }))
    .filter((group) => group.products.length > 0);
}

function renderCategoryFilters() {
  const filters = document.querySelector("#catalog-filters");
  if (!filters) return;

  const filterItems = ["All", ...categoryOrder];
  filters.innerHTML = filterItems.map((category) => `
    <button
      type="button"
      class="catalog-filter${category === activeCategory ? " is-active" : ""}"
      data-category="${category}"
      aria-pressed="${String(category === activeCategory)}"
    >
      ${category}
    </button>
  `).join("");

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
  const filteredGroups = activeCategory === "All"
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
              : `<div class="product-media-placeholder">Image Pending</div>`}
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
          <span class="catalog-group-badge">${category}</span>
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

function renderPrintCatalog() {
  const printGrid = document.querySelector("#print-grid");
  if (!printGrid) return;

  const groups = groupProductsByCategory();

  printGrid.innerHTML = groups.map(({ category, products: categoryProducts }) => `
    <section class="print-group">
      <div class="print-group-heading">${category}</div>
      ${categoryProducts.map((product) => `
        <article class="print-card">
          <div class="print-card-media">
            ${product.image
              ? `<img src="${product.image}" alt="${product.name}">`
              : `<div class="product-media-placeholder print-media-placeholder">Image Pending</div>`}
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

renderCategoryFilters();
renderProductGrid();
setupMenuToggle();
renderPrintCatalog();
