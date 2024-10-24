import React, { useState, useEffect } from "react";
// react-plotly.js라는 부분으로 plotly를 사용하기 위한 자바스크립트 라이브러리
import Plot from "react-plotly.js";
import "../../styles/App.css";

function BarChart() {
  const [todayMatches, setTodayMatches] = useState([]);
  const [matchData, setMatchData] = useState([]); // 각 경기별 데이터를 저장할 배열

  // 오늘 경기를 불러오기 위한 API 호출
  const fetchTodayMatches = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/today-matches`);
      const data = await response.json();
      console.log("오늘 경기 데이터:", data); // API 응답 데이터 확인
      if (data && data.length > 0) {
        setTodayMatches(data);
      } else {
        setTodayMatches([]);
      }
    } catch (error) {
      console.error("오늘 경기 데이터를 가져오는 중 오류 발생:", error);
      setTodayMatches([]);
    }
  };

  // 각 경기별 데이터를 가져오기 위한 함수
  const fetchAllDataForMatch = async (away, home) => {
    try {
      const matchData = {};

      // 승률 데이터 가져오기
      const winrateResponse = await fetch(
        `http://localhost:5000/api/winrate?away=${away}&home=${home}`
      );
      const winrateData = await winrateResponse.json();
      if (winrateData && winrateData.awayChart && winrateData.homeChart) {
        matchData.awayWinrateChart = JSON.parse(winrateData.awayChart);
        matchData.homeWinrateChart = JSON.parse(winrateData.homeChart);
        matchData.awayWinrate = winrateData.awayWinrate;
        matchData.homeWinrate = winrateData.homeWinrate;
        matchData.awayConfig = winrateData.awayConfig;
        matchData.homeConfig = winrateData.homeConfig;
      }

      // 타율 데이터 가져오기
      const avgResponse = await fetch(
        `http://localhost:5000/api/average_avg?away=${away}&home=${home}`
      );
      const avgData = await avgResponse.json();
      if (avgData && avgData.awayChart && avgData.homeChart) {
        matchData.awayAvgChart = JSON.parse(avgData.awayChart);
        matchData.homeAvgChart = JSON.parse(avgData.homeChart);
        matchData.awayAvg = avgData.awayAvg;
        matchData.homeAvg = avgData.homeAvg;
      }

      // ERA 데이터 가져오기
      const eraResponse = await fetch(
        `http://localhost:5000/api/average_era?away=${away}&home=${home}`
      );
      const eraData = await eraResponse.json();
      if (eraData && eraData.awayChart && eraData.homeChart) {
        matchData.awayEraChart = JSON.parse(eraData.awayChart);
        matchData.homeEraChart = JSON.parse(eraData.homeChart);
        matchData.awayEra = eraData.awayEra;
        matchData.homeEra = eraData.homeEra;
      }

      return matchData;
    } catch (error) {
      console.error("경기 데이터를 받아오는 중 오류 발생: ", error);
      return null;
    }
  };

  // 모든 경기에 대해 데이터를 가져오는 함수
  const fetchAllMatchesData = async () => {
    const allMatchData = [];

    for (const match of todayMatches) {
      const { awayTeam, homeTeam } = match;
      const matchResult = await fetchAllDataForMatch(awayTeam, homeTeam);
      if (matchResult) {
        allMatchData.push({ awayTeam, homeTeam, ...matchResult });
      }
    }

    setMatchData(allMatchData); // 모든 경기에 대한 데이터를 저장
  };

  useEffect(() => {
    fetchTodayMatches();
  }, []);

  useEffect(() => {
    if (todayMatches.length > 0) {
      fetchAllMatchesData();
    }
  }, [todayMatches]);

  return (
    <div>
      {/* 승률 차트 */}
      {awayWinrateChart && homeWinrateChart ? (
        <div>
          <h4>승률</h4>
          <Plot
            data={awayWinrateChart.data}
            layout={awayWinrateChart.layout || { title: "Away Winrate" }}
            config={awayConfig}
          />
          <Plot
            data={homeWinrateChart.data}
            layout={homeWinrateChart.layout || { title: "Home Winrate" }}
            config={homeConfig}
          />
          <div className="winrate-text">
            <p>
              <strong>{away}</strong> 승률: {awayWinrate}
            </p>
            <p>
              <strong>{home}</strong> 승률: {homeWinrate}
            </p>
          </div>
        </div>
      ) : (
        <p>승률 데이터를 불러오는 중입니다...</p>
      )}

      {/* 타율 차트 */}
      {awayAvgChart && homeAvgChart ? (
        <div>
          <h4>타율</h4>
          <Plot
            data={awayAvgChart ? awayAvgChart.data : []}
            layout={
              awayAvgChart
                ? awayAvgChart.layout
                : { title: "Away AVG", width: 500, height: 300 }
            }
            config={awayConfig}
          />
          <Plot
            data={homeAvgChart ? homeAvgChart.data : []}
            layout={
              homeAvgChart
                ? homeAvgChart.layout
                : { title: "Home AVG", width: 500, height: 300 }
            }
            config={homeConfig}
          />
          <div className="average-text">
            <p>
              <strong>{away}</strong> 타율:{" "}
              {awayAvg ? awayAvg.toFixed(3) : "N/A"}
            </p>
            <p>
              <strong>{home}</strong> 타율:{" "}
              {homeAvg ? homeAvg.toFixed(3) : "N/A"}
            </p>
          </div>
        </div>
      ) : (
        <p>타율 데이터를 불러오는 중입니다...</p>
      )}

      {/* 평균자책 차트 */}
      {awayEraChart && homeEraChart ? (
        <div>
          <h4>평균자책</h4>
          <Plot
            data={awayEraChart.data}
            layout={awayEraChart.layout || { title: "Away ERA" }}
            config={awayConfig}
          />
          <Plot
            data={homeEraChart.data}
            layout={homeEraChart.layout || { title: "Home ERA" }}
            config={homeConfig}
          />
          <div className="era-text">
            <p>
              <strong>{away}</strong> 평균자책:{" "}
              {awayEra ? awayEra.toFixed(2) : "N/A"}
            </p>
            <p>
              <strong>{home}</strong> 평균자책:{" "}
              {homeEra ? homeEra.toFixed(2) : "N/A"}
            </p>
          </div>
        </div>
      ) : (
        <p>ERA 데이터를 불러오는 중입니다...</p>
      )}
    </div>
  );
}

export default BarChart;
