const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
//외부라이브러리에서 가져오기

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use(cors()); 서버가 브라우저에게 다음과 같은 허가증을 보내는 것과 같습니다.

//express.urlencoded() 이 미들웨어를 사용하면 req.body 객체에 넣어준다
//ture는 복잡한 데이터 구조를 지원하기 때문에 요즘은 true를 기본값으로 사용한다
//Form 형태의 데이터 파싱 key=value 형태 처리

//express.json(): json 형탱의 데이터 파싱 {"key":"value"}형태로 처리해준다

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/img", express.static(path.join(__dirname, "..", "img")));

//express.static 외부 사용자가 내 서버 컴퓨터 내부의 폴더를 들여다 볼 수 있게 한다
//path.join(__dirname, "uploads") 실제 저장된 진짜 위치
//__dirname : 현재 실행 중인 소스 코드 파일이 위치한 폴더의 절대 경로
//uploads : 사용자가 내 웹사이트에 사진을 업로드할 때 저장되는 장소입니다. 웹으로 나가는 길을 열어주는 것
//img : 웹서버내 img를 저장하는장소

const productRouter = require("./router/crud");
app.use("/project", productRouter);
//라우터 분리기능
// require("./router/crud") = router 폴더 안의 crud.js 파일에 따로 작성해둔 라우터 기능들을 가져오겠다
//app.use("/project", productRouter) = /project: 이 라우터 안에 들어있는 모든 주소 앞에 자동으로 /project
//productRouter: 위에서 불러온 crud.js 파일의 내용들을 이 주소에 연결하겠다

app.get("/client/main", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "main.html"));
});
app.get("/client/add", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "add.html"));
});
//get 서버로 부터 정보를 조회할때 사용
//post 서버의 데이터를 생성하거나 변경할떄
//res.sendFile() 서버의 하드디스크에 있는 파일을 읽고 브라우저로 보내는것

const server = app.listen(3000, "0.0.0.0", () => {
  console.log("서버가 3000번 포트에서 실행 중입니다.");
});

// 에러 처리 코드 추가
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error("오류: 3000번 포트가 이미 사용 중입니다!");
  } else {
    console.error("서버 실행 중 오류 발생:", err);
  }
});
//app.listen 컴퓨터의 한 통로를 점유하여 실제 **'서버'**로서 동작하기 시작
//3000은 포트
