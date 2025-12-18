const FUNCTION_URL =
  "https://us-central1-product-image-gen-63c49.cloudfunctions.net/generate";

async function generate() {
  const result = document.getElementById("result");
  result.innerHTML = "⏳ Generating AI image...";

  try {
    const count = document.getElementById("count").value;
    const url = FUNCTION_URL + "?count=" + count;

    const res = await fetch(url, { method: "POST" });

    const text = await res.text();
    console.log("Raw response:", text);

    const data = JSON.parse(text);

    if (!res.ok) {
      throw new Error(data.error || "Server error");
    }

    result.innerHTML = "";

    data.images.forEach(url => {
      const img = document.createElement("img");
      img.src = url;
      img.style.maxWidth = "240px";
      img.style.margin = "10px";
      result.appendChild(img);
    });

  } catch (err) {
    console.error(err);
    result.innerHTML = "❌ " + err.message;
    alert(err.message);
  }
}
