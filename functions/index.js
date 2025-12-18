const functions = require("firebase-functions");
const fetch = require("node-fetch");
const Busboy = require("busboy");
const { buildPrompt } = require("./prompt");

exports.generate = functions
  .region("us-central1")
  .https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const busboy = Busboy({ headers: req.headers });
  let imageBuffer;
  let fields = {};

  busboy.on("file", (_, file) => {
    const chunks = [];
    file.on("data", d => chunks.push(d));
    file.on("end", () => imageBuffer = Buffer.concat(chunks));
  });

  busboy.on("field", (name, value) => {
    fields[name] = value;
  });

  busboy.on("finish", async () => {
    try {
      const prompt = buildPrompt(fields);
      const images = [];
      const count = parseInt(fields.count || "1");
      const functions = require("firebase-functions");
const apiKey = functions.config().deapi.key;
;

      for (let i = 0; i < count; i++) {
        const r = await fetch("https://api.deapi.ai/v1/images", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "flux-dev",
            prompt,
            image: imageBuffer.toString("base64"),
            strength: 0.3,
            size: "1024x1024",
            seed: 1000 + i
          })
        });

        const j = await r.json();
        images.push(j.data[0].url);
      }

      res.json({ images });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Generation failed" });
    }
  });

  req.pipe(busboy);
});
