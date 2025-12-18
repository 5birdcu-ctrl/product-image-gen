const functions = require("firebase-functions");
const Busboy = require("busboy");

exports.generate = functions
  .region("us-central1")
  .https.onRequest((req, res) => {

    // CORS (เรียกจากเว็บได้)
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST");

    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    console.log("Generate called");

    const busboy = Busboy({ headers: req.headers });
    const fields = {};

    busboy.on("field", (name, value) => {
      fields[name] = value;
    });

    busboy.on("finish", async () => {
      try {
        const count = Number(fields.count || 1);

        // 🔧 mock image URLs (เอาไว้ทดสอบก่อน)
        const images = [];
        for (let i = 0; i < count; i++) {
          images.push("https://placehold.co/600x600?text=AI+Image+" + (i + 1));
        }

        console.log("Send images:", images.length);

        res.json({ images });

      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
    });

    req.pipe(busboy);
  });
