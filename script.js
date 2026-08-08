// ==========================================
// ⚙️ धर्मवीर ॲडव्हर्टायझिंग - कंट्रोल सेंटर
// (इथून तुम्ही भविष्यात काहीही बदलू शकता)
// ==========================================

const WEBSITE_DATA = {
    // 1. तुमची संपर्क माहिती (Contact Details)
    whatsapp: "919309860089", // तुमचा १० अंकी WhatsApp नंबर (देशाच्या कोडसह उदा. 91...)
    phone: "+91 9309860089",   // कॉल करण्यासाठी मोबाईल नंबर
    instagram: "@dharmveer_advertising", // इंस्टाग्राम युजरनेम
    email: "dharmveeradvertising@gmail.com",       // ईमेल आयडी

    // 2. पोर्टफोलिओ (तुम्ही केलेले नवीन डिझाईन्स इथे जोडा)
    portfolio: [
        { title: "Flex Banner Design", category: "flex", image: "assets/logo.png" },
        { title: "Social Media Post", category: "social", image: "assets/logo.png" },
        { title: "Business Branding Logo", category: "logo", image: "assets/logo.png" }
    ],

    // 3. सर्व्हिसची यादी (Services)
    services: [
        { title: "Flex Printing", desc: "उच्च गुणवत्तेचे फ्लेक्स आणि बॅनर प्रिंटिंग." },
        { title: "Social Media Posts", desc: "फेसबुक आणि इंस्टाग्रामसाठी आकर्षक पोस्ट डिझाईन." },
        { title: "Logo & Branding", desc: "तुमच्या व्यवसायासाठी युनिक आणि प्रीमियम लोगो." },
        { title: "Digital Marketing", desc: "व्यवसाय ऑनलाइन वाढवण्यासाठी डिजिटल मार्केटिंग." }
    ],

    // 4. ग्राहकांचे रिव्ह्यू (Reviews)
    reviews: [
        { name: "राहुल पाटील", text: "खूप छान आणि वेळेत डिझाईन करून दिले. सर्व्हिस उत्तम आहे!", rating: "⭐⭐⭐⭐⭐" },
        { name: "अमित देशपांडे", text: "सोशल मीडिया पोस्ट्सचे डिझाईन्स खूप आकर्षक असतात.", rating: "⭐⭐⭐⭐⭐" }
    ]
};

// ==========================================
// 🚀 वेबसाईट ऑटोमेशन (या कोडला हात लावू नका)
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    // १. मोबाईल नंबर व सोशल मीडिया लिंक्स सेट करणे
    if (document.getElementById("whatsappDisplay")) {
        document.getElementById("whatsappDisplay").innerHTML = `<a href="https://wa.me/${WEBSITE_DATA.whatsapp}" target="_blank">+${WEBSITE_DATA.whatsapp}</a>`;
    }
    if (document.getElementById("instagramDisplay")) {
        document.getElementById("instagramDisplay").innerHTML = `<a href="https://instagram.com/${WEBSITE_DATA.instagram.replace('@','')}" target="_blank">${WEBSITE_DATA.instagram}</a>`;
    }
    if (document.getElementById("emailDisplay")) {
        document.getElementById("emailDisplay").innerText = WEBSITE_DATA.email;
    }

    // २. पोर्टफोलिओ ग्रिड लोड करणे
    const portfolioGrid = document.getElementById("portfolioGrid");
    if (portfolioGrid) {
        portfolioGrid.innerHTML = WEBSITE_DATA.portfolio.map(item => `
            <div class="portfolio-card">
                <img src="${item.image}" alt="${item.title}">
                <h3>${item.title}</h3>
            </div>
        `).join('');
    }

    // ३. सर्व्हिस ग्रिड लोड करणे
    const servicesGrid = document.getElementById("servicesGrid");
    if (servicesGrid) {
        servicesGrid.innerHTML = WEBSITE_DATA.services.map(s => `
            <div class="service-card">
                <h3>${s.title}</h3>
                <p>${s.desc}</p>
            </div>
        `).join('');
    }

    // ४. रिव्ह्यू ग्रिड लोड करणे
    const reviewsGrid = document.getElementById("reviewsGrid");
    if (reviewsGrid) {
        reviewsGrid.innerHTML = WEBSITE_DATA.reviews.map(r => `
            <div class="review-card">
                <p>"${r.text}"</p>
                <strong>- ${r.name}</strong>
                <div>${r.rating}</div>
            </div>
        `).join('');
    }

    // ५. फॉर्म थेट WhatsApp शी जोडणे
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const name = contactForm.name.value;
            const phone = contactForm.phone.value;
            const work = contactForm.work.value;
            const message = contactForm.message.value;

            const text = `नमस्कार धर्मवीर ॲडव्हर्टायझिंग,%0A%0Aमाझे नाव: ${name}%0Aमोबाईल: ${phone}%0Aकामाचा प्रकार: ${work}%0Aसंदेश: ${message}`;
            window.open(`https://wa.me/${WEBSITE_DATA.whatsapp}?text=${text}`, '_blank');
        });
    }

    // ६. वर्ष ऑटो-अपडेट करणे
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.innerText = new Date().getFullYear();
    
    // Loader हायड करणे
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";
});
