//Node.js 앱이 Oracle 데이터베이스와 대화할 수 있도록 통로

const oracledb = require("oracledb");

//Oracle에서 공식적으로 제공하는 Node.js용 라이브러리를 불러오기

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

//데이터를 객체 형태로 가져옵니다.

async function getConnection() {
  return await oracledb.getConnection({
    user: "scott",
    password: "tiger",
    connectString: "192.168.0.39:1521/xe",
  });
}
//async / await: DB 연결은 네트워크를 타고 멀리 가야 하므로 시간이 좀 걸립니다.
// 그래서 "연결될 때까지 잠시 기다려라"라는 의미
//DB에 접속을 시도하는 **'열쇠를 얻는 함수'**입니다.

module.exports = { getConnection, oracledb };

//이 파일 안에서 만든 getConnection, oracledb를 밖으로 내보내겠다
