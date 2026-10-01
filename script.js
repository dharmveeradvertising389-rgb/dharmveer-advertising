/* =========================================================
   Dharmveer Advertising — SCRIPT.JS (FIXED LOGO & FILTERS)
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
      z-index: 20 !important;
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
      height: auto;
      max-height: 140px;
      margin: 0 auto 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent !important;
    }
    .dv-logo-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0px 4px 12px rgba(255, 102, 0, 0.4));
    }

    #dv-splash-screen {
      position: fixed;
      inset: 0;
      background: #0b0f17;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999999;
      transition: opacity 0.5s ease, visibility 0.5s ease;
    }
    #dv-splash-screen.fade-out {
      opacity: 0;
      visibility: hidden;
      pointer-events: none !important;
    }

    /* Modal Overlay Fix */
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
  `;
  document.head.appendChild(style);
}

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
      <div class="dv-modal-card" style="background:#121824; padding:25px; border-radius:15px; text-align:center; color:#fff;">
        <h2>तुम्हाला काय पाहायचे आहे?</h2>
        <div id="dv-step-1">
          <button type="button" class="filter-btn active" style="margin:10px;" onclick="handleDvMainChoice('all')">🌐 All Designs</button>
          <button type="button" class="filter-btn" style="margin:10px;" onclick="handleDvMainChoice('choice')">🎯 Choose Category</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', introHTML);

  setTimeout(() => {
    const splash = document.getElementById("dv-splash-screen");
    const modal = document.getElementById("dv-selection-modal");
    if (splash) splash.classList.add("fade-out");
    setTimeout(() => {
      if (splash) splash.style.display = "none";
      if (modal) modal.classList.remove("hidden");
    }, 500);
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

const $ = s => document.querySelector(s); const $$ = s => document.querySelectorAll(s);

function renderPortfolio(category="All", isExpanded=false){
  const grid=$("#portfolioGrid");
  const filtersEl = $("#filters");

  const currentItems = dynamicPortfolioItems.length > 0 ? dynamicPortfolioItems : [
    {title:"Business Design", category:"Business", desc:"Creative", image:""},
    {title:"Social Media Post", category:"Social Media", desc:"Post Design", image:""},
    {title:"Festival Banner", category:"Festival", desc:"Festive Design", image:""}
  ];

  const categories = ["All", "Business", "Social Media", "Festival", "Political", "Personal", "Other"];

  if (filtersEl) {
    filtersEl.innerHTML = categories.map(c => 
      `<button class="filter-btn ${c.toLowerCase() === category.toLowerCase() ? 'active' : ''}" data-cat="${c}">${c}</button>`
    ).join("");

    filtersEl.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const selectedCat = btn.getAttribute("data-cat");
        renderPortfolio(selectedCat, false);
      });
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
    return `
      <article class="portfolio-card" style="border:1px solid #333; padding:15px; border-radius:10px; margin-bottom:15px;">
        <div class="portfolio-visual">
          ${imgUrl ? `<img src="${imgUrl}" style="max-width:100%; border-radius:8px;">` : `<p>${x.title}</p>`}
        </div>
        <h4>${x.title}</h4>
        <small>${x.category}</small>
      </article>
    `;
  }).join("");
}

async function initApp() {
  setupIntroAndModal();
  renderPortfolio("All", false);
}

document.addEventListener("DOMContentLoaded", initApp);
