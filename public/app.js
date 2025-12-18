async function generate() {
  try {
    const count = document.getElementById("count").value;

    const res = await fetch(
      "https://us-central1-product-image-gen-63c49.cloudfunctions.net/generate?count=" + count,
      {
        method: "POST"
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    const data = await res.json();

    const result = document.getElementById("result");
    result.innerHTML = "";

    if (!data.images) {
      result.innerHTML = "No images returned";
      return;
    }

    data.images.forEach(url => {
      const img = document.createElement("img");
      img.src = url;
      img.style.width = "250px";
      img.style.margin = "10px";
      result.appendChild(img);
    });

  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
  }
}
