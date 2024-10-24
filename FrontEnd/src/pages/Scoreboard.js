// import React, { useEffect, useState } from "react";
// import styled from "styled-components";
// import MatchCard from "../components/MatchCard";

// const CalendarContainer = styled.div`
//   display: flex;
//   align-items: center;
//   margin-bottom: 20px;
// `;

// const Button = styled.button`
//   margin: 0 10px;
// `;

// const Table = styled.table`
//   width: 100%;
//   border-collapse: collapse;
//   margin-top: 10px;
// `;

// const TableHeader = styled.th`
//   border: 1px solid #ddd;
//   padding: 5px 10px;
//   text-align: center;
//   background-color: #f2f2f2;
// `;

// const TableCell = styled.td`
//   border: 1px solid #ddd;
//   padding: 5px 10px;
//   text-align: center;
// `;

// const Scoreboard = () => {
//   const [scoreboard, setScoreboard] = useState([]);
//   const [currentDate, setCurrentDate] = useState(new Date("2024-08-13"));

//   const fetchScoreboard = async (date) => {
//     try {
//       const response = await fetch(
//         `/api/scoreboard?date=${date.toISOString().split("T")[0]}`
//       );
//       const data = await response.json();
//       // 데이터가 제대로 왔는지 확인 후 업데이트
//       if (data.scoreBoard) {
//         setScoreboard(data.scoreBoard);
//       } else {
//         setScoreboard([]); // 만약 데이터가 없으면 빈 배열로 초기화
//       }
//     } catch (error) {
//       console.error("Failed to fetch scoreboard data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchScoreboard(currentDate);
//   }, [currentDate]);

//   const handlePrevDate = () => {
//     setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() - 1)));
//   };

//   const handleNextDate = () => {
//     setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() + 1)));
//   };

//   const formatDate = (date) => {
//     return date.toLocaleDateString("ko-KR", {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//       weekday: "long",
//     });
//   };

//   return (
//     <>
//       <h1>스코어 보드</h1>
//       <hr />
//       <CalendarContainer>
//         <Button onClick={handlePrevDate}>이전</Button>
//         <span>{formatDate(currentDate)}</span>
//         <Button onClick={handleNextDate}>다음</Button>
//       </CalendarContainer>
//       <div>
//         {/* 데이터가 없을 때 처리 */}
//         {scoreboard.length === 0 ? (
//           <p>데이터가 없습니다.</p>
//         ) : (
//           scoreboard.map((match, index) => (
//             <MatchCard key={index} match={match}>
//               <Table>
//                 <thead>
//                   <tr>
//                     <TableHeader>팀명</TableHeader>
//                     <TableHeader></TableHeader>
//                     <TableHeader>1</TableHeader>
//                     <TableHeader>2</TableHeader>
//                     <TableHeader>3</TableHeader>
//                     <TableHeader>4</TableHeader>
//                     <TableHeader>5</TableHeader>
//                     <TableHeader>6</TableHeader>
//                     <TableHeader>7</TableHeader>
//                     <TableHeader>8</TableHeader>
//                     <TableHeader>9</TableHeader>
//                     <TableHeader>10</TableHeader>
//                     <TableHeader>11</TableHeader>
//                     <TableHeader>12</TableHeader>
//                     <TableHeader></TableHeader>
//                     <TableHeader>R</TableHeader>
//                     <TableHeader>H</TableHeader>
//                     <TableHeader>E</TableHeader>
//                     <TableHeader>B</TableHeader>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {/* awayTeam, homeTeam 데이터가 없을 경우 대비 */}
//                   <tr>
//                     <TableCell>{match.awayTeam || "N/A"}</TableCell>
//                     {match.awayTeam?.innings?.map((score, idx) => (
//                       <TableCell key={idx}>{score}</TableCell>
//                     ))}
//                     <TableCell>{match.awayTeam?.totalR || 0}</TableCell>
//                     <TableCell>{match.awayTeam?.totalH || 0}</TableCell>
//                     <TableCell>{match.awayTeam?.totalE || 0}</TableCell>
//                   </tr>
//                   <tr>
//                     <TableCell>{match.homeTeam || "N/A"}</TableCell>
//                     {match.homeTeam?.innings?.map((score, idx) => (
//                       <TableCell key={idx}>{score}</TableCell>
//                     ))}
//                     <TableCell>{match.homeTeam?.totalR || 0}</TableCell>
//                     <TableCell>{match.homeTeam?.totalH || 0}</TableCell>
//                     <TableCell>{match.homeTeam?.totalE || 0}</TableCell>
//                   </tr>
//                 </tbody>
//               </Table>
//             </MatchCard>
//           ))
//         )}
//       </div>
//     </>
//   );
// };

// export default Scoreboard;

// // Scoreboard.js
// import React, { useEffect, useState } from "react";
// import styled from "styled-components";
// import MatchCard from "../components/MatchCard";

// const CalendarContainer = styled.div`
//   display: flex;
//   align-items: center;
//   margin-bottom: 20px;
// `;

// const Button = styled.button`
//   margin: 0 10px;
// `;

// const Table = styled.table`
//   width: 100%;
//   border-collapse: collapse;
//   margin-top: 10px;
// `;

// const TableHeader = styled.th`
//   border: 1px solid #ddd;
//   padding: 5px 10px;
//   text-align: center;
//   background-color: #f2f2f2;
// `;

// const TableCell = styled.td`
//   border: 1px solid #ddd;
//   padding: 5px 10px;
//   text-align: center;
// `;

// const Scoreboard = () => {
//   const [scoreboard, setScoreboard] = useState([]);
//   const [currentDate, setCurrentDate] = useState(new Date("2024-08-13"));

//   const fetchScoreboard = async (date) => {
//     try {
//       const response = await fetch(
//         `/api/scoreboard?date=${date.toISOString().split("T")[0]}`
//       );
//       const data = await response.json();
//       // 데이터가 존재할 경우 업데이트
//       if (data.scoreBoard) {
//         setScoreboard(data.scoreBoard);
//       } else {
//         setScoreboard([]); // 데이터가 없으면 빈 배열로 처리
//       }
//     } catch (error) {
//       console.error("Failed to fetch scoreboard data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchScoreboard(currentDate);
//   }, [currentDate]);

//   const handlePrevDate = () => {
//     setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() - 1)));
//   };

//   const handleNextDate = () => {
//     setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() + 1)));
//   };

//   const formatDate = (date) => {
//     return date.toLocaleDateString("ko-KR", {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//       weekday: "long",
//     });
//   };

//   return (
//     <>
//       <h1>스코어 보드</h1>
//       <hr />
//       <CalendarContainer>
//         <Button onClick={handlePrevDate}>이전</Button>
//         <span>{formatDate(currentDate)}</span>
//         <Button onClick={handleNextDate}>다음</Button>
//       </CalendarContainer>
//       <div>
//         {/* 데이터가 없을 때 처리 */}
//         {scoreboard.length === 0 ? (
//           <p>데이터가 없습니다.</p>
//         ) : (
//           scoreboard.map((match, index) => (
//             <MatchCard key={index} match={match}>
//               <Table>
//                 <thead>
//                   <tr>
//                     <TableHeader>팀명</TableHeader>
//                     <TableHeader>1</TableHeader>
//                     <TableHeader>2</TableHeader>
//                     <TableHeader>3</TableHeader>
//                     <TableHeader>4</TableHeader>
//                     <TableHeader>5</TableHeader>
//                     <TableHeader>6</TableHeader>
//                     <TableHeader>7</TableHeader>
//                     <TableHeader>8</TableHeader>
//                     <TableHeader>9</TableHeader>
//                     <TableHeader>R</TableHeader>
//                     <TableHeader>H</TableHeader>
//                     <TableHeader>E</TableHeader>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {/* awayTeam 데이터 렌더링 */}
//                   <tr>
//                     <TableCell>{match.awayTeam || "N/A"}</TableCell>
//                     {match.awayTeam.innings.map((score, idx) => (
//                       <TableCell key={idx}>{score}</TableCell>
//                     ))}
//                     <TableCell>{match.awayTeam.totalR}</TableCell>
//                     <TableCell>{match.awayTeam.totalH}</TableCell>
//                     <TableCell>{match.awayTeam.totalE}</TableCell>
//                   </tr>
//                   {/* homeTeam 데이터 렌더링 */}
//                   <tr>
//                     <TableCell>{match.homeTeam || "N/A"}</TableCell>
//                     {match.homeTeam.innings.map((score, idx) => (
//                       <TableCell key={idx}>{score}</TableCell>
//                     ))}
//                     <TableCell>{match.homeTeam.totalR}</TableCell>
//                     <TableCell>{match.homeTeam.totalH}</TableCell>
//                     <TableCell>{match.homeTeam.totalE}</TableCell>
//                   </tr>
//                 </tbody>
//               </Table>
//             </MatchCard>
//           ))
//         )}
//       </div>
//     </>
//   );
// };

// export default Scoreboard;

// 0922
import React from "react";
import ScoreboardTable from "../components/schedule-scoreboard/ScoreboardTable";

const Scoreboard = () => {
  return <ScoreboardTable />;
};

export default Scoreboard;

// import React from "react";
// import MatchCard from "../components/MatchCard";

// const Scoreboard = ({ scoreboard }) => {
//   return (
//     <div>
//       {scoreboard.map((match, index) => (
//         <MatchCard key={index} match={match} />
//       ))}
//     </div>
//   );
// };

// export default Scoreboard;
