const functions = require("firebase-functions");

exports.generate = functions
  .region("us-central1")
  .https.onRequest(async (req, res) => {

    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    // 🔹 ให้ GET ใช้ทดสอบได้
    if (req.method === "GET") {
      return res.json({
        message: "Generate endpoint is working. Use POST to generate images."
      });
    }

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // ====== ส่วน generate จริงอยู่ด้านล่าง ======


    try {
      const FAL_KEY = functions.config().fal.key;
      if (!FAL_KEY) throw new Error("fal.ai API key missing");

      const count = Number(req.query.count || 1);

      const body = await req.json?.() ?? req.body;

      const prompt = `
A high-impact e-commerce thumbnail for a professional power tool,
cinematic 3D action-packed advertisement,
dramatic studio lighting, splash, particles,
modern premium industrial style,
no text, no watermark, no logo, no human.
`;

      const falResponse = await fetch(
        "https://fal.run/fal-ai/flux-pro/v1.1",
        {
          method: "POST",
          headers: {
            "Authorization": `Key ${FAL_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            prompt: prompt,
            image_size: "square_hd",
            num_images: count
          })
        }
      );

      const data = await falResponse.json();

      if (!falResponse.ok) {
        throw new Error(data?.error || "fal.ai error");
      }

      const images = data.images.map(img => img.url);

      return res.json({ images });

    } catch (err) {
      console.error("Generate error:", err);
      return res.status(500).json({ error: err.message });
    }
  });
