async function generate() {
  const prompt = document.getElementById("prompt").value;
  const count = document.getElementById("count").value;
  const result = document.getElementById("result");

  result.innerHTML = "Generating...";

  try {
    const res = await fetch("/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt, count })
    });

    const data = await res.json();

    if (!data.images || !Array.isArray(data.images)) {
      console.error(data);
      result.innerHTML = "❌ Generation failed";
      return;
    }

    result.innerHTML = "";

    data.images.forEach(img => {
      const image = document.createElement("img");
      image.src = img.url;
      image.className = "thumb";
      result.appendChild(image);
    });

  } catch (err) {
    console.error(err);
    result.innerHTML = "❌ Error occurred";
  }
}
