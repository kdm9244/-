//라우팅을 위한 비지니스 로직
//crud create(생성): 데이터를 db에 저장
//     read  (조회): DB에서 데이터를 가져와 보여줌
//     Update (수정): 기존 데이터를 바꿈
//     Delete (삭제): 데이터를 지움

const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");
const db = require("../db");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

//express.Router();작은 미니 서버 객체를 만드는 것입니다. app.use("/project", ...)와 연결되며,
// /project로 시작하는 모든 요청을 이 router가 넘겨받아 처리
//oracledb = require("oracledb") SQL 문을 실행하거나 결과 형식을 지정하는 등 Oracle 전용 기능을 쓸 수 있게 해줌
//db = require("../db") oracledb 라이브러리만으로는 어디에 접속할지 모르는데, **접속 열쇠(getConnection)**를 제공
//multer는 파일 업로드 전용 집행관 사용자가 웹사이트에서 이미지,pdf,동영상 같은 파일을 서버에 보낼때 중간에 가로채서 서버의 하드디스크에 저장
//upload = multer({ dest: "uploads/" }) 사용자가 파일을 보내면 uploads에 저장하겠다 라는 의미
//dest는 영어 단어 **Destination(목적지)**의 줄임말

//상품등록
router.post("/add", upload.single("fruit_img"), async (req, res) => {
  let conn;
  try {
    const { name, price, stock, des } = req.body || {};
    const imgFile = req.file ? req.file.filename : "회사로고.png";
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

//router.post("/add~~"): HTML 폼에서 fetch 가 /add 주소로 보냅니다
//자바스크립트에서 new FormData()에 담은 데이터 중 파일()은 multer가 uploads폴더에 저장하고 나머지는 req.body로 넘겨줌
//const { name, price, stock, des } = req.body || {}; 사용자가 입력한 글자들을 꺼내오되 빈상자({})를 준비해둬
//req.file ? 사용자가 업로드 했니? 있으면 true 없으면 fail -- true 면 multer가 imgFIle에 넣고 없으면 기본이미지 이름인 "사과.jpg"를 대신넣는다
//conn = await db.getConnection(); db.js파일에서 열쇠를 가져와 통로를만드는것
//const result = await conn.execute( 연결된 통로를 통해 sql을 실행하고 결과를 result 변수에 담아
//returning id into :id: = 데이터를 넣으면서 방금 생성된 새로운 id값을 서버로 보내
//데이터매칭
//id는 id값은 db에서 계산해서 밖으로 보내줄 값이야
//oracledb.bind_out 은 방금 db가 만든 값을 물어볼때 oracledab.Number은 숫자형태로 보내달라고 할떄
//rautoCommit:true는 커밋을 자동으로 해주는것
//res.redirect("/client/main") 저장이 끝나면 브라우저 주소창을 메인주소로 보낸다

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

//rowsAffected 영향을 받은 줄의 갯수 라는 뜻
//req.params는 주소창에 들어있는 **가변적인 값(파라미터)**을 읽어오는 도구

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
