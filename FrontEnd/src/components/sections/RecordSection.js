import React, { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useQuery } from "react-query"; // React Query 추가
import {
  SectionContainer,
  RecordBoxesContainer,
  RecordBoxContainer,
  LinkContainer,
} from "../../styles/CommonStyles";

// 데이터를 가져오는 함수 정의
const fetchTeamData = async (year) => {
  const response = await axios.get(`/api/pitchersteam?year=${year}`);
  return response.data.pitchersteam; // 팀 데이터 반환
};

const fetchPitcherData = async ({ queryKey }) => {
  const [_key, year, selectedTeam] = queryKey;
  const response = await axios.get(
    `/api/pitchers?year=${year}&teamName=${selectedTeam}`
  );
  return response.data.pitchers; // 투수 데이터 반환
};

const fetchBatterData = async ({ queryKey }) => {
  const [_key, year, selectedTeam] = queryKey;
  const response = await axios.get(
    `/api/batters?year=${year}&teamName=${selectedTeam}`
  );
  return response.data.batters; // 타자 데이터 반환
};

const RecordSection = () => {
  const [year] = useState(dayjs().year().toString()); // 현재 년도로 초기화
  const [selectedTeam] = useState("%25"); // 팀 선택 (전체 팀)

  // 팀 데이터를 가져오기 위한 쿼리
  const {
    data: teamData = [],
    isLoading: isLoadingTeam,
    error: teamError,
  } = useQuery(
    ["teamData", year], // 쿼리 키 (연도에 따라 다름)
    () => fetchTeamData(year),
    {
      onSuccess: (data) => console.log("팀 데이터:", data), // 팀 데이터 성공 시 콘솔 출력
      onError: (error) => console.error("팀 데이터 오류:", error), // 팀 데이터 오류 시 콘솔 출력
      refetchOnWindowFocus: false, // 포커스 시 재요청 방지
      refetchOnMount: false, // 컴포넌트 마운트 시 재요청 방지
    }
  );

  // 투수 데이터를 가져오기 위한 쿼리
  const {
    data: pitcherData = [],
    isLoading: isLoadingPitcher,
    error: pitcherError,
  } = useQuery(
    ["pitcherData", year, selectedTeam], // 쿼리 키 (연도와 팀에 따라 다름)

    fetchPitcherData,
    {
      onSuccess: (data) => console.log("투수 데이터:", data), // 투수 데이터 성공 시 콘솔 출력
      onError: (error) => console.error("투수 데이터 오류:", error), // 투수 데이터 오류 시 콘솔 출력
      refetchOnWindowFocus: false, // 포커스 시 재요청 방지
      refetchOnMount: false, // 컴포넌트 마운트 시 재요청 방지
    }
  );

  // 타자 데이터를 가져오기 위한 쿼리
  const {
    data: batterData = [],
    isLoading: isLoadingBatter,
    error: batterError,
  } = useQuery(
    ["batterData", year, selectedTeam], // 쿼리 키 (연도와 팀에 따라 다름)
    fetchBatterData,
    {
      onSuccess: (data) => console.log("타자 데이터:", data), // 타자 데이터 성공 시 콘솔 출력
      onError: (error) => console.error("타자 데이터 오류:", error), // 타자 데이터 오류 시 콘솔 출력
      refetchOnWindowFocus: false, // 포커스 시 재요청 방지
      refetchOnMount: false, // 컴포넌트 마운트 시 재요청 방지
    }
  );

  if (isLoadingTeam || isLoadingPitcher || isLoadingBatter) {
    return <div>로딩 중...</div>; // 로딩 상태
  }

  if (teamError || pitcherError || batterError) {
    return (
      <div>
        오류 발생:{" "}
        {teamError?.message || pitcherError?.message || batterError?.message}
      </div>
    ); // 에러 발생 시
  }

  const rankingTitles = ["구단", "투수", "타자"];
  const rankingData = [teamData, pitcherData, batterData];

  return (
    <div className="record-section">
      <SectionContainer>
        <h2
          style={{
            textAlign: "center",
            marginTop: "145px",
            font: "50px/1.5 'GongGothicMedium', sans-serif",
            color: "rgba(34,34,34,80%)",
          }}
        >
          빛나던 순간의 기록
        </h2>
        <h5
          style={{
            textAlign: "center",
            marginTop: "10px",
            font: "25px/1.5 'GongGothicMedium', sans-serif",
            color: "rgba(34,34,34,80%)",
          }}
        >
          2024 KBO 리그
        </h5>
        <RecordBoxesContainer>
          {rankingTitles.map((title, index) => (
            <RecordBoxContainer key={title} className="record-list">
              <h3 style={{ font: "40px/1.5 'GongGothicMedium', sans-serif" }}>
                {title} 순위
              </h3>
              <ol>
                {rankingData[index].slice(0, 3).map((item, itemIndex) => {
                  if (title === "구단") {
                    return (
                      <li key={item.teamName || itemIndex}>{item.teamName}</li>
                    );
                  } else if (title === "투수") {
                    return (
                      <li key={item.pitchersName || itemIndex}>
                        {item.pitchersName}{" "}
                        <span style={{ fontSize: "15px" }}>
                          ({item.teamName})
                        </span>
                      </li>
                    );
                  } else if (title === "타자") {
                    return (
                      <li key={item.battersName || itemIndex}>
                        {item.battersName}{" "}
                        <span style={{ fontSize: "15px" }}>
                          ({item.teamName})
                        </span>
                      </li>
                    );
                  }
                  return null;
                })}
              </ol>
            </RecordBoxContainer>
          ))}
          <LinkContainer to={`/recordanalysis/record`}>
            Go To Detail &gt;
          </LinkContainer>
        </RecordBoxesContainer>
      </SectionContainer>
    </div>
  );
};

export default RecordSection;
