/* =========================================================
   धर्मवीर ॲडव्हर्टायझिंग — COMPLETE & FIXED SCRIPT.JS
   ========================================================= */

let CONTACT = {
  whatsapp: "",
  instagram: "",
  email: "",
  logo_url: "",
  about: ""
};

const API_BASE = "https://falling-tree-3813.dharmveeradvertising389.workers.dev";
const DEFAULT_LOGO = "assets/logo.png";

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

// २. कॅटेगरी स्वच्छ करणारा फंक्शन
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

// ३. CSS ऑटो इन्जेक्ट (Transparent PNG & Filter Fixes)
if (!document.getElementById("portfolio-custom-styles")) {
  const style = document.createElement("style");
  style.id = "portfolio-custom-styles";
  style.innerHTML = `
    /* Filter Buttons Styling */
    #filters {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 10px !important;
      justify-content: center !important;
      margin-bottom: 30px !important;
      position: relative !important;
      z-index: 50 !important;
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
      pointer-events: auto !important;
      user-select: none;
    }

    .filter-btn:hover, .filter-btn.active {
      background: #ff6600 !important;
      color: #ffffff !important;
      border-color: #ff6600 !important;
      box-shadow: 0 4px 15px rgba(255, 102, 0, 0.5) !important;
    }

    /* Transparent PNG Logo Box (No Circular Cut/Background) */
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

    /* Splash Screen Overlay Fix */
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

    /* Choice Selection Modal Overlay */
    #dv-selection-modal {
      position: fixed;
      inset: 0;
      background-color: rgba(5, 7, 10, 0.88);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999998;
      padding: 20px;
    }
    #dv-selection-modal.hidden {
      display: none !important;
      pointer-events: none !important;
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
  `;
  document.head.appendChild(style);
}

// ४. स्प्लॅश स्क्रीन आणि चॉईस मॉडेल
function setupIntroAndModal() {
  if (document.getElementById("dv-splash-screen")) return;

  const logoSrc = CONTACT.logo_url || DEFAULT_LOGO;
  const logoHTML = `<img src="${logoSrc}" id="splashLogoImg" alt="Logo" onerror="this.onerror=null; this.src='${DEFAULT_LOGO}';">`;

  const introHTML = `
    <div id="dv-splash-screen">
      <div class="dv-logo-box">
        <div class="dv-logo-wrapper">
          ${logoHTML}
        </div>
        <p style="color:#94a3b8; font-size: 0.9rem;">धर्मवीर ॲडव्हर्टायझिंग</p>
      </div>
    </div>

    <div id="dv-selection-modal" class="hidden">
      <div style="background:#121824; border:1px solid #2a3447; border-radius:16px; padding:25px; text-align:center; color:#fff; max-width:400px; width:90%;">
        <h2 style="font-size:1.2rem; margin-bottom:15px;">तुम्हाला काय पाहायचे आहे?</h2>
        <div style="display:flex; flex-direction:column; gap:10px;">
          <button type="button" class="filter-btn active" style="padding:12px !important;" onclick="handleDvMainChoice('all')">🌐 All Designs</button>
          <button type="button" class="filter-btn" style="padding:12px !important;" onclick="handleDvMainChoice('choice')">🎯 Select Category</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', introHTML);

  // १.८ सेकंदात स्क्रीन अनलॉक होईल
  setTimeout(() => {
    const splash = document.getElementById("dv-splash-screen");
    const modal = document.getElementById("dv-selection-modal");
    
    const loader = document.getElementById("loader");
    if (loader) {
      loader.classList.add("hide");
      loader.style.display = "none";
    }

    if (splash) {
      splash.classList.add("fade-out");
      splash.style.display = "none";
    }
    if (modal) {
      modal.classList.remove("hidden");
    }
  }, 1800);
}

window.handleDvMainChoice = function(choice) {
  closeDvModal();
  renderPortfolio("All", false);
};

function closeDvModal() {
  const modal = document.getElementById("dv-selection-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.style.display = "none";
  }
}

// ५. इमेज पॉप-अप (Lightbox Modal)
function setupModal() {
  if (document.getElementById("imgModal")) return;
  const modalHTML = `
    <div id="imgModal" class="img-modal">
      <span class="img-modal-close" id="closeModalBtn">&times;</span>
      <img id="imgModalSrc" src="" alt="Full View">
      <div id="imgModalCaption" style="margin-top:10px; color:#fff;"></div>
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

const $ = s => document.querySelector(s); const $$ = s => document.querySelectorAll(s);

// ६. पोर्टफोलिओ आणि फिल्टर रेंडरिंग
function renderPortfolio(category="All", isExpanded=false){
  const grid = $("#portfolioGrid");
  const filtersEl = $("#filters");

  const defaultPortfolioItems = [
    {title:"Business Design", category:"Business", desc:"Business Creative", image:""},
    {title:"Social Media Creative", category:"Social Media", desc:"Instagram Post", image:""},
    {title:"Festival Design", category:"Festival", desc:"Festive Banner", image:""},
    {title:"Political Creative", category:"Political", desc:"Campaign Design", image:""},
    {title:"Personal Branding", category:"Personal", desc:"Personal Post", image:""},
    {title:"Poster Design", category:"Other", desc:"Custom Poster", image:""}
  ];

  const currentItems = dynamicPortfolioItems.length > 0 ? dynamicPortfolioItems : defaultPortfolioItems;
  const categories = ["All", "Business", "Social Media", "Festival", "Political", "Personal", "Other"];

  if (filtersEl) {
    filtersEl.innerHTML = categories.map(c => 
      `<button class="filter-btn ${c.toLowerCase() === category.toLowerCase() ? 'active' : ''}" data-cat="${c}">${c}</button>`
    ).join("");

    filtersEl.querySelectorAll(".filter-btn").forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const selectedCat = btn.getAttribute("data-cat");
        renderPortfolio(selectedCat, false);
      };
    });
  }

  if (!grid) return;

  let filtered = currentItems.filter(x => {
    if (category === "All") return true;
    return x.category && x.category.toLowerCase() === category.toLowerCase();
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #888; padding: 30px;">या कॅटेगरीमध्ये डिझाईन उपलब्ध नाहीत.</div>`;
    return;
  }

  grid.innerHTML = filtered.map((x, i) => {
    const imgUrl = getImageUrl(x);
    const hasImg = Boolean(imgUrl);
    return `
      <article class="portfolio-card" style="border:1px solid #222; padding:15px; border-radius:10px; margin-bottom:15px; background:#111;">
        <div class="portfolio-visual" ${hasImg ? `onclick="openModal('${imgUrl}', '${x.title}')"` : ''} style="cursor:pointer;">
          ${hasImg ? `<img src="${imgUrl}" style="width:100%; border-radius:8px; object-fit:cover;">` : `<p style="color:#aaa;">${x.title}</p>`}
        </div>
        <h4 style="color:#fff; margin-top:10px;">${x.title}</h4>
        <small style="color:#ff6600;">${x.category}</small>
      </article>
    `;
  }).join("");
}

// ७. सर्व्हिसेस, व्हाय आणि रिव्ह्यूज डेटा
const services = [
  ["✦","Logo Design","Brand identity, logo concepts आणि visual direction."],
  ["▣","Poster Design","Business, festival, event आणि custom posters."],
  ["◎","Social Media Design","Instagram, Facebook आणि digital creatives."],
  ["◈","Branding","Consistent visual identity आणि brand materials."],
  ["↗","Digital Marketing","Digital presence वाढवण्यासाठी creative support."],
  ["◌","Content Creatives","Campaigns आणि promotions साठी engaging designs."]
];

function renderServices(){
  const servicesGrid = $("#servicesGrid");
  if (!servicesGrid) return;
  servicesGrid.innerHTML = services.map(x => `
    <article class="service" style="padding:15px; border:1px solid #222; border-radius:8px; margin-bottom:10px;">
      <div class="icon" style="color:#ff6600; font-size:1.2rem;">${x[0]}</div>
      <h3 style="color:#fff; font-size:1rem; margin:5px 0;">${x[1]}</h3>
      <p style="color:#aaa; font-size:0.85rem;">${x[2]}</p>
    </article>
  `).join("");
}

// ८. कॉन्टॅक्ट अपडेट आणि बॅकग्राउंड API कॉल
function updateContact() {
  const whatsappEl = document.getElementById("whatsappDisplay");
  if (whatsappEl && CONTACT.whatsapp) {
    whatsappEl.textContent = CONTACT.whatsapp;
  }
}

async function loadSettings() {
  try {
    const response = await fetch(API_BASE + "/api/settings?t=" + Date.now());
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      CONTACT.whatsapp = data[0].whatsapp || "";
      CONTACT.logo_url = data[0].logo_url || "";
      const activeLogo = CONTACT.logo_url || DEFAULT_LOGO;
      document.querySelectorAll("img#splashLogoImg, .about-logo img, .brand img").forEach(img => {
        img.src = activeLogo;
      });
      updateContact();
    }
  } catch (e) {
    console.log("Settings skip");
  }
}

async function loadPortfolioData() {
  try {
    const response = await fetch(API_BASE + "/api/portfolio?t=" + Date.now());
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      dynamicPortfolioItems = data.map(item => ({
        title: item.title || "Untitled",
        category: cleanCategoryName(item.category || "Other"),
        desc: item.desc || "",
        image: getImageUrl(item)
      }));
      renderPortfolio("All", false);
    }
  } catch (e) {
    console.log("Portfolio skip");
  }
}

// ९. मुख्य ॲप सुरू करणे
function initApp() {
  setupModal();
  setupIntroAndModal();
  renderPortfolio("All", false);
  renderServices();
  
  // बॅकग्राउंड डेटा लोड (पेज न अडकवता)
  loadSettings();
  loadPortfolioData();

  const contactForm = $("#contactForm");
  if (contactForm) {
    contactForm.onsubmit = e => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const msg = `नमस्कार धर्मवीर ॲडव्हर्टायझिंग,%0A%0Aनाव: ${fd.get("name")}%0Aमोबाईल: ${fd.get("phone")}%0Aकामाचा प्रकार: ${fd.get("work")}%0Aसंदेश: ${fd.get("message") || "-"}`;
      if (CONTACT.whatsapp) {
        window.open(`https://wa.me/${CONTACT.whatsapp}?text=${msg}`, "_blank");
      }
    };
  }
}

document.addEventListener("DOMContentLoaded", initApp);
