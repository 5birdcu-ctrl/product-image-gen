async function generate() {
  const file = document.getElementById("image").files[0];
  const productName = document.getElementById("productName").value;
  const style = document.getElementById("style").value;
  const tone = document.getElementById("tone").value;
  const count = document.getElementById("count").value;

  if (!file || !productName) {
    alert("Please upload image and enter product name");
    return;
  }

  const formData = new FormData();
  formData.append("image", file);
  formData.append("productName", productName);
  formData.append("style", style);
  formData.append("tone", tone);
  formData.append("count", count);

  document.getElementById("result").innerHTML = "Generating...";

  const res = await fetch("/generate", {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  document.getElementById("result").innerHTML = "";
  data.images.forEach(url => {
    const img = document.createElement("img");
    img.src = url;
    document.getElementById("result").appendChild(img);
  });
}
