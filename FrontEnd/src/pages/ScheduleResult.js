// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { AiOutlineCaretLeft, AiOutlineCaretRight } from "react-icons/ai"; // 달력 아이콘
// // import { IoMdArrowDropright } from "react-icons/io";
// import { Container } from "../components/CommonStyles";
// import Button from "../components/usercomponents/Button";
// import styled from "styled-components";

// const TableContainer = styled.div`
//   text-align: center;
//   margin-top: 50px;

//   table {
//     width: 100%;
//     border-collapse: separate;
//     border-spacing: 0 29px; /* 행 간격 설정 */
//     border: 1px solid #ccc; /* 테두리 추가 */
//     border-radius: 10px; /* 라운딩 */
//   }

//   thead {
//     background-color: #f6f6f6;
//   }

//   tbody {
//     background-color: #ffffff;

//     tr:nth-child(first-child) {
//       background-color: #f6f6f6;
//     }
//   }

//   tr {
//     font-size: 16px;
//     border: 1px solid #ccc; /* 각 행의 테두리 추가 */
//   }

//   th {
//     padding: 10px;
//   }

//   td {
//     padding: 10px;
//   }
// `;

// const Table = ({ headers, data }) => {
//   return (
//     <table>
//       <thead>
//         <tr>
//           {headers.map((header, index) => (
//             <th key={index}>{header}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((row, rowIndex) => (
//           <tr key={rowIndex}>
//             {row.date && (
//               <td rowSpan={row.rowSpan}>
//                 {row.date}
//                 <br />
//                 <Link
//                   to="/scheduleresults/scoreboard"
//                   style={{
//                     textDecoration: "none",
//                     color: "#7d7d7d",
//                     fontSize: "10px",
//                   }}
//                 >
//                   &lt; 스코어보드 &gt;
//                 </Link>
//               </td>
//             )}
//             <td>{row.time}</td>
//             <td>{row.match}</td>
//             <td>{row.ground}</td>
//             <td>{row.etc}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// const ScheduleResult = () => {
//   const [groupedResults, setGroupedResults] = useState({});
//   const [year, setYear] = useState("2024");
//   const [month, setMonth] = useState("08");
//   const [selectedButton, setSelectedButton] = useState(0); // 첫 번째 버튼을 선택 상태로 설정

//   useEffect(() => {
//     const apiUrl = `/api/scheduleresults?year=${year}&month=${month}`;
//     console.log("Fetching data from:", apiUrl);
//     axios
//       .get(apiUrl)
//       .then((response) => {
//         console.log("Response data:", response.data);
//         const fetchedGroupedResults = response.data.groupedResults;
//         setGroupedResults(fetchedGroupedResults);
//       })
//       .catch((error) => console.error("Error fetching data:", error));
//   }, [year, month]);

//   // 테이블 헤더
//   const headers = ["날짜", "시간", "경기", "구장", "비고"];

//   // 이전/다음 월 이동 함수
//   const handlePreviousMonth = () => {
//     let newMonth = parseInt(month, 10) - 1;
//     let newYear = year;

//     if (newMonth < 1) {
//       newMonth = 12;
//       newYear = (parseInt(year, 10) - 1).toString();
//     }
//     setMonth(newMonth.toString().padStart(2, "0"));
//     setYear(newYear);
//   };

//   const handleNextMonth = () => {
//     let newMonth = parseInt(month, 10) + 1;
//     let newYear = year;

//     if (newMonth > 12) {
//       newMonth = 1;
//       newYear = (parseInt(year, 10) + 1).toString();
//     }
//     setMonth(newMonth.toString().padStart(2, "0"));
//     setYear(newYear);
//   };
//   // 클릭된 버튼의 인덱스로 상태 업데이트
//   const handleButtonClick = (index) => {
//     setSelectedButton(index);
//   };

//   return (
//     <Container style={{ marginTop: "150px" }}>
//       <div className="container" style={{ width: "1000px" }}>
//         <h1>일정</h1>
//         <div className="button-container">
//           <Button
//             children={"정규"}
//             id="regular"
//             $buttonType="sub-select"
//             $selected={selectedButton === 0} // 선택 여부를 판단
//             onClick={() => handleButtonClick(0)} // 버튼 클릭 시 선택 상태 변경
//           />
//           <Button
//             children={"포스트"}
//             id="post"
//             $buttonType="sub-select"
//             $selected={selectedButton === 1}
//             onClick={() => handleButtonClick(1)}
//           />
//         </div>

//         <hr />

//         {/* 날짜 선택 */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             margin: "10px",
//             gap: "10px",
//           }}
//         >
//           <AiOutlineCaretLeft
//             onClick={handlePreviousMonth}
//             style={{ cursor: "pointer" }}
//           />
//           <select value={year} onChange={(e) => setYear(e.target.value)}>
//             <option value="2022">2022</option>
//             <option value="2023">2023</option>
//             <option value="2024">2024</option>
//             <option value="2025">2025</option>
//           </select>
//           <select value={month} onChange={(e) => setMonth(e.target.value)}>
//             {Array.from({ length: 12 }, (v, i) => i + 1).map((m) => (
//               <option key={m} value={m.toString().padStart(2, "0")}>
//                 {m}월
//               </option>
//             ))}
//           </select>
//           <AiOutlineCaretRight
//             onClick={handleNextMonth}
//             style={{ cursor: "pointer" }}
//           />
//         </div>

//         {/* 일정 리스트 */}
//         {groupedResults &&
//         typeof groupedResults === "object" &&
//         Object.keys(groupedResults).length > 0 ? (
//           <div>
//             <TableContainer>
//               <Table
//                 headers={headers}
//                 data={Object.keys(groupedResults).flatMap((dateKey) => {
//                   const games = groupedResults[dateKey].map((game, index) => ({
//                     date: index === 0 ? dateKey : "", // 첫 번째 경기에서만 날짜 표시
//                     time: game.time.slice(0, 5), // 시간 형식을 HH:MM으로 변환
//                     match: `${game.awayteam} ${game.pitchers} ${game.awayscore} vs ${game.homescore} ${game.pitchers} ${game.hometeam}`,
//                     ground: game.ground,
//                     etc: game.etc,
//                     rowSpan: groupedResults[dateKey].length, // 해당 날짜의 경기 수로 rowSpan 설정
//                   }));

//                   return games;
//                 })}
//               />
//             </TableContainer>
//           </div>
//         ) : (
//           <p>Loading...</p>
//         )}
//       </div>
//     </Container>
//   );
// };

// export default ScheduleResult;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { AiOutlineCaretLeft, AiOutlineCaretRight } from "react-icons/ai";
// import { Container } from "../components/CommonStyles";
// import Button from "../components/usercomponents/Button";
// import styled from "styled-components";

// const TableContainer = styled.div`
//   text-align: center;
//   margin-top: 50px;
//   border-radius: 10px;
// `;

// const Section = styled.div`
//   margin-bottom: 20px;
//   border: 1px solid #ccc;
//   border-radius: 10px;
// `;

// const Table = styled.table`
//   width: 100%;
//   border-collapse: collapse;
// `;

// const Thead = styled.thead`
//   font-weight: bold;
//   background-color: #f6f6f6;
//   th {
//     padding: 10px;

//     &:first-child {
//       width: 120px;
//     }

//     &:nth-child(2) {
//       width: 80px;
//     }

//     &:nth-child(3) {
//       width: 800px;
//     }

//     &:nth-child(4) {
//       width: 40px;
//     }

//     &:last-child {
//       width: 150px;
//     }
//   }
// `;

// const Row = styled.tr`
//   border-top: 1px solid #ccc;
// `;

// const DateCell = styled.td`
//   text-align: center;
//   font-weight: bold;
//   vertical-align: middle; // 수직 중앙 정렬
//   width: 120px;
// `;

// const ScheduleResult = () => {
//   const [groupedResults, setGroupedResults] = useState({});
//   const [year, setYear] = useState("2024");
//   const [month, setMonth] = useState("08");
//   const [selectedButton, setSelectedButton] = useState(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true);
//     const seasonType = selectedButton === 0 ? "regular" : "post";
//     const apiUrl = `/api/scheduleresults?year=${year}&month=${month}&season=${seasonType}`;
//     axios
//       .get(apiUrl)
//       .then((response) => {
//         setGroupedResults(response.data.groupedResults);
//       })
//       .catch((error) => console.error("Error fetching data:", error))
//       .finally(() => setLoading(false));
//   }, [year, month, selectedButton]);

//   const handlePreviousMonth = () => {
//     let newMonth = parseInt(month, 10) - 1;
//     let newYear = year;
//     if (newMonth < 1) {
//       newMonth = 12;
//       newYear = (parseInt(year, 10) - 1).toString();
//     }
//     setMonth(newMonth.toString().padStart(2, "0"));
//     setYear(newYear);
//   };

//   const handleNextMonth = () => {
//     let newMonth = parseInt(month, 10) + 1;
//     let newYear = year;
//     if (newMonth > 12) {
//       newMonth = 1;
//       newYear = (parseInt(year, 10) + 1).toString();
//     }
//     setMonth(newMonth.toString().padStart(2, "0"));
//     setYear(newYear);
//   };

//   const handleButtonClick = (index) => {
//     setSelectedButton(index);
//   };

//   return (
//     <Container style={{ marginTop: "150px" }}>
//       <div className="container" style={{ width: "1000px" }}>
//         <h1>일정</h1>
//         <div className="button-container">
//           <Button
//             children={"정규"}
//             id="regular"
//             $buttonType="sub-select"
//             $selected={selectedButton === 0}
//             onClick={() => handleButtonClick(0)}
//           />
//           <Button
//             children={"포스트"}
//             id="post"
//             $buttonType="sub-select"
//             $selected={selectedButton === 1}
//             onClick={() => handleButtonClick(1)}
//           />
//         </div>

//         <hr />

//         {/* 날짜 선택 */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             margin: "10px",
//             gap: "10px",
//           }}
//         >
//           <AiOutlineCaretLeft
//             onClick={handlePreviousMonth}
//             style={{ cursor: "pointer" }}
//           />
//           <select value={year} onChange={(e) => setYear(e.target.value)}>
//             <option value="2022">2022</option>
//             <option value="2023">2023</option>
//             <option value="2024">2024</option>
//             <option value="2025">2025</option>
//           </select>
//           <select value={month} onChange={(e) => setMonth(e.target.value)}>
//             {Array.from({ length: 12 }, (v, i) => i + 1).map((m) => (
//               <option key={m} value={m.toString().padStart(2, "0")}>
//                 {m}월
//               </option>
//             ))}
//           </select>
//           <AiOutlineCaretRight
//             onClick={handleNextMonth}
//             style={{ cursor: "pointer" }}
//           />
//         </div>

//         {/* 테이블 */}
//         {loading ? (
//           <p>Loading...</p>
//         ) : Object.keys(groupedResults).length > 0 ? (
//           <TableContainer>
//             {Object.keys(groupedResults).map((dateKey, dateIndex) => (
//               <Section key={dateKey}>
//                 {dateIndex === 0 && (
//                   <Table>
//                     <Thead>
//                       <tr>
//                         <th>날짜</th>
//                         <th>시간</th>
//                         <th>경기</th>
//                         <th>구장</th>
//                         <th>비고</th>
//                       </tr>
//                     </Thead>
//                   </Table>
//                 )}
//                 <Table>
//                   <tbody>
//                     {groupedResults[dateKey].map((game, gameIndex) => (
//                       <Row key={gameIndex}>
//                         {/* 첫 번째 경기에만 날짜 셀 병합 */}
//                         {gameIndex === 0 ? (
//                           <DateCell rowSpan={groupedResults[dateKey].length}>
//                             {dateKey}
//                             <br />
//                             <Link
//                               to="/scheduleresults/scoreboard"
//                               style={{
//                                 textDecoration: "none",
//                                 color: "#7d7d7d",
//                                 fontSize: "10px",
//                               }}
//                             >
//                               &lt; 스코어보드 &gt;
//                             </Link>
//                           </DateCell>
//                         ) : null}
//                         <td>{game.time.slice(0, 5)}</td>
//                         <td>
//                           {game.awayteam} {game.awayscore} vs {game.homescore}{" "}
//                           {game.hometeam}
//                         </td>
//                         <td>{game.ground}</td>
//                         <td>{game.etc}</td>
//                       </Row>
//                     ))}
//                   </tbody>
//                 </Table>
//               </Section>
//             ))}
//           </TableContainer>
//         ) : (
//           <p>데이터가 없습니다.</p>
//         )}
//       </div>
//     </Container>
//   );
// };

// export default ScheduleResult;

import React from "react";
import { Outlet } from "react-router-dom";

const ScheduleResult = () => {
  return <Outlet />;
};

export default ScheduleResult;
