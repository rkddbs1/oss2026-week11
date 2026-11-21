// server.js — 내 서버. P4 에서 만들고 P5, P6 에서 늘립니다.
//
// 상황: 지금까지는 npx serve 가 파일을 내보내 주기만 했습니다. 예보는 페이지가 Open-Meteo 에서 직접 받았습니다.
// 할 일: P4  Express 서버. public/ 폴더를 내보내고, GET /api/health 에 응답합니다.
//       P5  GET /api/forecast?city=seoul. 예보를 서버가 받아서 하루 단위로 바꿔 돌려줍니다.
//       P6  GET /api/stats. 도시별 요청 횟수. 토큰(ADMIN_TOKEN)을 가진 요청에만 응답합니다.
// 실행: 터미널에서 npm start → http://localhost:3000
// 확인: 문제마다 problems/ 의 문제 파일 "확인"
// 커밋 메시지: p4: server / p5: forecast / p6: secret
//
// 이 파일은 public/ 밖에 있습니다. 브라우저 주소창으로는 열리지 않습니다(P4 에서 확인).

// P4 부터 여기 아래에 씁니다.

import express from "express";
import { getDaily } from "./openMeteo.js";
import { toDays } from "./public/logic.js";

const app = express();

const PORT = process.env.PORT ?? 3000;

// public/main.js의 기존 CITIES 객체를 여기에 옮기세요.
// 예: seoul, daejeon, gangneung
const CITIES = {
 seoul: { name: "Seoul", lat: 37.566, lon: 126.9784 },
  daejeon: { name: "Daejeon", lat: 36.3504, lon: 127.3845 },
  gangneung: { name: "Gangneung", lat: 37.7519, lon: 128.8761 }
};

// public 폴더의 정적 파일 제공
app.use(express.static("public"));

// 서버 상태 확인 API
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// 도시별 7일 예보 API
app.get("/api/forecast", async (req, res) => {
  const cityKey = req.query.city;

  // 등록되지 않은 도시 검사
  if (
    typeof cityKey !== "string" ||
    !Object.hasOwn(CITIES, cityKey)
  ) {
    return res.status(400).json({
      error: `Unknown city: ${cityKey}`
    });
  }

  const city = CITIES[cityKey];

  try {
    // Open-Meteo에서 원본 daily 데이터 가져오기
    const daily = await getDaily(city);

    // 날짜별 객체 배열로 변환
    const days = toDays(daily);

    // 프론트엔드에 필요한 데이터만 반환
    res.status(200).json({
      city: city.name,
      days
    });
  } catch (error) {
    res.status(502).json({
      error: error.message
    });
  }
});

// 서버 시작
app.listen(PORT, (error) => {
  if (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }

  console.log(`Listening on http://localhost:${PORT}`);
});
