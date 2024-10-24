import React, { useEffect, useState } from "react";

function MatchRankings() {
  const [matchData, setMatchData] = useState([]);

  // useEffect를 통해 Flask API에서 데이터 가져오기
  useEffect(() => {
    // API 요청 보내기
    fetch("http://localhost:5000/api/today-matches")
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error fetching match data: ", data.error);
        } else {
          setMatchData(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  // 데이터를 가져오기 전까지 로딩 상태를 표시할 수 있습니다.
  if (matchData.length === 0) {
    return <div>Loading match rankings...</div>;
  }

  return (
    <div>
      {matchData.map((match, index) => (
        <div
          key={index}
          style={{
            marginBottom: "20px",
            border: "1px solid #ccc",
            padding: "10px",
          }}
        >
          <div>
            <h3>Away Team: {match.awayTeam}</h3>
            {match.awayRank ? (
              <p>
                순위: {match.awayRank.Rank}등&nbsp;&nbsp;&nbsp;&nbsp; 승:{" "}
                {match.awayRank.Wins}&nbsp;&nbsp;&nbsp;&nbsp; 무:{" "}
                {match.awayRank.Draws}&nbsp;&nbsp;&nbsp;&nbsp; 패:{" "}
                {match.awayRank.Losses}
              </p>
            ) : (
              <p>No rank data available for {match.awayTeam}</p>
            )}
          </div>
          <div>
            <h3>Home Team: {match.homeTeam}</h3>
            {match.homeRank ? (
              <p>
                순위: {match.homeRank.Rank}등&nbsp;&nbsp;&nbsp;&nbsp; 승:{" "}
                {match.homeRank.Wins}&nbsp;&nbsp;&nbsp;&nbsp; 무:{" "}
                {match.homeRank.Draws}&nbsp;&nbsp;&nbsp;&nbsp; 패:{" "}
                {match.homeRank.Losses}
              </p>
            ) : (
              <p>No rank data available for {match.homeTeam}</p>
            )}
          </div>

          {/* 상대 전적 표시 */}
          <div style={{ marginTop: "10px", fontWeight: "bold" }}>
            <h4>Head-to-Head Record</h4>
            <p>
              Away Team 승: {match.headToHead.awayWin}&nbsp;&nbsp;&nbsp;&nbsp;
              Home Team 승: {match.headToHead.homeWin}&nbsp;&nbsp;&nbsp;&nbsp;
              무: {match.headToHead.draw}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MatchRankings;
