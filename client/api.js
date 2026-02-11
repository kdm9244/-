fetch("http://localhost:3000/project/1")
  .then((resp) => resp.json())
  .then((data) => {
    data.forEach((elem) => {
      const tr = makeRow(elem);
      document.querySelector("#list").appendChild(tr);
    });
  });
