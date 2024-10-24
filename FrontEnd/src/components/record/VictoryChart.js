// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Plot from "react-plotly.js";
// import StatusMessage from "../ui/StatusMessage";
// import "../../styles/App.css";

// function TeamPowerDetail() {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [todayMatches, setTodayMatches] = useState([]);
//   const [matchData, setMatchData] = useState([]); // 각 경기별 데이터를 저장할 배열

//   const fetchTodayMatches = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/today-matches`
//       );
//       const data = response.data;
//       console.log("오늘 경기 데이터:", data);

//       const allMatchData = await Promise.all(
//         data.map(async (match) => {
//           const { awayTeam, homeTeam } = match;
//           const additionalData = await fetchAllDataForMatch(awayTeam, homeTeam);
//           return { ...match, ...additionalData };
//         })
//       );

//       setMatchData(allMatchData);
//       setLoading(false);
//     } catch (error) {
//       console.error("오늘 경기 데이터를 가져오는 중 오류 발생:", error);
//       setError("오늘 경기 데이터를 불러오는 중 오류가 발생했습니다.");
//       setLoading(false);
//     }
//   };

//   // 각 경기별 데이터를 가져오기 위한 함수
//   const fetchAllDataForMatch = async (away, home) => {
//     try {
//       const matchData = {};

//       // 승률 데이터 가져오기
//       const winrateResponse = await fetch(
//         `http://localhost:5000/api/winrate?away=${away}&home=${home}`
//       );
//       const winrateData = await winrateResponse.json();
//       if (winrateData && winrateData.awayChart && winrateData.homeChart) {
//         matchData.awayWinrateChart = JSON.parse(winrateData.awayChart);
//         matchData.homeWinrateChart = JSON.parse(winrateData.homeChart);
//         matchData.awayWinrate = winrateData.awayWinrate;
//         matchData.homeWinrate = winrateData.homeWinrate;
//         matchData.awayConfig = winrateData.awayConfig;
//         matchData.homeConfig = winrateData.homeConfig;
//       }

//       // 타율 데이터 가져오기
//       const avgResponse = await fetch(
//         `http://localhost:5000/api/average_avg?away=${away}&home=${home}`
//       );
//       const avgData = await avgResponse.json();
//       if (avgData && avgData.awayChart && avgData.homeChart) {
//         matchData.awayAvgChart = JSON.parse(avgData.awayChart);
//         matchData.homeAvgChart = JSON.parse(avgData.homeChart);
//         matchData.awayAvg = avgData.awayAvg;
//         matchData.homeAvg = avgData.homeAvg;
//       }

//       // ERA 데이터 가져오기
//       const eraResponse = await fetch(
//         `http://localhost:5000/api/average_era?away=${away}&home=${home}`
//       );
//       const eraData = await eraResponse.json();
//       if (eraData && eraData.awayChart && eraData.homeChart) {
//         matchData.awayEraChart = JSON.parse(eraData.awayChart);
//         matchData.homeEraChart = JSON.parse(eraData.homeChart);
//         matchData.awayEra = eraData.awayEra;
//         matchData.homeEra = eraData.homeEra;
//       }

//       return matchData;
//     } catch (error) {
//       console.error("경기 데이터를 받아오는 중 오류 발생: ", error);
//       return null;
//     }
//   };

//   // 모든 경기에 대해 데이터를 가져오는 함수
//   const fetchAllMatchesData = async () => {
//     const allMatchData = [];

//     for (const match of todayMatches) {
//       const { awayTeam, homeTeam } = match;
//       const matchResult = await fetchAllDataForMatch(awayTeam, homeTeam);
//       if (matchResult) {
//         allMatchData.push({ awayTeam, homeTeam, ...matchResult });
//       }
//     }

//     setMatchData(allMatchData); // 모든 경기에 대한 데이터를 저장
//   };

//   useEffect(() => {
//     fetchTodayMatches();
//   }, []);

//   useEffect(() => {
//     if (todayMatches.length > 0) {
//       fetchAllMatchesData();
//     }
//   }, [todayMatches]);

//   // 데이터를 가져오기 전까지 로딩 상태를 표시할 수 있습니다.
//   if (matchData.length === 0) {
//     return <div>Loading match rankings...</div>;
//   }

//   return (
//     <div className="TeamAnalytics">
//       {loading ? (
//         <StatusMessage loading={loading} />
//       ) : error ? (
//         <StatusMessage error={error} />
//       ) : (
//         <div>
//           {matchData.map((match, index) => (
//             <div key={index}>
//               <div>
//                 <div className="TeamInfo">
//                   <div className="TeamInfo_Away">
//                     <div className="TeamInfo_Away_name">{match.awayTeam}</div>
//                     {match.awayRank ? (
//                       <div className="TeamInfo_Away_Score">
//                         <span className="TeamInfo_Away_Score_Rank">
//                           {match.awayRank.Rank}위
//                         </span>
//                         <span>
//                           <span className="TeamInfo_Away_Score_Wins">
//                             {match.awayRank.Wins}승
//                           </span>
//                           <span className="TeamInfo_Away_Score_Draws">
//                             {match.awayRank.Draws}무
//                           </span>
//                           <span className="TeamInfo_Away_Score_Losses">
//                             {match.awayRank.Losses}패
//                           </span>
//                         </span>
//                       </div>
//                     ) : (
//                       <p>No rank data available for {match.awayTeam}</p>
//                     )}
//                   </div>
//                   <div className="TeamInfo_VS">VS</div>
//                   <div className="TeamInfo_Home">
//                     <div className="TeamInfo_Home_name">{match.homeTeam}</div>
//                     {match.homeRank ? (
//                       <div className="TeamInfo_Home_Score">
//                         <span className="TeamInfo_Home_Score_Rank">
//                           {match.homeRank.Rank}위
//                         </span>
//                         <span>
//                           <span className="TeamInfo_Home_Score_Wins">
//                             {match.homeRank.Wins}승
//                           </span>
//                           <span className="TeamInfo_Home_Score_Draws">
//                             {match.homeRank.Draws}무
//                           </span>
//                           <span className="TeamInfo_Home_Score_Losses">
//                             {match.homeRank.Losses}패
//                           </span>
//                         </span>
//                       </div>
//                     ) : (
//                       <p>No rank data available for {match.homeTeam}</p>
//                     )}
//                   </div>
//                 </div>

//                 <table className="TeamPower_power_info_table__gM4Gi">
//                   <caption>
//                     <span className="blind">양팀 전력 비교</span>
//                   </caption>
//                   <colgroup>
//                     <col className="col1" />
//                     <col className="TeamPower_col2__34ipx" />
//                     <col className="col3" />
//                   </colgroup>
//                   <thead>
//                     <tr>
//                       <th scope="col">
//                         <span className="blind">{match.awayTeam}</span>
//                       </th>
//                       <th scope="col">
//                         <span className="blind">구분</span>
//                       </th>
//                       <th scope="col">
//                         <span className="blind">{match.homeTeam}</span>
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {/* 승률 */}
//                     {match.awayWinrateChart && match.homeWinrateChart ? (
//                       <tr>
//                         <td>
//                           <div className="TeamPower_score_area__3NSLd">
//                             <div className="TeamPower_chart__3_cIp">
//                               <Plot
//                                 data={match.awayWinrateChart.data || []}
//                                 layout={
//                                   match.awayWinrateChart.layout || {
//                                     title: "Away Winrate",
//                                   }
//                                 }
//                                 config={match.awayConfig}
//                               />
//                             </div>
//                             <div className="TeamPower_score__2zqG4">
//                               {match.awayWinrate
//                                 ? match.awayWinrate.toFixed(3)
//                                 : "N/A"}
//                             </div>
//                           </div>
//                         </td>
//                         <th scope="row">시즌승률</th>
//                         <td>
//                           <div className="TeamPower_score_area__3NSLd">
//                             <div className="TeamPower_chart__3_cIp">
//                               <Plot
//                                 data={match.homeWinrateChart.data || []}
//                                 layout={
//                                   match.homeWinrateChart.layout || {
//                                     title: "Home Winrate",
//                                   }
//                                 }
//                                 config={match.homeConfig}
//                               />
//                             </div>
//                             <div className="TeamPower_score__2zqG4">
//                               {match.homeWinrate
//                                 ? match.homeWinrate.toFixed(3)
//                                 : "N/A"}
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     ) : (
//                       <td colSpan={3}>No data available</td>
//                     )}
//                     {/* 타율 */}
//                     {match.awayAvgChart && match.homeAvgChart ? (
//                       <tr>
//                         <td>
//                           <div className="TeamPower_score_area__3NSLd">
//                             <div className="TeamPower_chart__3_cIp">
//                               <Plot
//                                 data={match.awayAvgChart.data || []}
//                                 layout={
//                                   match.awayAvgChart.layout || {
//                                     title: "Away AVG",
//                                   }
//                                 }
//                                 config={match.awayConfig}
//                               />
//                             </div>
//                             <div className="TeamPower_score__2zqG4">
//                               {match.awayAvg ? match.awayAvg.toFixed(3) : "N/A"}
//                             </div>
//                           </div>
//                         </td>
//                         <th scope="row">시즌타율</th>
//                         <td>
//                           <div className="TeamPower_score_area__3NSLd">
//                             <div className="TeamPower_chart__3_cIp">
//                               <Plot
//                                 data={match.homeAvgChart.data || []}
//                                 layout={
//                                   match.homeAvgChart.layout || {
//                                     title: "Home AVG",
//                                   }
//                                 }
//                                 config={match.homeConfig}
//                               />
//                             </div>
//                             <div className="TeamPower_score__2zqG4">
//                               {match.homeAvg ? match.homeAvg.toFixed(3) : "N/A"}
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     ) : (
//                       <p>타율 데이터를 불러오는 중입니다...</p>
//                     )}
//                     {/* ERA */}
//                     {match.awayEraChart && match.homeEraChart ? (
//                       <tr>
//                         <td>
//                           <div className="TeamPower_score_area__3NSLd">
//                             <div className="TeamPower_chart__3_cIp">
//                               <Plot
//                                 data={match.awayEraChart.data || []}
//                                 layout={
//                                   match.awayEraChart.layout || {
//                                     title: "Away ERA",
//                                   }
//                                 }
//                                 config={match.awayConfig}
//                               />
//                             </div>
//                             <div className="TeamPower_score__2zqG4">
//                               {match.awayEra ? match.awayEra.toFixed(2) : "N/A"}
//                             </div>
//                           </div>
//                         </td>
//                         <th scope="row">평균자책</th>
//                         <td>
//                           <div className="TeamPower_score_area__3NSLd">
//                             <div className="TeamPower_chart__3_cIp">
//                               <Plot
//                                 data={match.homeEraChart.data || []}
//                                 layout={
//                                   match.homeEraChart.layout || {
//                                     title: "Home ERA",
//                                   }
//                                 }
//                                 config={match.homeConfig}
//                               />
//                             </div>
//                             <div className="TeamPower_score__2zqG4">
//                               {match.homeEra ? match.homeEra.toFixed(2) : "N/A"}
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     ) : (
//                       <p>ERA 데이터를 불러오는 중입니다...</p>
//                     )}

//                     {/* 상대 전적 */}
//                     {match.headToHead ? (
//                       <tr key={index}>
//                         <td>
//                           <div className="TeamMatchUp">
//                             <div className="TeamMatchUp_Away">
//                               <span>{match.headToHead.awayWin}승</span>
//                               <span>{match.headToHead.draw}무</span>
//                               <span>{match.headToHead.homeWin}패</span>
//                             </div>
//                           </div>
//                         </td>
//                         <th scope="row">상대 전적</th>
//                         <td>
//                           <div className="TeamMatchUp">
//                             <div className="TeamMatchUp_Home">
//                               <span>{match.headToHead.homeWin}승</span>
//                               <span>{match.headToHead.draw}무</span>
//                               <span>{match.headToHead.awayWin}패</span>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     ) : (
//                       <tr key={index}>
//                         <td colSpan={3}>No head-to-head data available</td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default TeamPowerDetail;

//#################################################################################################
import React, { useState, useEffect } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import StatusMessage from "../ui/StatusMessage";
import "../../styles/App.css";

function VictoryChart({ match }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [matchData, setMatchData] = useState(null); // 개별 경기 데이터를 저장할 객체

  useEffect(() => {
    const fetchData = async () => {
      if (!match) return;

      setLoading(true);
      try {
        const additionalData = await fetchAllDataForMatch(
          match.awayTeam,
          match.homeTeam
        );
        setMatchData({ ...match, ...additionalData });
        setLoading(false);
      } catch (error) {
        console.error("경기 데이터를 가져오는 중 오류 발생:", error);
        setError("경기 데이터를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchData();
  }, [match]);

  // 각 경기별 데이터를 가져오기 위한 함수
  const fetchAllDataForMatch = async (away, home) => {
    try {
      const matchData = {};

      // 승률 데이터 가져오기
      const winrateResponse = await axios.get(
        `http://localhost:5000/api/winrate?away=${away}&home=${home}`
      );
      const winrateData = winrateResponse.data;
      if (winrateData) {
        matchData.awayWinrateChart = JSON.parse(winrateData.awayChart);
        matchData.homeWinrateChart = JSON.parse(winrateData.homeChart);
        matchData.awayWinrate = winrateData.awayWinrate;
        matchData.homeWinrate = winrateData.homeWinrate;
        matchData.awayConfig = winrateData.awayConfig;
        matchData.homeConfig = winrateData.homeConfig;
      }

      // 타율 데이터 가져오기
      const avgResponse = await axios.get(
        `http://localhost:5000/api/average_avg?away=${away}&home=${home}`
      );
      const avgData = avgResponse.data;
      if (avgData) {
        matchData.awayAvgChart = JSON.parse(avgData.awayChart);
        matchData.homeAvgChart = JSON.parse(avgData.homeChart);
        matchData.awayAvg = avgData.awayAvg;
        matchData.homeAvg = avgData.homeAvg;
      }

      // ERA 데이터 가져오기
      const eraResponse = await axios.get(
        `http://localhost:5000/api/average_era?away=${away}&home=${home}`
      );
      const eraData = eraResponse.data;
      if (eraData) {
        matchData.awayEraChart = JSON.parse(eraData.awayChart);
        matchData.homeEraChart = JSON.parse(eraData.homeChart);
        matchData.awayEra = eraData.awayEra;
        matchData.homeEra = eraData.homeEra;
      }

      return matchData;
    } catch (error) {
      console.error("경기 데이터를 받아오는 중 오류 발생: ", error);
      return {};
    }
  };

  if (!matchData) {
    return <div>Loading match data...</div>;
  }

  return (
    <div className="TeamAnalytics">
      {loading ? (
        <StatusMessage loading={loading} />
      ) : error ? (
        <StatusMessage error={error} />
      ) : (
        <div>
          <div className="TeamInfo">
            <div className="TeamInfo_Away">
              <div className="TeamInfo_Away_name">{matchData.awayTeam}</div>
              {matchData.awayRank ? (
                <div className="TeamInfo_Away_Score">
                  <span className="TeamInfo_Away_Score_Rank">
                    {matchData.awayRank.Rank}위
                  </span>
                  <span className="TeamInfo_Away_Score_Wins">
                    {matchData.awayRank.Wins}승
                  </span>
                  <span className="TeamInfo_Away_Score_Draws">
                    {matchData.awayRank.Draws}무
                  </span>
                  <span className="TeamInfo_Away_Score_Losses">
                    {matchData.awayRank.Losses}패
                  </span>
                </div>
              ) : (
                <p>No rank data available for {matchData.awayTeam}</p>
              )}
            </div>
            <div className="TeamInfo_VS">VS</div>
            <div className="TeamInfo_Home">
              <div className="TeamInfo_Home_name">{matchData.homeTeam}</div>
              {matchData.homeRank ? (
                <div className="TeamInfo_Home_Score">
                  <span className="TeamInfo_Home_Score_Rank">
                    {matchData.homeRank.Rank}위
                  </span>
                  <span className="TeamInfo_Home_Score_Wins">
                    {matchData.homeRank.Wins}승
                  </span>
                  <span className="TeamInfo_Home_Score_Draws">
                    {matchData.homeRank.Draws}무
                  </span>
                  <span className="TeamInfo_Home_Score_Losses">
                    {matchData.homeRank.Losses}패
                  </span>
                </div>
              ) : (
                <p>No rank data available for {matchData.homeTeam}</p>
              )}
            </div>
          </div>
          <div>
            <table className="team-power-info-table">
              <colgroup>
                <col className="col1" />
                <col className="TeamPower_col2__34ipx" />
                <col className="col3" />
              </colgroup>
              <thead className="team-victory-thead">
                <tr>
                  <th scope="col">
                    <span className="blind">{matchData.awayTeam}</span>
                  </th>
                  <th scope="col">
                    <span className="blind">구분</span>
                  </th>
                  <th scope="col">
                    <span className="blind">{matchData.homeTeam}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* 승률 */}
                {matchData.awayWinrateChart && matchData.homeWinrateChart ? (
                  <tr>
                    <td>
                      <div className="team-victory-score-area">
                        <div className="team-victory-score-text">
                          {matchData.awayWinrate
                            ? matchData.awayWinrate.toFixed(3)
                            : "N/A"}
                        </div>
                        <div className="team-victory-score-chart">
                          <Plot
                            data={matchData.awayWinrateChart.data || []}
                            layout={{
                              ...(matchData.awayWinrateChart.layout || {
                                title: "Away Winrate",
                              }),
                              width: 250, // 원하는 너비
                              height: 40, // 높이를 더 크게 설정 (예: 100)
                              margin: {
                                l: 10, // 왼쪽 여백
                                r: 10, // 오른쪽 여백
                                b: 10, // 아래쪽 여백
                                t: 10, // 위쪽 여백
                              },
                            }}
                            config={matchData.awayConfig}
                          />
                        </div>
                      </div>
                    </td>
                    <th scope="row">시즌승률</th>
                    <td>
                      <div className="team-victory-score-area">
                        <div className="team-victory-score-chart">
                          <Plot
                            data={matchData.homeWinrateChart.data || []}
                            layout={{
                              ...(matchData.homeWinrateChart.layout || {
                                title: "Home Winrate",
                              }),
                              width: 250, // 너비 250
                              height: 40, // 높이 30
                              margin: {
                                l: 10, // 왼쪽 여백
                                r: 10, // 오른쪽 여백
                                b: 10, // 아래쪽 여백
                                t: 10, // 위쪽 여백
                              },
                            }}
                            config={matchData.homeConfig}
                          />
                        </div>
                        <div className="team-victory-score-text">
                          {matchData.homeWinrate
                            ? matchData.homeWinrate.toFixed(3)
                            : "N/A"}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <td colSpan={3}>No data available</td>
                )}
                {/* 타율 */}
                {matchData.awayAvgChart && matchData.homeAvgChart ? (
                  <tr>
                    <td>
                      <div className="team-victory-avg-area">
                        <div className="team-victory-avg-text">
                          {matchData.awayAvg
                            ? matchData.awayAvg.toFixed(3)
                            : "N/A"}
                        </div>
                        <div className="team-victory-avg-chart">
                          <Plot
                            data={matchData.awayAvgChart.data || []}
                            layout={{
                              ...(matchData.awayAvgChart.layout || {
                                title: "Away AVG",
                              }),
                              width: 250, // 너비 250
                              height: 40, // 높이 30
                              margin: {
                                l: 10, // 왼쪽 여백
                                r: 10, // 오른쪽 여백
                                b: 10, // 아래쪽 여백
                                t: 10, // 위쪽 여백
                              },
                            }}
                            config={matchData.awayConfig}
                          />
                        </div>
                      </div>
                    </td>
                    <th scope="row">시즌타율</th>
                    <td>
                      <div className="team-victory-avg-area">
                        <div className="team-victory-avg-chart">
                          <Plot
                            data={matchData.homeAvgChart.data || []}
                            layout={{
                              ...(matchData.homeAvgChart.layout || {
                                title: "Home AVG",
                              }),
                              width: 250, // 너비 250
                              height: 40, // 높이 30
                              margin: {
                                l: 10, // 왼쪽 여백
                                r: 10, // 오른쪽 여백
                                b: 10, // 아래쪽 여백
                                t: 10, // 위쪽 여백
                              },
                            }}
                            config={matchData.homeConfig}
                          />
                        </div>
                        <div className="team-victory-avg-text">
                          {matchData.homeAvg
                            ? matchData.homeAvg.toFixed(3)
                            : "N/A"}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <td colSpan={3}>No data available</td>
                )}
                {/* ERA */}
                {matchData.awayEraChart && matchData.homeEraChart ? (
                  <tr>
                    <td>
                      <div className="team-victory-score-area">
                        <div className="team-victory-score-text">
                          {matchData.awayEra
                            ? matchData.awayEra.toFixed(2)
                            : "N/A"}
                        </div>
                        <div className="team-victory-score-chart">
                          <Plot
                            data={matchData.awayEraChart.data || []}
                            layout={{
                              ...(matchData.awayEraChart.layout || {
                                title: "Away ERA",
                              }),
                              width: 250, // 너비 250
                              height: 40, // 높이 30
                              margin: {
                                l: 10, // 왼쪽 여백
                                r: 10, // 오른쪽 여백
                                b: 10, // 아래쪽 여백
                                t: 10, // 위쪽 여백
                              },
                            }}
                            config={matchData.awayConfig}
                          />
                        </div>
                      </div>
                    </td>
                    <th scope="row">평균자책</th>
                    <td>
                      {" "}
                      <div className="team-victory-score-area">
                        <div className="team-victory-score-chart">
                          <Plot
                            data={matchData.homeEraChart.data || []}
                            layout={{
                              ...(matchData.homeEraChart.layout || {
                                title: "Home ERA",
                              }),
                              width: 250, // 너비 250
                              height: 40, // 높이 30
                              margin: {
                                l: 10, // 왼쪽 여백
                                r: 10, // 오른쪽 여백
                                b: 10, // 아래쪽 여백
                                t: 10, // 위쪽 여백
                              },
                            }}
                            config={matchData.homeConfig}
                          />
                        </div>
                        <div className="team-victory-score-text">
                          {matchData.homeEra
                            ? matchData.homeEra.toFixed(2)
                            : "N/A"}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <td colSpan={3}>No data available</td>
                )}

                {/* 상대 전적 */}
                {matchData.headToHead ? (
                  <tr>
                    <td>
                      <div className="TeamMatchUp">
                        <div className="TeamMatchUp_Away">
                          <span>{matchData.headToHead.awayWin}승</span>
                          <span>{matchData.headToHead.draw}무</span>
                          <span>{matchData.headToHead.homeWin}패</span>
                        </div>
                      </div>
                    </td>
                    <th scope="row">상대 전적</th>
                    <td>
                      <div className="TeamMatchUp">
                        <div className="TeamMatchUp_Home">
                          <span>{matchData.headToHead.homeWin}승</span>
                          <span>{matchData.headToHead.draw}무</span>
                          <span>{matchData.headToHead.awayWin}패</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={3}>No head-to-head data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default VictoryChart;

//###################################################################################
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import StatusMessage from "../ui/StatusMessage";
// import "../../styles/App.css";
// import styled from "styled-components";

// // 스타일 정의
// const GraphContainer = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
// `;

// const TeamVictoryScoreArea = styled.div`
//   display: flex;
//   align-items: center;
//   width: 100%;
// `;

// const VictoryScoreText = styled.span`
//   margin-right: 10px;
// `;

// const VictoryScoreBar = styled.div`
//   background-color: #e0e0e0;
//   width: 100%;
//   height: 15px;
//   position: relative;
//   border-radius: 10px;
// `;

// const VictoryScoreBarInner = styled.div`
//   height: 100%;
//   border-radius: 10px;
//   background-color: ${({ color }) => color}; // 팀 색상 적용
//   width: ${({ score }) => score}%;
// `;

// const CenterText = styled.th`
//   text-align: center;
//   width: 80px;
// `;

// function VictoryChart({ match }) {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [matchData, setMatchData] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!match) return;

//       setLoading(true);
//       try {
//         const additionalData = await fetchAllDataForMatch(
//           match.awayTeam,
//           match.homeTeam
//         );
//         setMatchData({ ...match, ...additionalData });
//         setLoading(false);
//       } catch (error) {
//         setError("경기 데이터를 불러오는 중 오류가 발생했습니다.");
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [match]);

//   // 각 경기별 데이터를 가져오기 위한 함수
//   const fetchAllDataForMatch = async (away, home) => {
//     try {
//       const matchData = {};

//       // 승률 데이터 가져오기
//       const winrateResponse = await axios.get(
//         `http://localhost:5000/api/winrate?away=${away}&home=${home}`
//       );
//       const winrateData = winrateResponse.data;
//       if (winrateData) {
//         matchData.awayWinrateChart = JSON.parse(winrateData.awayChart);
//         matchData.homeWinrateChart = JSON.parse(winrateData.homeChart);
//         matchData.awayWinrate = winrateData.awayWinrate;
//         matchData.homeWinrate = winrateData.homeWinrate;
//         matchData.awayConfig = winrateData.awayConfig;
//         matchData.homeConfig = winrateData.homeConfig;
//       }

//       // 타율 데이터 가져오기
//       const avgResponse = await axios.get(
//         `http://localhost:5000/api/average_avg?away=${away}&home=${home}`
//       );
//       const avgData = avgResponse.data;
//       if (avgData) {
//         matchData.awayAvgChart = JSON.parse(avgData.awayChart);
//         matchData.homeAvgChart = JSON.parse(avgData.homeChart);
//         matchData.awayAvg = avgData.awayAvg;
//         matchData.homeAvg = avgData.homeAvg;
//       }

//       // ERA 데이터 가져오기
//       const eraResponse = await axios.get(
//         `http://localhost:5000/api/average_era?away=${away}&home=${home}`
//       );
//       const eraData = eraResponse.data;
//       if (eraData) {
//         matchData.awayEraChart = JSON.parse(eraData.awayChart);
//         matchData.homeEraChart = JSON.parse(eraData.homeChart);
//         matchData.awayEra = eraData.awayEra;
//         matchData.homeEra = eraData.homeEra;
//       }

//       return matchData;
//     } catch (error) {
//       console.error("경기 데이터를 받아오는 중 오류 발생: ", error);
//       return {};
//     }
//   };

//   if (!matchData) {
//     return <div>Loading match data...</div>;
//   }

//   return (
//     <div className="TeamAnalytics">
//       {loading ? (
//         <StatusMessage loading={loading} />
//       ) : error ? (
//         <StatusMessage error={error} />
//       ) : (
//         <table className="team-power-info-table">
//           <tbody>
//             {/* 승률 */}
//             <tr>
//               <td>
//                 <TeamVictoryScoreArea>
//                   <VictoryScoreText>
//                     {matchData.awayWinrate
//                       ? matchData.awayWinrate.toFixed(3)
//                       : "N/A"}
//                   </VictoryScoreText>
//                   <VictoryScoreBar>
//                     <VictoryScoreBarInner
//                       score={matchData.awayWinrate * 100}
//                       color={matchData.awayTeamColor}
//                     />
//                   </VictoryScoreBar>
//                 </TeamVictoryScoreArea>
//               </td>
//               <CenterText>승률</CenterText>
//               <td>
//                 <TeamVictoryScoreArea>
//                   <VictoryScoreBar>
//                     <VictoryScoreBarInner
//                       score={matchData.homeWinrate * 100}
//                       color={matchData.homeTeamColor}
//                     />
//                   </VictoryScoreBar>
//                   <VictoryScoreText>
//                     {matchData.homeWinrate
//                       ? matchData.homeWinrate.toFixed(3)
//                       : "N/A"}
//                   </VictoryScoreText>
//                 </TeamVictoryScoreArea>
//               </td>
//             </tr>

//             {/* 타율 */}
//             <tr>
//               <td>
//                 <TeamVictoryScoreArea>
//                   <VictoryScoreText>
//                     {matchData.awayAvg ? matchData.awayAvg.toFixed(3) : "N/A"}
//                   </VictoryScoreText>
//                   <VictoryScoreBar>
//                     <VictoryScoreBarInner
//                       score={matchData.awayAvg * 100}
//                       color={matchData.awayTeamColor}
//                     />
//                   </VictoryScoreBar>
//                 </TeamVictoryScoreArea>
//               </td>
//               <CenterText>타율</CenterText>
//               <td>
//                 <TeamVictoryScoreArea>
//                   <VictoryScoreBar>
//                     <VictoryScoreBarInner
//                       score={matchData.homeAvg * 100}
//                       color={matchData.homeTeamColor}
//                     />
//                   </VictoryScoreBar>
//                   <VictoryScoreText>
//                     {matchData.homeAvg ? matchData.homeAvg.toFixed(3) : "N/A"}
//                   </VictoryScoreText>
//                 </TeamVictoryScoreArea>
//               </td>
//             </tr>

//             {/* 평균자책 */}
//             <tr>
//               <td>
//                 <TeamVictoryScoreArea>
//                   <VictoryScoreText>
//                     {matchData.awayEra ? matchData.awayEra.toFixed(2) : "N/A"}
//                   </VictoryScoreText>
//                   <VictoryScoreBar>
//                     <VictoryScoreBarInner
//                       score={matchData.awayEra * 100}
//                       color={matchData.awayTeamColor}
//                     />
//                   </VictoryScoreBar>
//                 </TeamVictoryScoreArea>
//               </td>
//               <CenterText>평균자책</CenterText>
//               <td>
//                 <TeamVictoryScoreArea>
//                   <VictoryScoreBar>
//                     <VictoryScoreBarInner
//                       score={matchData.homeEra * 100}
//                       color={matchData.homeTeamColor}
//                     />
//                   </VictoryScoreBar>
//                   <VictoryScoreText>
//                     {matchData.homeEra ? matchData.homeEra.toFixed(2) : "N/A"}
//                   </VictoryScoreText>
//                 </TeamVictoryScoreArea>
//               </td>
//             </tr>

//             {/* 상대전적 */}
//             <tr>
//               <td colSpan="3">
//                 <div style={{ textAlign: "center", marginTop: "20px" }}>
//                   상대전적:{" "}
//                   <strong>
//                     {matchData.awayHeadToHead ? matchData.awayHeadToHead : "N/A"}{" "}
//                     승{" "}
//                   </strong>
//                   {matchData.drawsHeadToHead ? matchData.drawsHeadToHead : "N/A"}{" "}
//                   무{" "}
//                   <strong>
//                     {matchData.homeHeadToHead ? matchData.homeHeadToHead : "N/A"}{" "}
//                     패
//                   </strong>
//                 </div>
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// export default VictoryChart;
