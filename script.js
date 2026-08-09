/* =========================================================
   धर्मवीर ॲडव्हर्टायझिंग — SCRIPT.JS
   ========================================================= */

let CONTACT = {
  whatsapp: "",
  instagram: "",
  email: "",
  logo_url: "",
  about: ""
};

const API_BASE =
  "https://falling-tree-3813.dharmveeradvertising389.workers.dev";

async function loadSettings() {
  try {
    const response = await fetch(API_BASE + "/api/settings?t=" + Date.now(), {
      cache: "no-store"
    });
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      const settings = data[0];

      CONTACT.whatsapp = settings.whatsapp || "";
      CONTACT.instagram = settings.instagram || "";
      CONTACT.email = settings.email || "";
      CONTACT.logo_url = settings.logo_url || "";
      CONTACT.about = settings.about || "";

      updateContact();

      // Logo
      if (CONTACT.logo_url) {
        document.querySelectorAll(
          ".about-logo img, .brand img, .hero-logo, .footer-brand img"
        ).forEach(img => {
          img.src = CONTACT.logo_url;
        });
      }

      // About
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

loadSettings();

const portfolioItems = [
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
    viewWork:"कामाबद्दल बोला →",startProject:"माझं काम पाहा",stat1:"Creative Focus",stat2:"Design Possibilities",stat3:"Digital Presence",
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
    viewWork:"Start a Project →",startProject:"View My Work",stat1:"Creative Focus",stat2:"Design Possibilities",stat3:"Digital Presence",
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
    viewWork:"काम के बारे में बात करें →",startProject:"मेरा काम देखें",stat1:"Creative Focus",stat2:"Design Possibilities",stat3:"Digital Presence",
    creative:"Creative",branding:"Branding",marketing:"Marketing",portfolioTitle:"चुना हुआ <span>काम</span>",portfolioText:"आपकी जरूरत के अनुसार तैयार किए गए creative designs की झलक.",
    editNote:"बाद में अपनी असली designs assets/portfolio में डालकर script.js से आसानी से बदल सकते हैं.",
    beforeTitle:"Design में <span>फर्क</span> दिखना चाहिए.",beforeText:"आपके creative को clean, premium और attention-grabbing look देने का प्रयास.",
    servicesTitle:"हम आपके लिए <span>क्या कर सकते हैं?</span>",whyTitle:"सिर्फ design नहीं,<br><span>पहचान बनाएं.</span>",whyText:"हर creative में आपके brand, audience और purpose को ध्यान में रखा जाता है.",
    reviewsTitle:"Client <span>Reviews</span>",reviewsText:"आपका feedback हमारे लिए महत्वपूर्ण है.",reviewNote:"बाद में असली client reviews यहां आसानी से बदल सकते हैं.",
    aboutTitle:"धर्मवीर ॲडव्हर्टायझिंग",aboutText:"Graphics Design और Digital Marketing के लिए creative और practical solutions. अभी हम घर से काम करते हैं; भविष्य में office location यहां जोड़ी जा सकती है.",
    contactTitle:"आपके project के बारे में <span>बात करते हैं.</span>",contactText:"Design, poster, social media या digital marketing — काम की जानकारी भेजें.",
    nameLabel:"नाम",phoneLabel:"मोबाइल नंबर",workLabel:"काम का प्रकार",messageLabel:"संदेश",sendMessage:"Message बनाएं →",formNote:"WhatsApp नंबर जोड़ने के बाद यह form सीधे WhatsApp message तैयार करेगा."
  }
};

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

function renderPortfolio(category="All"){
  const grid=$("#portfolioGrid");
  const cats=["All",...new Set(portfolioItems.map(x=>x.category))];
  $("#filters").innerHTML=cats.map(c=>`<button class="filter-btn ${c===category?'active':''}" data-category="${c}">${c==="All"?"All":c}</button>`).join("");
  
  let filteredItems = portfolioItems.filter(x=>category==="All"||x.category===category);
  if (category === "All") {
    filteredItems = filteredItems.slice(0, 6);
  }

  grid.innerHTML=filteredItems.map((x,i)=>`
    <article class="portfolio-card">
      <div class="portfolio-visual" ${x.image?`style="background-image:url('${x.image}');background-size:cover;background-position:center"`:""}>
        ${x.image?"":`<span>${String(i+1).padStart(2,"0")}</span>`}
      </div>
      <div class="portfolio-info"><span class="tag">${x.category}</span><h3>${x.title}</h3><p>${x.desc}</p></div>
    </article>`).join("");
  $$(".filter-btn").forEach(b=>b.onclick=()=>renderPortfolio(b.dataset.category));
}

function renderServices(){
  const serviceMessages = {
    "Logo Design": "नमस्कार धर्मवीर ॲडव्हर्टायझिंग, मला माझ्या ब्रँडसाठी Logo Design करून हवे आहे. कृपया अधिक माहिती द्या.",
    "Poster Design": "नमस्कार धर्मवीर ॲडव्हर्टायझिंग, मला Poster / Banner Design करून हवे आहे. कृपया अधिक माहिती द्या.",
    "Social Media Design": "नमस्कार धर्मवीर ॲडव्हर्टायझिंग, मला Social Media Creatives डिझाईन करायचे आहेत. कृपया अधिक माहिती द्या.",
    "Branding": "नमस्कार धर्मवीर ॲडव्हर्टायझिंग, मला माझ्या व्यवसायाचे संपूर्ण Branding करून हवे आहे. कृपया अधिक माहिती द्या.",
    "Digital Marketing": "नमस्कार धर्मवीर ॲडव्हर्टायझिंग, मला Digital Marketing सपोर्टबद्दल अधिक माहिती हवी आहे.",
    "Content Creatives": "नमस्कार धर्मवीर ॲडव्हर्टायझिंग, मला Campaign / Promotional Content Creatives डिझाईन करायचे आहेत."
  };

  $("#servicesGrid").innerHTML = services.map(x => {
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
        $("#toast").textContent = "Admin Panel मध्ये आधी WhatsApp Number सेव्ह करा.";
        $("#toast").classList.add("show");
        setTimeout(() => $("#toast").classList.remove("show"), 3000);
      }
    };
  });
}

function renderWhy(){
  $("#whyList").innerHTML=whyItems.map(x=>`<div class="why-item"><b>${x[0]}</b><div><h3>${x[1]}</h3><p>${x[2]}</p></div></div>`).join("");
}
function renderReviews(){
  $("#reviewsGrid").innerHTML=reviews.map(x=>`<article class="review"><div class="stars">★★★★★</div><p>“${x[1]}”</p><strong>${x[2]}</strong><small>${x[0]}</small></article>`).join("");
}

function applyLanguage(lang){
  const t=translations[lang]||translations.mr;
  document.documentElement.lang=lang;
  $$("[data-i18n]").forEach(el=>{if(t[el.dataset.i18n]!==undefined)el.innerHTML=t[el.dataset.i18n]});
  localStorage.setItem("dv-lang",lang);
}
// 1. Main Initialization Function
function initApp() {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.classList.add("hide");
    loader.style.display = "none"; // लोडर सक्तीने बंद करा
  }
  
  if (typeof renderPortfolio === 'function') renderPortfolio();
  if (typeof renderServices === 'function') renderServices();
  if (typeof renderWhy === 'function') renderWhy();
  if (typeof renderReviews === 'function') renderReviews();
  if (typeof updateContact === 'function') updateContact();
  applyLanguage(localStorage.getItem("dv-lang") || "mr");
  if ($("#year")) $("#year").textContent = new Date().getFullYear();
}

// 2. Timer (१.५ सेकंदात लोडर १००% हटणार)
setTimeout(initApp, 1500);

// 3. Menu Toggle
if ($("#menuToggle")) {
  $("#menuToggle").onclick = () => $("#mainNav").classList.toggle("open");
}
$$(".language-menu button").forEach(b => b.onclick = () => applyLanguage(b.dataset.lang));

// 4. Contact Form
if ($("#contactForm")) {
  $("#contactForm").addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const msg = `नमस्कार धर्मवीर ॲडव्हर्टायझिंग,%0A%0Aनाव: ${fd.get("name")}%0Aमोबाईल: ${fd.get("phone")}%0Aकामाचा प्रकार: ${fd.get("work")}%0Aसंदेश: ${fd.get("message") || "-"}`;
    if (CONTACT.whatsapp) {
      window.open(`https://wa.me/${CONTACT.whatsapp}?text=${msg}`, "_blank");
    } else {
      $("#toast").textContent = "WhatsApp number नंतर Admin Panel मध्ये जोडा.";
      $("#toast").classList.add("show");
      setTimeout(() => $("#toast").classList.remove("show"), 3000);
    }
  });
}

// 5. Client Feedback Button WhatsApp Logic
const feedbackBtn = document.getElementById("giveFeedbackBtn");
if (feedbackBtn) {
  feedbackBtn.onclick = () => {
    const msg = `नमस्कार धर्मवीर ॲडव्हर्टायझिंग,%0A%0Aमला माझी प्रतिक्रिया (Review) द्यायची आहे:%0A%0Aरेटिंग: ⭐⭐⭐⭐⭐%0Aनाव: %0Aप्रतिक्रिया: `;
    if (CONTACT.whatsapp) {
      window.open(`https://wa.me/${CONTACT.whatsapp}?text=${msg}`, "_blank");
    } else {
      $("#toast").textContent = "WhatsApp number नंतर Admin Panel मध्ये जोडा.";
      $("#toast").classList.add("show");
      setTimeout(() => $("#toast").classList.remove("show"), 3000);
    }
  };
}
