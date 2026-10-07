// functions/api/psd-store.js

export async function onRequestGet(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    const storeData = await context.env.PSD_STORE_KV.get("psd_data");
    const defaultData = storeData ? JSON.parse(storeData) : [
      {
        sectionId: "navratri-special",
        sectionTitle: "NAVRAATRI SPECIAL PSD",
        items: [
          {
            id: "navratri-1",
            title: "Navratri Utsav 7 Premium PSD Pack",
            previewImg: "assets/demo1.jpg",
            price: "229",
            originalPrice: "799",
            downloadUrl: "https://drive.google.com/your-psd-link-1"
          }
        ]
      }
    ];

    return new Response(JSON.stringify(defaultData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}

export async function onRequestPost(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    const body = await context.request.json();
    await context.env.PSD_STORE_KV.put("psd_data", JSON.stringify(body.psdData));

    return new Response(JSON.stringify({ success: true, message: "PSD Data Updated Successfully!" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
