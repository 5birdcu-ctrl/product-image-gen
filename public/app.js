// 🔴 URL เต็มของ Cloud Function (ห้ามใช้ /generate)
const FUNCTION_URL =
  "https://us-central1-product-image-gen-63c49.cloudfunctions.net/generate";

async function generate() {
  const fileInput = document.getElementById("image");

  if (!fileInput.files.length) {
    alert("Please select an image");
    return;
  }

  const formData = new FormData();
  formData.append("image", fileInput.files[0]);
  formData.append("productName", document.getElementById("productName").value);
  formData.append("style", document.getElementById("style").value);
  formData.append("tone", document.getElementById("tone").value);
  formData.append("count", document.getElementById("count").value);

  const result = document.getElementById("result");
  result.innerHTML = "⏳ Generating...";

  try {
    const res = await fetch(FUNCTION_URL, {
      method: "POST",
      body: formData
    });

    // 🔴 ป้องกัน JSON พัง
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    const data = await res.json();

    result.innerHTML = "";

    data.images.forEach(url => {
      const img = document.createElement("img");
      img.src = url;
      img.style.maxWidth = "200px";
      img.style.margin = "10px";
      result.appendChild(img);
    });

  } catch (err) {
    result.innerHTML = "❌ Error";
    alert(err.message);
    console.error(err);
  }
}
