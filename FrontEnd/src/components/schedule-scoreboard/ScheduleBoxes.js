// import React, { useEffect, useState } from "react";
// import { getTeamEmblem } from "../../contexts/teamsData";
// import VS from "../../assets/images/VS.png";
// import { ScheduleBoxesContainer, ScheduleBox } from "../../styles/CommonStyles";
// import { RxDividerVertical } from "react-icons/rx";
// import dayjs from "dayjs";
// import { ScoreText } from "./ScheduleTableView";
// import StatusMessage from "../ui/StatusMessage"; // StatusMessage import

// const ScheduleBoxes = ({
//   selectedDate,
//   scheduleResults,
//   userFavioriteTeam,
//   loading, // loading 상태 prop
//   error, // error 상태 prop
// }) => {
//   const [schedule, setSchedule] = useState([]);
//   // 일정 박스 스타일을 선호 구단에 따라 변경
//   const isUserFavoriteTeam = (team) => team === userFavioriteTeam;

//   // 선택된 날짜와 전달된 스케줄 데이터를 기준으로 필터링
//   useEffect(() => {
//     const dateString = dayjs(selectedDate).format("YYYY-MM-DD"); // 선택된 날짜를 dayjs로 변환
//     const gamesForDate = scheduleResults.filter(
//       (game) => dayjs(game.gameDate).format("YYYY-MM-DD") === dateString
//     ); // 해당 날짜의 경기를 가져옴
//     setSchedule(rearrangeSchedule(gamesForDate, userFavioriteTeam));
//   }, [selectedDate, scheduleResults, userFavioriteTeam]);

//   // 경기 상태 계산 함수
//   const getGameStatus = (gameDate, status, etc) => {
//     const isPastGame = dayjs(gameDate).isBefore(dayjs(), "day");
//     if (etc === "우천취소") return "우천 취소";
//     if (etc === "폭염취소") return "폭염 취소";
//     if (etc === "미세먼지취소") return "미세먼지 취소";

//     return isPastGame ? "경기 종료" : "경기 예정";
//   };

//   // 투수 상태 계산 함수
//   const getPitcherStatus = (scoreDiff, gameDate, etc) => {
//     const isPastGame = dayjs(gameDate).isBefore(dayjs(), "day");

//     if (etc === "우천취소" || etc === "폭염취소" || etc === "미세먼지취소") {
//       return null; // 투수 상태 없음1029
//     }

//     if (!isPastGame) return "선"; // 경기 예정일 경우 "선" 반환
//     if (scoreDiff > 0) return "승";
//     if (scoreDiff < 0) return "패";
//     return "무";
//   };

//   // 경기 재정렬 함수: 선호 구단이 속한 경기를 중앙으로 이동
//   const rearrangeSchedule = (schedule, userFavioriteTeam) => {
//     if (!userFavioriteTeam) return schedule;

//     const preferredGames = schedule.filter(
//       (game) =>
//         game.home === userFavioriteTeam || game.away === userFavioriteTeam
//     );

//     if (preferredGames.length === 0) return schedule;

//     const otherGames = schedule.filter(
//       (game) =>
//         game.home !== userFavioriteTeam && game.away !== userFavioriteTeam
//     );

//     const result = [];
//     const totalGames = otherGames.length + preferredGames.length;
//     const beforePreferredGamesCount = Math.floor(
//       (totalGames - preferredGames.length) / 2
//     );

//     result.push(...otherGames.slice(0, beforePreferredGamesCount));
//     result.push(...preferredGames);
//     result.push(...otherGames.slice(beforePreferredGamesCount));

//     return result;
//   };

//   if (loading || error || schedule.length === 0) {
//     return (
//       <StatusMessage
//         loading={loading}
//         error={error}
//         noData={schedule.length === 0 ? "경기가 없습니다." : null}
//       />
//     );
//   }

//   return (
//     <ScheduleBoxesContainer>
//       {schedule.map((game, index) => {
//         const homeScore = parseInt(game.homeScore, 10);
//         const awayScore = parseInt(game.awayScore, 10);
//         const homePitcherStatus = getPitcherStatus(
//           homeScore - awayScore,
//           game.gameDate,
//           game.etc
//         );
//         const awayPitcherStatus = getPitcherStatus(
//           awayScore - homeScore,
//           game.gameDate,
//           game.etc
//         );

//         const isCanceled =
//           game.etc === "우천취소" ||
//           game.etc === "폭염취소" ||
//           game.etc === "미세먼지취소";

//         return (
//           <ScheduleBox key={index}>
//             <ul className="game-info">
//               <li>
//                 {game.ground} <RxDividerVertical /> {game.time}
//               </li>
//               <li className="game-status">
//                 {getGameStatus(game.gameDate, game.status, game.etc)}
//               </li>
//               {awayPitcherStatus && (
//                 <li>
//                   {awayPitcherStatus} <span>{game.awayPitcher}</span>
//                 </li>
//               )}
//               <li className="teamEM-away">
//                 <img src={getTeamEmblem(game.away)} alt={game.away} />
//               </li>
//               <li className="score-container">
//                 {!isCanceled && (
//                   <ScoreText
//                     $isWin={game.awayWinLose === "승"}
//                     className="score"
//                   >
//                     {game.awayScore}
//                   </ScoreText>
//                 )}
//                 <img src={VS} alt="vs" className="vs-image" />
//                 {!isCanceled && (
//                   <ScoreText
//                     $isWin={game.homeWinLose === "승"}
//                     className="score"
//                   >
//                     {game.homeScore}
//                   </ScoreText>
//                 )}
//               </li>
//               <li className="teamEM-home">
//                 <img src={getTeamEmblem(game.home)} alt={game.home} />
//               </li>
//               {homePitcherStatus && (
//                 <li>
//                   {homePitcherStatus} <span>{game.homePitcher}</span>
//                 </li>
//               )}
//             </ul>
//           </ScheduleBox>
//         );
//       })}
//     </ScheduleBoxesContainer>
//   );
// };

// export default ScheduleBoxes;

//#######################################################################################
import React, { useEffect, useState } from "react";
import { getTeamEmblem } from "../../contexts/teamsData";
import VS from "../../assets/images/VS.png";
import { ScheduleBoxesContainer, ScheduleBox } from "../../styles/CommonStyles";
import { RxDividerVertical } from "react-icons/rx";
import dayjs from "dayjs";
import { ScoreText } from "./ScheduleTableView";
import StatusMessage from "../ui/StatusMessage";

const ScheduleBoxes = ({
  selectedDate,
  scheduleResults,
  userFavoriteTeam,
  loading,
  error,
}) => {
  const [schedule, setSchedule] = useState([]);

  // 선택된 날짜와 전달된 스케줄 데이터를 기준으로 필터링 및 정렬
  useEffect(() => {
    const dateString = dayjs(selectedDate).format("YYYY-MM-DD");
    const gamesForDate = scheduleResults.filter(
      (game) => dayjs(game.gameDate).format("YYYY-MM-DD") === dateString
    );
    console.log("선택된 날짜:", selectedDate);
    console.log("유저의 선호 구단:", userFavoriteTeam);
    console.log("해당 날짜의 경기:", gamesForDate);

    setSchedule(rearrangeSchedule(gamesForDate, userFavoriteTeam));
  }, [selectedDate, scheduleResults, userFavoriteTeam]);

  // 경기 재정렬 함수: 선호 구단이 속한 경기를 중앙으로 이동
  const rearrangeSchedule = (schedule, userFavoriteTeam) => {
    if (!userFavoriteTeam) {
      console.log("선호 구단 정보가 없습니다.");
      return schedule;
    }

    const preferredGames = schedule.filter(
      (game) => game.home === userFavoriteTeam || game.away === userFavoriteTeam
    );
    console.log("선호 구단 경기:", preferredGames);

    if (preferredGames.length === 0) {
      console.log("선호 구단과 일치하는 경기가 없습니다.");
      return schedule;
    }

    const otherGames = schedule.filter(
      (game) => game.home !== userFavoriteTeam && game.away !== userFavoriteTeam
    );
    console.log("기타 경기:", otherGames);

    const result = [];
    const totalGames = otherGames.length + preferredGames.length;
    const beforePreferredGamesCount = Math.floor(
      (totalGames - preferredGames.length) / 2
    );

    result.push(...otherGames.slice(0, beforePreferredGamesCount));
    result.push(...preferredGames);
    result.push(...otherGames.slice(beforePreferredGamesCount));

    console.log("재정렬된 경기:", result);
    return result;
  };

  // 로딩, 에러 상태 및 스케줄 데이터가 없을 때 처리
  if (loading || error || schedule.length === 0) {
    return (
      <StatusMessage
        loading={loading}
        error={error}
        noData={schedule.length === 0 ? "경기가 없습니다." : null}
      />
    );
  }

  //   return (
  //     <ScheduleBoxesContainer>
  //       {schedule.map((game, index) => {
  //         const isFavoriteGame =
  //           userFavoriteTeam === game.home || userFavoriteTeam === game.away;

  //         const homeScore = parseInt(game.homeScore, 10);
  //         const awayScore = parseInt(game.awayScore, 10);
  //         const homePitcherStatus = getPitcherStatus(
  //           homeScore - awayScore,
  //           game.gameDate,
  //           game.etc
  //         );
  //         const awayPitcherStatus = getPitcherStatus(
  //           awayScore - homeScore,
  //           game.gameDate,
  //           game.etc
  //         );

  //         const isCanceled =
  //           game.etc === "우천취소" ||
  //           game.etc === "폭염취소" ||
  //           game.etc === "미세먼지취소";

  //         return (
  //           <ScheduleBox
  //             key={index}
  //             className={isFavoriteGame ? "highlight" : ""}
  //           >
  //             <ul className="game-info">
  //               <li>
  //                 {game.ground} <RxDividerVertical /> {game.time}
  //               </li>
  //               <li className="game-status">
  //                 {getGameStatus(game.gameDate, game.status, game.etc)}
  //               </li>
  //               {awayPitcherStatus && (
  //                 <li>
  //                   {awayPitcherStatus} <span>{game.awayPitcher}</span>
  //                 </li>
  //               )}
  //               <li className="teamEM-away">
  //                 <img src={getTeamEmblem(game.away)} alt={game.away} />
  //               </li>
  //               <li className="score-container">
  //                 {!isCanceled && (
  //                   <ScoreText
  //                     $isWin={game.awayWinLose === "승"}
  //                     className="score"
  //                   >
  //                     {game.awayScore}
  //                   </ScoreText>
  //                 )}
  //                 <img src={VS} alt="vs" className="vs-image" />
  //                 {!isCanceled && (
  //                   <ScoreText
  //                     $isWin={game.homeWinLose === "승"}
  //                     className="score"
  //                   >
  //                     {game.homeScore}
  //                   </ScoreText>
  //                 )}
  //               </li>
  //               <li className="teamEM-home">
  //                 <img src={getTeamEmblem(game.home)} alt={game.home} />
  //               </li>
  //               {homePitcherStatus && (
  //                 <li>
  //                   {homePitcherStatus} <span>{game.homePitcher}</span>
  //                 </li>
  //               )}
  //             </ul>
  //           </ScheduleBox>
  //         );
  //       })}
  //     </ScheduleBoxesContainer>
  //   );
  // };

  // // 경기 상태 계산 함수
  // const getGameStatus = (gameDate, status, etc) => {
  //   const isPastGame = dayjs(gameDate).isBefore(dayjs(), "day");
  //   if (etc === "우천취소") return "우천 취소";
  //   if (etc === "폭염취소") return "폭염 취소";
  //   if (etc === "미세먼지취소") return "미세먼지 취소";
  //   return isPastGame ? "경기 종료" : "경기 예정";
  // };

  // // 투수 상태 계산 함수
  // const getPitcherStatus = (scoreDiff, gameDate, etc) => {
  //   const isPastGame = dayjs(gameDate).isBefore(dayjs(), "day");
  //   if (etc === "우천취소" || etc === "폭염취소" || etc === "미세먼지취소") {
  //     return null;
  //   }
  //   if (!isPastGame) return "선";
  //   if (scoreDiff > 0) return "승";
  //   if (scoreDiff < 0) return "패";
  //   return "무";
  // };

  return (
    <ScheduleBoxesContainer>
      {schedule.map((game, index) => {
        const isFavoriteGame =
          userFavoriteTeam === game.home || userFavoriteTeam === game.away;

        const isCanceled =
          game.etc === "우천취소" ||
          game.etc === "폭염취소" ||
          game.etc === "미세먼지취소";

        return (
          <ScheduleBox
            key={index}
            className={isFavoriteGame ? "highlight" : ""}
          >
            <ul className="game-info">
              <li>
                {game.ground} <RxDividerVertical /> {game.time}
              </li>
              <li className="game-status">
                {game.etc}
                {/* 백엔드에서 받은 경기 상태(경기종료, 경기예정 등) 사용 */}
              </li>
              {!isCanceled && game.awayPitcher && (
                <li>
                  {game.awayWinLose} <span>{game.awayPitcher}</span>{" "}
                  {/* 백엔드에서 처리된 승/패 상태 사용 */}
                </li>
              )}
              <li className="teamEM-away">
                <img src={getTeamEmblem(game.away)} alt={game.away} />
              </li>
              <li className="score-container">
                {!isCanceled && (
                  <ScoreText
                    $isWin={game.awayWinLose === "승"}
                    className="score"
                  >
                    {game.awayScore}
                  </ScoreText>
                )}
                <img src={VS} alt="vs" className="vs-image" />
                {!isCanceled && (
                  <ScoreText
                    $isWin={game.homeWinLose === "승"}
                    className="score"
                  >
                    {game.homeScore}
                  </ScoreText>
                )}
              </li>
              <li className="teamEM-home">
                <img src={getTeamEmblem(game.home)} alt={game.home} />
              </li>
              {!isCanceled && game.homePitcher && (
                <li>
                  {game.homeWinLose} <span>{game.homePitcher}</span>
                  {/* 백엔드에서 처리된 승/패 상태 사용 */}
                </li>
              )}
            </ul>
          </ScheduleBox>
        );
      })}
    </ScheduleBoxesContainer>
  );
};
export default ScheduleBoxes;
