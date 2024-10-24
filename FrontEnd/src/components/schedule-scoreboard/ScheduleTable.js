// // 0922 수정
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { AiOutlineCaretLeft, AiOutlineCaretRight } from "react-icons/ai";
// // import { Container } from "./CommonStyles";
// import Button from "./usercomponents/Button";
// import styled from "styled-components";
// import { getTeamEmblem } from "./commuinad/common/teamsData"; // 팀 이름으로 엠블럼 찾는 함수

// /* 0922 수정 */
// import MatchCard from "./MatchCard";
// import { useNavigate } from "react-router-dom";

// const TableContainer = styled.div`
//   text-align: center;
//   margin-top: 34px;
//   width: 1320px;
// `;

// const Section = styled.div`
//   margin-bottom: 29px;
//   border: 1px solid #ccc;
//   border-radius: 10px;
//   // width: 100%;
// `;

// const Table = styled.table`
//   width: 100%;
//   border-collapse: collapse;
//   margin: 15px auto;
// `;

// const Thead = styled.thead`
//   th {
//     height: 60px;
//     padding: 10px;
//     background-color: #f6f6f6;
//     text-align: center;
//     border-collapse: collapse;
//     border-bottom: none;

//     /* 첫 번째 열과 마지막 열에 border-radius 적용 */
//     &:first-child {
//       border-top-left-radius: 10px;
//       border-bottom-left-radius: 10px;
//     }
//     &:last-child {
//       border-top-right-radius: 10px;
//       border-bottom-right-radius: 10px;
//     }

//     /* 열 너비 설정 */
//     &:nth-child(1) {
//       width: 150px; /* 날짜 */
//     }
//     &:nth-child(2) {
//       width: 80px; /* 시간 */
//     }
//     &:nth-child(3) {
//       width: 600px; /* 경기 */
//     }
//     &:nth-child(4) {
//       width: 100px; /* 구장 */
//     }
//     &:nth-child(5) {
//       width: 160px; /* 비고 */
//     }
//   }
// `;

// const Row = styled.tr`
//   margin-bottom: 8px;
//   &:last-of-type td {
//     border-bottom: none; /* 마지막 행 테두리 제거 */
//   }

//   td {
//     // padding: 18px 5px;
//     text-align: center;

//     /* 열 너비 설정 */
//     &:nth-child(1) {
//       width: 150px; /* 날짜 */
//     }
//     &:nth-child(2) {
//       width: 80px; /* 시간 */
//       ul {
//         list-style-type: none;
//         padding: 0;
//         margin: 0;
//         display: flex;
//         flex-wrap: wrap;
//         gap: 10px;
//       }
//     }
//     &:nth-child(3) {
//       width: 600px; /* 경기 */

//       ul {
//         list-style-type: none;
//         padding: 0;
//         margin: 0;
//         display: flex;
//         flex-wrap: wrap;
//         gap: 10px;
//       }
//     }
//     &:nth-child(4) {
//       width: 100px; /* 구장 */
//     }
//     &:nth-child(5) {
//       width: 160px; /* 비고 */
//     }
//   }
// `;

// const DateCell = styled.td`
//   text-align: center;
//   font-weight: bold;
//   vertical-align: middle; // 수직 중앙 정렬
//   border-bottom: none; /* 날짜 셀의 아래쪽 테두리 제거 */
// `;

// const ScheduleTable = () => {
//   const [loading, setLoading] = useState(true);
//   const [selectedButton, setSelectedButton] = useState(0);
//   const [scheduleResults, setScheduleResults] = useState({});
//   const [year, setYear] = useState("2024");
//   const [month, setMonth] = useState("08");
//   const [season, setSeason] = useState("regular");

//   /* 0922 수정 */
//   const [selectedGame, setSelectedGame] = useState(null); // 선택한 경기 상태 추가

//   // const navigate = useNavigate(); // 페이지 이동에 사용

//   // useEffect(() => {
//   //   setLoading(true);
//   //   // const seasonType = selectedButton === 0 ? "regular" : "post";
//   //   const apiUrl = `/api/scheduleresults?year=${year}&month=${month}&season=${season}`; //

//   //   axios
//   //     .get(apiUrl)
//   //     .then((response) => {
//   //       console.log("scheduleResults:", response.data.scheduleResults);
//   //       const groupedDate = response.data.scheduleResults.reduce(
//   //         (acc, game) => {
//   //           const dateKey = game.gameDate;
//   //           if (!acc[dateKey]) {
//   //             acc[dateKey] = [];
//   //           }
//   //           acc[dateKey].push({
//   //             dayoftheweek: game.dayOfTheWeek,
//   //             time: game.time,
//   //             awayteam: game.away,
//   //             hometeam: game.home,
//   //             awayscore: game.awayScore,
//   //             homescore: game.homeScore,
//   //             homewinlose: game.homeWinLose,
//   //             awaywinlose: game.awayWinLose,
//   //             homepitcher: game.homePitcher,
//   //             awaypitcher: game.awayPitcher,
//   //             ground: game.ground,
//   //             etc: game.etc,
//   //           });
//   //           return acc;
//   //         },
//   //         {}
//   //       );
//   //       setScheduleResults(groupedDate);
//   //     })
//   //     .catch((error) => {
//   //       console.error("Error fetching data:", error);
//   //       setScheduleResults({});
//   //     })
//   //     .finally(() => setLoading(false));
//   // }, [year, month]);

//   useEffect(() => {
//     setLoading(true);
//     const apiUrl = `/api/scheduleresults?year=${year}&month=${month}&season=${season}`;

//     axios
//       .get(apiUrl)
//       .then((response) => {
//         const groupedDate = response.data.scheduleResults.reduce(
//           (acc, game) => {
//             const dateKey = game.gameDate;
//             if (!acc[dateKey]) {
//               acc[dateKey] = [];
//             }
//             acc[dateKey].push(game);
//             return acc;
//           },
//           {}
//         );
//         setScheduleResults(groupedDate);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//         setScheduleResults({});
//       })
//       .finally(() => setLoading(false));
//   }, [year, month]);

//   // 이전 월 이동 버튼
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

//   // 다음 월 이동 버튼
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

//   /* 0922 수정 */
//   // 경기 선택 핸들러
//   // const handleGameClick = (game) => {
//   //   setSelectedGame(game); // 선택된 경기 설정
//   //   navigate("/scheduleresults/scoreboard", { state: { game } }); // 경기 카드로 이동하며 데이터 전달
//   // };

//   // 0924 수정 - 기존의 dateKey는 '08.01(목)' 형식이라면 이를 'YYYY-MM-DD' 형식으로 변환
//   const formatDateForURL = (year, month, dayKey) => {
//     const day = dayKey.split(".")[1]; // '08.01(목)' -> '01'
//     return `${year}-${month}-${day}`; // 2024-08-01
//   };

//   // 요일을 한글로 반환하는 함수
//   // const getKoreanDay = (dateString) => {
//   //   const days = ["일", "월", "화", "수", "목", "금", "토"];
//   //   const date = new Date(dateString); // '2024-08-01' 형식으로 들어오는 날짜를 Date 객체로 변환
//   //   return days[date.getDay()]; // 요일 숫자를 한글 요일로 변환
//   // };

//   // 날짜를 '08.01(목)' 형식으로 변환하는 함수
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     // const koreanDay = getKoreanDay(dateString);
//     return `${month}.${day}`; //(${koreanDay})
//   };

//   const handleButtonClick = (index) => {
//     setSelectedButton(index);
//   };

//   return (
//     // <Container style={{ marginTop: "150px" }}>
//     <>
//       <div className="container text-center" style={{ marginTop: "150px" }}>
//         <h1>일정</h1>
//         <div
//           className="button-container23 text-center"
//           style={{ margin: "50px auto 90px" }}
//         >
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
//             marginTop: "31px",
//             gap: "12px",
//           }}
//         >
//           <AiOutlineCaretLeft
//             onClick={handlePreviousMonth}
//             style={{ cursor: "pointer" }}
//           />
//           <select
//             value={year}
//             onChange={(e) => setYear(e.target.value)}
//             style={{
//               border: "1px solid #eee",
//               padding: "5px 10px",
//               borderRadius: "5px",
//             }}
//           >
//             <option value="2022">2022</option>
//             <option value="2023">2023</option>
//             <option value="2024">2024</option>
//             <option value="2025">2025</option>
//           </select>
//           <select
//             value={month}
//             onChange={(e) => setMonth(e.target.value)}
//             style={{
//               border: "1px solid #eee",
//               padding: "5px 10px",
//               borderRadius: "5px",
//             }}
//           >
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

//         {/* 테이블 헤더 (한 번만 렌더링) */}
//         <TableContainer>
//           <Table>
//             <Thead>
//               <tr>
//                 <th>날짜</th>
//                 <th>시간</th>
//                 <th>경기</th>
//                 <th>구장</th>
//                 <th>비고</th>
//               </tr>
//             </Thead>
//           </Table>
//         </TableContainer>
//         {/*    console.log({year}, {month}, {dateKey},
//           {formatDateForURL(year, month, dateKey)})  */}
//         {/* 날짜 및 경기 섹션 */}
//         {loading ? (
//           <p>Loading...</p>
//         ) : Object.keys(scheduleResults).length > 0 ? ( // 일정있을 경우 코드 실행
//           <TableContainer>
//             {Object.keys(scheduleResults).map((dateKey) => (
//               <Section key={dateKey}>
//                 <Table>
//                   <tbody>
//                     {/* scheduleResults[dateKey]가 배열인지 확인 */}
//                     {Array.isArray(scheduleResults[dateKey]) &&
//                     scheduleResults[dateKey].length > 0 ? (
//                       scheduleResults[dateKey].map((game, gameIndex) => (
//                         <Row key={gameIndex}>
//                           {gameIndex === 0 ? (
//                             <DateCell rowSpan={scheduleResults[dateKey].length}>
//                               {/* 변환된 날짜 출력 */}
//                               {formatDate(dateKey)} ({game.dayOfTheWeek})
//                               <br />
//                               <Link
//                                 to={`/scheduleresults/scoreboard?date=${dateKey}`}
//                                 style={{
//                                   textDecoration: "none",
//                                   color: "#7d7d7d",
//                                   fontSize: "10px",
//                                 }}
//                               >
//                                 스코어보드 &gt;
//                               </Link>
//                             </DateCell>
//                           ) : null}
//                           <td>{game.time}</td>
//                           <td>
//                             <ul
//                               style={{
//                                 alignItems: "center",
//                               }}
//                             >
//                               <li>
//                                 <img
//                                   src={getTeamEmblem(game.away)} // teamsData에서 emblem 가져오기
//                                   alt={game.away}
//                                   style={{ width: "30px", height: "30px" }}
//                                 />
//                               </li>
//                               <li>{game.away} </li>
//                               <li>
//                                 {game.awayPitcher}
//                                 <span>&nbsp;{game.awayWinLose}</span>
//                               </li>
//                               <li>{game.awayScore}</li>
//                               <li>vs</li>
//                               <li>{game.homeScore}</li>
//                               <li>
//                                 <span>{game.homeWinLose}&nbsp;</span>
//                                 {game.homePitcher}
//                               </li>
//                               <li>{game.home}</li>
//                               <li>
//                                 <img
//                                   src={getTeamEmblem(game.home)} // teamsData에서 emblem 가져오기
//                                   alt={game.home}
//                                   style={{ width: "30px", height: "30px" }}
//                                 />
//                               </li>
//                             </ul>
//                           </td>

//                           <td>{game.ground}</td>
//                           <td>{game.etc}</td>
//                         </Row>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan={5}>데이터가 없습니다.</td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </Table>
//               </Section>
//             ))}
//           </TableContainer>
//         ) : (
//           <p>데이터가 없습니다.</p>
//         )}
//       </div>
//       {/* 선택된 경기가 있으면 MatchCard로 전달 */}
//       {selectedGame && <MatchCard match={selectedGame} />}
//     </>
//     // </Container>
//   );
// };

// export default ScheduleTable;

// 0922 수정
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { AiOutlineCaretLeft, AiOutlineCaretRight } from "react-icons/ai";
// // import { Container } from "./CommonStyles";
// import Button from "./usercomponents/Button";
// import styled from "styled-components";
// import { getTeamEmblem } from "./commuinad/common/teamsData"; // 팀 이름으로 엠블럼 찾는 함수
// import { DateUtils } from "./DateUtils"; // 새로운 파일에서 불러오기

// /* 0922 수정 */
// import MatchCard from "./MatchCard";
// import { useNavigate } from "react-router-dom";

// const TableContainer = styled.div`
//   text-align: center;
//   margin-top: 34px;
//   width: 1320px;
// `;

// const Section = styled.div`
//   margin-bottom: 29px;
//   border: 1px solid #ccc;
//   border-radius: 10px;
//   // width: 100%;
// `;

// const Table = styled.table`
//   width: 100%;
//   border-collapse: collapse;
//   margin: 15px auto;
// `;

// const Thead = styled.thead`
//   th {
//     height: 60px;
//     padding: 10px;
//     background-color: #f6f6f6;
//     text-align: center;
//     border-collapse: collapse;
//     border-bottom: none;

//     /* 첫 번째 열과 마지막 열에 border-radius 적용 */
//     &:first-child {
//       border-top-left-radius: 10px;
//       border-bottom-left-radius: 10px;
//     }
//     &:last-child {
//       border-top-right-radius: 10px;
//       border-bottom-right-radius: 10px;
//     }

//     /* 열 너비 설정 */
//     &:nth-child(1) {
//       width: 150px; /* 날짜 */
//     }
//     &:nth-child(2) {
//       width: 80px; /* 시간 */
//     }
//     &:nth-child(3) {
//       width: 600px; /* 경기 */
//     }
//     &:nth-child(4) {
//       width: 100px; /* 구장 */
//     }
//     &:nth-child(5) {
//       width: 160px; /* 비고 */
//     }
//   }
// `;

// const Row = styled.tr`
//   margin-bottom: 8px;
//   &:last-of-type td {
//     border-bottom: none; /* 마지막 행 테두리 제거 */
//   }

//   td {
//     // padding: 18px 5px;
//     text-align: center;

//     /* 열 너비 설정 */
//     &:nth-child(1) {
//       width: 150px; /* 날짜 */
//     }
//     &:nth-child(2) {
//       width: 80px; /* 시간 */
//       ul {
//         list-style-type: none;
//         padding: 0;
//         margin: 0;
//         display: flex;
//         flex-wrap: wrap;
//         gap: 10px;
//       }
//     }
//     &:nth-child(3) {
//       width: 600px; /* 경기 */

//       ul {
//         list-style-type: none;
//         padding: 0;
//         margin: 0;
//         display: flex;
//         flex-wrap: wrap;
//         gap: 45px;

//         li:nth-child(2),
//         li:nth-child(8) {
//           display: flex-row;
//         }

//         li:nth-child(3),
//         li:nth-child(7) {
//           font-size: 10px;
//         }
//       }
//     }
//     &:nth-child(4) {
//       width: 100px; /* 구장 */
//     }
//     &:nth-child(5) {
//       width: 160px; /* 비고 */
//     }
//   }
// `;

// const DateCell = styled.td`
//   text-align: center;
//   font-weight: bold;
//   vertical-align: middle; // 수직 중앙 정렬
//   border-bottom: none; /* 날짜 셀의 아래쪽 테두리 제거 */
// `;

// // 승/패/무에 따른 색상 설정
// export const WinLoseText = styled.span`
//   color: ${({ $winLose }) =>
//     $winLose === "승" ? "#D71E17" : $winLose === "패" ? "#0008C5" : "#757575"};
// `;

// // 승리 시 점수에 색상 적용
// export const ScoreText = styled.li`
//   color: ${({ $isWin }) => ($isWin ? "#D71E17" : "inherit")};
//   font-size: 16px;
// `;

// const ScheduleTable = () => {
//   const handleYearMonthChange = (newYear, newMonth) => {
//     setYear(newYear);
//     setMonth(newMonth);
//   };
//   const [loading, setLoading] = useState(true);
//   const [selectedButton, setSelectedButton] = useState(0);
//   const [scheduleResults, setScheduleResults] = useState({});
//   const [year, setYear] = useState("2024");
//   const [month, setMonth] = useState("08");
//   const [season, setSeason] = useState("regular"); // 시즌 상태

//   /* 0922 수정 */
//   const [selectedGame, setSelectedGame] = useState(null); // 선택한 경기 상태 추가

//   useEffect(() => {
//     setLoading(true);
//     const apiUrl =
//       /* 선택된 시즌에 따라 엔드포인트 결정 */
//       season === "regular"
//         ? `/api/scheduleresults?year=${year}&month=${month}` // 정규
//         : `/api/postScheduleresults?year=${year}&month=${month}`; // 포스트

//     axios
//       .get(apiUrl)
//       .then((response) => {
//         // 응답에 scheduleResults가 존재하는지 확인
//         const results = response.data.scheduleResults || []; // 기본값으로 빈 배열 설정
//         const groupedDate = results.reduce((acc, game) => {
//           const dateKey = game.gameDate;
//           if (!acc[dateKey]) {
//             acc[dateKey] = [];
//           }
//           acc[dateKey].push(game);
//           return acc;
//         }, {});
//         setScheduleResults(groupedDate);
//       })
//       .catch((error) => {
//         console.error("데이터를 가져오는 중 오류 발생:", error);
//         setScheduleResults({});
//       })
//       .finally(() => setLoading(false));
//   }, [year, month, season]); // 시즌을 의존성 배열에 추가

//   const handleButtonClick = (index) => {
//     setSelectedButton(index);
//     setSeason(index === 0 ? "regular" : "post"); // 버튼 클릭에 따라 시즌 업데이트
//   };

//   // 이전 월 이동 버튼
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

//   // 다음 월 이동 버튼
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

//   /* 0922 수정 */
//   // 경기 선택 핸들러
//   // const handleGameClick = (game) => {
//   //   setSelectedGame(game); // 선택된 경기 설정
//   //   navigate("/scheduleresults/scoreboard", { state: { game } }); // 경기 카드로 이동하며 데이터 전달
//   // };

//   // // 0924 수정 - 기존의 dateKey는 '08.01(목)' 형식이라면 이를 'YYYY-MM-DD' 형식으로 변환
//   // const formatDateForURL = (year, month, dayKey) => {
//   //   const day = dayKey.split(".")[1]; // '08.01(목)' -> '01'
//   //   return `${year}-${month}-${day}`; // 2024-08-01
//   // };

//   // 날짜를 '08.01(목)' 형식으로 변환하는 함수
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     // const koreanDay = getKoreanDay(dateString);
//     return `${month}.${day}`; //(${koreanDay})
//   };

//   return (
//     // <Container style={{ marginTop: "150px" }}>
//     <>
//       <div className="container text-center" style={{ marginTop: "150px" }}>
//         <h1>일정</h1>

//         <div
//           className="button-container23 text-center"
//           style={{ margin: "50px auto 90px" }}
//         >
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
//         <DateUtils
//           year={year}
//           month={month}
//           onYearMonthChange={handleYearMonthChange}
//         />
//         {/* <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             marginTop: "31px",
//             gap: "12px",
//           }}
//         >
//           <AiOutlineCaretLeft
//             onClick={handlePreviousMonth}
//             style={{ cursor: "pointer" }}
//           />
//           <select
//             value={year}
//             onChange={(e) => setYear(e.target.value)}
//             style={{
//               border: "1px solid #eee",
//               padding: "5px 10px",
//               borderRadius: "5px",
//             }}
//           >
//             <option value="2022">2022</option>
//             <option value="2023">2023</option>
//             <option value="2024">2024</option>
//             <option value="2025">2025</option>
//           </select>
//           <select
//             value={month}
//             onChange={(e) => setMonth(e.target.value)}
//             style={{
//               border: "1px solid #eee",
//               padding: "5px 10px",
//               borderRadius: "5px",
//             }}
//           >
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
//         </div> */}

//         {/* 테이블 헤더 (한 번만 렌더링) */}
//         <TableContainer>
//           <Table>
//             <Thead>
//               <tr>
//                 <th>날짜</th>
//                 <th>시간</th>
//                 <th>경기</th>
//                 <th>구장</th>
//                 <th>비고</th>
//               </tr>
//             </Thead>
//           </Table>
//         </TableContainer>
//         {/*    console.log({year}, {month}, {dateKey},
//           {formatDateForURL(year, month, dateKey)})  */}
//         {/* 날짜 및 경기 섹션 */}
//         {loading ? (
//           <p>Loading...</p>
//         ) : Object.keys(scheduleResults).length > 0 ? ( // 일정있을 경우 코드 실행
//           <TableContainer>
//             {Object.keys(scheduleResults).map((dateKey) => (
//               <Section key={dateKey}>
//                 <Table>
//                   <tbody>
//                     {/* scheduleResults[dateKey]가 배열인지 확인 */}
//                     {Array.isArray(scheduleResults[dateKey]) &&
//                     scheduleResults[dateKey].length > 0 ? (
//                       scheduleResults[dateKey].map((game, gameIndex) => (
//                         <Row key={gameIndex}>
//                           {gameIndex === 0 ? (
//                             <DateCell rowSpan={scheduleResults[dateKey].length}>
//                               {/* 변환된 날짜 출력 */}
//                               {formatDate(dateKey)} ({game.dayOfTheWeek})
//                               <br />
//                               <Link
//                                 to={`/scheduleresults/scoreboard?date=${dateKey}`}
//                                 style={{
//                                   textDecoration: "none",
//                                   color: "#7d7d7d",
//                                   fontSize: "10px",
//                                 }}
//                               >
//                                 스코어보드 &gt;
//                               </Link>
//                             </DateCell>
//                           ) : null}
//                           <td>{game.time}</td>
//                           <td>
//                             <ul
//                               style={{
//                                 alignItems: "center",
//                               }}
//                             >
//                               <li>
//                                 <img
//                                   src={getTeamEmblem(game.away)} // teamsData에서 emblem 가져오기
//                                   alt={game.away}
//                                 />
//                               </li>
//                               <li>{game.away} </li>
//                               <li>
//                                 {game.awayPitcher}
//                                 <WinLoseText $winLose={game.awayWinLose}>
//                                   &nbsp;{game.awayWinLose}
//                                 </WinLoseText>
//                               </li>
//                               <ScoreText $isWin={game.awayWinLose === "승"}>{`${
//                                 (game.awayScore && game.awayWinLose === "승") ||
//                                 game.awayWinLose === "패"
//                                   ? game.awayScore
//                                   : ""
//                               }`}</ScoreText>
//                               <li>vs</li>
//                               <ScoreText $isWin={game.homeWinLose === "승"}>{`${
//                                 (game.homeScore && game.homeWinLose === "승") ||
//                                 game.homeWinLose === "패"
//                                   ? game.homeScore
//                                   : ""
//                               }`}</ScoreText>
//                               <li>
//                                 <WinLoseText $winLose={game.homeWinLose}>
//                                   {game.homeWinLose}&nbsp;
//                                 </WinLoseText>
//                                 {game.homePitcher}
//                               </li>
//                               <li>{game.home}</li>
//                               <li>
//                                 <img
//                                   src={getTeamEmblem(game.home)} // teamsData에서 emblem 가져오기
//                                   alt={game.home}
//                                 />
//                               </li>
//                             </ul>
//                           </td>

//                           <td>{game.ground}</td>
//                           <td>{game.etc}</td>
//                         </Row>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan={5}>데이터가 없습니다.</td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </Table>
//               </Section>
//             ))}
//           </TableContainer>
//         ) : (
//           <p>데이터가 없습니다.</p>
//         )}
//         {/* 선택된 경기가 있으면 MatchCard로 전달 */}
//         {selectedGame && <MatchCard match={selectedGame} />}
//       </div>
//     </>
//     // </Container>
//   );
// };

// export default ScheduleTable;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import Button from "../ui/Button";
// import { DateUtils } from "../../utils/DateUtils"; // 날짜 선택 유틸
// import ScheduleTableView from "./ScheduleTableView"; // 테이블 표시 컴포넌트
// import styled from "styled-components";

// const ScheduleTableContainer = styled.div`
//   margin-top: 150px;
//   text-align: center;
// `;

// const ButtonContainer = styled.div`
//   margin: 50px auto 90px;
//   display: flex;
//   justify-content: center;
// `;

// const ScheduleTable = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [year, setYear] = useState("2024");
//   const [month, setMonth] = useState("08");
//   const [season, setSeason] = useState("regular");
//   const [scheduleResults, setScheduleResults] = useState({});
//   const [selectedButton, setSelectedButton] = useState(0);

//   const handleYearMonthChange = (newYear, newMonth) => {
//     setYear(newYear);
//     setMonth(newMonth);
//   };

//   const handleButtonClick = (index) => {
//     setSelectedButton(index);
//     setSeason(index === 0 ? "regular" : "post");
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const apiUrl =
//           season === "regular"
//             ? `/api/scheduleresults?year=${year}&month=${month}`
//             : `/api/postscheduleresults?year=${year}&month=${month}`;

//         const response = await axios.get(apiUrl);
//         console.log("API 응답 데이터: ", response.data); // API 응답 확인

//         // 응답 데이터에서 정규 시즌과 포스트 시즌에 맞는 데이터를 가져오기
//         const results =
//           season === "regular"
//             ? response.data.scheduleResults || []
//             : response.data.postScheduleResults || []; // 포스트 시즌 데이터 처리

//         const groupedDate = results.reduce((acc, game) => {
//           const dateKey = game.gameDate; // 날짜를 키로 그룹화
//           if (!acc[dateKey]) {
//             acc[dateKey] = [];
//           }
//           acc[dateKey].push(game);
//           return acc;
//         }, {});

//         setScheduleResults(groupedDate); // 결과 저장
//       } catch (err) {
//         setError("데이터를 불러오는 중 오류가 발생했습니다.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [year, month, season]);

//   return (
//     <ScheduleTableContainer>
//       <h1>일정</h1>

//       <ButtonContainer>
//         <Button
//           children={"정규"}
//           $buttonType="sub-select"
//           $selected={selectedButton === 0}
//           onClick={() => handleButtonClick(0)}
//         />
//         <Button
//           children={"포스트"}
//           $buttonType="sub-select"
//           $selected={selectedButton === 1}
//           onClick={() => handleButtonClick(1)}
//         />
//       </ButtonContainer>

//       <DateUtils
//         year={year}
//         month={month}
//         onYearMonthChange={handleYearMonthChange}
//       />

//       {loading ? (
//         <p>로딩 중...</p>
//       ) : error ? (
//         <p>{error}</p>
//       ) : (
//         <ScheduleTableView scheduleResults={scheduleResults} />
//       )}
//     </ScheduleTableContainer>
//   );
// };

// export default ScheduleTable;

// 0929
// import React, { useState } from "react";
// import dayjs from "dayjs"; // dayjs 라이브러리 사용
// import ScheduleTableView from "./ScheduleTableView";
// import useScheduleData from "./useScheduleData";
// import Button from "../ui/Button";
// import { DateUtils } from "../../utils/DateUtils";
// import styled from "styled-components";

// const ScheduleTableContainer = styled.div`
//   margin-top: 150px;
//   text-align: center;
// `;

// const ButtonContainer = styled.div`
//   margin: 50px auto 90px;
//   display: flex;
//   justify-content: center;
// `;

// const ScheduleTable = () => {
//   // dayjs를 사용하여 현재 연도와 월 설정
//   const currentYear = dayjs().year();
//   const currentMonth = dayjs().format("MM"); // 0부터 시작하지 않으므로 추가 조정 불필요

//   // 상태값으로 현재 연도와 월 설정
//   const [year, setYear] = useState(currentYear);
//   const [month, setMonth] = useState(currentMonth);
//   const [season, setSeason] = useState("regular");
//   const [selectedButton, setSelectedButton] = useState(0);

//   const { scheduleResults, loading, error } = useScheduleData(
//     year,
//     month,
//     season
//   );

//   // 연도와 월이 변경되면 상태 업데이트
//   const handleYearMonthChange = (newYear, newMonth) => {
//     setYear(newYear);
//     setMonth(newMonth);
//   };

//   // 버튼 클릭 시 시즌 변경
//   const handleButtonClick = (index) => {
//     setSelectedButton(index);
//     setSeason(index === 0 ? "regular" : "post");
//   };

//   return (
//     <ScheduleTableContainer>
//       <h1>일정</h1>

//       {/* 정규 시즌 및 포스트 시즌 선택 버튼 */}
//       <ButtonContainer>
//         <Button
//           children={"정규"}
//           $buttonType="sub-select"
//           $selected={selectedButton === 0}
//           onClick={() => handleButtonClick(0)}
//         />
//         <Button
//           children={"포스트"}
//           $buttonType="sub-select"
//           $selected={selectedButton === 1}
//           onClick={() => handleButtonClick(1)}
//         />
//       </ButtonContainer>

//       {/* 연도 및 월 선택 */}
//       <DateUtils
//         year={year}
//         month={month}
//         onYearMonthChange={handleYearMonthChange}
//       />

//       {/* 로딩 상태, 에러 메시지, 또는 결과 표시 */}
//       {loading ? (
//         <p>로딩 중...</p>
//       ) : error ? (
//         <p>{error}</p>
//       ) : (
//         <ScheduleTableView scheduleResults={scheduleResults} />
//       )}
//     </ScheduleTableContainer>
//   );
// };

// export default ScheduleTable;

import React, { useState } from "react";
import dayjs from "dayjs";
import ScheduleTableView from "./ScheduleTableView";
import useScheduleData from "./useScheduleData";
import Button from "../ui/Button";
import StatusMessage from "../ui/StatusMessage";
import { DateUtils } from "../../utils/DateUtils"; // DateUtils 컴포넌트를 가져옵니다.
import {
  ContentContainer,
  ContentTitle,
  SubCategoryContainer,
  SubContentContainer,
  HR,
} from "../../styles/CommonStyles";

const ScheduleTable = () => {
  const currentYear = dayjs().year(); // 현재 연도
  const currentMonth = dayjs().format("MM"); // 현재 월
  const [year, setYear] = useState(currentYear); // 현재 연도 상태
  const [month, setMonth] = useState(currentMonth); // 현재 월 상태
  const [season, setSeason] = useState("regular"); // 현재 시즌 상태
  const [selectedCategory, setSelectedCategory] = useState(0); // 선택된 카테고리 (0: 정규, 1: 포스트)

  // React-Query를 사용하여 데이터 가져오기
  const {
    data: scheduleResults,
    isLoading,
    error,
  } = useScheduleData(year, month, season);

  const handleYearMonthChange = (newYear, newMonth) => {
    setYear(newYear);
    setMonth(newMonth);
  };

  const handleButtonClick = (index) => {
    setSelectedCategory(index);
    const newSeason = index === 0 ? "regular" : "post";
    setSeason(newSeason);

    // 버튼 클릭 시 연도와 월을 현재 연도와 월로 초기화
    setYear(currentYear);
    setMonth(currentMonth);
  };

  const isEmptyData =
    !scheduleResults || Object.keys(scheduleResults).length === 0;

  return (
    <ContentContainer>
      <ContentTitle>일정</ContentTitle>

      <SubCategoryContainer>
        <Button
          children="정규"
          $buttonType="subCategory"
          $selected={selectedCategory === 0}
          onClick={() => handleButtonClick(0)}
        />
        <Button
          children="포스트"
          $buttonType="subCategory"
          $selected={selectedCategory === 1}
          onClick={() => handleButtonClick(1)}
        />
      </SubCategoryContainer>

      <SubContentContainer>
        <HR />
        <DateUtils
          year={year}
          month={month}
          onYearMonthChange={handleYearMonthChange}
          showMonth={true} // 월 선택 기능을 활성화합니다.
        />

        {isLoading || error ? (
          <StatusMessage
            loading={isLoading}
            error={error ? error.message || "오류가 발생했습니다." : ""}
            noData={isEmptyData ? "등록된 경기 일정이 없습니다." : null}
          />
        ) : (
          <ScheduleTableView scheduleResults={scheduleResults} />
        )}
      </SubContentContainer>
    </ContentContainer>
  );
};

export default ScheduleTable;
