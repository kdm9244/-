function makeRow(elem) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
        <td>${elem.ID}</td>
        <td>
          <img src="http://localhost:3000/uploads/${elem.IMG}" width="50">
        </td>
        <td>${elem.NAME}</td>
        <td>${elem.PRICE}</td>
        <td>${elem.STOCK}</td>
        <td>${elem.DES}</td>
        <td>
          <button onclick="editProduct(this,${elem.ID})">수정</button>
          <button onclick="deleteProduct(this,${elem.ID})">삭제</button>
          </td>
      `;
  return tr;
}
