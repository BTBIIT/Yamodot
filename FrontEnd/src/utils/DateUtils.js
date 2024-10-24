// import React from "react";
// import { AiOutlineCaretLeft, AiOutlineCaretRight } from "react-icons/ai";
// import dayjs from "dayjs";
// import "dayjs/locale/ko"; // 한글 요일을 사용하려면 locale 설정 필요

// dayjs.locale("ko");

// // 날짜 포맷 변환 함수
// export const formatDate = (dateString, format = "MM.DD (ddd)") => {
//   return dayjs(dateString).format(format);
// };

// // URL에 맞게 날짜 포맷 변환 함수
// export const formatDateForURL = (year, month, dayKey) => {
//   const day = dayKey.split(".")[1]; // '08.01(목)' -> '01'
//   return `${year}-${month}-${day}`; // 2024-08-01
// };

// // 요일을 한글로 반환하는 함수
// export const getKoreanDay = (dateString) => {
//   return dayjs(dateString).format("ddd"); // 요일을 한글로 반환
// };

// // DateUtils 컴포넌트
// const DateUtils = ({ year, month, onYearMonthChange, showMonth = false }) => {
//   // 이전 월 이동 버튼 핸들러
//   const handlePreviousMonth = () => {
//     if (!month) return;
//     const currentDate = dayjs(`${year}-${month}-01`);
//     const newDate = currentDate.subtract(1, "month");
//     onYearMonthChange(newDate.format("YYYY"), newDate.format("MM"));
//   };

//   // 다음 월 이동 버튼 핸들러
//   const handleNextMonth = () => {
//     if (!month) return;
//     const currentDate = dayjs(`${year}-${month}-01`);
//     const newDate = currentDate.add(1, "month");
//     onYearMonthChange(newDate.format("YYYY"), newDate.format("MM"));
//   };

//   return (
//     <div>
//       {showMonth && (
//         <AiOutlineCaretLeft
//           onClick={handlePreviousMonth}
//           style={{ cursor: "pointer" }}
//         />
//       )}
//       <select
//         value={year}
//         onChange={(e) => onYearMonthChange(e.target.value, month)}
//         style={{
//           border: "1px solid #eee",
//           padding: "5px 10px",
//           borderRadius: "5px",
//         }}
//       >
//         <option value="2022">2022</option>
//         <option value="2023">2023</option>
//         <option value="2024">2024</option>
//       </select>
//       {showMonth && (
//         <select
//           value={month}
//           onChange={(e) => onYearMonthChange(year, e.target.value)}
//           style={{
//             border: "1px solid #eee",
//             padding: "5px 10px",
//             borderRadius: "5px",
//           }}
//         >
//           {Array.from({ length: 12 }, (v, i) => i + 1).map((m) => (
//             <option key={m} value={m.toString().padStart(2, "0")}>
//               {m}월
//             </option>
//           ))}
//         </select>
//       )}
//       {showMonth && (
//         <AiOutlineCaretRight
//           onClick={handleNextMonth}
//           style={{ cursor: "pointer" }}
//         />
//       )}
//     </div>
//   );
// };

// export { DateUtils };

//##########################################################################################
import dayjs from "dayjs";
import "dayjs/locale/ko";
import React from "react";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import styled from "styled-components";

dayjs.locale("ko");

const StyleDateUtils = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;

  select {
    border: 1px solid #eee;
    padding: 5px 10px;
    border-radius: 5px;
    margin: 0 5px;
    cursor: pointer;
  }
`;

// 날짜 포맷 변환 함수 (기존)
export const formatDate = (dateString, format = "MM.DD (ddd)") => {
  return dayjs(dateString).format(format);
};

// Table에서 사용한 날짜 포맷 함수 추가
export const formatDateForTable = (dateString, includeTime = false) => {
  const date = dayjs(dateString);
  const formattedDate = date.format("YYYY-MM-DD");

  if (includeTime) {
    const formattedTime = date.format("HH:mm");
    return `${formattedDate} ${formattedTime}`;
  }

  return formattedDate;
};

// 이전/다음 월 또는 날짜 계산 함수
export const getSurroundingDates = (currentDate, availableDates) => {
  const currentDateString = dayjs(currentDate).format("YYYY-MM-DD");
  const currentIndex = availableDates.indexOf(currentDateString);

  const previousDate =
    currentIndex > 0 ? availableDates[currentIndex - 1] : null;
  const nextDate =
    currentIndex < availableDates.length - 1
      ? availableDates[currentIndex + 1]
      : null;

  return {
    previousDate,
    currentDate: currentDateString,
    nextDate,
  };
};

// DateUtils 컴포넌트
export const DateUtils = ({
  year,
  month,
  onYearMonthChange,
  showMonth = false,
}) => {
  const handlePreviousMonth = () => {
    if (!month) return;
    const currentDate = dayjs(`${year}-${month}-01`);
    const newDate = currentDate.subtract(1, "month");
    onYearMonthChange(newDate.format("YYYY"), newDate.format("MM"));
  };

  const handleNextMonth = () => {
    if (!month) return;
    const currentDate = dayjs(`${year}-${month}-01`);
    const newDate = currentDate.add(1, "month");
    onYearMonthChange(newDate.format("YYYY"), newDate.format("MM"));
  };

  return (
    <StyleDateUtils>
      <div>
        {showMonth && (
          <FaCaretLeft
            onClick={handlePreviousMonth}
            style={{ cursor: "pointer" }}
          />
        )}
      </div>
      <div>
        <select
          value={year}
          onChange={(e) => onYearMonthChange(e.target.value, month)}
        >
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>
      </div>
      <div>
        {showMonth && (
          <select
            value={month}
            onChange={(e) => onYearMonthChange(year, e.target.value)}
          >
            {Array.from({ length: 12 }, (v, i) => i + 1).map((m) => (
              <option key={m} value={m.toString().padStart(2, "0")}>
                {m}월
              </option>
            ))}
          </select>
        )}
      </div>
      <div>
        {showMonth && (
          <FaCaretRight
            onClick={handleNextMonth}
            style={{ cursor: "pointer" }}
          />
        )}
      </div>
    </StyleDateUtils>
  );
};
