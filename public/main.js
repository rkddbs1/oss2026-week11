
// public/main.js — 주어짐(9주차 Run Check 완성본). P5 에서 세 군데를 고칩니다.
//
// 상황: 화면 담당. 받기는 api.js, 판단은 logic.js 에 맡기고 여기서는 읽고 그리기만 합니다.
// P5 를 하기 전: 도시의 위도·경도(CITIES)를 이 파일이 갖고 있고, 받은 daily 를 여기서 toDays 로 바꿉니다.
// P5 를 한 뒤: CITIES 와 toDays 호출은 서버로 옮겨 가고, 이 파일은 서버가 준 city 와 days 를 그대로 씁니다.
//            자세한 것은 problems/P5_forecast.md.
// 실행: P0 ~ P3 은 npx serve public, P4 부터는 npm start → 브라우저에서 http://localhost:3000
// 커밋 메시지: p5: forecast

import { getForecast } from "./api.js";
import { isGoodDay, summarize, reasons } from "./logic.js";

// P1. 요소는 처음에 한 번만 찾아 둠.
const form = document.querySelector("#run-form");
const citySelect = document.querySelector("#city");
const rainInput = document.querySelector("#rain-limit");
const windInput = document.querySelector("#wind-limit");
const statusEl = document.querySelector("#status");
const summaryEl = document.querySelector("#summary");
const rowsEl = document.querySelector("#rows");

// input.value 는 문자열이므로 Number 로 변환
function readLimits() {
  return {
    rain: Number(rainInput.value),
    wind: Number(windInput.value)
  };
}

// P3. 화면에 보이는 모든 값
const state = {
  city: null,
  days: [],
  limits: readLimits()
};

// 하루 날씨를 테이블 행으로 변환
function dayRow(day) {
  const tr = document.createElement("tr");

  const cells = [
    day.date.slice(5),
    `${day.max}°`,
    `${day.wind} km/h`,
    `${day.rain}%`,
    reasons(day, state.limits).join(", ")
  ];

  for (const text of cells) {
    const td = document.createElement("td");
    td.textContent = text;
    tr.append(td);
  }

  // 달리기 좋은 날이면 초록색 표시
  if (isGoodDay(day, state.limits)) {
    tr.classList.add("good");
  }

  return tr;
}

// 화면 다시 그리기
function render() {
  summaryEl.textContent = state.city
    ? `${state.city}: ${summarize(state.days, state.limits)}.`
    : "";

  rowsEl.replaceChildren(...state.days.map(dayRow));
}

// Check 버튼 또는 Enter로 제출
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  statusEl.textContent = "Loading...";
  statusEl.classList.remove("error");

  try {
    // 선택한 도시 키를 서버에 전달
    const result = await getForecast(citySelect.value);

    // 서버가 반환한 city와 days를 그대로 저장
    state.city = result.city;
    state.days = result.days;

    statusEl.textContent = "";
  } catch (err) {
    // 오류가 발생하면 기존 데이터를 유지
    statusEl.textContent =
      `Could not load the forecast (${err.message}).`;

    statusEl.classList.add("error");
  }

  render();
});

// 기준값이 바뀌면 새로 요청하지 않고 화면만 갱신
for (const input of [rainInput, windInput]) {
  input.addEventListener("input", () => {
    state.limits = readLimits();
    render();
  });
}
