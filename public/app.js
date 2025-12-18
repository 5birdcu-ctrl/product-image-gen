async function generate() {
  const count = document.getElementById("count").value;

  const res = await fetch(
    `/generate?count=${count}`,
    { method: "POST" }
  );

  const data = await res.json();

  const result = document.getElementById("result");
  result.innerHTML = "";

  data.images.forEach(url => {
    const img = document.createElement("img");
    img.src = url;
    img.style.width = "200px";
    img.style.margin = "10px";
    result.appendChild(img);
  });
}
