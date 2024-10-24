import React, { useState, useEffect } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import dayjs from "dayjs";
import { AiOutlineCaretLeft, AiOutlineCaretRight } from "react-icons/ai";
import StatusMessage from "../ui/StatusMessage";
import {
  SubContentContainer,
  SubTitle,
  Strong,
} from "../../styles/CommonStyles";

function GroundPlot() {
  const currentYear = dayjs().year(); // 현재 연도를 가져옵니다.
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [homeWinData, setHomeWinData] = useState(null);
  const [homeWinLayout, setHomeWinLayout] = useState(null);
  const [homeWinConfig, setHomeWinConfig] = useState(null);

  const [filteredData, setFilteredData] = useState(null);
  const [filteredLayout, setFilteredLayout] = useState(null);
  const [filteredConfig, setFilteredConfig] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDataByYear = async (year) => {
    // 상태 초기화 (로딩, 데이터, 에러)
    setLoading(true);
    setError(null);
    setHomeWinData(null);
    setFilteredData(null);

    try {
      // 유효한 연도 (22, 23, 24년)만 처리
      if (year < 2022 || year > 2024) {
        throw new Error("해당 연도의 데이터가 없습니다.");
      }

      const apiUrl = `http://localhost:5000/api/data-by-year?year=${year}`;
      const response = await axios.get(apiUrl);
      const data = response.data;

      // 홈 팀 승리 데이터 설정
      const homeWinParsed = JSON.parse(data.homeWin.data);
      setHomeWinData(homeWinParsed.data);
      setHomeWinLayout(homeWinParsed.layout);
      setHomeWinConfig(data.homeWin.config);

      // 원정 팀 승리 데이터 설정
      const filteredParsed = JSON.parse(data.filtered.data);
      setFilteredData(filteredParsed.data);
      setFilteredLayout(filteredParsed.layout);
      setFilteredConfig(data.filtered.config);

      setLoading(false);
    } catch (err) {
      // 특정 에러 메시지 처리
      if (err.message === "해당 연도의 데이터가 없습니다.") {
        setError("해당 연도의 데이터가 없습니다.");
      } else {
        setError("데이터를 불러오는 중 문제가 발생했습니다.");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataByYear(selectedYear);
  }, [selectedYear]);

  // 연도 변경 함수
  const handleYearChange = (direction) => {
    if (direction === "prev") {
      setSelectedYear((prevYear) => prevYear - 1);
    } else if (direction === "next") {
      if (selectedYear < currentYear) {
        setSelectedYear((prevYear) => prevYear + 1);
      } else {
        // 현재 연도에 도달했을 때 알림창을 띄움
        window.alert("조회 가능한 마지막 연도입니다.");
      }
    }
  };

  return (
    <SubContentContainer>
      {/* 연도 이동 아이콘 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AiOutlineCaretLeft
          size={24}
          style={{ cursor: "pointer" }}
          onClick={() => handleYearChange("prev")}
        />
        <SubTitle style={{ margin: "0 20px" }}>{selectedYear}</SubTitle>
        <AiOutlineCaretRight
          size={24}
          style={{
            cursor: selectedYear >= currentYear ? "not-allowed" : "pointer",
          }}
          onClick={() => handleYearChange("next")}
        />
      </div>

      {loading && <StatusMessage loading />}
      {error && <StatusMessage error={error} />}

      {!loading && !error && (
        <div className="chart-container">
          {homeWinData && homeWinLayout && homeWinConfig && (
            <div className="chart">
              <Plot
                data={homeWinData}
                layout={homeWinLayout}
                config={homeWinConfig}
              />
              <Strong>홈</Strong>
            </div>
          )}
          {filteredData && filteredLayout && filteredConfig && (
            <div className="chart">
              <Plot
                data={filteredData}
                layout={filteredLayout}
                config={filteredConfig}
              />
              <Strong>원정</Strong>
            </div>
          )}
        </div>
      )}
    </SubContentContainer>
  );
}

export default GroundPlot;
