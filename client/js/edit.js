//수정
function editProduct(btn, ID) {
  const card = btn.closest(".product-card");

  const name = card.querySelector(".name").innerText;
  const price = card.querySelector(".price").dataset.raw;
  const stock = card.querySelector(".stock").dataset.raw;
  const des = card.querySelector(".des").innerText;

  document.getElementById("editId").value = ID;
  document.getElementById("editName").value = name;
  document.getElementById("editPrice").value = price;
  document.getElementById("editStock").value = stock;
  document.getElementById("editDes").value = des;

  document.getElementById("modal").style.display = "block";
}
//수정닫기
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function update() {
  const ID = document.getElementById("editId").value;
  console.log("수정할 ID:", ID);
  const formData = new FormData();

  formData.append("name", document.getElementById("editName").value);
  formData.append("price", document.getElementById("editPrice").value);
  formData.append("stock", document.getElementById("editStock").value);
  formData.append("des", document.getElementById("editDes").value);

  fetch(`http://localhost:3000/project/update/${ID}`, {
    method: "POST",
    body: formData,
  }).then((resp) => {
    if (resp.ok) {
      location.href = "/client/main.html";
    } else {
      alert("등록오류");
    }
  });
}
