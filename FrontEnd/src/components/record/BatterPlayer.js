// import React, { useEffect, useState } from "react";
// import Plot from "react-plotly.js";

// const BatterPlayer = () => {
//   const [matchData, setMatchData] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:5000/api/batter-comparisons"
//         );
//         const data = await response.json();

//         // API에서 여러 경기의 데이터를 받아옴
//         setMatchData(data);
//       } catch (error) {
//         console.error("데이터를 받아오는데 문제가 발생했습니다:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   if (!matchData) {
//     return <div>No data available</div>;
//   }

//   return (
//     <div
//       style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
//     >
//       {matchData.map((match, matchIndex) => {
//         // 각 매치에서 chart 파싱
//         const parsedChart =
//           typeof match.chart === "string"
//             ? JSON.parse(match.chart)
//             : match.chart;

//         return (
//           <div key={matchIndex} style={{ marginBottom: "40px" }}>
//             {/* match.names가 존재하는지 확인 */}
//             {match.names && (
//               <>
//                 {/* match.chart와 match.chart.data가 존재하는지 확인 */}
//                 {parsedChart && parsedChart.data && (
//                   <>
//                     {/* 콘솔 로그로 데이터 확인 */}
//                     {console.log("parsedChart.data:", parsedChart.data)}

//                     {match.names.awayBatters.map((awayPlayer, index) => (
//                       <div
//                         key={index}
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           marginBottom: "20px",
//                         }}
//                       >
//                         {/* 원정 팀 선수 이름 */}
//                         <div
//                           style={{
//                             width: "100px",
//                             textAlign: "right",
//                             marginRight: "10px",
//                           }}
//                         >
//                           {awayPlayer}
//                         </div>

//                         {/* 그래프 */}
//                         <Plot
//                           data={[
//                             {
//                               y: [""], // 빈 문자열로 라벨 표시 제거
//                               x: [parsedChart.data[0]?.x[index] || 0], // away 팀 AVG 값 사용, 값이 없으면 0
//                               type: "bar",
//                               orientation: "h",
//                               marker: { color: "#D71E17" },
//                               text: parsedChart.data[0]?.x[index] || "N/A", // 막대 안에 표시할 수치, 값이 없으면 "N/A"
//                               textposition: "inside", // 막대 안쪽에 수치를 표시
//                               textfont: { color: "white" }, // 수치 색상 흰색으로
//                               hoverinfo: "none", // hover 정보 제거
//                               name: "Away Team AVG",
//                             },
//                             {
//                               y: [""], // 빈 문자열로 라벨 표시 제거
//                               x: [parsedChart.data[1]?.x[index] || 0], // home 팀 AVG 값 사용, 값이 없으면 0
//                               type: "bar",
//                               orientation: "h",
//                               marker: { color: "#A9A9A9" },
//                               text: parsedChart.data[1]?.x[index] || "N/A", // 막대 안에 표시할 수치, 값이 없으면 "N/A"
//                               textposition: "inside", // 막대 안쪽에 수치를 표시
//                               textfont: { color: "white" }, // 수치 색상 흰색으로
//                               hoverinfo: "none", // hover 정보 제거
//                               name: "Home Team AVG",
//                             },
//                           ]}
//                           layout={{
//                             barmode: "stack", // 두 팀을 스택으로 쌓음
//                             width: 600,
//                             height: 40, // 각 그래프의 높이 조정
//                             xaxis: { showticklabels: false }, // x축 범위 조정 없이 자동으로 맞춤
//                             yaxis: { showticklabels: false }, // y축 라벨 제거
//                             showlegend: false, // 범례 제거
//                             margin: { l: 0, r: 0, t: 0, b: 0 }, // 여백 조정
//                           }}
//                           config={{ displayModeBar: false }} // 인터랙티브 툴바 제거
//                           style={{ flexGrow: 1 }}
//                         />

//                         {/* 홈 팀 선수 이름 */}
//                         <div
//                           style={{
//                             width: "100px",
//                             textAlign: "left",
//                             marginLeft: "10px",
//                           }}
//                         >
//                           {match.names.homeBatters[index]}
//                         </div>
//                       </div>
//                     ))}
//                   </>
//                 )}
//               </>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default BatterPlayer;

//##############################################################################################
import React from "react";
import Plot from "react-plotly.js";
import { Strong } from "../../styles/CommonStyles";
const BatterPlayer = ({ match }) => {
  console.log("BatterPlayer:", match);

  console.log("BatterPlayer colors:", match.awayTeamColor, match.homeTeamColor);

  // 데이터 검증 및 파싱
  const parsedChart =
    match && match.batterChart
      ? typeof match.batterChart === "string"
        ? JSON.parse(match.batterChart)
        : match.batterChart
      : null;

  if (
    !match ||
    !parsedChart ||
    !parsedChart.data ||
    !match.awayBatters ||
    !match.homeBatters
  ) {
    return <div>No batter data available</div>;
  }

  return (
    <div className="analysis-player-container">
      <Strong>타자</Strong>
      {match.awayBatters.map((awayBatter, index) => (
        <div className="analysis-player" key={index}>
          <div className="analysis-player away">{awayBatter}</div>
          <Plot
            data={[
              {
                y: [""],
                x: [parsedChart.data[0]?.x[index] || 0],
                type: "bar",
                orientation: "h",
                marker: { color: match.awayTeamColor },
                text: parsedChart.data[0]?.x[index] || "N/A",
                textposition: "inside",
                textfont: { color: "white" },
                hoverinfo: "none",
                name: "Away Team AVG",
              },
              {
                y: [""],
                x: [parsedChart.data[1]?.x[index] || 0],
                type: "bar",
                orientation: "h",
                marker: { color: match.homeTeamColor },
                text: parsedChart.data[1]?.x[index] || "N/A",
                textposition: "inside",
                textfont: { color: "white" },
                hoverinfo: "none",
                name: "Home Team AVG",
              },
            ]}
            layout={{
              barmode: "stack",
              width: 200,
              height: 20,
              xaxis: { showticklabels: false },
              yaxis: { showticklabels: false },
              showlegend: false,
              margin: { l: 0, r: 0, t: 0, b: 0 },
            }}
            config={{ displayModeBar: false }}
          />
          <div className="analysis-player home">{match.homeBatters[index]}</div>
        </div>
      ))}
    </div>
  );
};

export default BatterPlayer;
