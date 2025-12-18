import functions from "firebase-functions";
import cors from "cors";
import fetch from "node-fetch";

const corsHandler = cors({ origin: true });

export const generate = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    try {
      const { prompt, count } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Missing prompt" });
      }

      const imageCount = Math.min(Math.max(Number(count) || 1, 1), 4);

      const falKey = process.env.FAL_KEY;
      if (!falKey) {
        return res.status(500).json({ error: "Missing FAL_KEY" });
      }

      console.log("Generate with nanobanana:", imageCount);

      const falRes = await fetch(
        "https://fal.run/fal-ai/nanobanana",
        {
          method: "POST",
          headers: {
            "Authorization": `Key ${falKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            prompt,
            num_images: imageCount,
            image_size: "square_hd"
          })
        }
      );

      const rawText = await falRes.text();

      if (!falRes.ok) {
        console.error("fal.ai error:", rawText);
        return res.status(500).json({
          error: "fal.ai returned error",
          detail: rawText
        });
      }

      const result = JSON.parse(rawText);

      return res.json({
        images: result.images || []
      });

    } catch (err) {
      console.error("Generate failed:", err);
      return res.status(500).json({
        error: err.message
      });
    }
  });
});
