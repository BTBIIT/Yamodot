// import React, { useEffect, useState } from "react";
// import Plot from "react-plotly.js";

// const PitcherPlayer = () => {
//   const [matchData, setMatchData] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:5000/api/pitcher-comparisons"
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
//         const parsedChart =
//           typeof match.chart === "string"
//             ? JSON.parse(match.chart)
//             : match.chart;

//         return (
//           <div key={matchIndex} style={{ marginBottom: "40px" }}>
//             {match.names && (
//               <>
//                 {parsedChart && parsedChart.data && (
//                   <>
//                     {console.log("parsedChart.data:", parsedChart.data)}

//                     {match.names.awayPitchers.map((awayPlayer, index) => (
//                       <div
//                         key={index}
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           marginBottom: "20px",
//                         }}
//                       >
//                         {/* 원정 팀 투수 이름 */}
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
//                               y: [""],
//                               x: [parsedChart.data[0]?.x[index] || 0], // away 팀 ERA 값
//                               type: "bar",
//                               orientation: "h",
//                               marker: { color: "#D71E17" },
//                               text: parsedChart.data[0]?.x[index] || "N/A",
//                               textposition: "inside",
//                               textfont: { color: "white" },
//                               hoverinfo: "none",
//                               name: "Away Team ERA",
//                             },
//                             {
//                               y: [""],
//                               x: [parsedChart.data[1]?.x[index] || 0], // home 팀 ERA 값
//                               type: "bar",
//                               orientation: "h",
//                               marker: { color: "#A9A9A9" },
//                               text: parsedChart.data[1]?.x[index] || "N/A",
//                               textposition: "inside",
//                               textfont: { color: "white" },
//                               hoverinfo: "none",
//                               name: "Home Team ERA",
//                             },
//                           ]}
//                           layout={{
//                             barmode: "stack",
//                             width: 600,
//                             height: 40,
//                             xaxis: { showticklabels: false },
//                             yaxis: { showticklabels: false },
//                             showlegend: false,
//                             margin: { l: 0, r: 0, t: 0, b: 0 },
//                           }}
//                           config={{ displayModeBar: false }}
//                           style={{ flexGrow: 1 }}
//                         />

//                         {/* 홈 팀 투수 이름 */}
//                         <div
//                           style={{
//                             width: "100px",
//                             textAlign: "left",
//                             marginLeft: "10px",
//                           }}
//                         >
//                           {match.names.homePitchers[index]}
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

// export default PitcherPlayer;

//###########################################################################################
import React from "react";
import Plot from "react-plotly.js";
import { Strong } from "../../styles/CommonStyles";
const PitcherPlayer = ({ match }) => {
  console.log("PitcherPlayer:", match);

  // 데이터 검증 및 파싱
  const parsedChart =
    match && match.pitcherChart
      ? typeof match.pitcherChart === "string"
        ? JSON.parse(match.pitcherChart)
        : match.pitcherChart
      : null;

  if (
    !match ||
    !parsedChart ||
    !parsedChart.data ||
    !match.awayPitchers ||
    !match.homePitchers
  ) {
    return <div>No pitcher data available</div>;
  }

  return (
    <div className="analysis-player-container">
      <Strong>투수</Strong>
      {match.awayPitchers.map((awayPitcher, index) => (
        <div className="analysis-player" key={index}>
          <div className="analysis-player away">{awayPitcher}</div>
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
                name: "Away Team ERA",
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
                name: "Home Team ERA",
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
          <div className="analysis-player home">
            {match.homePitchers[index]}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PitcherPlayer;
