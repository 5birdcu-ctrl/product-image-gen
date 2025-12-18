async function generate() {
  const prompt = document.getElementById("prompt").value;
  const count = document.getElementById("count").value;
  const result = document.getElementById("result");

  result.innerHTML = "⏳ Generating...";

  try {
    const res = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, count })
    });

    const data = await res.json();

    // ❌ fal.ai หรือ backend error
    if (!data.ok) {
      console.error("Backend error:", data);
      result.innerHTML = `
        ❌ Generate failed<br>
        <small>${data.message || "Unknown error"}</small>
      `;
      return;
    }

    // ❌ ไม่มีรูป
    if (!Array.isArray(data.images) || data.images.length === 0) {
      result.innerHTML = "⚠️ No images returned (check fal.ai credit)";
      return;
    }

    // ✅ success
    result.innerHTML = "";
    data.images.forEach(img => {
      const image = document.createElement("img");
      image.src = img.url;
      image.className = "thumb";
      result.appendChild(image);
    });

  } catch (err) {
    console.error(err);
    result.innerHTML = "❌ Network / Server error";
  }
}
