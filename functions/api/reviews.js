// Public live reviews API for Cloudflare Pages.
// Uses the existing PSD_STORE_KV binding, with a separate key from PSD Store data.
const KEY = "dharmveer_live_reviews_v1";
const MAX_REVIEWS = 1000;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}

export async function onRequestGet({ env }) {
  try {
    const raw = await env.PSD_STORE_KV.get(KEY);
    const reviews = raw ? JSON.parse(raw) : [];
    return json({ reviews: Array.isArray(reviews) ? reviews : [] });
  } catch (error) {
    return json({ error: "Reviews सध्या उपलब्ध नाहीत." }, 503);
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim().replace(/\s+/g, " ");
    const message = String(body.message || "").trim();
    const rating = Number(body.rating);

    if (name.length < 2 || name.length > 50) return json({ error: "कृपया 2 ते 50 अक्षरांतील नाव द्या." }, 400);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return json({ error: "कृपया 1 ते 5 स्टार रेटिंग निवडा." }, 400);
    if (message.length < 5 || message.length > 500) return json({ error: "Review 5 ते 500 अक्षरांमध्ये असावा." }, 400);

    const raw = await env.PSD_STORE_KV.get(KEY);
    const reviews = raw ? JSON.parse(raw) : [];
    const safeReviews = Array.isArray(reviews) ? reviews : [];
    const review = {
      id: crypto.randomUUID(),
      name,
      rating,
      message,
      createdAt: new Date().toISOString()
    };
    safeReviews.unshift(review);
    await env.PSD_STORE_KV.put(KEY, JSON.stringify(safeReviews.slice(0, MAX_REVIEWS)));
    return json({ success: true, review });
  } catch (error) {
    return json({ error: "Review सेव्ह करता आला नाही. KV Database binding तपासा." }, 503);
  }
}
