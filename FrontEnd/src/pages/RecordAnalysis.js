import React from "react";
import { Outlet } from "react-router-dom";

export const fetchRecordData = (date) => {
  const mockData = {
    teamRanking: [
      { teamName: "KIA", ranking: 1 },
      { teamName: "삼성", ranking: 2 },
      { teamName: "LG", ranking: 3 },
      { teamName: "두산", ranking: 4 },
      { teamName: "KT", ranking: 5 },
      { teamName: "SSG", ranking: 6 },
      { teamName: "롯데", ranking: 7 },
      { teamName: "한화", ranking: 8 },
      { teamName: "NC", ranking: 9 },
      { teamName: "키움", ranking: 10 },
    ],
    pitcherRanking: [
      { pitcherName: "원태인", ranking: 1, teamName: "삼성" },
      { pitcherName: "하트", ranking: 2, teamName: "NC" },
      { pitcherName: "곽빈", ranking: 3, teamName: "두산" },
      { pitcherName: "헤이수스", ranking: 4, teamName: "키움" },
      { pitcherName: "엔스", ranking: 5, teamName: "LG" },
      { pitcherName: "네일", ranking: 6, teamName: "KIA" },
      { pitcherName: "반즈", ranking: 7, teamName: "롯데" },
    ],
    batterRanking: [
      { batterName: "에레디아", ranking: 1, teamName: "SSG" },
      { batterName: "레이예스", ranking: 2, teamName: "롯데" },
      { batterName: "김도영", ranking: 3, teamName: "KIA" },
      { batterName: "구자욱", ranking: 4, teamName: "삼성" },
      { batterName: "송성문", ranking: 5, teamName: "키움" },
      { batterName: "데이비슨", ranking: 6, teamName: "NC" },
      { batterName: "최정", ranking: 7, teamName: "SSG" },
    ],
  };
  return mockData[date] || [];
};
const RecordAnalysis = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default RecordAnalysis;
