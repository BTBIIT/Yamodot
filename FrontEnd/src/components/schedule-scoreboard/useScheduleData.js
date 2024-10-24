// //현재 년도와 월을 기준으로 일정, 포스트 설정

// import { useState, useEffect } from "react";
// import axios from "axios";

// const useScheduleData = (year, month, season) => {
//   const [scheduleResults, setScheduleResults] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const apiUrl =
//           season === "regular"
//             ? `/api/scheduleresults?year=${year}&month=${month}`
//             : `/api/postscheduleresults?year=${year}&month=${month}`;

//         const response = await axios.get(apiUrl);

//         const results =
//           season === "regular"
//             ? response.data.scheduleResults || []
//             : response.data.postScheduleResults || []; // 포스트 시즌 데이터 처리

//         // 응답 데이터에서 정규 시즌과 포스트 시즌에 맞는 데이터 가져오기
//         const groupedData = results.reduce((acc, game) => {
//           const dateKey = game.gameDate; // 날짜를 키로 그룹화
//           if (!acc[dateKey]) {
//             acc[dateKey] = [];
//           }
//           acc[dateKey].push(game);
//           return acc;
//         }, {});

//         setScheduleResults(groupedData); // 결과 저장
//       } catch (err) {
//         setError("데이터를 불러오는 중 오류가 발생했습니다.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [year, month, season]);

//   return { scheduleResults, loading, error };
// };

// export default useScheduleData;

import { useQuery } from "react-query";
import axios from "axios";

// API 데이터를 가져오는 함수
const fetchScheduleData = async (year, month, season) => {
  const apiUrl =
    season === "regular"
      ? `/api/scheduleresults?year=${year}&month=${month}`
      : `/api/postscheduleresults?year=${year}&month=${month}`;
  const response = await axios.get(apiUrl);
  const results =
    season === "regular"
      ? response.data.scheduleResults || []
      : response.data.postScheduleResults || [];

  const groupedData = results.reduce((acc, game) => {
    const dateKey = game.gameDate;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(game);
    return acc;
  }, {});

  return groupedData;
};

// React-Query를 활용한 데이터 캐싱 및 페칭 로직
const useScheduleData = (year, month, season) => {
  return useQuery(
    ["scheduleResults", year, month, season],
    () => fetchScheduleData(year, month, season),
    {
      staleTime: 1000 * 60 * 5, // 5분 동안 데이터가 신선하게 유지됨
      gcTime: 1000 * 60 * 10, // 10분 동안 캐싱
      refetchOnWindowFocus: false, // 포커스 시 재요청 방지
    }
  );
};

export default useScheduleData;
