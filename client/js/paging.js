//페이징
let current_page = 1;

function loadProducts(page = 1) {
  current_page = page;

  fetch(`http://192.168.0.39:3000/project/${page}`)
    .then((resp) => resp.json())
    .then((data) => {
      const productList = document.querySelector("#product-list");
      productList.innerHTML = "";

      if (data.product && data.product.length > 0) {
        data.product.forEach((item) => {
          const card = makeCard(item);
          productList.appendChild(card);
        });
      }

      renderPagination(data.totalPage);
    })
    .catch((err) => console.error("에러", err));
}

loadProducts(1);

function renderPagination(totalPage) {
  const paginationDiv = document.querySelector("#pagination");
  paginationDiv.innerHTML = "";

  for (let i = 1; i <= totalPage; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;

    if (i === current_page) {
      btn.classList.add("active");
    }

    btn.onclick = () => {
      loadProducts(i);
    };
    paginationDiv.appendChild(btn);
  }
}
