const { onRequest } = require("firebase-functions/v2/https");
const cors = require("cors")({ origin: true });
const fal = require("@fal-ai/serverless-client");

// 🔐 ใส่ FAL_KEY ด้วย firebase config
fal.config({
  credentials: process.env.FAL_KEY
});

// ป้องกัน Unicode / smart quote
function normalizePrompt(text = "") {
  return text
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[^\x00-\x7F]/g, "");
}

exports.generate = onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    try {
      const { prompt, count } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Missing prompt" });
      }

      const safePrompt = normalizePrompt(prompt);
      const numImages = Math.min(Math.max(Number(count) || 1, 1), 4);

      const result = await fal.subscribe("fal-ai/nanobanana", {
        input: {
          prompt: safePrompt,
          num_images: numImages
        }
      });

      res.json({
        ok: true,
        images: result.images || []
      });

    } catch (err) {
      console.error("Generate error:", err);
      res.status(500).json({
        ok: false,
        error: err.message
      });
    }
  });
});
