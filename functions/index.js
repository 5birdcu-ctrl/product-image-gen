const functions = require("firebase-functions");

exports.generate = functions
  .region("us-central1")
  .https.onRequest(async (req, res) => {

    // CORS
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST");

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    try {
      console.log("Generate with deAPI");

      const DEAPI_KEY = functions.config().deapi.key;
      if (!DEAPI_KEY) {
        throw new Error("deAPI key not found");
      }

      // รับค่าจาก query (ตอนนี้เรายังไม่รับไฟล์ เพื่อให้เห็นรูปก่อน)
      const count = Number(req.query.count || 1);

      // 🔹 PROMPT BASE (ของคุณ)
      const prompt = `
A high-impact e-commerce thumbnail for a professional power tool,
Cinematic 3D action-packed advertisement of Product.
The tool is shown clearly, large, sharp in foreground,
dramatic studio lighting, splash, particles,
modern premium industrial style,
no text, no watermark, no logo, no human.
`;

      // 🔹 เรียก deAPI
      const response = await fetch("https://api.deapi.ai/v1/images/generations", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${DEAPI_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "sdxl",
          prompt: prompt,
          n: count,
          size: "1024x1024"
        })
      });

      const text = await response.text();
      console.log("deAPI raw:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON from deAPI");
      }

      if (!response.ok) {
        throw new Error(data.error || "deAPI error");
      }

      // deAPI format
      const images = data.data.map(img => img.url);

      return res.status(200).json({ images });

    } catch (err) {
      console.error("Generate error:", err);
      return res.status(500).json({ error: err.message });
    }
  });
