const FUNCTION_URL =
  "https://us-central1-product-image-gen-63c49.cloudfunctions.net/generate";

async function generate() {
  const result = document.getElementById("result");
  result.innerHTML = "⏳ Generating...";

  try {
    const url = FUNCTION_URL + "?count=" +
      document.getElementById("count").value;

    const res = await fetch(url, { method: "POST" });

    const text = await res.text(); // 🔴 อ่านเป็น text ก่อนเสมอ
    console.log("Raw response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Response is not JSON");
    }

    if (!res.ok) {
      throw new Error(data.error || "Server error");
    }

    result.innerHTML = "";

    data.images.forEach(url => {
      const img = document.createElement("img");
      img.src = url;
      img.style.maxWidth = "200px";
      img.style.margin = "10px";
      result.appendChild(img);
    });

  } catch (err) {
    console.error(err);
    result.innerHTML = "❌ Error: " + err.message;
    alert(err.message);
  }
}
