// import React, { useState, useEffect, useCallback } from "react";
// import CarouselSection from "./CarouselSection";
// import ScheduleBoxes from "../schedule-scoreboard/ScheduleBoxes";
// import DateNavigationBar from "./DateNavigationBar";
// import axios from "axios";
// import dayjs from "dayjs";
// import {
//   ScheduleSectionContainer,
//   LinkContainer,
// } from "../../styles/CommonStyles";

// const ScheduleSection = () => {
//   const [currentDate, setCurrentDate] = useState(dayjs().toDate());
//   const [availableDates, setAvailableDates] = useState([]);
//   const [scheduleResults, setScheduleResults] = useState([]);
//   const [userFavioriteTeam, setUserFavioriteTeam] = useState(""); // 선호 팀 상태 추가

//   // 선호 팀을 로컬 스토리지 또는 API에서 불러오는 함수
//   useEffect(() => {
//     const storedPreferredTeam = localStorage.getItem("userFavioriteTeam"); // 로컬 스토리지에서 불러오기
//     if (storedPreferredTeam) {
//       setUserFavioriteTeam(storedPreferredTeam);
//     } else {
//       setUserFavioriteTeam(""); // 기본값 설정 (선호팀이 없을 경우)
//     }
//   }, []);

//   // API에서 스케줄 데이터를 가져와 가능한 날짜들을 추출하는 함수
//   const fetchAvailableDates = useCallback(async () => {
//     try {
//       const response = await axios.get(`/api/mainschedule?date`);
//       const scheduleData = response.data.mainSchedule || [];

//       // 가능한 날짜 추출
//       const uniqueDates = [
//         ...new Set(scheduleData.map((game) => game.gameDate)),
//       ];

//       console.log("API로부터 가능한 날짜들:", uniqueDates); // 로그로 출력

//       setAvailableDates(uniqueDates); // 상태 업데이트
//     } catch (error) {
//       console.error(
//         "가능한 날짜 가져오기 오류:",
//         error.response?.data || error.message
//       );
//       setAvailableDates([]); // 오류 발생 시 빈 배열로 설정
//     }
//   }, []);

//   // 선택된 날짜에 대한 스케줄 데이터를 가져오는 함수
//   const fetchScheduleResults = useCallback(async (date) => {
//     try {
//       const response = await axios.get(`/api/mainschedule?date=${date}`);
//       const scheduleData = response.data.mainSchedule || [];
//       console.log("API로부터 받은 스케줄 데이터:", scheduleData); // 로그 출력
//       setScheduleResults(scheduleData);
//     } catch (error) {
//       console.error(
//         "스케줄 데이터 가져오기 오류:",
//         error.response?.data || error.message
//       );
//       setScheduleResults([]); // 오류 발생 시 빈 배열로 설정
//     }
//   }, []);

//   // 현재 날짜에 맞는 가능한 날짜와 스케줄 데이터를 가져옴
//   useEffect(() => {
//     if (availableDates.length === 0) {
//       fetchAvailableDates(); // 최초에만 호출
//     }
//   }, [availableDates, fetchAvailableDates]); // 의존성 배열에서 availableDates를 참조하여 한 번만 호출

//   // 스케줄 데이터 가져오기
//   useEffect(() => {
//     const dateString = dayjs(currentDate).format("YYYY-MM-DD");

//     if (availableDates.length > 0) {
//       // 현재 날짜가 마지막 가능한 날짜 이후일 경우, 마지막 가능한 날짜로 설정
//       const lastDate = availableDates[availableDates.length - 1];
//       if (dayjs(currentDate).isAfter(dayjs(lastDate), "day")) {
//         setCurrentDate(dayjs(lastDate).toDate()); // 마지막 날짜로 설정
//       } else {
//         fetchScheduleResults(dateString); // 현재 날짜에 맞는 스케줄을 불러옴
//       }
//     }
//   }, [currentDate, availableDates, fetchScheduleResults]);

//   return (
//     <div className="schedule-section">
//       <ScheduleSectionContainer>
//         <CarouselSection />
//         <DateNavigationBar
//           currentDate={currentDate}
//           onDateChange={setCurrentDate}
//           availableDates={availableDates}
//         />
//         <ScheduleBoxes
//           selectedDate={currentDate}
//           scheduleResults={scheduleResults} // 스케줄 결과를 전달
//           userFavioriteTeam={userFavioriteTeam} // 선호 팀 전달
//         />
//         {Array.isArray(availableDates) &&
//           availableDates.includes(dayjs(currentDate).format("YYYY-MM-DD")) && (
//             <LinkContainer
//               to="/scheduleresults/schedule"
//               style={{ color: "#eeeeee" }}
//             >
//               Go To Detail &gt;
//             </LinkContainer>
//           )}
//       </ScheduleSectionContainer>
//     </div>
//   );
// };

// export default ScheduleSection;

// 1006
// import React, { useState, useEffect, useCallback } from "react";
// import CarouselSection from "./CarouselSection";
// import ScheduleBoxes from "../schedule-scoreboard/ScheduleBoxes";
// import DateNavigationBar from "./DateNavigationBar";
// import axios from "axios";
// import dayjs from "dayjs";
// import {
//   ScheduleSectionContainer,
//   LinkContainer,
// } from "../../styles/CommonStyles";

// const ScheduleSection = () => {
//   const [currentDate, setCurrentDate] = useState(dayjs().toDate());
//   const [availableDates, setAvailableDates] = useState([]);
//   const [scheduleResults, setScheduleResults] = useState([]);
//   const [userFavioriteTeam, setUserFavioriteTeam] = useState(""); // 선호 팀 상태 추가

//   // 선호 팀을 로컬 스토리지 또는 API에서 불러오는 함수
//   useEffect(() => {
//     const storedPreferredTeam = localStorage.getItem("userFavioriteTeam"); // 로컬 스토리지에서 불러오기
//     if (storedPreferredTeam) {
//       setUserFavioriteTeam(storedPreferredTeam);
//     } else {
//       setUserFavioriteTeam(""); // 기본값 설정 (선호팀이 없을 경우)
//     }
//   }, []);

//   // API에서 스케줄 데이터를 가져와 가능한 날짜들을 추출하는 함수
//   const fetchAvailableDates = useCallback(async () => {
//     if (availableDates.length === 0) {
//       try {
//         const response = await axios.get(`/api/mainschedule?date`);
//         const scheduleData = response.data.mainSchedule || [];

//         // 가능한 날짜 추출
//         const uniqueDates = [
//           ...new Set(scheduleData.map((game) => game.gameDate)),
//         ];

//         console.log("API로부터 가능한 날짜들:", uniqueDates); // 로그로 출력

//         setAvailableDates(uniqueDates); // 상태 업데이트
//       } catch (error) {
//         console.error(
//           "가능한 날짜 가져오기 오류:",
//           error.response?.data || error.message
//         );
//         setAvailableDates([]); // 오류 발생 시 빈 배열로 설정
//       }
//     }
//   }, [availableDates]);

//   // 선택된 날짜에 대한 스케줄 데이터를 가져오는 함수
//   const fetchScheduleResults = useCallback(async (date) => {
//     try {
//       const response = await axios.get(`/api/mainschedule?date=${date}`);
//       const scheduleData = response.data.mainSchedule || [];
//       console.log("API로부터 받은 스케줄 데이터:", scheduleData); // 로그 출력
//       setScheduleResults(scheduleData);
//     } catch (error) {
//       console.error(
//         "스케줄 데이터 가져오기 오류:",
//         error.response?.data || error.message
//       );
//       setScheduleResults([]); // 오류 발생 시 빈 배열로 설정
//     }
//   }, []);

//   // 최초에 한번만 호출: availableDates 불러오기
//   useEffect(() => {
//     fetchAvailableDates();
//   }, [fetchAvailableDates]);

//   // availableDates가 로드된 후, 선택된 날짜에 대한 스케줄 데이터를 불러옴
//   useEffect(() => {
//     const dateString = dayjs(currentDate).format("YYYY-MM-DD");

//     if (availableDates.length > 0) {
//       // 현재 날짜가 마지막 가능한 날짜 이후일 경우, 마지막 가능한 날짜로 설정
//       const lastDate = availableDates[availableDates.length - 1];
//       if (dayjs(currentDate).isAfter(dayjs(lastDate), "day")) {
//         setCurrentDate(dayjs(lastDate).toDate()); // 마지막 날짜로 설정
//       } else {
//         fetchScheduleResults(dateString); // 현재 날짜에 맞는 스케줄을 불러옴
//       }
//     }
//   }, [currentDate, availableDates, fetchScheduleResults]);

//   return (
//     <div className="schedule-section">
//       <ScheduleSectionContainer>
//         <CarouselSection />
//         <DateNavigationBar
//           currentDate={currentDate}
//           onDateChange={setCurrentDate}
//           availableDates={availableDates}
//         />
//         <ScheduleBoxes
//           selectedDate={currentDate}
//           scheduleResults={scheduleResults} // 스케줄 결과를 전달
//           userFavioriteTeam={userFavioriteTeam} // 선호 팀 전달
//         />
//         {Array.isArray(availableDates) &&
//           availableDates.includes(dayjs(currentDate).format("YYYY-MM-DD")) && (
//             <LinkContainer
//               to="/scheduleresults/schedule"
//               style={{ color: "#eeeeee" }}
//             >
//               Go To Detail &gt;
//             </LinkContainer>
//           )}
//       </ScheduleSectionContainer>
//     </div>
//   );
// };

// export default ScheduleSection;

// import React, { useState, useEffect } from "react";
// import CarouselSection from "./CarouselSection";
// import ScheduleBoxes from "../schedule-scoreboard/ScheduleBoxes";
// import DateNavigationBar from "./DateNavigationBar";
// import axios from "axios";
// import dayjs from "dayjs";
// import { useQuery } from "react-query";
// import {
//   ScheduleSectionContainer,
//   LinkContainer,
// } from "../../styles/CommonStyles";
// import StatusMessage from "../ui/StatusMessage"; // StatusMessage 컴포넌트 추가

// // 스케줄 데이터를 가져오는 함수
// const fetchAvailableDates = async () => {
//   const response = await axios.get(`/api/mainschedule?date`, {
//     withCredentials: true,
//   });
//   return [...new Set(response.data.mainSchedule.map((game) => game.gameDate))];
// };

// // 특정 날짜에 대한 스케줄 데이터를 가져오는 함수
// const fetchScheduleResults = async (date, availableDates) => {
//   if (!date || !availableDates.includes(date)) {
//     console.warn("유효하지 않은 날짜로 인해 빈 스케줄 데이터를 반환합니다.");
//     return [];
//   }
//   const response = await axios.get(`/api/mainschedule?date=${date}`);
//   console.log("API로부터 받은 스케줄 데이터:", response.data.mainSchedule);
//   return response.data.mainSchedule;
// };

// const ScheduleSection = () => {
//   const [currentDate, setCurrentDate] = useState(dayjs().toDate());
//   const formattedDate = dayjs(currentDate).format("YYYY-MM-DD");

//   // React Query로 스케줄 데이터 가져오기
//   const {
//     data: availableDates = [],
//     isLoading: isLoadingDates,
//     error: datesError,
//   } = useQuery("availableDates", fetchAvailableDates, {
//     staleTime: 1000 * 60 * 5, // 5분 동안 데이터가 신선하다고 간주
//     cacheTime: 1000 * 60 * 10, // 10분 동안 캐시된 데이터 유지
//     // refetchOnWindowFocus: false, // 포커스 시 재요청 방지
//     // refetchOnMount: false, // 컴포넌트 마운트 시 재요청 방지
//     // retry: 0, // 실패 시 재요청 방지
//   });
//   console.log("availableDates: ", availableDates);

//   const {
//     data: scheduleResults = [],
//     isLoading: isLoadingSchedule,
//     error: scheduleError,
//     refetch: refetchSchedule,
//   } = useQuery(
//     ["scheduleResults", formattedDate],
//     () => fetchScheduleResults(formattedDate, availableDates),
//     {
//       enabled: availableDates.length > 0, // availableDates가 로드된 이후에만 쿼리 실행
//       staleTime: 1000 * 60 * 5,
//       cacheTime: 1000 * 60 * 10,
//     }
//   );

//   // 날짜 데이터가 로드된 후 스케줄 데이터를 수동으로 가져옴
//   useEffect(() => {
//     if (!availableDates.includes(formattedDate)) {
//       // 현재 날짜에 경기가 없을 때
//       const nextAvailableDate = availableDates.find((date) =>
//         dayjs(date).isAfter(formattedDate)
//       );
//       const previousAvailableDate = [...availableDates]
//         .reverse()
//         .find((date) => dayjs(date).isBefore(formattedDate));

//       if (nextAvailableDate) {
//         setCurrentDate(dayjs(nextAvailableDate).toDate());
//       } else if (previousAvailableDate) {
//         setCurrentDate(dayjs(previousAvailableDate).toDate());
//       }
//     }
//   }, [formattedDate, availableDates]);

//   return (
//     <div className="schedule-section">
//       <ScheduleSectionContainer>
//         {isLoadingDates || isLoadingSchedule ? (
//           <StatusMessage loading={true} />
//         ) : datesError || scheduleError ? (
//           <StatusMessage
//             error={datesError?.message || scheduleError?.message}
//           />
//         ) : (
//           <>
//             <CarouselSection />
//             <DateNavigationBar
//               currentDate={currentDate}
//               onDateChange={setCurrentDate}
//               availableDates={availableDates}
//             />
//             {scheduleResults.length === 0 ? (
//               <StatusMessage noData="스케줄 데이터가 없습니다." />
//             ) : (
//               <ScheduleBoxes
//                 selectedDate={currentDate}
//                 scheduleResults={scheduleResults}
//               />
//             )}
//             {Array.isArray(availableDates) &&
//               availableDates.includes(formattedDate) && (
//                 <LinkContainer
//                   to="/scheduleresults/schedule"
//                   style={{ color: "#eeeeee" }}
//                 >
//                   Go To Detail &gt;
//                 </LinkContainer>
//               )}
//           </>
//         )}
//       </ScheduleSectionContainer>
//     </div>
//   );
// };

// export default ScheduleSection;

//########################################################################################################################################
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import dayjs from "dayjs";
import { useUser } from "../../contexts/UserContext";
import StatusMessage from "../ui/StatusMessage";
import CarouselSection from "./CarouselSection";
import ScheduleBoxes from "../schedule-scoreboard/ScheduleBoxes";
import DateNavigationBar from "./DateNavigationBar";

import {
  ScheduleSectionContainer,
  LinkContainer,
} from "../../styles/CommonStyles";

// 스케줄 데이터를 가져오는 함수
const fetchAvailableDates = async () => {
  const response = await axios.get(`/api/mainschedule?date`, {
    withCredentials: true,
  });
  return [...new Set(response.data.mainSchedule.map((game) => game.gameDate))];
};

// 특정 날짜에 대한 스케줄 데이터를 가져오는 함수
const fetchScheduleResults = async (date, availableDates) => {
  if (!date || !availableDates.includes(date)) {
    console.warn("유효하지 않은 날짜로 인해 빈 스케줄 데이터를 반환합니다.");
    return;
  }
  const response = await axios.get(`/api/mainschedule?date=${date}`);
  console.log("API로부터 받은 스케줄 데이터:", response.data.mainSchedule);
  return response.data.mainSchedule;
};

const ScheduleSection = () => {
  const [currentDate, setCurrentDate] = useState(dayjs().toDate());
  const formattedDate = dayjs(currentDate).format("YYYY-MM-DD");

  // useUser 훅을 사용하여 user 정보 가져오기
  const { user } = useUser();
  console.log("user:", user);
  const userFavoriteTeam = user?.userFavoriteTeam || null;

  // React Query로 스케줄 데이터 가져오기
  const {
    data: availableDates = [],
    isLoading: isLoadingDates,
    error: datesError,
  } = useQuery("availableDates", fetchAvailableDates, {
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const {
    data: scheduleResults = [],
    isLoading: isLoadingSchedule,
    error: scheduleError,
  } = useQuery(
    ["scheduleResults", formattedDate],
    () => fetchScheduleResults(formattedDate, availableDates),
    {
      enabled: availableDates.length > 0,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
    }
  );

  // 날짜 데이터가 로드된 후 스케줄 데이터를 수동으로 가져옴
  useEffect(() => {
    if (!availableDates.includes(formattedDate)) {
      const nextAvailableDate = availableDates.find((date) =>
        dayjs(date).isAfter(formattedDate)
      );
      const previousAvailableDate = [...availableDates]
        .reverse()
        .find((date) => dayjs(date).isBefore(formattedDate));

      if (nextAvailableDate) {
        setCurrentDate(dayjs(nextAvailableDate).toDate());
      } else if (previousAvailableDate) {
        setCurrentDate(dayjs(previousAvailableDate).toDate());
      }
    }
  }, [formattedDate, availableDates]);

  return (
    <div className="schedule-section">
      <ScheduleSectionContainer>
        {/* 캐러셀과 날짜 네비게이션 바는 로딩 상태와 관계없이 항상 표시 */}
        <CarouselSection />
        <DateNavigationBar
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          availableDates={availableDates}
        />

        {/* 스케줄 데이터 부분만 로딩 중 표시 */}
        {isLoadingSchedule ? (
          <StatusMessage loading={true} />
        ) : scheduleError ? (
          <StatusMessage error={scheduleError.message} />
        ) : scheduleResults.length === 0 ? (
          <StatusMessage noData="스케줄 데이터가 없습니다." />
        ) : (
          <ScheduleBoxes
            selectedDate={currentDate}
            scheduleResults={scheduleResults}
            userFavoriteTeam={userFavoriteTeam}
          />
        )}

        {/* 스케줄 데이터가 로드된 경우에만 링크 표시 */}
        {Array.isArray(availableDates) &&
          availableDates.includes(formattedDate) && (
            <LinkContainer
              to="/scheduleresults/schedule"
              style={{ color: "#eeeeee" }}
            >
              Go To Detail &gt;
            </LinkContainer>
          )}
      </ScheduleSectionContainer>
    </div>
  );
};

export default ScheduleSection;
