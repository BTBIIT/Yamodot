// // 1002
// import React, { useCallback, useMemo, useState, useEffect } from "react";
// import dayjs from "dayjs";
// import { DateNavContainer } from "../../styles/CommonStyles";

// const formatDateWithDay = (date) => {
//   const days = ["일", "월", "화", "수", "목", "금", "토"];
//   const dayOfWeek = days[dayjs(date).day()];
//   return `${dayjs(date).format("YYYY.MM.DD")}(${dayOfWeek})`;
// };

// const DateNavigationBar = ({ currentDate, onDateChange, availableDates }) => {
//   const [noMoreGames, setNoMoreGames] = useState(false);

//   useEffect(() => {
//     // 현재 날짜에 경기가 없으면 가장 가까운 미래의 경기가 있는 날로 설정
//     if (!availableDates.includes(dayjs(currentDate).format("YYYY.MM.DD"))) {
//       const nextAvailableDate = availableDates.find((date) =>
//         dayjs(date).isAfter(dayjs(currentDate))
//       );
//       if (nextAvailableDate) {
//         onDateChange(new Date(nextAvailableDate));
//       }
//     }
//   }, [currentDate, availableDates, onDateChange]);

//   const getNextDate = useCallback((date) => {
//     return dayjs(date).add(1, "day").format("YYYY.MM.DD");
//   }, []);

//   const getPreviousDate = useCallback((date) => {
//     return dayjs(date).subtract(1, "day").format("YYYY.MM.DD");
//   }, []);

//   // 가장 가까운 미래의 경기 날짜를 찾습니다
//   const findNextAvailableDate = useCallback(
//     (date) => {
//       let nextDate = getNextDate(date);
//       while (
//         dayjs(nextDate).isBefore(
//           dayjs(availableDates[availableDates.length - 1]),
//           "day"
//         )
//       ) {
//         if (availableDates.includes(nextDate)) {
//           return nextDate;
//         }
//         nextDate = getNextDate(nextDate);
//       }
//       return null;
//     },
//     [availableDates, getNextDate]
//   );

//   // 가장 가까운 과거의 경기 날짜를 찾습니다
//   const findPreviousAvailableDate = useCallback(
//     (date) => {
//       let previousDate = getPreviousDate(date);
//       while (dayjs(previousDate).isAfter(dayjs(availableDates[0]), "day")) {
//         if (availableDates.includes(previousDate)) {
//           return previousDate;
//         }
//         previousDate = getPreviousDate(previousDate);
//       }
//       return null;
//     },
//     [availableDates, getPreviousDate]
//   );

//   const handleNextDate = () => {
//     const nextDate = findNextAvailableDate(
//       dayjs(currentDate).format("YYYY.MM.DD")
//     );
//     if (nextDate) {
//       onDateChange(new Date(nextDate));
//       setNoMoreGames(false);
//     } else {
//       alert("이후 등록된 경기가 없습니다.");
//       setNoMoreGames(true);
//     }
//   };

//   const handlePreviousDate = () => {
//     const prevDate = findPreviousAvailableDate(
//       dayjs(currentDate).format("YYYY.MM.DD")
//     );
//     if (prevDate) {
//       onDateChange(new Date(prevDate));
//     } else {
//       alert("이전 등록된 경기가 없습니다.");
//     }
//   };

//   // 지정된 범위만큼 날짜 목록 생성
//   const visibleDates = useMemo(() => {
//     const pastCount = 1; // 과거 날짜를 몇 개 표시할지 설정
//     const futureCount = 1; // 미래 날짜를 몇 개 표시할지 설정
//     const currentFormatted = dayjs(currentDate).format("YYYY.MM.DD");

//     const pastDates = [];
//     let tempDate = currentFormatted;
//     for (let i = 0; i < pastCount; i++) {
//       tempDate = findPreviousAvailableDate(tempDate);
//       if (tempDate) pastDates.unshift(tempDate);
//     }

//     const futureDates = [];
//     tempDate = currentFormatted;
//     for (let i = 0; i < futureCount; i++) {
//       tempDate = findNextAvailableDate(tempDate);
//       if (tempDate) futureDates.push(tempDate);
//     }

//     return [...pastDates, currentFormatted, ...futureDates];
//   }, [currentDate, findPreviousAvailableDate, findNextAvailableDate]);

//   return (
//     <DateNavContainer>
//       <button onClick={handlePreviousDate}>&lt;</button>
//       <ul>
//         {visibleDates.map((dateString, index) => {
//           const date = new Date(dateString);
//           return (
//             <li key={index}>
//               <button
//                 className={
//                   dayjs(date).isSame(dayjs(currentDate), "day") ? "active" : ""
//                 }
//                 onClick={() => onDateChange(date)}
//               >
//                 {formatDateWithDay(date)}
//               </button>
//             </li>
//           );
//         })}
//       </ul>
//       <button onClick={handleNextDate}>&gt;</button>
//     </DateNavContainer>
//   );
// };

// export default DateNavigationBar;

//#############################################################################################################################################
//#############################################################################################################################################
// 1003
// import React, { useCallback, useMemo, useState, useEffect } from "react";
// import dayjs from "dayjs";
// import { DateNavContainer } from "../../styles/CommonStyles";

// const formatDateWithDay = (date) => {
//   // 요일을 한글로 출력
//   const days = ["일", "월", "화", "수", "목", "금", "토"];
//   const dayOfWeek = days[dayjs(date).day()];
//   // 날짜를 'YYYY.MM.DD(요일)' 형식으로 반환
//   return `${dayjs(date).format("YYYY-MM-DD")}(${dayOfWeek})`;
// };

// const DateNavigationBar = ({ currentDate, onDateChange, availableDates }) => {
//   const [noMoreGames, setNoMoreGames] = useState(false);

//   // availableDates가 정의되지 않았거나 비어있는 경우 처리
//   useEffect(() => {
//     if (!availableDates || availableDates.length === 0) {
//       console.error("유효한 경기가 없습니다.");
//       return;
//     }

//     // 현재 날짜에 경기가 없으면 가장 가까운 미래의 경기가 있는 날로 설정
//     if (!availableDates.includes(dayjs(currentDate).format("YYYY-MM-DD"))) {
//       const nextAvailableDate = availableDates.find((date) =>
//         dayjs(date).isAfter(dayjs(currentDate))
//       );
//       if (nextAvailableDate) {
//         onDateChange(new Date(nextAvailableDate));
//       } else {
//         console.log("이후 등록된 경기가 없습니다.");
//       }
//     }
//   }, [currentDate, availableDates, onDateChange]);

//   // 다음 날짜를 구하는 함수
//   const getNextDate = useCallback((date) => {
//     return dayjs(date).add(1, "day").format("YYYY-MM-DD");
//   }, []);

//   // 이전 날짜를 구하는 함수
//   const getPreviousDate = useCallback((date) => {
//     return dayjs(date).subtract(1, "day").format("YYYY-MM-DD");
//   }, []);

//   // 가장 가까운 미래의 경기 날짜 찾기
//   const findNextAvailableDate = useCallback(
//     (date) => {
//       if (!availableDates || availableDates.length === 0) return null; // availableDates가 비어있는 경우

//       let nextDate = getNextDate(date);
//       while (
//         dayjs(nextDate).isBefore(
//           dayjs(availableDates[availableDates.length - 1]),
//           "day"
//         )
//       ) {
//         if (availableDates.includes(nextDate)) {
//           return nextDate;
//         }
//         nextDate = getNextDate(nextDate);
//       }
//       return null;
//     },
//     [availableDates, getNextDate]
//   );

//   // 가장 가까운 과거의 경기 날짜 찾기
//   const findPreviousAvailableDate = useCallback(
//     (date) => {
//       if (!availableDates || availableDates.length === 0) return null; // availableDates가 비어있는 경우

//       let previousDate = getPreviousDate(date);
//       while (dayjs(previousDate).isAfter(dayjs(availableDates[0]), "day")) {
//         if (availableDates.includes(previousDate)) {
//           return previousDate;
//         }
//         previousDate = getPreviousDate(previousDate);
//       }
//       return null;
//     },
//     [availableDates, getPreviousDate]
//   );

//   // 다음 날짜 버튼 클릭 핸들러
//   const handleNextDate = () => {
//     const nextDate = findNextAvailableDate(
//       dayjs(currentDate).format("YYYY-MM-DD")
//     );
//     if (nextDate) {
//       onDateChange(new Date(nextDate));
//       setNoMoreGames(false);
//     } else {
//       alert("이후 등록된 경기가 없습니다.");
//       setNoMoreGames(true);
//     }
//   };

//   // 이전 날짜 버튼 클릭 핸들러
//   const handlePreviousDate = () => {
//     const prevDate = findPreviousAvailableDate(
//       dayjs(currentDate).format("YYYY-MM-DD")
//     );
//     if (prevDate) {
//       onDateChange(new Date(prevDate));
//     } else {
//       alert("이전 등록된 경기가 없습니다.");
//     }
//   };

//   // 지정된 범위만큼 날짜 목록 생성
//   const visibleDates = useMemo(() => {
//     if (!availableDates || availableDates.length === 0) return []; // availableDates가 비어있는 경우 빈 배열 반환

//     const pastCount = 1; // 과거 경기일 1개
//     const futureCount = 1; // 미래 경기일 1개
//     const currentFormatted = dayjs(currentDate).format("YYYY-MM-DD");

//     const pastDates = [];
//     let tempDate = currentFormatted;
//     for (let i = 0; i < pastCount; i++) {
//       tempDate = findPreviousAvailableDate(tempDate);
//       if (tempDate) pastDates.unshift(tempDate);
//     }

//     const futureDates = [];
//     tempDate = currentFormatted;
//     for (let i = 0; i < futureCount; i++) {
//       tempDate = findNextAvailableDate(tempDate);
//       if (tempDate) futureDates.push(tempDate);
//     }

//     return [...pastDates, currentFormatted, ...futureDates];
//   }, [currentDate, findPreviousAvailableDate, findNextAvailableDate]);

//   return (
//     <DateNavContainer>
//       <button onClick={handlePreviousDate}>&lt;</button>
//       <ul>
//         {visibleDates.map((dateString, index) => {
//           const date = new Date(dateString);
//           return (
//             <li key={index}>
//               <button
//                 className={
//                   dayjs(date).isSame(dayjs(currentDate), "day") ? "active" : ""
//                 }
//                 onClick={() => onDateChange(date)}
//               >
//                 {formatDateWithDay(date)}
//               </button>
//             </li>
//           );
//         })}
//       </ul>
//       <button onClick={handleNextDate}>&gt;</button>
//     </DateNavContainer>
//   );
// };

// export default DateNavigationBar;

// ####################################################################################################################
// ####################################################################################################################
// import React, { useCallback, useMemo, useEffect } from "react";
// import dayjs from "dayjs";
// import { DateNavContainer } from "../../styles/CommonStyles";

// const formatDateWithDay = (date) => {
//   const days = ["일", "월", "화", "수", "목", "금", "토"];
//   const dayOfWeek = days[dayjs(date).day()];
//   return `${dayjs(date).format("YYYY.MM.DD")}(${dayOfWeek})`;
// };

// const DateNavigationBar = ({
//   currentDate,
//   onDateChange,
//   availableDates,
//   visibleDates,
// }) => {
//   useEffect(() => {
//     if (!availableDates || availableDates.length === 0) return;

//     if (!availableDates.includes(dayjs(currentDate).format("YYYY-MM-DD"))) {
//       const nextAvailableDate = availableDates.find((date) =>
//         dayjs(date).isAfter(dayjs(currentDate))
//       );
//       if (nextAvailableDate) {
//         onDateChange(new Date(nextAvailableDate));
//       }
//     }
//   }, [currentDate, availableDates, onDateChange]);

//   const handleNextDate = () => {
//     const nextDate = visibleDates.find((date) =>
//       dayjs(date).isAfter(dayjs(currentDate))
//     );
//     if (nextDate) {
//       onDateChange(new Date(nextDate));
//     }
//   };

//   const handlePreviousDate = () => {
//     const prevDate = visibleDates
//       .slice()
//       .reverse()
//       .find((date) => dayjs(date).isBefore(dayjs(currentDate)));
//     if (prevDate) {
//       onDateChange(new Date(prevDate));
//     }
//   };

//   return (
//     <DateNavContainer>
//       <button onClick={handlePreviousDate}>&lt;</button>
//       <ul>
//         {visibleDates.map((dateString, index) => {
//           const date = new Date(dateString);
//           return (
//             <li key={index}>
//               <button
//                 className={
//                   dayjs(date).isSame(dayjs(currentDate), "day") ? "active" : ""
//                 }
//                 onClick={() => onDateChange(date)}
//               >
//                 {formatDateWithDay(date)}
//               </button>
//             </li>
//           );
//         })}
//       </ul>
//       <button onClick={handleNextDate}>&gt;</button>
//     </DateNavContainer>
//   );
// };

// export default DateNavigationBar;

//#######################################################################################
//#######################################################################################
//#######################################################################################
// import React from "react";
// import { DateNavContainer } from "../../styles/CommonStyles";

// const formatDateWithDay = (date) => {
//   const days = ["일", "월", "화", "수", "목", "금", "토"];
//   const dayOfWeek = days[date.getDay()];
//   return `${date.getFullYear()}.${(date.getMonth() + 1)
//     .toString()
//     .padStart(2, "0")}.${date
//     .getDate()
//     .toString()
//     .padStart(2, "0")}(${dayOfWeek})`;
// };

// const DateNavigationBar = ({ currentDate, onDateChange, availableDates }) => {
//   const getNextDate = (date) => {
//     const nextDate = new Date(date);
//     nextDate.setDate(nextDate.getDate() + 1);
//     return nextDate;
//   };

//   const getPreviousDate = (date) => {
//     const previousDate = new Date(date);
//     previousDate.setDate(previousDate.getDate() - 1);
//     return previousDate;
//   };

//   const findNextAvailableDate = (date) => {
//     let nextDate = getNextDate(date);
//     while (availableDates.includes(nextDate.toISOString().split("T")[0])) {
//       return nextDate;
//     }
//     return null; // 더 이상 가능한 날짜가 없으면 null 반환
//   };

//   const findPreviousAvailableDate = (date) => {
//     let previousDate = getPreviousDate(date);
//     while (availableDates.includes(previousDate.toISOString().split("T")[0])) {
//       return previousDate;
//     }
//     return null; // 더 이상 가능한 날짜가 없으면 null 반환
//   };

//   const handlePreviousDate = () => {
//     const prevDate = findPreviousAvailableDate(currentDate);
//     if (prevDate) {
//       onDateChange(prevDate);
//     }
//   };

//   const handleNextDate = () => {
//     const nextDate = findNextAvailableDate(currentDate);
//     if (nextDate) {
//       onDateChange(nextDate);
//     }
//   };

//   return (
//     <DateNavContainer>
//       <button onClick={handlePreviousDate}>&lt;</button>
//       <ul>
//         {availableDates.map((dateString, index) => {
//           const date = new Date(dateString);
//           return (
//             <li key={index}>
//               <button
//                 className={
//                   date.getTime() === currentDate.getTime() ? "active" : ""
//                 }
//                 onClick={() => onDateChange(date)}
//               >
//                 {formatDateWithDay(date)}
//               </button>
//             </li>
//           );
//         })}
//       </ul>
//       <button onClick={handleNextDate}>&gt;</button>
//     </DateNavContainer>
//   );
// };

// export default DateNavigationBar;

// 1004 2차
// import React from "react";
// import { DateNavContainer } from "../../styles/CommonStyles";

// const formatDateWithDay = (date) => {
//   const days = ["일", "월", "화", "수", "목", "금", "토"];
//   const dayOfWeek = days[date.getDay()];
//   return `${date.getFullYear()}.${(date.getMonth() + 1)
//     .toString()
//     .padStart(2, "0")}.${date
//     .getDate()
//     .toString()
//     .padStart(2, "0")}(${dayOfWeek})`;
// };

// const DateNavigationBar = ({ currentDate, onDateChange, availableDates }) => {
//   // 다음 가능한 날짜 찾기 함수 수정
//   const findNextAvailableDate = (date) => {
//     let nextDate = new Date(date);
//     while (true) {
//       nextDate.setDate(nextDate.getDate() + 1); // 하루씩 증가
//       const nextDateString = nextDate.toISOString().split("T")[0];
//       if (availableDates.includes(nextDateString)) {
//         return nextDate;
//       }
//       // 반복문이 너무 많이 실행되지 않도록 안전 장치
//       if (nextDate.getFullYear() > 2100) {
//         return null; // 가능한 날짜가 더 이상 없으면 null 반환
//       }
//     }
//   };

//   // 이전 가능한 날짜 찾기 함수 수정
//   const findPreviousAvailableDate = (date) => {
//     let previousDate = new Date(date);
//     while (true) {
//       previousDate.setDate(previousDate.getDate() - 1); // 하루씩 감소
//       const prevDateString = previousDate.toISOString().split("T")[0];
//       if (availableDates.includes(prevDateString)) {
//         return previousDate;
//       }
//       // 반복문이 너무 많이 실행되지 않도록 안전 장치
//       if (previousDate.getFullYear() < 1900) {
//         return null; // 가능한 날짜가 더 이상 없으면 null 반환
//       }
//     }
//   };

//   const handlePreviousDate = () => {
//     const prevDate = findPreviousAvailableDate(currentDate);
//     if (prevDate) {
//       onDateChange(prevDate);
//     }
//   };

//   const handleNextDate = () => {
//     const nextDate = findNextAvailableDate(currentDate);
//     if (nextDate) {
//       onDateChange(nextDate);
//     }
//   };

//   return (
//     <DateNavContainer>
//       <button onClick={handlePreviousDate}>&lt;</button>
//       <ul>
//         {availableDates.slice(0, 3).map((dateString, index) => {
//           const date = new Date(dateString);
//           return (
//             <li key={index}>
//               <button
//                 className={
//                   date.getTime() === currentDate.getTime() ? "active" : ""
//                 }
//                 onClick={() => onDateChange(date)}
//               >
//                 {formatDateWithDay(date)}
//               </button>
//             </li>
//           );
//         })}
//       </ul>
//       <button onClick={handleNextDate}>&gt;</button>
//     </DateNavContainer>
//   );
// };

// export default DateNavigationBar;

// 1004 3차
// import React from "react";
// import dayjs from "dayjs";
// import { DateNavContainer } from "../../styles/CommonStyles";

// const formatDateWithDay = (date) => {
//   const days = ["일", "월", "화", "수", "목", "금", "토"];
//   const dayOfWeek = days[dayjs(date).day()];
//   return `${dayjs(date).format("YYYY.MM.DD")}(${dayOfWeek})`;
// };

// const DateNavigationBar = ({ currentDate, onDateChange, availableDates }) => {
//   // 선택된 날짜 기준으로 이전 날짜와 다음 날짜를 찾는 함수
//   const getSurroundingDates = (currentDate, availableDates) => {
//     const currentDateString = currentDate.toISOString().split("T")[0];
//     const currentIndex = availableDates.indexOf(currentDateString);

//     // 현재 날짜의 인덱스를 기준으로 이전, 현재, 이후 날짜를 반환
//     const previousDate = availableDates[currentIndex - 1] || null;
//     const nextDate = availableDates[currentIndex + 1] || null;

//     return {
//       previousDate,
//       currentDate: currentDateString,
//       nextDate,
//     };
//   };

//   const { previousDate, nextDate } = getSurroundingDates(
//     currentDate,
//     availableDates
//   );

//   const handlePreviousDate = () => {
//     if (previousDate) {
//       onDateChange(new Date(previousDate));
//     }
//   };

//   const handleNextDate = () => {
//     if (nextDate) {
//       onDateChange(new Date(nextDate));
//     }
//   };

//   return (
//     <DateNavContainer>
//       <button onClick={handlePreviousDate} disabled={!previousDate}>
//         &lt;
//       </button>
//       <ul>
//         {previousDate && (
//           <li>
//             <button onClick={() => onDateChange(new Date(previousDate))}>
//               {formatDateWithDay(new Date(previousDate))}
//             </button>
//           </li>
//         )}
//         <li>
//           <button className="active">{formatDateWithDay(currentDate)}</button>
//         </li>
//         {nextDate && (
//           <li>
//             <button onClick={() => onDateChange(new Date(nextDate))}>
//               {formatDateWithDay(new Date(nextDate))}
//             </button>
//           </li>
//         )}
//       </ul>
//       <button onClick={handleNextDate} disabled={!nextDate}>
//         &gt;
//       </button>
//     </DateNavContainer>
//   );
// };

// export default DateNavigationBar;

// 1004 4차
// import React from "react";
// import dayjs from "dayjs";
// import { DateNavContainer } from "../../styles/CommonStyles";

// const formatDateWithDay = (date) => {
//   const days = ["일", "월", "화", "수", "목", "금", "토"];
//   const dayOfWeek = days[dayjs(date).day()];
//   return `${dayjs(date).format("YYYY.MM.DD")}(${dayOfWeek})`;
// };

// const DateNavigationBar = ({ currentDate, onDateChange, availableDates }) => {
//   // 선택된 날짜 기준으로 이전 날짜와 다음 날짜를 찾는 함수
//   const getSurroundingDates = (currentDate, availableDates) => {
//     const currentDateString = dayjs(currentDate).format("YYYY-MM-DD");
//     const currentIndex = availableDates.indexOf(currentDateString);

//     // 현재 날짜의 인덱스를 기준으로 이전, 현재, 이후 날짜를 반환
//     const previousDate =
//       currentIndex > 0 ? availableDates[currentIndex - 1] : null;
//     const nextDate =
//       currentIndex < availableDates.length - 1
//         ? availableDates[currentIndex + 1]
//         : null; // 마지막 날짜일 경우 null로 반환

//     return {
//       previousDate,
//       currentDate: currentDateString,
//       nextDate,
//     };
//   };

//   // currentDate와 availableDates를 기반으로 surrounding dates를 가져옴
//   const { previousDate, nextDate } = getSurroundingDates(
//     currentDate,
//     availableDates
//   );

//   const handlePreviousDate = () => {
//     if (previousDate) {
//       onDateChange(dayjs(previousDate).toDate());
//     } else {
//       alert("이전 등록된 경기가 없습니다.");
//     }
//   };

//   const handleNextDate = () => {
//     if (nextDate) {
//       onDateChange(dayjs(nextDate).toDate());
//     } else {
//       alert("이후 등록된 경기가 없습니다."); // 마지막 날짜일 경우 경고 메시지
//     }
//   };

//   return (
//     <DateNavContainer>
//       <button onClick={handlePreviousDate} disabled={!previousDate}>
//         &lt;
//       </button>
//       <ul>
//         {previousDate && (
//           <li>
//             <button onClick={() => onDateChange(dayjs(previousDate).toDate())}>
//               {formatDateWithDay(previousDate)}
//             </button>
//           </li>
//         )}
//         <li>
//           <button className="active">{formatDateWithDay(currentDate)}</button>
//         </li>
//         {nextDate && (
//           <li>
//             <button onClick={() => onDateChange(dayjs(nextDate).toDate())}>
//               {formatDateWithDay(nextDate)}
//             </button>
//           </li>
//         )}
//       </ul>
//       <button onClick={handleNextDate} disabled={!nextDate}>
//         &gt;
//       </button>
//     </DateNavContainer>
//   );
// };

// export default DateNavigationBar;

// 1006 사용중이었음
// import React, { useCallback } from "react";
// import dayjs from "dayjs";
// import { DateNavContainer } from "../../styles/CommonStyles";

// const formatDateWithDay = (date) => {
//   const days = ["일", "월", "화", "수", "목", "금", "토"];
//   const dayOfWeek = days[dayjs(date).day()];
//   return `${dayjs(date).format("YYYY.MM.DD")}(${dayOfWeek})`;
// };

// const DateNavigationBar = ({ currentDate, onDateChange, availableDates }) => {
//   // 선택된 날짜 기준으로 이전 날짜와 다음 날짜를 찾는 함수
//   const getSurroundingDates = useCallback((currentDate, availableDates) => {
//     const currentDateString = dayjs(currentDate).format("YYYY-MM-DD");
//     const currentIndex = availableDates.indexOf(currentDateString);

//     // 현재 날짜의 인덱스를 기준으로 이전, 현재, 이후 날짜를 반환
//     const previousDate =
//       currentIndex > 0 ? availableDates[currentIndex - 1] : null;
//     const nextDate =
//       currentIndex < availableDates.length - 1
//         ? availableDates[currentIndex + 1]
//         : null; // 마지막 날짜일 경우 null로 반환

//     return {
//       previousDate,
//       currentDate: currentDateString,
//       nextDate,
//     };
//   }, []);

//   // currentDate와 availableDates를 기반으로 surrounding dates를 가져옴
//   const { previousDate, nextDate } = getSurroundingDates(
//     currentDate,
//     availableDates
//   );

//   const handlePreviousDate = useCallback(() => {
//     if (previousDate) {
//       onDateChange(dayjs(previousDate).toDate());
//     } else {
//       alert("이전 등록된 경기가 없습니다.");
//     }
//   }, [previousDate, onDateChange]);

//   const handleNextDate = useCallback(() => {
//     if (nextDate) {
//       onDateChange(dayjs(nextDate).toDate());
//     } else {
//       alert("이후 등록된 경기가 없습니다."); // 마지막 날짜일 경우 경고 메시지
//     }
//   }, [nextDate, onDateChange]);

//   return (
//     <DateNavContainer>
//       <button onClick={handlePreviousDate} disabled={!previousDate}>
//         &lt;
//       </button>
//       <ul>
//         {previousDate && (
//           <li>
//             <button onClick={() => onDateChange(dayjs(previousDate).toDate())}>
//               {formatDateWithDay(previousDate)}
//             </button>
//           </li>
//         )}
//         <li>
//           <button className="active">{formatDateWithDay(currentDate)}</button>
//         </li>
//         {nextDate && (
//           <li>
//             <button onClick={() => onDateChange(dayjs(nextDate).toDate())}>
//               {formatDateWithDay(nextDate)}
//             </button>
//           </li>
//         )}
//       </ul>
//       <button onClick={handleNextDate} disabled={!nextDate}>
//         &gt;
//       </button>
//     </DateNavContainer>
//   );
// };

// export default DateNavigationBar;

//###########################################################################################
import React, { useCallback } from "react";
import dayjs from "dayjs";
import { DateNavContainer } from "../../styles/CommonStyles";
import { formatDate, getSurroundingDates } from "../../utils/DateUtils";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

const DateNavigationBar = ({ currentDate, onDateChange, availableDates }) => {
  const { previousDate, nextDate } = getSurroundingDates(
    currentDate,
    availableDates
  );

  const handlePreviousDate = useCallback(() => {
    if (previousDate) {
      onDateChange(dayjs(previousDate).toDate());
    } else {
      alert("이전 등록된 경기가 없습니다.");
    }
  }, [previousDate, onDateChange]);

  const handleNextDate = useCallback(() => {
    if (nextDate) {
      onDateChange(dayjs(nextDate).toDate());
    } else {
      alert("이후 등록된 경기가 없습니다.");
    }
  }, [nextDate, onDateChange]);

  return (
    <DateNavContainer>
      <LuChevronLeft onClick={handlePreviousDate} disabled={!previousDate} />

      <ul>
        {previousDate && (
          <li>
            <button onClick={() => onDateChange(dayjs(previousDate).toDate())}>
              {formatDate(previousDate, "YYYY.MM.DD(ddd)")}
            </button>
          </li>
        )}
        <li>
          <button className="active">
            {formatDate(currentDate, "YYYY.MM.DD(ddd)")}
          </button>
        </li>
        {nextDate && (
          <li>
            <button onClick={() => onDateChange(dayjs(nextDate).toDate())}>
              {formatDate(nextDate, "YYYY.MM.DD(ddd)")}
            </button>
          </li>
        )}
      </ul>

      <LuChevronRight onClick={handleNextDate} disabled={!nextDate} />
    </DateNavContainer>
  );
};

export default DateNavigationBar;
