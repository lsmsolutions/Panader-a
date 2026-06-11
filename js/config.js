const DEFAULT_LANGUAGE = "en";
const SUPPORTED_LANGUAGES = ["en", "es"];
const categoryOrder = ["breads", "bunsCakes", "snacks", "seasonings", "traditional"];
// Change these paths if the custom Formspree redirect pages move.
const quoteRedirectPaths = {
  en: "thank-you.html",
  es: "gracias.html"
};
const caseUnitsByProductId = {
  "curry-powder-spicy": "6",
  "mild-jerk-seasoning": "6",
  "mildG-jerk-seasoning": "6",
  "hotP-jerk-seasoning": "6",
  "hot-jerk-seasoning": "6",
  "pan-de-fruta": "12",
  "hardough-bread": "12",
  "multi-grand-hardough": "12",
  "whole-wheat-bread": "12",
  "spice-bun-28oz": "12",
  "banana-bulla-4-pax": "12",
  "ginger-bulla-4-pax": "12",
  "coconut-bulla-4-pax": "12",
  "ackee-in-brine": "24",
  "walkerswood-mild-jerk-seasoning-10oz": "24",
  "coconut-roll": "24",
  "cinnamon-roll": "24",
  "jamaican-fruit-cake": "36",
  "bammy-sticks": "48",
  "mini-bammy": "48",
  "carrot-cake": "50",
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
    requiredNote: "* Required fields",
    requiredError: "Please complete all required fields.",
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
    requiredNote: "* Campos obligatorios",
    requiredError: "Completa todos los campos obligatorios.",
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
