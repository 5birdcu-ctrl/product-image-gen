const FUNCTION_URL =
  "https://us-central1-product-image-gen-63c49.cloudfunctions.net/generate";

async function generate() {
  const count = document.getElementById("count").value;

  const res = await fetch(
    "https://us-central1-product-image-gen-63c49.cloudfunctions.net/generate?count=" + count,
    {
      method: "POST"
    }
  );

  const data = await res.json();

  const result = document.getElementById("result");
  result.innerHTML = "";

  data.images.forEach(url => {
    const img = document.createElement("img");
    img.src = url;
    img.style.width = "250px";
    img.style.margin = "10px";
    result.appendChild(img);
  });
}
 catch (err) {
    console.error(err);
    result.innerHTML = "❌ " + err.message;
    alert(err.message);
  }
}
