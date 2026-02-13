document.querySelector("#event").addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData();

  const fileInput = document.querySelector("#upload");
  if (fileInput.files[0]) {
    formData.append("fruit_img", fileInput.files[0]);
  }
  formData.append("name", document.querySelector("#name").value);
  formData.append("price", document.querySelector("#price").value);
  formData.append("stock", document.querySelector("#stock").value);
  formData.append("des", document.querySelector("#des").value);

  fetch("http://192.168.0.39:3000/project/add", {
    method: "POST",
    body: formData,
  }).then((resp) => {
    if (resp.ok) {
      location.href = "/client/main.html";
    } else {
      alert("등록오류");
    }
  });
});

document.getElementById("upload").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const previewImg = document.getElementById("img-preview");
      const previewText = document.getElementById("preview-text");
      const icon = document.querySelector(".icon");

      previewImg.src = e.target.result;
      previewImg.style.display = "block"; // 사진 표시
      if (previewText) previewText.style.display = "none"; // 문구 숨김
      if (icon) icon.style.display = "none"; // 아이콘 숨김
    };
    reader.readAsDataURL(file);
  }
});
