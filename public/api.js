
// public/api.js — 주어짐(9주차 Run Check 완성본). P5 에서 고칩니다.
//
// P5 를 하기 전: 페이지가 Open-Meteo 를 직접 부릅니다.
// P5 를 한 뒤: 서버(openMeteo.js)가 Open-Meteo 를 호출하고,
//              이 파일은 내 서버의 /api/forecast 만 호출합니다.
// 확인: problems/P5_forecast.md 의 "확인"
// 커밋 메시지: p5: forecast

// 도시 키를 받아 내 서버에서 7일치 예보를 가져옵니다.
export async function getForecast(cityKey) {
  const res = await fetch(
    `/api/forecast?city=${encodeURIComponent(cityKey)}`
  );

  // 성공과 실패 모두 JSON 응답
  const data = await res.json();

  // 서버에서 전달한 오류 메시지를 그대로 사용
  if (!res.ok) {
    throw new Error(data.error);
  }

  // { city: "Seoul", days: [...] } 반환
  return data;
}
