//검색
document.querySelector("#search-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const keyword = document.querySelector("#search").value.trim();
  const searchInput = document.querySelector("#search");

  if (!keyword) {
    alert("검색어를 입력해주세요");
    loadProducts(1);
    return;
  }

  searchInput.value = "";

  fetch(`http://192.168.0.39:3000/project/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keyword: keyword }),
  })
    .then((resp) => resp.json())
    .then((data) => {
      const productList = document.querySelector("#product-list");
      productList.innerHTML = "";
      pagination.innerHTML = "";

      if (data.length > 0) {
        data.forEach((item) => {
          const card = makeCard(item);
          productList.appendChild(card);
        });
      } else {
        productList.innerHTML = "<p class='no-result'>검색결과가 없습니다<p>";
      }
    })
    .catch((err) => console.error("검색 오류:", err));
});
