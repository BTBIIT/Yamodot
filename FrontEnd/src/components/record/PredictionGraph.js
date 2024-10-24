// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Plot from "react-plotly.js";
// import dayjs from "dayjs"; // dayjs 라이브러리 임포트
// import { getTeamEmblem } from "../../contexts/teamsData";
// import StatusMessage from "../ui/StatusMessage"; // StatusMessage 컴포넌트 임포트

// function PredictionGraph() {
//   const [matchResults, setMatchResults] = useState([]); // 여러 경기 결과 저장
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchTodayMatches();
//   }, []);

//   const fetchTodayMatches = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/predict",
//         {},
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const result = response.data;

//       console.log("Result:", result);

//       // 예측 결과와 팀 이름을 설정합니다.
//       console.log("Fetched probabilities:", result.new_probabilities);
//       setMatchResults(result); // 여러 경기 결과 저장
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 상태 메시지 처리
//   if (loading || error || !matchResults || matchResults.length === 0) {
//     return (
//       <StatusMessage
//         loading={loading}
//         error={error}
//         noData={matchResults.length === 0 && "예측할 경기가 없습니다."}
//       />
//     );
//   }

//   return (
//     <div>
//       {matchResults.map((match, index) => {
//         const homeProbability = match.new_probabilities[0] * 100; // 홈 팀 확률
//         const awayProbability = match.new_probabilities[1] * 100; // 원정 팀 확률

//         const homeColor =
//           homeProbability > awayProbability ? "#D71E17" : "#A9A9A9"; // 홈 팀 색상
//         const awayColor =
//           awayProbability > homeProbability ? "#D71E17" : "#A9A9A9"; // 원정 팀 색상

//         // 팀 엠블럼 가져오기
//         const awayTeamEmblem = getTeamEmblem(match.away_team);
//         const homeTeamEmblem = getTeamEmblem(match.home_team);

//         // 경기 날짜 변환
//         const matchDate = dayjs(match.date).format("YYYY-MM-DD");

//         console.log(
//           `Match ${index + 1} - Home Probability: ${homeProbability.toFixed(
//             2
//           )}%, Away Probability: ${awayProbability.toFixed(
//             2
//           )}% - Date: ${matchDate}`
//         );

//         return (
//           <div
//             key={index}
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 marginBottom: "20px",
//               }}
//             >
//               {/* 원정 팀 이름 */}
//               <div
//                 style={{
//                   width: "100px",
//                   textAlign: "right",
//                   marginRight: "10px",
//                 }}
//               >
//                 {awayTeamEmblem ? (
//                   <img src={awayTeamEmblem} alt={`${match.away_team} Emblem`} />
//                 ) : (
//                   match.away_team
//                 )}
//               </div>

//               <div
//                 style={{
//                   flexGrow: 1,
//                   overflow: "hidden",
//                   borderRadius: "15px", // 막대의 모서리를 둥글게 만드는 CSS 속성
//                 }}
//               >
//                 {/* 확률 그래프 */}
//                 <Plot
//                   data={[
//                     {
//                       y: [""],
//                       x: [awayProbability],
//                       type: "bar",
//                       orientation: "h",
//                       marker: {
//                         color: awayColor,
//                         line: {
//                           color: "rgba(0,0,0,0.1)",
//                           width: 2,
//                         },
//                       },
//                       text: `${awayProbability.toFixed(2)}%`,
//                       textposition: "inside",
//                       textfont: { color: "white" },
//                       hoverinfo: "none",
//                       name: "Away Team Probability",
//                     },
//                     {
//                       y: [""],
//                       x: [homeProbability],
//                       type: "bar",
//                       orientation: "h",
//                       marker: { color: homeColor },
//                       text: `${homeProbability.toFixed(2)}%`,
//                       textposition: "inside",
//                       textfont: { color: "white", size: 12 },
//                       hoverinfo: "none",
//                       name: "Home Team Probability",
//                     },
//                   ]}
//                   layout={{
//                     barmode: "stack",
//                     width: 600,
//                     height: 46,
//                     xaxis: { showticklabels: false },
//                     yaxis: { showticklabels: false },
//                     showlegend: false,
//                     margin: { l: 0, r: 0, t: 0, b: 0 },
//                     bargroupgap: 0.2,
//                   }}
//                   config={{ displayModeBar: false }}
//                   style={{ flexGrow: 1 }}
//                 />
//               </div>

//               {/* 홈 팀 엠블럼 */}
//               <div
//                 style={{
//                   width: "100px",
//                   textAlign: "left",
//                   marginLeft: "10px",
//                 }}
//               >
//                 {homeTeamEmblem ? (
//                   <img src={homeTeamEmblem} alt={`${match.home_team} Emblem`} />
//                 ) : (
//                   match.home_team
//                 )}
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// export default PredictionGraph;

//#################################################################################
// import React from "react";
// import Plot from "react-plotly.js";
// import dayjs from "dayjs";
// import { getTeamEmblem } from "../../contexts/teamsData";
// import StatusMessage from "../ui/StatusMessage"; // StatusMessage 컴포넌트 임포트

// const PredictionGraph = ({ match }) => {
//   // match 객체 로그 추가
//   console.log("Match Data:", match);

//   // 기존 조건문: 데이터가 없을 때 상태 메시지 표시
//   if (
//     !match ||
//     !match.new_probabilities ||
//     match.new_probabilities.length !== 2
//   ) {
//     return <StatusMessage noData="예측할 데이터가 없습니다." />;
//   }

//   const homeProbability = match.new_probabilities[0] * 100; // 홈 팀 확률
//   const awayProbability = match.new_probabilities[1] * 100; // 원정 팀 확률

//   const homeColor = homeProbability > awayProbability ? "#D71E17" : "#A9A9A9"; // 홈 팀 색상
//   const awayColor = awayProbability > homeProbability ? "#D71E17" : "#A9A9A9"; // 원정 팀 색상

//   const awayTeamEmblem = getTeamEmblem(match.awayTeam);
//   const homeTeamEmblem = getTeamEmblem(match.homeTeam);

//   return (
//     <div
//       style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
//     >
//       <div style={{ width: "100px", textAlign: "right", marginRight: "10px" }}>
//         {awayTeamEmblem ? (
//           <img src={awayTeamEmblem} alt={`${match.awayTeam} Emblem`} />
//         ) : (
//           match.awayTeam
//         )}
//       </div>

//       <Plot
//         data={[
//           {
//             y: [""],
//             x: [awayProbability],
//             type: "bar",
//             orientation: "h",
//             marker: { color: awayColor },
//             text: `${awayProbability.toFixed(2)}%`,
//             textposition: "inside",
//             textfont: { color: "white" },
//             hoverinfo: "none",
//           },
//           {
//             y: [""],
//             x: [homeProbability],
//             type: "bar",
//             orientation: "h",
//             marker: { color: homeColor },
//             text: `${homeProbability.toFixed(2)}%`,
//             textposition: "inside",
//             textfont: { color: "white" },
//             hoverinfo: "none",
//           },
//         ]}
//         layout={{
//           barmode: "stack",
//           width: 600,
//           height: 46,
//           xaxis: { showticklabels: false },
//           yaxis: { showticklabels: false },
//           showlegend: false,
//           margin: { l: 0, r: 0, t: 0, b: 0 },
//         }}
//         config={{ displayModeBar: false }}
//       />

//       <div style={{ width: "100px", textAlign: "left", marginLeft: "10px" }}>
//         {homeTeamEmblem ? (
//           <img src={homeTeamEmblem} alt={`${match.homeTeam} Emblem`} />
//         ) : (
//           match.homeTeam
//         )}
//       </div>
//     </div>
//   );
// };

// export default PredictionGraph;

//##########################################################################################################
// import React from "react";
// import Plot from "react-plotly.js";
// import { getTeamEmblem } from "../../contexts/teamsData";
// import StatusMessage from "../ui/StatusMessage";
// import { ProbabilityBar, ProbabilityText } from "../sections/PredictionSection";

// const PredictionGraph = ({ match, compact = false }) => {
//   // match 객체 로그 추가
//   console.log("Match Data:", match);

//   // 기존 조건문: 데이터가 없을 때 상태 메시지 표시
//   if (
//     !match ||
//     !match.new_probabilities ||
//     match.new_probabilities.length !== 2
//   ) {
//     return <StatusMessage noData="예측할 데이터가 없습니다." />;
//   }

//   const homeProbability = match.new_probabilities[0] * 100; // 홈 팀 확률
//   const awayProbability = match.new_probabilities[1] * 100; // 원정 팀 확률

//   const awayWinProb = awayProbability;
//   const homeWinProb = homeProbability;

//   const homeColor = homeProbability > awayProbability ? "#D71E17" : "#A9A9A9"; // 홈 팀 색상
//   const awayColor = awayProbability > homeProbability ? "#D71E17" : "#A9A9A9"; // 원정 팀 색상

//   const awayTeamEmblem = getTeamEmblem(match.awayTeam);
//   const homeTeamEmblem = getTeamEmblem(match.homeTeam);

//   // compact prop에 따라 그래프 크기 조절
//   const graphWidth = compact ? 300 : 600;
//   const graphHeight = compact ? 30 : 46;

//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         marginBottom: compact ? "10px" : "20px",
//       }}
//     >
//       <div>
//         {awayTeamEmblem ? (
//           <img src={awayTeamEmblem} alt={`${match.awayTeam} Emblem`} />
//         ) : (
//           match.awayTeam
//         )}
//       </div>
//       <ProbabilityBar $isHome={false} width={awayWinProb}>
//         <ProbabilityText>{awayWinProb.toFixed(2)}%</ProbabilityText>
//       </ProbabilityBar>
//       <ProbabilityBar $isHome={true} width={homeWinProb}>
//         <ProbabilityText $isHome={true}>
//           {homeWinProb.toFixed(2)}%
//         </ProbabilityText>
//       </ProbabilityBar>
//       {/* <Plot
//         data={[
//           {
//             y: [""],
//             x: [awayProbability],
//             type: "bar",
//             orientation: "h",
//             marker: { color: awayColor },
//             text: `${awayProbability.toFixed(2)}%`,
//             textposition: "inside",
//             textfont: { color: "white" },
//             hoverinfo: "none",
//           },
//           {
//             y: [""],
//             x: [homeProbability],
//             type: "bar",
//             orientation: "h",
//             marker: { color: homeColor },
//             text: `${homeProbability.toFixed(2)}%`,
//             textposition: "inside",
//             textfont: { color: "white" },
//             hoverinfo: "none",
//           },
//         ]}
//         layout={{
//           barmode: "stack",
//           width: graphWidth,
//           height: graphHeight,
//           xaxis: { showticklabels: false },
//           yaxis: { showticklabels: false },
//           showlegend: false,
//           margin: { l: 0, r: 0, t: 0, b: 0 },
//         }}
//         config={{ displayModeBar: false }}
//       /> */}
//       <div>
//         {homeTeamEmblem ? (
//           <img src={homeTeamEmblem} alt={`${match.homeTeam} Emblem`} />
//         ) : (
//           match.homeTeam
//         )}
//       </div>
//     </div>
//   );
// };

// export default PredictionGraph;

import React from "react";
import Plot from "react-plotly.js";
import { getTeamEmblem } from "../../contexts/teamsData";
import StatusMessage from "../ui/StatusMessage";
import { ProbabilityBar, ProbabilityText } from "../sections/PredictionSection";
import { PredictionBoxContainer } from "../../styles/CommonStyles";

const PredictionGraph = ({ match }) => {
  console.log("Match Data:", match);

  if (
    !match ||
    !match.new_probabilities ||
    match.new_probabilities.length !== 2
  ) {
    return <StatusMessage noData="예측할 데이터가 없습니다." />;
  }

  const homeProbability = match.new_probabilities[0] * 100;
  const awayProbability = match.new_probabilities[1] * 100;

  const awayWinProb = awayProbability;
  const homeWinProb = homeProbability;

  const homeColor = homeProbability > awayProbability ? "#D71E17" : "#A9A9A9";
  const awayColor = awayProbability > homeProbability ? "#D71E17" : "#A9A9A9";

  const awayTeamEmblem = getTeamEmblem(match.awayTeam);
  const homeTeamEmblem = getTeamEmblem(match.homeTeam);

  return (
    <PredictionBoxContainer>
      <div>
        {awayTeamEmblem ? (
          <img src={awayTeamEmblem} alt={`${match.awayTeam} Emblem`} />
        ) : (
          match.awayTeam
        )}
      </div>
      <ProbabilityBar $isHome={false} width={awayWinProb}>
        <ProbabilityText>{awayWinProb.toFixed(2)}%</ProbabilityText>
      </ProbabilityBar>
      <ProbabilityBar $isHome={true} width={homeWinProb}>
        <ProbabilityText $isHome={true}>
          {homeWinProb.toFixed(2)}%
        </ProbabilityText>
      </ProbabilityBar>
      <div>
        {homeTeamEmblem ? (
          <img src={homeTeamEmblem} alt={`${match.homeTeam} Emblem`} />
        ) : (
          match.homeTeam
        )}
      </div>
    </PredictionBoxContainer>
  );
};

export default PredictionGraph;
