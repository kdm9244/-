const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/img", express.static(path.join(__dirname, "..", "img")));

const productRouter = require("./router/crud");
app.use("/project", productRouter);

app.get("/client/main", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "main.html"));
});
app.get("/client/add", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "add.html"));
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
