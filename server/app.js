const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

//cors추가
const cors = require("cors");
app.use(cors());
//

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/img", express.static(path.join(__dirname, "..", "img")));
//이미지 등록
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const oracledb = require("oracledb");
const db = require("./db");

app.get("/client/add", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "add.html"));
});

app.post("/client/add", upload.single("fruit_img"), async (req, res) => {
  let conn;
  try {
    const { name, price, stock, des } = req.body || {};
    const imgFile = req.file ? req.file.filename : "사과.jpg";
    conn = await db.getConnection();
    const result = await conn.execute(
      `insert into project(id,name,price,stock,des,img)
        values((select nvl(max(id),0)+1 from project), :name, :price, :stock,:des,:img)
        returning id into :id`,

      {
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        name: name,
        price: Number(price) || 0,
        stock: Number(stock) || 0,
        des: des || "",
        img: imgFile,
      },
      { autoCommit: true },
    );
    res.redirect("/client/main"); //메인 페이지로 돌아가기
  } catch (err) {
    console.error("에러발생", err);
    res.status(500).send("db 저장 중 오류");
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (e) {
        console.error("닫기 에러", e);
      }
    }
  }
});

//메인으로 보내주기
app.get("/project/1", async (req, res) => {
  const conn = await db.getConnection();
  try {
    const sql =
      "SELECT id, name ,price ,stock, des, img FROM project ORDER BY id DESC";
    const result = await conn.execute(sql, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    res.json(result.rows);
  } catch (err) {
    console.log("에러가 났어요!", err);
    res.status(500).send("데이터를 못 가져왔습니다.");
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (e) {
        console.error("에러", e);
      }
    }
  }
});
//글 삭제
app.get("/project_delete/:ID", async (req, res) => {
  const conn = await db.getConnection();
  const result = await conn.execute(
    "DELETE FROM PROJECT WHERE ID = :ID",
    { ID: req.params.ID },
    { autoCommit: true },
  );
  if (result.rowsAffected) {
    res.send({ retCode: "OK" });
  } else {
    res.send({ retCode: "NG" });
  }
});

//글 수정
app.post("/project_update/:ID", async (req, res) => {
  let conn;
  try {
    const { name, price, stock, des } = req.body;
    const { ID } = req.params;

    conn = await db.getConnection();
    const result = await conn.execute(
      `UPDATE project
       SET 
         name = :name,
         price = :price,
         stock = :stock,
         des = :des
       WHERE id = :ID`,
      {
        name: name,
        price: Number(price) || 0,
        stock: Number(stock) || 0,
        des: des || "",
        ID: ID,
      },
      { autoCommit: true },
    );

    if (result.rowsAffected) {
      res.send({ retCode: "OK" });
    } else {
      res.send({ retCode: "NG" });
    }
  } catch (err) {
    console.error("수정 중 에러 발생:", err);
    res.status(500).send("수정 실패");
  } finally {
    if (conn) await conn.close();
  }
});

app.get("/client/main", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "main.html"));
});

app.listen(port, () => {
  console.log("http://localhost:3000");
});
