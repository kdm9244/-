const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");
const db = require("../db");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

//상품등록
router.post("/add", upload.single("fruit_img"), async (req, res) => {
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

//상품삭제
router.get("/delete/:ID", async (req, res) => {
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

//상품수정
router.post("/update/:ID", upload.none(), async (req, res) => {
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

//상품검색

router.post("/search", async (req, res) => {
  let conn;
  try {
    const { keyword } = req.body;
    conn = await db.getConnection();
    const sql = `SELECT * FROM PROJECT
        WHERE UPPER(NAME) LIKE :keyword
        ORDER BY id DESC
      `;
    const result = await conn.execute(
      sql,
      { keyword: `%${keyword}%` },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );
    res.json(result.rows);
  } catch (err) {
    console.error("수정 중 에러 발생:", err);
    res.status(500).send("수정 실패");
  } finally {
    if (conn) await conn.close();
  }
});

//페이지넘기기
router.get("/:page", async (req, res) => {
  let conn;
  try {
    const page = parseInt(req.params.page) || 1;
    const perPage = 6;
    const offset = (page - 1) * perPage;

    conn = await db.getConnection();

    const countResult = await conn.execute(
      `SELECT COUNT(*) AS total FROM project`,
    );
    const totalCount = countResult.rows[0].TOTAL || countResult.rows[0][0];
    const totalPages = Math.ceil(totalCount / perPage);

    const sql = `
    SELECT id, name ,price ,stock,des,img
    FROM project
    ORDER BY id DESC
    OFFSET :offset ROWS FETCH NEXT :perPage ROWS ONLY
    `;
    const result = await conn.execute(
      sql,
      { offset, perPage },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );
    res.json({
      product: result.rows,
      totalPage: totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error("수정 중 에러 발생:", err);
    res.status(500).send("수정 실패");
  } finally {
    if (conn) await conn.close();
  }
});

module.exports = router;
//리스트 없이 메인으로 뿌려주기

// //메인으로 보내주기
// app.get("/project/1", async (req, res) => {
//   const conn = await db.getConnection();
//   try {
//     const sql =
//       "SELECT id, name ,price ,stock, des, img FROM project ORDER BY id DESC";
//     const result = await conn.execute(sql, [], {
//       outFormat: oracledb.OUT_FORMAT_OBJECT,
//     });
//     res.json(result.rows);
//   } catch (err) {
//     console.log("에러가 났어요!", err);
//     res.status(500).send("데이터를 못 가져왔습니다.");
//   } finally {
//     if (conn) {
//       try {
//         await conn.close();
//       } catch (e) {
//         console.error("에러", e);
//       }
//     }
//   }
// });
