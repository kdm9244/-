//삭제
function deleteProduct(btn, ID) {
  fetch(`http://localhost:3000/project_delete/${ID}`)
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data);
      if (data.retCode == "OK") {
        const tr = btn.parentElement.parentElement;
        tr.remove();
      } else {
        alert("삭제실패");
      }
    })
    .catch((err) => {
      console.error("에러 발생:", err);
    });
}
