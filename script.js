/* =========================================================
   धर्मवीर ॲडव्हर्टायझिंग — SCRIPT.JS (ORIGINAL FULL CODE)
   ========================================================= */

let CONTACT = {
  whatsapp: "",
  instagram: "",
  email: "",
  logo_url: "",
  about: ""
};

const API_BASE = "https://falling-tree-3813.dharmveeradvertising389.workers.dev";

// Local default logo path
const DEFAULT_LOGO = "assets/logo.png";

// Admin Panel मधून आलेले फोटो साठवण्यासाठी
let dynamicPortfolioItems = [];

// १. फोटोची लिंक शोधणारा फंक्शन
function getImageUrl(item) {
  if (!item) return "";
  let url = item.image_url || item.imageUrl || item.image || item.photo || item.photo_url || item.url || item.img || item.src || "";
  if (typeof url === 'string') {
    url = url.trim();
    if (url === "null" || url === "undefined") return "";
    if (url.startsWith("/")) {
      url = API_BASE + url;
    }
  }
  return url;
}

// २. कॅटेगरीच्या नावातील डबल ऑप्शन्स घालवण्यासाठी नॅचरल मॅपिंग
function cleanCategoryName(cat) {
  if (!cat) return "Other";
  let c = cat.trim();
  let lower = c.toLowerCase();
  
  if (lower.includes("festival")) return "Festival";
  if (lower.includes("business")) return "Business";
  if (lower.includes("social")) return "Social Media";
  if (lower.includes("political")) return "Political";
  if (lower.includes("personal")) return "Personal";
  if (lower.includes("other")) return "Other";
  
  return c;
}

// ३. ऑटो CSS स्टाइल इंजेक्ट (Fixed PNG Logo & Active Filters)
if (!document.getElementById("portfolio-custom-styles")) {
  const style = document.createElement("style");
  style.id = "portfolio-custom-styles";
  style.innerHTML = `
    /* Filter Buttons Orange Style */
    #filters {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 10px !important;
      justify-content: center !important;
      margin-bottom: 30px !important;
      position: relative !important;
      z-index: 50 !important;
      visibility: visible !important;
      opacity: 1 !important;
      pointer-events: auto !important;
    }

    .filter-btn {
      padding: 8px 20px !important;
      border-radius: 25px !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      background: rgba(255, 255, 255, 0.05) !important;
      color: #ddd !important;
      cursor: pointer !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      transition: all 0.3s ease !important;
      display: inline-block !important;
      pointer-events: auto !important;
      user-select: none;
    }

    .filter-btn:hover, .filter-btn.active {
      background: #ff6600 !important;
      color: #ffffff !important;
      border-color: #ff6600 !important;
      box-shadow: 0 4px 15px rgba(255, 102, 0, 0.5) !important;
    }

    /* Show More/Less Button Style */
    .toggle-portfolio-btn {
      display: inline-block !important;
      margin: 30px auto 10px auto !important;
      padding: 10px 25px !important;
      background: #ff6600 !important;
      color: #ffffff !important;
      border: none !important;
      border-radius: 25px !important;
      font-size: 15px !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      box-shadow: 0 4px 15px rgba(255, 102, 0, 0.4) !important;
      transition: all 0.3s ease !important;
    }
    .toggle-portfolio-btn:hover {
      background: #e65c00 !important;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 102, 0, 0.6) !important;
    }

    /* Image & Portfolio Card */
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
      height: 280px !important;
      border-radius: 12px !important;
      background-color: #1a1a1a !important;
    }

    .portfolio-visual.has-img {
      cursor: pointer;
    }

    .portfolio-visual img {
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
      display: block !important;
      opacity: 1 !important;
      visibility: visible !important;
      position: relative !important;
      z-index: 10 !important;
      transition: transform 0.3s ease !important;
    }

    .portfolio-card:hover .portfolio-visual img {
      transform: scale(1.05) !important;
    }

    /* Lightbox Modal */
    .img-modal {
      display: none;
      position: fixed;
      z-index: 999999;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.93);
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

    /* --- Transparent PNG Logo Container --- */
    #dv-splash-screen {
      position: fixed;
      inset: 0;
      background: #0b0f17;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999999;
      transition: opacity 0.4s ease, visibility 0.4s ease;
    }
    #dv-splash-screen.fade-out {
      opacity: 0;
      visibility: hidden;
      pointer-events: none !important;
      display: none !important;
    }
    .dv-logo-box {
      text-align: center;
    }
    .dv-logo-wrapper {
      width: 140px;
      height: 140px;
      margin: 0 auto 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent !important;
      border: none !important;
      border-radius: 0 !important;
      box-shadow: none !important;
    }
    .dv-logo-wrapper img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      filter: drop-shadow(0px 4px 12px rgba(255, 102, 0, 0.5));
    }
    .dv-logo-text {
      color: #ffffff;
      font-weight: 800;
      font-size: 1rem;
    }
  `;
  document.head.appendChild(style);
}

// Intro Splash Inject करणारा फंक्शन
function setupIntroAndModal() {
  if (document.getElementById("dv-splash-screen")) return;

  const logoSrc = CONTACT.logo_url || DEFAULT_LOGO;
  const logoHTML = `<img src="${logoSrc}" id="splashLogoImg" alt="Logo" onerror="this.onerror=null; this.src='${DEFAULT_LOGO}';">`;

  const introHTML = `
    <!-- 1st Logo Pop-up Splash -->
    <div id="dv-splash-screen">
      <div class="dv-logo-box">
        <div class="dv-logo-wrapper">
          ${logoHTML}
        </div>
        <p style="color:#94a3b8; font-size: 0.9rem;">धर्मवीर ॲडव्हर्टायझिंग</p>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', introHTML);

  // १ला लोगो ३.८ सेकंद (3800ms) दिसेल आणि मग थेट वेबसाईट ओपन होईल
  setTimeout(() => {
    const splash = document.getElementById("dv-splash-screen");
    
    const loader = document.getElementById("loader");
    if (loader) {
      loader.classList.add("hide");
      loader.style.display = "none";
    }

    if (splash) {
      splash.classList.add("fade-out");
      splash.style.display = "none";
    }
  }, 3800);
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
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal = document.getElementById("imgModal");
  const closeBtn = document.getElementById("closeModalBtn");

  if (closeBtn) closeBtn.onclick = () => modal.classList.remove("active");
  if (modal) {
    modal.onclick = (e) => {
      if (e.target === modal) modal.classList.remove("active");
    };
  }
}

function openModal(imageSrc, title) {
  if (!imageSrc) return;
  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("imgModalSrc");
  const modalCaption = document.getElementById("imgModalCaption");
  if (modal && modalImg) {
    modalImg.src = imageSrc;
    if (modalCaption) modalCaption.textContent = title || "";
    modal.classList.add("active");
  }
}

async function loadSettings() {
  try {
    const response = await fetch(API_BASE + "/api/settings?t=" + Date.now(), { cache: "no-store" });
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      const settings = data[0];
      CONTACT.whatsapp = settings.whatsapp || "";
      CONTACT.instagram = settings.instagram || "";
      CONTACT.email = settings.email || "";
      CONTACT.logo_url = settings.logo_url || "";
      CONTACT.about = settings.about || "";

      updateContact();

      const activeLogo = CONTACT.logo_url || DEFAULT_LOGO;
      document.querySelectorAll(".about-logo img, .brand img, .hero-logo, .footer-brand img, .dv-logo-wrapper img, #splashLogoImg").forEach(img => {
        img.src = activeLogo;
      });

      if (CONTACT.about) {
        const aboutText = document.querySelector("#about [data-i18n='aboutText']");
        if (aboutText) aboutText.textContent = CONTACT.about;
      }
    }
  } catch (error) {
    console.error("Settings error:", error);
  }
}

async function loadPortfolioData() {
  try {
    const response = await fetch(API_BASE + "/api/portfolio?t=" + Date.now(), { cache: "no-store" });
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      dynamicPortfolioItems = data.map(item => {
        const imgUrl = getImageUrl(item);
        const rawCat = item.category || "Other";
        return {
          title: item.title || "Untitled Design",
          category: cleanCategoryName(rawCat),
          desc: item.desc || item.description || `${cleanCategoryName(rawCat)} Creative`,
          image: imgUrl
        };
      });
      renderPortfolio("All", false);
    }
  } catch (error) {
    console.error("Portfolio fetch error:", error);
  }
}

function updateContact() {
  const whatsappEl = document.getElementById("whatsappDisplay");
  const instagramEl = document.getElementById("instagramDisplay");
  const emailEl = document.getElementById("emailDisplay");

  if (whatsappEl) {
    whatsappEl.textContent = CONTACT.whatsapp ? CONTACT.whatsapp : "नंतर जोडू";
    if (CONTACT.whatsapp) {
      whatsappEl.style.cursor = "pointer";
      whatsappEl.onclick = () => window.open(`https://wa.me/${CONTACT.whatsapp}`, "_blank");
    }
  }

  if (instagramEl) {
    instagramEl.textContent = CONTACT.instagram ? CONTACT.instagram : "नंतर जोडू";
    if (CONTACT.instagram) {
      instagramEl.style.cursor = "pointer";
      const instaLink = CONTACT.instagram.startsWith("http") 
        ? CONTACT.instagram 
        : `https://instagram.com/${CONTACT.instagram.replace('@', '')}`;
      instagramEl.onclick = () => window.open(instaLink, "_blank");
    }
  }

  if (emailEl) {
    emailEl.textContent = CONTACT.email ? CONTACT.email : "नंतर जोडू";
    if (CONTACT.email) {
      emailEl.style.cursor = "pointer";
      emailEl.onclick = () => window.open(`mailto:${CONTACT.email}`, "_blank");
    }
  }
}

const defaultPortfolioItems = [
  {title:"Business Design", category:"Business", desc:"Business / Branding Creative", image:""},
  {title:"Social Media Creative", category:"Social Media", desc:"Instagram / Facebook Post", image:""},
  {title:"Festival Design", category:"Festival", desc:"Festival & Special Occasion", image:""},
  {title:"Political Creative", category:"Political", desc:"Campaign / Political Creative", image:""},
  {title:"Personal Branding", category:"Personal", desc:"Personal / Professional Design", image:""},
  {title:"Poster Design", category:"Other", desc:"Custom Poster Creative", image:""}
];

const services = [
  ["✦","Logo Design","Brand identity, logo concepts आणि visual direction."],
  ["▣","Poster Design","Business, festival, event आणि custom posters."],
  ["◎","Social Media Design","Instagram, Facebook आणि digital creatives."],
  ["◈","Branding","Consistent visual identity आणि brand materials."],
  ["↗","Digital Marketing","Digital presence वाढवण्यासाठी creative support."],
  ["◌","Content Creatives","Campaigns आणि promotions साठी engaging designs."]
];

const whyItems = [
  ["01","Creative Design","प्रत्येक कामासाठी वेगळा आणि purpose-driven creative approach."],
  ["02","Professional Work","Clean, premium आणि उपयोगी final designs."],
  ["03","Client Focus","तुमची गरज, audience आणि कामाचा प्रकार लक्षात घेऊन design."],
  ["04","Digital Support","Social media आणि digital marketing साठी creative support."]
];

const reviews = [
  ["Client Review","तुमचा खरा client feedback इथे दिसेल.","Client Name"],
  ["Your Review","काम पूर्ण झाल्यावर client review इथे add करा.","Client Name"],
  ["Future Review","नवीन reviews सहज add करता येतील.","Client Name"]
];

const translations = {
  mr:{
    navHome:"Home",navPortfolio:"Portfolio",navServices:"Services",navAbout:"About",navReviews:"Reviews",navContact:"Contact",
    eyebrow:"CREATIVE DESIGN • DIGITAL MARKETING",heroTitle:"तुमच्या ब्रँडला<br><span>वेगळी ओळख</span> देऊया.",
    heroText:"आकर्षक Graphics Design, Social Media Creatives आणि Digital Marketing — तुमच्या कामासाठी एकाच ठिकाणी.",
    viewWork:"माझं काम पाहा →",
    startProject:"कामाबद्दल बोला",
    stat1:"Creative Focus",stat2:"Design Possibilities",stat3:"Digital Presence",
    creative:"Creative",branding:"Branding",marketing:"Marketing",portfolioTitle:"निवडक <span>काम</span>",portfolioText:"तुमच्या गरजेनुसार तयार केलेल्या creative designs ची झलक.",
    editNote:"नंतर तुझी खरी designs assets/portfolio मध्ये टाकून script.js मधून सहज बदलता येतील.",
    beforeTitle:"Design मध्ये <span>फरक</span> दिसला पाहिजे.",beforeText:"तुमच्या जुन्या creative ला अधिक clean, premium आणि attention-grabbing look देण्याचा प्रयत्न.",
    servicesTitle:"तुमच्यासाठी <span>काय करू शकतो?</span>",whyTitle:"फक्त design नाही,<br><span>ओळख तयार करूया.</span>",whyText:"प्रत्येक creative मध्ये तुमचा brand, audience आणि purpose लक्षात घेऊन काम करण्याचा प्रयत्न.",
    reviewsTitle:"Client <span>Reviews</span>",reviewsText:"तुमच्या feedback ला आमच्यासाठी विशेष महत्त्व आहे.",reviewNote:"खरे client reviews मिळाल्यावर इथे सहज बदलता येतील.",
    aboutTitle:"धर्मवीर ॲडव्हर्टायझिंग",aboutText:"Graphics Design आणि Digital Marketing साठी creative आणि practical solutions देण्याचा आमचा प्रयत्न. सध्या आम्ही घरून काम करतो; भविष्यात office सुरू झाल्यावर location इथे जोडता येईल.",
    contactTitle:"तुमच्या project बद्दल <span>बोलूया.</span>",contactText:"Design, poster, social media किंवा digital marketing — कामाची माहिती पाठवा.",
    nameLabel:"नाव",phoneLabel:"मोबाईल नंबर",workLabel:"कामाचा प्रकार",messageLabel:"संदेश",sendMessage:"Message तयार करा →",formNote:"WhatsApp नंबर जोडल्यावर हा form थेट WhatsApp message तयार करेल."
  },
  en:{
    navHome:"Home",navPortfolio:"Portfolio",navServices:"Services",navAbout:"About",navReviews:"Reviews",navContact:"Contact",
    eyebrow:"CREATIVE DESIGN • DIGITAL MARKETING",heroTitle:"Give your brand<br><span>a different identity.</span>",
    heroText:"Graphics Design, Social Media Creatives and Digital Marketing — creative support for your work in one place.",
    viewWork:"View My Work →",
    startProject:"Start a Project",
    stat1:"Creative Focus",stat2:"Design Possibilities",stat3:"Digital Presence",
    creative:"Creative",branding:"Branding",marketing:"Marketing",portfolioTitle:"Selected <span>Work</span>",portfolioText:"A glimpse of creative work built around your needs.",
    editNote:"Add your real designs later in assets/portfolio and update them easily from script.js.",
    beforeTitle:"Design should <span>show the difference.</span>",beforeText:"A cleaner, premium and attention-grabbing direction for your creatives.",
    servicesTitle:"What can we <span>do for you?</span>",whyTitle:"Not just design,<br><span>build an identity.</span>",whyText:"Every creative is approached with your brand, audience and purpose in mind.",
    reviewsTitle:"Client <span>Reviews</span>",reviewsText:"Your feedback matters to us.",reviewNote:"Replace these placeholders with real client reviews later.",
    aboutTitle:"धर्मवीर ॲडव्हर्टायझिंग",aboutText:"Creative and practical solutions for Graphics Design and Digital Marketing. We currently work from home; an office location can be added here in the future.",
    contactTitle:"Let's talk about <span>your project.</span>",contactText:"Design, posters, social media or digital marketing — send us the details.",
    nameLabel:"Name",phoneLabel:"Mobile Number",workLabel:"Work Type",messageLabel:"Message",sendMessage:"Create Message →",formNote:"Once a WhatsApp number is added, this form will create a WhatsApp message."
  },
  hi:{
    navHome:"Home",navPortfolio:"Portfolio",navServices:"Services",navAbout:"About",navReviews:"Reviews",navContact:"Contact",
    eyebrow:"CREATIVE DESIGN • DIGITAL MARKETING",heroTitle:"आपके ब्रांड को<br><span>एक अलग पहचान दें.</span>",
    heroText:"Graphics Design, Social Media Creatives और Digital Marketing — आपके काम के लिए creative support एक ही जगह.",
    viewWork:"मेरा काम देखें →",
    startProject:"काम के बारे में बात करें",
    stat1:"Creative Focus",stat2:"Design Possibilities",stat3:"Digital Presence",
    creative:"Creative",branding:"Branding",marketing:"Marketing",portfolioTitle:"चुना हुआ <span>काम</span>",portfolioText:"आपकी जरूरत के अनुसार तैयार किए गए creative designs की झलक.",
    editNote:"बाद में अपनी असली designs assets/portfolio में डालकर script.js से आसानी से बदल सकते हैं.",
    beforeTitle:"Design में <span>फर्क</span> दिखना चाहिए.",beforeText:"आपके creative को clean, premium और attention-grabbing look देने का प्रयास.",
    servicesTitle:"हम आपके लिए <span>क्या कर सकते हैं?</span>",whyTitle:"सिर्फ design नहीं,<br><span>पहचान बनाएं.</span>",whyText:"हर creative में आपके brand, audience और purpose को ध्यान में रखकर काम करने का प्रयास.",
    reviewsTitle:"Client <span>Reviews</span>",reviewsText:"आपका feedback हमारे लिए महत्वपूर्ण है.",reviewNote:"बाद में असली client reviews यहां आसानी से बदल सकते हैं.",
    aboutTitle:"धर्मवीर ॲडव्हर्टायझिंग",aboutText:"Graphics Design और Digital Marketing के लिए creative और practical solutions. अभी हम घर से काम करते हैं; भविष्य में office location यहां जोड़ी जा सकती है.",
    contactTitle:"आपके project के बारे में <span>बात करते हैं.</span>",contactText:"Design, poster, social media या digital marketing — काम की जानकारी भेजें.",
    nameLabel:"नाम",phoneLabel:"मोबाइल नंबर",workLabel:"काम का प्रकार",messageLabel:"संदेश",sendMessage:"Message बनाएं →",formNote:"WhatsApp नंबर जोड़ने के बाद यह form सीधे WhatsApp message तैयार करेगा."
  }
};

const $= s => document.querySelector(s); const$$ = s => document.querySelectorAll(s);

// पोर्टफोलिओ व फिल्टर्स रेंडरिंग
function renderPortfolio(category="All", isExpanded=false){
  const grid=$("#portfolioGrid");
  if (!grid) return;

  const currentItems = dynamicPortfolioItems.length > 0 ? dynamicPortfolioItems : defaultPortfolioItems;
  
  const defaultCats = ["Business", "Social Media", "Festival", "Political", "Personal", "Other"];
  const dynamicCats = currentItems.map(x => cleanCategoryName(x.category)).filter(Boolean);
  
  const uniqueCategoryList = [];
  [...defaultCats, ...dynamicCats].forEach(cat => {
    const clean = cleanCategoryName(cat);
    if (!uniqueCategoryList.includes(clean)) {
      uniqueCategoryList.push(clean);
    }
  });

  const allCats = ["All", ...uniqueCategoryList];

  const filtersEl = $("#filters");
  if (filtersEl) {
    filtersEl.innerHTML = allCats.map(c => 
      `<button class="filter-btn ${c.toLowerCase()===category.toLowerCase()?'active':''}" data-category="${c}">${c}</button>`
    ).join("");
  }

  let filteredItems = currentItems.filter(x => {
    if (category === "All") return true;
    return x.category && x.category.toLowerCase() === category.toLowerCase();
  });

  const existingToggleBtn = document.getElementById("portfolioToggleBtn");
  if (existingToggleBtn) {
    existingToggleBtn.remove();
  }

  if (filteredItems.length === 0 && category !== "All") {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #888; padding: 40px; font-size: 16px;">या कॅटेगरीमध्ये सध्या डिझाईन जोडलेले नाही.</div>`;
  } else {
    const itemsToDisplay = isExpanded ? filteredItems : filteredItems.slice(0, 2);

    grid.innerHTML = itemsToDisplay.map((x, i) => {
      const imgUrl = getImageUrl(x);
      const hasImage = Boolean(imgUrl);

      return `
        <article class="portfolio-card">
          <div class="portfolio-visual ${hasImage ? 'has-img' : ''}" 
               style="${hasImage ? `background-image: url('${imgUrl}') !important; background-size: cover !important; background-position: center !important;` : ''}"
               ${hasImage ? `onclick="openModal('${imgUrl}', '${x.title}')"` : ''}>
            ${hasImage ? 
              `<img src="${imgUrl}" alt="${x.title}" style="width:100% !important; height:100% !important; object-fit:cover !important; display:block !important; position:relative !important; z-index:10 !important;">` : 
              `<span style="color:#888;">${String(i+1).padStart(2,"0")}</span>`
            }
          </div>
          <div class="portfolio-info">
            <span class="tag">${x.category || 'Design'}</span>
            <h3>${x.title}</h3>
            <p>${x.desc || ''}</p>
          </div>
        </article>
      `;
    }).join("");

    if (filteredItems.length > 2) {
      const toggleBtn = document.createElement("button");
      toggleBtn.id = "portfolioToggleBtn";
      toggleBtn.className = "toggle-portfolio-btn";
      toggleBtn.innerText = isExpanded ? "कमी पहा" : "अधिक पहा";

      toggleBtn.onclick = () => {
        renderPortfolio(category, !isExpanded);
      };

      if (grid.parentNode) {
        grid.parentNode.insertBefore(toggleBtn, grid.nextSibling);
      }
    }
  }

  $$(".filter-btn").forEach(b => {
    b.onclick = (e) => {
      e.preventDefault();
      renderPortfolio(b.dataset.category, false);
    };
  });
}

function setupBeforeAfterClick() {
  document.querySelectorAll(".before-after img, #beforeAfter img, .before-after-img").forEach(img => {
    img.classList.add("before-after-img");
    img.onclick = () => {
      openModal(img.src, "Before / After Design Preview");
    };
  });
}

function renderServices(){
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
    const msg = serviceMessages[title] || `नमस्कार धर्मवीर ॲडव्हर्टायझिंग, मला ${title} बद्दल माहिती हवी आहे.`;
    return `
      <article class="service service-card-clickable" data-msg="${encodeURIComponent(msg)}" style="cursor: pointer;">
        <div class="icon">${x[0]}</div>
        <h3>${x[1]}</h3>
        <p>${x[2]}</p>
      </article>
    `;
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

function renderWhy(){
  const whyList = $("#whyList");
  if (whyList) {
    whyList.innerHTML=whyItems.map(x=>`<div class="why-item"><b>${x[0]}</b><div><h3>${x[1]}</h3><p>${x[2]}</p></div></div>`).join("");
  }
}

function renderReviews(){
  const reviewsGrid = $("#reviewsGrid");
  if (reviewsGrid) {
    reviewsGrid.innerHTML=reviews.map(x=>`<article class="review"><div class="stars">★★★★★</div><p>“${x[1]}”</p><strong>${x[2]}</strong><small>${x[0]}</small></article>`).join("");
  }
}

function applyLanguage(lang){
  const t=translations[lang]||translations.mr;
  document.documentElement.lang=lang;
  $$("[data-i18n]").forEach(el=>{if(t[el.dataset.i18n]!==undefined)el.innerHTML=t[el.dataset.i18n]});
  localStorage.setItem("dv-lang",lang);
}

// Main Initialization Function
function initApp() {
  setupModal();
  setupIntroAndModal();

  try { renderPortfolio("All", false); } catch(e) {}
  try { renderServices(); } catch(e) {}
  try { renderWhy(); } catch(e) {}
  try { renderReviews(); } catch(e) {}
  try { updateContact(); } catch(e) {}
  try { setupBeforeAfterClick(); } catch(e) {}
  try { applyLanguage(localStorage.getItem("dv-lang") || "mr"); } catch(e) {}

  if ($("#year")) $("#year").textContent = new Date().getFullYear();

  const menuBtn = $("#menuToggle");
  if (menuBtn) {
    menuBtn.onclick = () => {
      const mainNav = $("#mainNav");       if (mainNav) mainNav.classList.toggle("open");     };   }    $$(".language-menu button").forEach(b => {
    b.onclick = () => applyLanguage(b.dataset.lang);
  });

  loadSettings();
  loadPortfolioData();
}

document.addEventListener("DOMContentLoaded", initApp);
