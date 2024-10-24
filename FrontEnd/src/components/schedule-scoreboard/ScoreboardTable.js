// 0923 수정
// import React, { useEffect, useState } from "react";
// import styled from "styled-components";
// import MatchCard from "./MatchCard";
// import { AiOutlineCaretLeft, AiOutlineCaretRight } from "react-icons/ai";
// import { LuCalendarDays } from "react-icons/lu";
// import { Container } from "./CommonStyles";
// import axios from "axios";
// import DatePicker from "react-datepicker"; // 날짜 선택 라이브러리 추가
// import "react-datepicker/dist/react-datepicker.css"; // 스타일 추가

// //0924 수정
// import { useLocation } from "react-router-dom"; // 쿼리 파라미터를 가져오기 위한 훅

// const CalendarContainer = styled.div`
//   align-items: center;
//   margin-bottom: 20px;
//   display: flex;
// `;

// const ScoreboardTable = () => {
//   const [scoreboard, setScoreboard] = useState([]);
//   const [loading, setLoading] = useState(true);
//   // const [date, setDate] = useState(new Date("2024-08-13")); // Date 객체로 초기화
//   const [showCalendar, setShowCalendar] = useState(false); // 캘린더 표시 상태

//   //0924 수정
//   const location = useLocation(); // 쿼리 파라미터를 가져오기 위한 훅
//   const searchParams = new URLSearchParams(location.search);
//   const queryDate = searchParams.get("date");
//   // URL에서 받은 date 쿼리가 있으면 그 값을 사용, 없으면 현재 날짜로 초기화
//   const [date, setDate] = useState(
//     queryDate ? new Date(queryDate) : new Date()
//   );
//   // const [date, setDate] = useState(queryDate || new Date());

//   // 해당 날짜의 스코어보드를 불러오는 함수
//   useEffect(() => {
//     setLoading(true);
//     const apiUrl = `/api/scoreboard?date=${date.toISOString().split("T")[0]}`; // 날짜를 ISO 형식으로 변환
//     axios
//       .get(apiUrl)
//       .then((response) => {
//         console.log("Fetched scoreBoard:", response.data);
//         if (Array.isArray(response.data.scoreBoard)) {
//           setScoreboard(response.data.scoreBoard);
//         } else {
//           console.error("Scoreboard is not an array", response.data.scoreBoard);
//           setScoreboard([]);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//         setScoreboard([]);
//       })
//       .finally(() => setLoading(false));
//   }, [date]);

//   const handlePrevDate = () => {
//     setDate((prev) => {
//       const newDate = new Date(prev);
//       newDate.setDate(newDate.getDate() - 1);
//       return newDate;
//     });
//   };

//   const handleNextDate = () => {
//     setDate((next) => {
//       const newDate = new Date(next);
//       newDate.setDate(newDate.getDate() + 1);
//       return newDate;
//     });
//   };

//   const formatDate = (date) => {
//     // date가 Date 객체일 때만 getFullYear 메서드를 호출
//     if (!(date instanceof Date)) {
//       console.error("Invalid date:", date);
//       return "";
//     }

//     return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
//       2,
//       "0"
//     )}.${String(date.getDate()).padStart(2, "0")}(${
//       ["일", "월", "화", "수", "목", "금", "토"][date.getDay()]
//     })`;
//   };

//   return (
//     <Container style={{ marginTop: "150px" }}>
//       <div>
//         <h1>스코어 보드</h1>
//         <hr />
//         <CalendarContainer>
//           <AiOutlineCaretLeft
//             onClick={handlePrevDate}
//             style={{ cursor: "pointer" }}
//           />
//           <span
//             onClick={() => setShowCalendar(!showCalendar)}
//             style={{ cursor: "pointer" }}
//           >
//             {formatDate(date)}
//             <LuCalendarDays />
//           </span>
//           {showCalendar && (
//             <DatePicker
//               selected={date}
//               onChange={(date) => {
//                 setDate(date);
//                 setShowCalendar(false); // 날짜 선택 후 캘린더 닫기
//               }}
//               inline
//             />
//           )}
//           <AiOutlineCaretRight
//             onClick={handleNextDate}
//             style={{ cursor: "pointer" }}
//           />
//         </CalendarContainer>

//         <div>
//           {scoreboard.length === 0 ? (
//             <p>데이터가 없습니다.</p>
//           ) : (
//             scoreboard.map(
//               (match, index) => (
//                 console.log(match), (<MatchCard key={index} match={match} />)
//               )
//             )
//           )}
//         </div>
//       </div>
//     </Container>
//   );
// };

// export default ScoreboardTable;

// 0926 수정 완전체
// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import MatchCard from "./MatchCard";
// import StatusMessage from "../ui/StatusMessage";
// import { AiOutlineCaretLeft, AiOutlineCaretRight } from "react-icons/ai";
// import { LuCalendarDays } from "react-icons/lu";
// import { Container } from "../../styles/CommonStyles";
// import styled from "styled-components";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import dayjs from "dayjs"; // dayjs 임포트
// import localizedFormat from "dayjs/plugin/localizedFormat"; // localizedFormat 플러그인 임포트
// import "dayjs/locale/ko"; // 한국어 로케일 임포트

// // dayjs 설정
// dayjs.extend(localizedFormat);
// dayjs.locale("ko"); // 한국어 설정

// /* 스타일드 컴포넌트 */
// const CalendarContainer = styled.div`
//   align-items: center;
//   margin-bottom: 20px;
//   display: flex;
//   flex-direction: column; // 열 방향으로 설정
//   justify-content: center; // 중앙 정렬
// `;

// const DateButton = styled.span`
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   margin: 0 10px; // 날짜 버튼 간격 조정
// `;

// const StyledDatePicker = styled(DatePicker)`
//   .react-datepicker__header {
//     display: flex;
//     justify-content: center; // 년/월 버튼 중앙 정렬
//     align-items: center;
//   }

//   .react-datepicker__current-month {
//     font-size: 1.5rem; // 년/월 크기 조정
//   }

//   .react-datepicker__navigation {
//     top: 0.5rem; // 위쪽으로 간격 조정
//     height: 105px;
//   }
// `;

// const ScoreboardTable = () => {
//   const [scoreboard, setScoreboard] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [date, setDate] = useState(dayjs()); // dayjs 사용
//   const location = useLocation();
//   const navigate = useNavigate();

//   // 쿼리 파라미터로부터 날짜를 받아오는 함수
//   const getDateFromQuery = () => {
//     const query = new URLSearchParams(location.search);
//     const queryDate = query.get("date");
//     return queryDate ? dayjs(queryDate) : dayjs(); // 쿼리 파라미터가 없으면 현재 날짜 반환
//   };

//   // 해당 날짜의 스코어보드를 불러오는 함수
//   useEffect(() => {
//     const selectedDate = getDateFromQuery();
//     setDate(selectedDate); // 선택된 날짜로 업데이트
//     const apiUrl = `/api/scoreboard?date=${selectedDate.format("YYYY-MM-DD")}`; // dayjs 포맷 사용

//     axios
//       .get(apiUrl)
//       .then((response) => {
//         console.log("API Response:", response.data); // 응답 로그 추가
//         setScoreboard(response.data.scoreBoard);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//         setScoreboard([]); // 데이터가 없을 때도 scoreboard를 초기화
//       })
//       .finally(() => setLoading(false));
//   }, [location.search]);

//   // 날짜를 변경하면 URL의 쿼리 파라미터 업데이트
//   const handleDateChange = (newDate) => {
//     const formattedDate = newDate.format("YYYY-MM-DD"); // dayjs 포맷 사용
//     const newSearchParams = new URLSearchParams(location.search);
//     newSearchParams.set("date", formattedDate);
//     navigate({ search: newSearchParams.toString() });
//     setDate(newDate); // 선택된 날짜로 상태 업데이트
//   };

//   const handlePrevDate = () => {
//     const newDate = date.subtract(1, "day"); // dayjs 사용
//     handleDateChange(newDate); // 날짜 변경 시 URL 업데이트
//     setDate(newDate); // 상태 업데이트
//   };

//   const handleNextDate = () => {
//     const newDate = date.add(1, "day"); // dayjs 사용
//     handleDateChange(newDate); // 날짜 변경 시 URL 업데이트
//     setDate(newDate); // 상태 업데이트
//   };

//   // 날짜 포맷팅 함수
//   const formatDate = (date) => {
//     return date.format("YYYY.MM.DD (dd)"); // 요일을 짧은 형식으로 표기 (일, 월, 화)
//   };

//   return (
//     <Container style={{ marginTop: "150px" }}>
//       <h1>스코어 보드</h1>
//       <hr />
//       <CalendarContainer>
//         <div style={{ display: "flex", alignItems: "center" }}>
//           <AiOutlineCaretLeft
//             onClick={handlePrevDate}
//             style={{ cursor: "pointer" }}
//           />
//           <DateButton onClick={() => setShowCalendar(!showCalendar)}>
//             {formatDate(date)} {/* 포맷된 날짜 사용 */}
//             <LuCalendarDays />
//           </DateButton>
//           <AiOutlineCaretRight
//             onClick={handleNextDate}
//             style={{ cursor: "pointer" }}
//           />
//         </div>
//         {showCalendar && (
//           <StyledDatePicker
//             selected={date.toDate()} // DatePicker는 JavaScript Date 객체를 받으므로 변환
//             onChange={(date) => {
//               if (date) {
//                 handleDateChange(dayjs(date)); // dayjs로 변환
//                 setShowCalendar(false);
//               }
//             }}
//             inline
//             dateFormat="yyyy년 MM월" // 년월 포맷
//           />
//         )}
//       </CalendarContainer>
//       {/* 로딩, 에러 또는 데이터 없을 때 처리 */}
//       {loading ? (
//         <StatusMessage loading={loading} />
//       ) : scoreboard.length === 0 ? (
//         <StatusMessage noData="등록된 경기 일정이 없습니다." />
//       ) : (
//         scoreboard.map((match, index) => (
//           <MatchCard key={index} match={match} />
//         ))
//       )}
//     </Container>
//   );
// };

// export default ScoreboardTable;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import MatchCard from "./MatchCard";
import StatusMessage from "../ui/StatusMessage";
import { formatDate } from "../../utils/DateUtils";
import { AiOutlineCaretLeft, AiOutlineCaretRight } from "react-icons/ai";
import { LuCalendarDays } from "react-icons/lu";
import { useUser } from "../../contexts/UserContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/ko";

import styled from "styled-components";
import {
  ContentContainer,
  ContentTitle,
  SubContentContainer,
  HR,
} from "../../styles/CommonStyles";

// dayjs 설정
dayjs.extend(localizedFormat);
dayjs.locale("ko");

const CalendarContainer = styled.div`
  align-items: center;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const DateButton = styled.span`
  cursor: pointer;
  display: flex;
  align-items: center;
  margin: 0 10px;
`;

const StyledDatePicker = styled(DatePicker)`
  .react-datepicker__header {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .react-datepicker__current-month {
    font-size: 1.5rem;
  }

  .react-datepicker__day--outside-month {
    cursor: default;
    visibility: hidden;
  }

  .react-datepicker__navigation {
    top: 0.5rem;
    height: 105px;
  }
`;

const ScoreboardTable = () => {
  const { user } = useUser(); // 유저 정보에서 선호 구단을 가져옴
  const userFavoriteTeam = user?.userFavoriteTeam || null; // 선호 구단이 없을 수도 있으므로 기본값 처리
  const [scoreboard, setScoreboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState(dayjs()); // 현재 날짜로 초기화
  const location = useLocation();
  const navigate = useNavigate();

  const formatScoreboardDate = (date) => formatDate(date, "YYYY.MM.DD (ddd)");

  // 쿼리 파라미터로부터 날짜를 받아오는 함수
  const getDateFromQuery = () => {
    const query = new URLSearchParams(location.search);
    const queryDate = query.get("date");
    return queryDate ? dayjs(queryDate) : null; // 쿼리 파라미터가 없으면 null 반환
  };

  // 해당 날짜의 스코어보드를 불러오는 함수
  useEffect(() => {
    console.log("User's favorite team:", userFavoriteTeam);
    const selectedDate = getDateFromQuery() || dayjs(); // 쿼리 파라미터가 없으면 현재 날짜 사용
    setDate(selectedDate); // 선택된 날짜로 업데이트
    const apiUrl = `/api/scoreboard?date=${selectedDate.format("YYYY-MM-DD")}`;

    axios
      .get(apiUrl, { withCredentials: true })
      .then((response) => {
        const fetchedScoreboard = response.data.scoreBoard;
        if (userFavoriteTeam) {
          // 선호 구단 경기를 먼저 정렬
          const sortedScoreboard = fetchedScoreboard.sort((a, b) => {
            const aIsFavorite =
              a.awayTeam === userFavoriteTeam ||
              a.homeTeam === userFavoriteTeam;
            const bIsFavorite =
              b.awayTeam === userFavoriteTeam ||
              b.homeTeam === userFavoriteTeam;
            if (aIsFavorite && !bIsFavorite) return -1;
            if (!aIsFavorite && bIsFavorite) return 1;
            return 0; // 선호 구단이 없으면 기존 순서 유지
          });
          setScoreboard(sortedScoreboard);
          console.log("Sorted scoreboard:", sortedScoreboard);
        } else {
          setScoreboard(fetchedScoreboard);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setScoreboard([]);
      })
      .finally(() => setLoading(false));
  }, [location.search, userFavoriteTeam]);

  const handleDateChange = (newDate) => {
    const formattedDate = newDate.format("YYYY-MM-DD");
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set("date", formattedDate);
    navigate({ search: newSearchParams.toString() });
    setDate(newDate);
  };

  const handlePrevDate = () => {
    const newDate = date.subtract(1, "day");
    handleDateChange(newDate);
    setDate(newDate);
  };

  const handleNextDate = () => {
    const newDate = date.add(1, "day");
    handleDateChange(newDate);
    setDate(newDate);
  };

  return (
    <ContentContainer>
      <ContentTitle>스코어 보드</ContentTitle>

      <SubContentContainer>
        <HR />
        <CalendarContainer>
          <div style={{ display: "flex", alignItems: "center" }}>
            <AiOutlineCaretLeft
              onClick={handlePrevDate}
              style={{ cursor: "pointer" }}
            />
            <DateButton onClick={() => setShowCalendar(!showCalendar)}>
              {formatScoreboardDate(date)} {/* 포맷된 날짜 사용 */}
              <LuCalendarDays />
            </DateButton>
            <AiOutlineCaretRight
              onClick={handleNextDate}
              style={{ cursor: "pointer" }}
            />
          </div>
          {showCalendar && (
            <StyledDatePicker
              selected={date.toDate()} // DatePicker는 JavaScript Date 객체를 받으므로 변환
              onChange={(date) => {
                if (date) {
                  handleDateChange(dayjs(date)); // dayjs로 변환
                  setShowCalendar(false);
                }
              }}
              inline
            />
          )}
        </CalendarContainer>
        {loading ? (
          <StatusMessage loading={loading} />
        ) : scoreboard.length === 0 ? (
          <StatusMessage noData="등록된 경기 일정이 없습니다." />
        ) : (
          scoreboard.map((match, index) => (
            <MatchCard key={index} match={match} />
          ))
        )}
      </SubContentContainer>
    </ContentContainer>
  );
};

export default ScoreboardTable;
