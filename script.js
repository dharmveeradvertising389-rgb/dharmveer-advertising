/* =========================================================
   धर्मवीर ॲडव्हर्टायझिंग — SCRIPT.JS (STABLE & AUTO-LOADER FIX)
   ========================================================= */

let CONTACT = {
  whatsapp: "",
  instagram: "",
  email: "",
  logo_url: "",
  about: ""
};

const API_BASE = "https://falling-tree-3813.dharmveeradvertising389.workers.dev";

// Admin Panel मधून आलेले फोटो साठवण्यासाठी
let dynamicPortfolioItems = [];
let managedPortfolioCategories = [];
let hasManagedPortfolioCategories = false;

async function loadManagedPortfolioCategories() {
  try {
    const response = await fetch(
      API_BASE + "/api/content?t=" + Date.now(),
      { cache: "no-store" }
    );

    const data = await response.json();

    const saved = Array.isArray(data)
      ? data.find(x => x.content_key === "portfolio_categories")
      : null;

    if (saved && saved.content_value) {
      const parsed = JSON.parse(saved.content_value);

      if (Array.isArray(parsed)) {
        managedPortfolioCategories = parsed.filter(
          c => c && String(c.name || "").trim()
        );

        hasManagedPortfolioCategories = true;
      }
    }
  } catch (error) {
    console.error("Portfolio category settings error:", error);
  }
}

function getManagedCategoryName(categoryName) {
  const raw = String(categoryName || "").trim();

  if (!raw || !hasManagedPortfolioCategories) {
    return raw;
  }

  const found = managedPortfolioCategories.find(cat =>
    String(cat.name || "").toLowerCase() === raw.toLowerCase() ||
    (
      Array.isArray(cat.aliases) &&
      cat.aliases.some(
        alias => String(alias).toLowerCase() === raw.toLowerCase()
      )
    )
  );

  return found ? found.name : raw;
}

// Loader बंद करण्यासाठी
function forceHideLoader() {
  const loader = document.getElementById("loader");

  if (loader) {
    loader.classList.add("hide");
    loader.style.display = "none";
  }
}

// फोटोची लिंक शोधणारे Function
function getImageUrl(item) {
  if (!item) return "";

  let url =
    item.image_url ||
    item.imageUrl ||
    item.image ||
    item.photo ||
    item.photo_url ||
    item.url ||
    item.img ||
    item.src ||
    "";

  if (typeof url === "string") {
    url = url.trim();

    if (url === "null" || url === "undefined") {
      return "";
    }

    if (url.startsWith("/")) {
      url = API_BASE + url;
    }
  }

  return url;
}

// Category नावांमधील duplicate पर्याय काढण्यासाठी
function cleanCategoryName(cat) {
  if (!cat) return "Other";

  let c = String(cat).trim();
  const managedName = getManagedCategoryName(c);

  if (hasManagedPortfolioCategories) {
    const exact = managedPortfolioCategories.find(item =>
      String(item.name || "").toLowerCase() === c.toLowerCase() ||
      (
        Array.isArray(item.aliases) &&
        item.aliases.some(
          alias => String(alias).toLowerCase() === c.toLowerCase()
        )
      )
    );

    if (exact) return exact.name;

    // Admin Panel मध्ये Category List सेव्ह केली असल्यास
    // जुन्या fixed categories जबरदस्तीने वापरू नयेत.
    return managedName || c;
  }

  const lower = c.toLowerCase();

  if (lower.includes("festival")) return "Festival";
  if (lower.includes("business")) return "Business";
  if (lower.includes("social")) return "Social Media";
  if (lower.includes("political")) return "Political";
  if (lower.includes("personal")) return "Personal";
  if (lower.includes("other")) return "Other";

  return c;
}

// Portfolio साठी CSS Styles
if (!document.getElementById("portfolio-custom-styles")) {
  const style = document.createElement("style");

  style.id = "portfolio-custom-styles";

  style.innerHTML = `
    #filters {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 10px !important;
      justify-content: center !important;
      margin-bottom: 30px !important;
      position: relative !important;
      z-index: 20 !important;
      visibility: visible !important;
      opacity: 1 !important;
    }

    .filter-btn {
      padding: 8px 20px !important;
      border-radius: 25px !important;
      border: 1px solid rgba(255,255,255,0.2) !important;
      background: rgba(255,255,255,0.05) !important;
      color: #ddd !important;
      cursor: pointer !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      transition: all 0.3s ease !important;
      display: inline-block !important;
    }

    .filter-btn:hover,
    .filter-btn.active {
      background: #ff6600 !important;
      color: #ffffff !important;
      border-color: #ff6600 !important;
      box-shadow: 0 4px 15px rgba(255,102,0,0.35) !important;
    }
    body[data-theme="light"] .filter-btn {
      background: #ffffff !important;
      color: #242424 !important;
      border-color: #d4d0c9 !important;
    }
    body[data-theme="light"] .filter-btn:hover,
    body[data-theme="light"] .filter-btn.active {
      background: #ff6600 !important;
      color: #ffffff !important;
      border-color: #ff6600 !important;
    }

    /* Portfolio: सर्व डिझाइन्स एकाच Home पेजवर, छोटे 4:5 thumbnails */
    #portfolioGrid {
      display: grid !important;
      grid-template-columns: none !important;
      grid-template-rows: minmax(0, 1fr) !important;
      grid-auto-flow: column !important;
      grid-auto-columns: calc((100% - 20px) / 3) !important;
      align-items: start !important;
      gap: 10px !important;
      width: 100% !important;
      max-width: 100% !important;
      overflow-x: auto !important;
      overflow-y: hidden !important;
      overscroll-behavior-x: contain !important;
      -webkit-overflow-scrolling: touch !important;
      scroll-snap-type: x mandatory !important;
      scrollbar-width: thin !important;
      padding: 12px 4px 24px !important;
      box-sizing: border-box !important;
    }

    #portfolioGrid > .portfolio-card {
      display: flex !important;
      flex: initial !important;
      flex-direction: column !important;
      width: 100% !important;
      min-width: 0 !important;
      max-width: 100% !important;
      margin: 0 !important;
      overflow: hidden !important;
      border-radius: 12px !important;
      transform: translateY(22px) scale(0.88);
      opacity: 0;
      transition:
        opacity 650ms ease,
        transform 650ms cubic-bezier(.2,.75,.25,1),
        box-shadow 300ms ease !important;
      will-change: transform, opacity;
    }

    #portfolioGrid > .portfolio-card.is-visible {
      opacity: 1 !important;
      transform: translateY(0) scale(1) !important;
    }

    #portfolioGrid > .portfolio-card:hover {
      box-shadow: 0 14px 35px rgba(0,0,0,0.28) !important;
    }

    .portfolio-visual::before,
    .portfolio-visual::after,
    .portfolio-card::before,
    .portfolio-card::after {
      display: none !important;
      opacity: 0 !important;
      content: none !important;
    }

    .portfolio-visual {
      position: relative !important;
      overflow: hidden !important;
      height: auto !important;
      aspect-ratio: 4 / 5 !important;
      min-height: 0 !important;
      flex: 0 0 auto !important;
      border-radius: 12px 12px 0 0 !important;
      background-color: #1a1a1a !important;
    }

    .portfolio-visual.has-img { cursor: pointer; }

    .portfolio-visual img {
      width: 100% !important;
      height: 100% !important;
      object-fit: contain !important;
      display: block !important;
      opacity: 1 !important;
      visibility: visible !important;
      position: relative !important;
      z-index: 10 !important;
      transition: transform 0.35s ease !important;
    }

    .portfolio-card:hover .portfolio-visual img {
      transform: scale(1.045) !important;
    }

    /* फोटोखालील काळी पट्टी आणि डिझाइनचे नाव दाखवू नका; मूळ डेटा DOM मध्ये सुरक्षित राहतो. */
    #portfolioGrid .portfolio-info {
      display: none !important;
    }

    @media (min-width: 701px) {
      #portfolioGrid > .portfolio-card { scroll-snap-align: start !important; }
    }
    @media (max-width: 1100px) and (min-width: 701px) {
      #portfolioGrid { grid-auto-columns: calc((100% - 18px) / 3) !important; gap: 9px !important; }
    }
    @media (max-width: 700px) {
      /* Mobile-only: एकावेळी 2 वर + 2 खाली; पुढील डिझाइन्ससाठी फक्त grid मध्ये swipe */
      #portfolioGrid {
        display: grid !important;
        grid-template-columns: none !important;
        grid-template-rows: repeat(2, minmax(0, 1fr)) !important;
        grid-auto-flow: column !important;
        grid-auto-columns: calc((100% - 10px) / 2) !important;
        gap: 10px !important;
        width: 100% !important;
        max-width: 100% !important;
        overflow-x: auto !important;
        overflow-y: hidden !important;
        overscroll-behavior-x: contain !important;
        touch-action: pan-x pan-y !important;
        -webkit-overflow-scrolling: touch !important;
        scroll-snap-type: x mandatory !important;
        scrollbar-width: thin !important;
        padding: 10px 2px 16px !important;
        align-items: start !important;
      }
      #portfolioGrid > .portfolio-card {
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;
        height: auto !important;
        min-height: 0 !important;
        aspect-ratio: 4 / 5 !important;
        scroll-snap-align: start !important;
      }
      #portfolioGrid .portfolio-visual {
        width: 100% !important;
        height: 100% !important;
        aspect-ratio: 4 / 5 !important;
        border-radius: 10px !important;
      }
    }
    @media (max-width: 380px) {
      #portfolioGrid { gap: 7px !important; grid-auto-columns: calc((100% - 7px) / 2) !important; }
    }

    #portfolioGrid .portfolio-info h3 {
      color: #fff !important;
      font-size: 16px !important;
      line-height: 1.45 !important;
      font-weight: 700 !important;
      margin: 0 !important;
      overflow-wrap: anywhere !important;
    }

    #portfolioGrid .portfolio-info .tag,
    #portfolioGrid .portfolio-info p {
      display: none !important;
    }

    .portfolio-empty-message {
      flex: 0 0 100% !important;
      color: #888 !important;
      text-align: center !important;
      padding: 40px 20px !important;
    }

    @media (max-width: 600px) {
      #portfolioGrid > .portfolio-card {
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;
      }
      .portfolio-visual {
        width: 100% !important;
        height: auto !important;
        min-height: 0 !important;
        flex-basis: auto !important;
        aspect-ratio: 4 / 5 !important;
      }
      .portfolio-visual img { object-fit: contain !important; }
    }

    @media (prefers-reduced-motion: reduce) {
      #portfolioGrid { scroll-behavior: auto !important; }
      #portfolioGrid > .portfolio-card {
        transition: none !important;
        transform: none !important;
        opacity: 1 !important;
      }
    }

    .img-modal {
      display: none;
      position: fixed;
      z-index: 999999;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.93);
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 20px;
      box-sizing: border-box;
      backdrop-filter: blur(5px);
    }

    .img-modal.active {
      display: flex;
    }

    .img-modal img {
      max-width: 92%;
      max-height: 85vh;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.8);
      object-fit: contain;
    }

    .img-modal-close {
      position: absolute;
      top: 15px;
      right: 25px;
      color: #fff;
      font-size: 40px;
      font-weight: bold;
      cursor: pointer;
      z-index: 1000000;
    }

    .img-modal-close:hover {
      color: #ff5555;
    }

    .img-modal-caption {
      margin-top: 12px;
      color: #fff;
      font-size: 16px;
      font-weight: 500;
      text-align: center;
    }
  `;

  document.head.appendChild(style);
}
function setupModal() {
  if (document.getElementById("imgModal")) return;

  const modalHTML = `
    <div id="imgModal" class="img-modal">
      <span class="img-modal-close" id="closeModalBtn">&times;</span>
      <img id="imgModalSrc" src="" alt="Full Design View">
      <div id="imgModalCaption" class="img-modal-caption"></div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modal = document.getElementById("imgModal");
  const closeBtn = document.getElementById("closeModalBtn");

  closeBtn.onclick = () => modal.classList.remove("active");

  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  };
}

function openModal(imageSrc, title) {
  if (!imageSrc) return;

  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("imgModalSrc");
  const modalCaption = document.getElementById("imgModalCaption");

  if (modal && modalImg) {
    modalImg.src = imageSrc;
    modalCaption.textContent = title || "";
    modal.classList.add("active");
  }
}

async function loadSettings() {
  try {
    const response = await fetch(
      API_BASE + "/api/settings?t=" + Date.now(),
      { cache: "no-store" }
    );

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      const settings = data[0];

      CONTACT.whatsapp = settings.whatsapp || "";
      CONTACT.instagram = settings.instagram || "";
      CONTACT.email = settings.email || "";
      CONTACT.logo_url = settings.logo_url || "";
      CONTACT.about = settings.about || "";

      updateContact();

      if (CONTACT.logo_url) {
        document
          .querySelectorAll(
            ".about-logo img, .brand img, .hero-logo, .footer-brand img"
          )
          .forEach(img => {
            img.src = CONTACT.logo_url;
          });
      }

      if (CONTACT.about) {
        const aboutText = document.querySelector(
          "#about [data-i18n='aboutText']"
        );

        if (aboutText) {
          aboutText.textContent = CONTACT.about;
        }
      }
    }
  } catch (error) {
    console.error("Settings error:", error);
  }
}

async function loadPortfolioData() {
  try {
    const response = await fetch(
      API_BASE + "/api/portfolio?t=" + Date.now(),
      { cache: "no-store" }
    );

    const data = await response.json();

    if (Array.isArray(data)) {
      // API ने रिकामी यादी दिली तरी जुने items ठेवू नयेत.
      dynamicPortfolioItems = data.map(item => {
        const rawCat = item.category || item.main_category || "Other";
        const cleanCat = cleanCategoryName(rawCat);

        return {
          ...item,
          title: item.title || item.name || "Untitled Design",
          category: cleanCat,
          subcategory: item.subcategory || item.sub_category || item.subCategory || "",
          desc:
            item.desc ||
            item.description ||
            `${cleanCat} Creative`,
          image: getImageUrl(item)
        };
      });
    }
  } catch (error) {
    console.error("Portfolio fetch error:", error);
  }
}

function updateContact() {
  const whatsappEl = document.getElementById("whatsappDisplay");
  const instagramEl = document.getElementById("instagramDisplay");
  const emailEl = document.getElementById("emailDisplay");
  const whatsappButton = document.getElementById("whatsappContactButton");
  const instagramButton = document.getElementById("instagramContactButton");
  const emailButton = document.getElementById("emailContactButton");

  const setLink = (button, url) => {
    if (!button) return;
    if (url) {
      button.href = url;
      button.style.opacity = "1";
      button.style.pointerEvents = "auto";
      button.removeAttribute("aria-disabled");
    } else {
      button.href = "#contact";
      button.style.opacity = ".55";
      button.style.pointerEvents = "none";
      button.setAttribute("aria-disabled", "true");
    }
  };

  if (whatsappEl) whatsappEl.textContent = CONTACT.whatsapp || "नंतर जोडू";
  if (instagramEl) instagramEl.textContent = CONTACT.instagram || "नंतर जोडू";
  if (emailEl) emailEl.textContent = CONTACT.email || "नंतर जोडू";

  const phone = String(CONTACT.whatsapp || "").replace(/[^0-9]/g, "");
  const instagram = String(CONTACT.instagram || "").trim();
  const instagramUrl = instagram
    ? (instagram.startsWith("http") ? instagram : `https://instagram.com/${instagram.replace(/^@/, "")}`)
    : "";
  setLink(whatsappButton, phone ? `https://wa.me/${phone}` : "");
  setLink(instagramButton, instagramUrl);
  setLink(emailButton, CONTACT.email ? `mailto:${CONTACT.email}` : "");

  if (whatsappEl && phone) {
    whatsappEl.style.cursor = "pointer";
    whatsappEl.onclick = () => window.open(`https://wa.me/${phone}`, "_blank", "noopener");
  }
  if (instagramEl && instagramUrl) {
    instagramEl.style.cursor = "pointer";
    instagramEl.onclick = () => window.open(instagramUrl, "_blank", "noopener");
  }
  if (emailEl && CONTACT.email) {
    emailEl.style.cursor = "pointer";
    emailEl.onclick = () => { window.location.href = `mailto:${CONTACT.email}`; };
  }
}

loadSettings();

const defaultPortfolioItems = [
  {
    title: "Business Design",
    category: "Business",
    desc: "Business / Branding Creative",
    image: ""
  },
  {
    title: "Social Media Creative",
    category: "Social Media",
    desc: "Instagram / Facebook Post",
    image: ""
  },
  {
    title: "Festival Design",
    category: "Festival",
    desc: "Festival & Special Occasion",
    image: ""
  },
  {
    title: "Political Creative",
    category: "Political",
    desc: "Campaign / Political Creative",
    image: ""
  },
  {
    title: "Personal Branding",
    category: "Personal",
    desc: "Personal / Professional Design",
    image: ""
  },
  {
    title: "Poster Design",
    category: "Other",
    desc: "Custom Poster Creative",
    image: ""
  }
];
const services = [
  ["✦", "Logo Design", "Brand identity, logo concepts आणि visual direction."],
  ["▣", "Poster Design", "Business, festival, event आणि custom posters."],
  ["◎", "Social Media Design", "Instagram, Facebook आणि digital creatives."],
  ["◈", "Branding", "Consistent visual identity आणि brand materials."],
  ["↗", "Digital Marketing", "Digital presence वाढवण्यासाठी creative support."],
  ["◌", "Content Creatives", "Campaigns आणि promotions साठी engaging designs."]
];

const whyItems = [
  ["01", "Creative Design", "प्रत्येक कामासाठी वेगळा आणि purpose-driven creative approach."],
  ["02", "Professional Work", "Clean, premium आणि उपयोगी final designs."],
  ["03", "Client Focus", "तुमची गरज, audience आणि कामाचा प्रकार लक्षात घेऊन design."],
  ["04", "Digital Support", "Social media आणि digital marketing साठी creative support."]
];

const reviews = [
  ["Client Review", "तुमचा खरा client feedback इथे दिसेल.", "Client Name"],
  ["Your Review", "काम पूर्ण झाल्यावर client review इथे add करा.", "Client Name"],
  ["Future Review", "नवीन reviews सहज add करता येतील.", "Client Name"]
];

const translations = {
  mr: {
    navHome:"मुख्यपृष्ठ",navPortfolio:"पोर्टफोलिओ",navServices:"सेवा",navAbout:"आमच्याबद्दल",navReviews:"प्रतिक्रिया",navContact:"संपर्क",
    eyebrow:"CREATIVE DESIGN • DIGITAL MARKETING",
    heroTitle:"तुमच्या ब्रँडला<br><span>एक वेगळी ओळख द्या.</span>",
    heroText:"Graphics Design, Social Media Creatives आणि Digital Marketing — तुमच्या व्यवसायासाठी creative support एकाच ठिकाणी.",
    viewWork:"माझे काम पहा →",
    startProject:"संपर्क",
    stat1:"Creative Focus",stat2:"Design Possibilities",stat3:"Digital Presence",
    creative:"Creative",branding:"Branding",marketing:"Marketing",
    portfolioTitle:"निवडक <span>काम</span>",
    portfolioText:"तुमच्या गरजेनुसार तयार केलेल्या creative designs ची झलक.",
    editNote:"नंतर तुमच्या खऱ्या designs assets/portfolio मध्ये टाकून script.js मधून सहज बदलू शकता.",
    beforeTitle:"Design मध्ये <span>फरक</span> दिसला पाहिजे.",
    beforeText:"तुमच्या creative ला clean, premium आणि attention-grabbing look देण्याचा प्रयत्न.",
    servicesTitle:"आम्ही तुमच्यासाठी <span>काय करू शकतो?</span>",
    whyTitle:"फक्त design नाही,<br><span>ओळख निर्माण करा.</span>",
    whyText:"प्रत्येक creative मध्ये तुमचा brand, audience आणि purpose लक्षात घेऊन काम करण्याचा प्रयत्न.",
    reviewsTitle:"Client <span>Reviews</span>",
    reviewsText:"तुमचा feedback आमच्यासाठी महत्त्वाचा आहे.",
    reviewNote:"नंतर खऱ्या client reviews इथे सहज बदलू शकता.",
    aboutTitle:"धर्मवीर ॲडव्हर्टायझिंग",
    aboutText:"Graphics Design आणि Digital Marketing साठी creative आणि practical solutions. सध्या आम्ही घरून काम करतो; भविष्यात office location इथे जोडता येईल.",
    contactTitle:"तुमच्या project बद्दल <span>बोलूया.</span>",
    contactText:"Design, poster, social media किंवा digital marketing — कामाची माहिती पाठवा.",
    nameLabel:"नाव",phoneLabel:"मोबाईल नंबर",workLabel:"कामाचा प्रकार",messageLabel:"संदेश",sendMessage:"Message तयार करा →",
    formNote:"WhatsApp नंबर जोडल्यानंतर हा form WhatsApp message तयार करेल."
  },
  en: {
    navHome:"Home",navPortfolio:"Portfolio",navServices:"Services",navAbout:"About",navReviews:"Reviews",navContact:"Contact",
    eyebrow:"CREATIVE DESIGN • DIGITAL MARKETING",
    heroTitle:"Give your brand<br><span>a unique identity.</span>",
    heroText:"Graphics Design, Social Media Creatives and Digital Marketing — creative support for your business, all in one place.",
    viewWork:"View My Work →",
    startProject:"Contact",
    stat1:"Creative Focus",stat2:"Design Possibilities",stat3:"Digital Presence",
    creative:"Creative",branding:"Branding",marketing:"Marketing",
    portfolioTitle:"Selected <span>Work</span>",
    portfolioText:"A glimpse of creative designs made to suit your needs.",
    editNote:"Add your actual designs to assets/portfolio and update them through script.js.",
    beforeTitle:"Design should make a <span>difference.</span>",
    beforeText:"We aim to give your creative work a clean, premium and attention-grabbing look.",
    servicesTitle:"What can we <span>do for you?</span>",
    whyTitle:"More than design,<br><span>build an identity.</span>",
    whyText:"Every creative is made with your brand, audience and purpose in mind.",
    reviewsTitle:"Client <span>Reviews</span>",
    reviewsText:"Your feedback matters to us.",
    reviewNote:"You can replace these with genuine client reviews later.",
    aboutTitle:"Dharmveer Advertising",
    aboutText:"Creative and practical solutions for Graphics Design and Digital Marketing. We currently work from home; an office location can be added here in the future.",
    contactTitle:"Let's talk about <span>your project.</span>",
    contactText:"Design, posters, social media or digital marketing — send us the details.",
    nameLabel:"Name",phoneLabel:"Mobile Number",workLabel:"Work Type",messageLabel:"Message",sendMessage:"Create Message →",
    formNote:"Once a WhatsApp number is added, this form will create a WhatsApp message."
  },
  hi: {
    navHome:"Home",navPortfolio:"Portfolio",navServices:"Services",navAbout:"About",navReviews:"Reviews",navContact:"Contact",
    eyebrow:"CREATIVE DESIGN • DIGITAL MARKETING",
    heroTitle:"आपके ब्रांड को<br><span>एक अलग पहचान दें.</span>",
    heroText:"Graphics Design, Social Media Creatives और Digital Marketing — आपके काम के लिए creative support एक ही जगह.",
    viewWork:"मेरा काम देखें →",
    startProject:"संपर्क",
    stat1:"Creative Focus",stat2:"Design Possibilities",stat3:"Digital Presence",
    creative:"Creative",branding:"Branding",marketing:"Marketing",
    portfolioTitle:"चुना हुआ <span>काम</span>",
    portfolioText:"आपकी जरूरत के अनुसार तैयार किए गए creative designs की झलक.",
    editNote:"बाद में अपनी असली designs assets/portfolio में डालकर script.js से आसानी से बदल सकते हैं.",
    beforeTitle:"Design में <span>फर्क</span> दिखना चाहिए.",
    beforeText:"आपके creative को clean, premium और attention-grabbing look देने का प्रयास.",
    servicesTitle:"हम आपके लिए <span>क्या कर सकते हैं?</span>",
    whyTitle:"सिर्फ design नहीं,<br><span>पहचान बनाएं.</span>",
    whyText:"हर creative में आपके brand, audience और purpose को ध्यान में रखकर काम करने का प्रयास.",
    reviewsTitle:"Client <span>Reviews</span>",
    reviewsText:"आपका feedback हमारे लिए महत्वपूर्ण है.",
    reviewNote:"बाद में असली client reviews यहां आसानी से बदल सकते हैं.",
    aboutTitle:"धर्मवीर ॲडव्हर्टायझिंग",
    aboutText:"Graphics Design और Digital Marketing के लिए creative और practical solutions. अभी हम घर से काम करते हैं; भविष्य में office location यहां जोड़ी जा सकती है.",
    contactTitle:"आपके project के बारे में <span>बात करते हैं.</span>",
    contactText:"Design, poster, social media या digital marketing — काम की जानकारी भेजें.",
    nameLabel:"नाम",phoneLabel:"मोबाइल नंबर",workLabel:"काम का प्रकार",messageLabel:"संदेश",sendMessage:"Message बनाएं →",
    formNote:"WhatsApp नंबर जोड़ने के बाद यह form सीधे WhatsApp message तैयार करेगा."
  }
};

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

let activePortfolioCategory = "Personal";
let portfolioRevealObserver = null;

function escapeHTML(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, ch => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[ch]);
}

function observePortfolioCards() {
  const cards = document.querySelectorAll("#portfolioGrid .portfolio-card");

  if (portfolioRevealObserver) {
    portfolioRevealObserver.disconnect();
    portfolioRevealObserver = null;
  }

  if (!("IntersectionObserver" in window)) {
    cards.forEach(card => card.classList.add("is-visible"));
    return;
  }

  portfolioRevealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        portfolioRevealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: document.getElementById("portfolioGrid"),
    threshold: 0.12
  });

  cards.forEach(card => portfolioRevealObserver.observe(card));
}

function renderPortfolio(category = "Personal", isExpanded = false) {
  const grid = $("#portfolioGrid");
  if (!grid) return;

  activePortfolioCategory = category || "All";

  const currentItems = dynamicPortfolioItems.length > 0
    ? dynamicPortfolioItems
    : defaultPortfolioItems;

  const defaultCats = ["Business", "Social Media", "Festival", "Political", "Personal", "Other"];
  const managedCats = managedPortfolioCategories
    .map(item => String(item.name || "").trim())
    .filter(Boolean);
  const dynamicCats = currentItems
    .map(item => cleanCategoryName(item.category))
    .filter(Boolean);

  const uniqueCategoryList = [];
  // Admin मधील categories प्रथम; fallback categories जुन्या साइटसाठी.
  [...managedCats, ...defaultCats, ...dynamicCats].forEach(cat => {
    const clean = cleanCategoryName(cat);
    if (clean && !uniqueCategoryList.some(existing => existing.toLowerCase() === clean.toLowerCase())) {
      uniqueCategoryList.push(clean);
    }
  });

  const allCats = ["All", ...uniqueCategoryList];
  const filtersEl = $("#filters");

  if (filtersEl) {
    filtersEl.innerHTML = allCats.map(cat => {
      const active = cat.toLowerCase() === activePortfolioCategory.toLowerCase();
      return `<button type="button" class="filter-btn ${active ? "active" : ""}" data-category="${escapeHTML(cat)}">${escapeHTML(cat)}</button>`;
    }).join("");
  }

  const filteredItems = currentItems.filter(item => {
    if (activePortfolioCategory === "All") return true;
    const itemCat = cleanCategoryName(item.category);
    const itemSub = String(item.subcategory || "").trim();
    return itemCat.toLowerCase() === activePortfolioCategory.toLowerCase()
      || itemSub.toLowerCase() === activePortfolioCategory.toLowerCase();
  });

  if (filteredItems.length === 0) {
    grid.innerHTML = `<div class="portfolio-empty-message">या कॅटेगरीमध्ये सध्या डिझाईन जोडलेले नाही.</div>`;
  } else {
    // Side scrolling साठी सर्व डिझाइन्स एकाच रांगेत दाखवा.
    grid.innerHTML = filteredItems.map((item, index) => {
      const imgUrl = getImageUrl(item);
      const safeUrl = escapeHTML(imgUrl);
      const safeTitle = escapeHTML(item.title || "Untitled Design");
      const safeCategory = escapeHTML(item.category || "Design");
      const safeDesc = escapeHTML(item.desc || "");
      const hasImage = Boolean(imgUrl);

      return `
        <article class="portfolio-card">
          <div class="portfolio-visual ${hasImage ? "has-img" : ""}">
            ${hasImage
              ? `<img src="${safeUrl}" alt="${safeTitle}" loading="${index < 3 ? "eager" : "lazy"}" decoding="async">`
              : `<span style="color:#888;display:flex;width:100%;height:100%;align-items:center;justify-content:center;">${String(index + 1).padStart(2, "0")}</span>`
            }
          </div>
          <div class="portfolio-info">
            <span class="tag">${safeCategory}</span>
            <h3>${safeTitle}</h3>
            <p>${safeDesc}</p>
          </div>
        </article>`;
    }).join("");

    // Click handling is attached safely after rendering.
    grid.querySelectorAll(".portfolio-card").forEach((card, index) => {
      const item = filteredItems[index];
      const image = card.querySelector(".portfolio-visual img");
      if (image) {
        image.addEventListener("click", () => openModal(getImageUrl(item), item.title || ""));
      }
    });
  }

  if (filtersEl) {
    filtersEl.querySelectorAll(".filter-btn").forEach(button => {
      button.addEventListener("click", () => {
        renderPortfolio(button.dataset.category || "All", false);
      });
    });
  }

  observePortfolioCards();
}

function setupBeforeAfterClick() {
  document.querySelectorAll(".before-after img, #beforeAfter img, .before-after-img").forEach(img => {
    img.classList.add("before-after-img");
    img.onclick = () => {
      openModal(img.src, "Before / After Design Preview");
    };
  });
}

function renderServices() {
  const servicesGrid = $("#servicesGrid");
  if (!servicesGrid) return;

  const serviceMessages = {
    "Logo Design": "नमस्कार धर्मवीर ॲडव्हर्टायझिंग, मला माझ्या ब्रँडसाठी Logo Design करून हवे आहे. कृपया अधिक माहिती द्या.",
    "Poster Design": "नमस्कार धर्मवीर ॲडव्हर्टायझिंग, मला Poster / Banner Design करून हवे आहे. कृपया अधिक माहिती द्या.",
    "Social Media Design": "नमस्कार धर्मवीर ॲडव्हर्टायझिंग, मला Social Media Creatives डिझाईन करायचे आहेत. कृपया अधिक माहिती द्या.",
    "Branding": "नमस्कार धर्मवीर ॲडव्हर्टायझिंग, मला माझ्या व्यवसायाचे संपूर्ण Branding करून हवे आहे. कृपया अधिक माहिती द्या.",
    "Digital Marketing": "नमस्कार धर्मवीर ॲडव्हर्टायझिंग, मला Digital Marketing सपोर्टबद्दल अधिक माहिती हवी आहे.",
    "Content Creatives": "नमस्कार धर्मवीर ॲडव्हर्टायझिंग, मला Campaign / Promotional Content Creatives डिझाईन करायचे आहेत."
  };

  servicesGrid.innerHTML = services.map(x => {
    const title = x[1];
    const msg = serviceMessages[title] ||
      `नमस्कार धर्मवीर ॲडव्हर्टायझिंग, मला ${title} बद्दल माहिती हवी आहे.`;

    return `
      <article class="service service-card-clickable"
               data-msg="${encodeURIComponent(msg)}"
               style="cursor:pointer;">
        <div class="icon">${x[0]}</div>
        <h3>${x[1]}</h3>
        <p>${x[2]}</p>
      </article>`;
  }).join("");

  $$(".service-card-clickable").forEach(card => {
    card.onclick = () => {
      const msg = card.dataset.msg;

      if (CONTACT.whatsapp) {
        window.open(`https://wa.me/${CONTACT.whatsapp}?text=${msg}`, "_blank");
      } else {
        const toast = $("#toast");
        if (toast) {
          toast.textContent = "Admin Panel मध्ये आधी WhatsApp Number सेव्ह करा.";
          toast.classList.add("show");
          setTimeout(() => toast.classList.remove("show"), 3000);
        }
      }
    };
  });
}

function renderWhy() {
  const whyList = $("#whyList");

  if (whyList) {
    whyList.innerHTML = whyItems.map(x => `
      <div class="why-item">
        <b>${x[0]}</b>
        <div>
          <h3>${x[1]}</h3>
          <p>${x[2]}</p>
        </div>
      </div>`).join("");
  }
}

function renderReviews() {
  const reviewsGrid = $("#reviewsGrid");

  if (reviewsGrid) {
    reviewsGrid.innerHTML = reviews.map(x => `
      <article class="review">
        <div class="stars">★★★★★</div>
        <p>“${x[1]}”</p>
        <strong>${x[2]}</strong>
        <small>${x[0]}</small>
      </article>`).join("");
  }
}

function applyLanguage(lang) {
  const t = translations[lang] || translations.mr;
  document.documentElement.lang = lang;

  $$("[data-i18n]").forEach(el => {
    if (t[el.dataset.i18n] !== undefined) {
      el.innerHTML = t[el.dataset.i18n];
    }
  });

  localStorage.setItem("dv-lang", lang);
}

// Main App Initialization
async function initApp() {
  setupModal();

  // Hide loader early to ensure screen doesn't block
  forceHideLoader();

  await loadManagedPortfolioCategories();
  await loadPortfolioData();

  // सुरुवातीला सर्व Portfolio डिझाइन्स एकत्र दाखवा; विद्यमान filters वापरून वेगळी category निवडता येईल.
  const initialCategory = "All";

  try { renderPortfolio(initialCategory, false); } catch (e) {}
  try { renderServices(); } catch (e) {}
  try { renderWhy(); } catch (e) {}
  try { renderReviews(); } catch (e) {}
  try { updateContact(); } catch (e) {}
  try { setupBeforeAfterClick(); } catch (e) {}
  try { applyLanguage(localStorage.getItem("dv-lang") || "mr"); } catch (e) {}

  if ($("#year")) {
    $("#year").textContent = new Date().getFullYear();
  }

  const menuBtn = $("#menuToggle");

  if (menuBtn) {
    menuBtn.onclick = () => {
      const mainNav = $("#mainNav");
      if (mainNav) mainNav.classList.toggle("open");
    };
  }

  $$(".language-menu button").forEach(b => {
    b.onclick = () => applyLanguage(b.dataset.lang);
  });

  const contactForm = $("#contactForm");

  if (contactForm) {
    contactForm.onsubmit = e => {
      e.preventDefault();

      const fd = new FormData(e.currentTarget);
      const msg = `नमस्कार धर्मवीर ॲडव्हर्टायझिंग,%0A%0Aनाव: ${fd.get("name")}%0Aमोबाईल: ${fd.get("phone")}%0Aकामाचा प्रकार: ${fd.get("work")}%0Aसंदेश: ${fd.get("message") || "-"}`;

      if (CONTACT.whatsapp) {
        window.open(`https://wa.me/${CONTACT.whatsapp}?text=${msg}`, "_blank");
      } else {
        const toast = $("#toast");

        if (toast) {
          toast.textContent = "WhatsApp number नंतर Admin Panel मध्ये जोडा.";
          toast.classList.add("show");
          setTimeout(() => toast.classList.remove("show"), 3000);
        }
      }
    };
  }

  // Dark / light theme toggle; remembers the visitor's choice.
  const themeBtn = document.getElementById("themeToggle");
  const setTheme = theme => {
    document.body.dataset.theme = theme;
    if (themeBtn) {
      themeBtn.textContent = theme === "light" ? "🌙 Dark" : "☀️ Light";
      themeBtn.setAttribute("aria-label", theme === "light" ? "डार्क थीम निवडा" : "लाईट थीम निवडा");
    }
    try { localStorage.setItem("dv-theme", theme); } catch (e) {}
  };
  let savedTheme = "dark";
  try { savedTheme = localStorage.getItem("dv-theme") || "dark"; } catch (e) {}
  setTheme(savedTheme === "light" ? "light" : "dark");
  if (themeBtn) themeBtn.addEventListener("click", () => {
    setTheme(document.body.dataset.theme === "light" ? "dark" : "light");
  });

  const feedbackBtn = document.getElementById("giveFeedbackBtn");

  if (feedbackBtn) {
    feedbackBtn.onclick = () => {
      const msg = `नमस्कार धर्मवीर ॲडव्हर्टायझिंग,%0A%0Aमला माझी प्रतिक्रिया (Review) द्यायची आहे:%0A%0Aरेटिंग: ⭐⭐⭐⭐⭐%0Aनाव: %0Aप्रतिक्रिया: `;

      if (CONTACT.whatsapp) {
        window.open(`https://wa.me/${CONTACT.whatsapp}?text=${msg}`, "_blank");
      } else {
        const toast = $("#toast");

        if (toast) {
          toast.textContent = "WhatsApp number नंतर Admin Panel मध्ये जोडा.";
          toast.classList.add("show");
          setTimeout(() => toast.classList.remove("show"), 3000);
        }
      }
    };
  }

  forceHideLoader();
}

// App Trigger
if (document.readyState === "complete" || document.readyState === "interactive") {
  initApp();
} else {
  document.addEventListener("DOMContentLoaded", initApp);
}

// Emergency Fallback: 1.2s नंतर loader auto-close होईल
setTimeout(forceHideLoader, 1200);
/* Admin Panel मध्ये नवीन बदल झाल्यास refresh न करता साइटवर दाखवण्याचा प्रयत्न.
   API उपलब्ध नसल्यास सध्याची वेबसाइट चालूच राहते. */
let portfolioSyncBusy = false;
async function syncPortfolioFromAdmin() {
  if (portfolioSyncBusy || document.visibilityState === "hidden") return;
  portfolioSyncBusy = true;

  try {
    const previousItems = JSON.stringify(dynamicPortfolioItems);
    const previousCategories = JSON.stringify(managedPortfolioCategories);

    await loadManagedPortfolioCategories();
    await loadPortfolioData();

    const changed =
      previousItems !== JSON.stringify(dynamicPortfolioItems) ||
      previousCategories !== JSON.stringify(managedPortfolioCategories);

    if (changed) {
      const selected = managedPortfolioCategories.some(cat =>
        String(cat.name || "").toLowerCase() === String(activePortfolioCategory).toLowerCase()
      ) || activePortfolioCategory === "All"
        ? activePortfolioCategory
        : (managedPortfolioCategories[0]?.name || "All");

      renderPortfolio(selected, false);
    }
  } catch (error) {
    console.error("Portfolio sync error:", error);
  } finally {
    portfolioSyncBusy = false;
  }
}

window.addEventListener("load", () => {
  window.setInterval(syncPortfolioFromAdmin, 30000);
});
