# धर्मवीर ॲडव्हर्टायझिंग Website

Free static website starter for GitHub + Cloudflare Pages.

## Files
- `index.html` — website structure
- `style.css` — design
- `script.js` — editable portfolio, services, reviews, contact and languages
- `assets/logo.png` — your logo

## How to edit later
Open `script.js`:
- `CONTACT` = WhatsApp / Instagram / Gmail
- `portfolioItems` = portfolio designs and categories
- `services` = services
- `whyItems` = Why Choose Us
- `reviews` = client reviews

For real portfolio images, create `assets/portfolio/`, upload images there, then set the `image` field, e.g.:
`image:"assets/portfolio/poster1.jpg"`

## Important
This first version is a static site. The contact form opens WhatsApp after a WhatsApp number is added. No paid database is required.


## Live Client Reviews (Cloudflare Pages)
- Visitors can submit a name, a 1–5 star rating, and a written review directly on the website.
- New reviews publish immediately and are shown newest first, 3 reviews per page with Previous / More controls.
- The API is `functions/api/reviews.js` and stores reviews under a separate KV key.
- In Cloudflare Pages → Settings → Functions → KV namespace bindings, bind the existing KV namespace using the variable name `PSD_STORE_KV` (the same binding used by the PSD Store). If this binding is already configured for the PSD Store, no new binding is needed.
- Deploy the project to Cloudflare Pages for `/api/reviews` to work. GitHub Pages alone does not run Cloudflare Pages Functions; use the Cloudflare Pages deployment connected to this repository.
- Reviews are public and publish immediately without admin approval, as requested. Do not collect sensitive personal information in review text.
