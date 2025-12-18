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
      console.log("Generate called");

      // รับค่าจาก query / body แบบง่ายก่อน
      const count = Number(req.query.count || 1);

      const images = [];
      for (let i = 0; i < count; i++) {
        images.push(
          `https://placehold.co/600x600?text=AI+Image+${i + 1}`
        );
      }

      return res.status(200).json({ images });

    } catch (err) {
      console.error("Function error:", err);
      return res.status(500).json({ error: err.message });
    }
  });
