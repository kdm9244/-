//삽입
function makeCard(elem) {
  const SERVER_URL = "http://192.168.0.39:3000";
  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = `
        <div class="card-img">
          <img src="${SERVER_URL}/uploads/${elem.IMG}">
        </div>
        <div class ="card-body">
          <h3 class ="name">${elem.NAME}</h3>
          <p class ="price" data-raw="${elem.PRICE}">가격 : ${Number(elem.PRICE).toLocaleString()}원</p>
          <p class ="stock" data-raw="${elem.STOCK}">재고 : ${Number(elem.STOCK)}</p>
          <p class ="des">${elem.DES}</p>
          </div>
          <div class ="card-footer">
            <button onclick="editProduct(this, ${elem.ID})">수정</button>
            <button onclick="deleteProduct(this, ${elem.ID})">삭제</button>
      `;
  return card;
}
