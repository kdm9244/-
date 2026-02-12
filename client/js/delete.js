//삭제
function deleteProduct(btn, ID) {
  fetch(`http://localhost:3000/project/delete/${ID}`)
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data);
      if (data.retCode == "OK") {
        const card = btn.closest(".product-card");
        card.remove();
      } else {
        alert("삭제실패");
      }
      if (data.retCode == "OK") {
        loadProducts(1);
      }
    })
    .catch((err) => {
      console.error("에러 발생:", err);
    });
}
