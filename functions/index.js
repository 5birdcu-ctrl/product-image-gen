const functions = require("firebase-functions");

exports.generate = functions
  .region("us-central1")
  .https.onRequest(async (req, res) => {

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

      const count = Number(req.query.count || 1);

      const prompt = `
A high-impact e-commerce thumbnail for a professional power tool,
Cinematic 3D action-packed advertisement,
Product shown clearly in foreground,
dramatic lighting, splash, particles,
modern premium industrial style,
no text, no watermark, no logo, no human.
`;

      const response = await fetch(
  "https://api.deapi.ai/v1/openai/images/generations",
  {
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
  }
);

// 🔥 อ่านเป็น text ก่อน
const rawText = await response.text();
console.log("deAPI raw response:", rawText);

// ถ้าไม่ใช่ JSON → โยน error
let data;
try {
  data = JSON.parse(rawText);
} catch (e) {
  throw new Error("deAPI returned non-JSON response");
}

if (!response.ok) {
  throw new Error(data.error?.message || "deAPI error");
}


      const data = await response.json();
      console.log("deAPI JSON:", data);

      if (!response.ok) {
        throw new Error(data.error?.message || "deAPI error");
      }

      const images = data.data.map(img => img.url);

      return res.json({ images });

    } catch (err) {
      console.error("Generate error:", err);
      return res.status(500).json({ error: err.message });
    }
  });
