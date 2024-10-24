// 0923
// import React from "react";
// import styled from "styled-components";
// import { getTeamEmblem } from "./commuinad/common/teamsData"; // 팀 이름으로 엠블럼 찾는 함수

// const MatchContainer = styled.div`
//   border: 1px solid #ddd;
//   border-radius: 10px;
//   background-color: #fff;
//   padding: 20px;
//   margin-bottom: 20px;
// `;

// const TeamContainer = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   ul {
//     display: flex;
//     list-style: none;
//     margin: 0;
//     padding: 0;
//     li {
//       margin-right: 10px;
//     }
//   }
// `;

// const StatusContainer = styled.div`
//   text-align: center;
//   div {
//     list-style: none;
//     margin: 0;
//     padding: 0;
//   }
// `;

// const InningTable = styled.table`
//   width: 100%;
//   border-collapse: collapse;
//   margin-top: 10px;
// `;

// const TableHeader = styled.thead`
//   th {
//     height: 47px;
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
// `;

// const TableCell = styled.td`
//   padding: 5px;
//   text-align: center;
//   width: 30px; /* 이닝 너비 */
//   border-bottom: none;
// `;

// const MatchCard = ({ match }) => {
//   // match 데이터가 없으면 null 반환
//   if (!match) return null;

//   const {
//     status,
//     ground,
//     gameDate,
//     time,
//     away,
//     awayScore,
//     awayWinLose,
//     awayPitcher,
//     home,
//     homeScore,
//     homeWinLose,
//     homePitcher,
//     ...innings
//   } = match;

//   // 이닝 점수를 배열로 변환
//   const awayInnings = [];
//   const homeInnings = [];

//   for (let i = 1; i <= 12; i++) {
//     awayInnings.push(innings[`${i}`] || "원정 이닝"); // 해당 이닝 점수가 없으면 빈 문자열
//     homeInnings.push(innings[`${i}`] || "홈 이닝"); // 해당 이닝 점수가 없으면 빈 문자열
//   }

//   return (
//     <MatchContainer>
//       <TeamContainer>
//         <ul>
//           <li>{away || "원정팀"}</li>
//           <li>
//             {awayPitcher || "원정 투수"}
//             <span>&nbsp;{awayWinLose || "승 무 패"}</span>
//           </li>
//           <li>
//             <img
//               src={getTeamEmblem(away)} // teamsData에서 emblem 가져오기
//               alt={"원정 팀" + away + "엠블럼"}
//               style={{ width: "30px", height: "30px" }}
//             />
//           </li>
//           <li>{`${awayScore || "- 점수"}`}</li>
//         </ul>
//         <StatusContainer>
//           <div>{status || "N/A"}</div>
//           <div>{gameDate.slice(5, 10).split("-").join(".") || "N/A"}</div>
//           <div>{time || "N/A"}</div>
//           <div>{ground || "N/A"}</div>
//         </StatusContainer>
//         <ul>
//           <li>{`${homeScore || "- 점수"}`}</li>
//           <li>
//             <img
//               src={getTeamEmblem(home)} // teamsData에서 emblem 가져오기
//               alt={"홈 팀" + home + "엠블럼"}
//               style={{ width: "30px", height: "30px" }}
//             />
//           </li>
//           <li>{home || "홈팀"}</li>
//           <li>
//             <span>{homeWinLose || "승 무 패"}&nbsp;</span>
//             {homePitcher || "홈 투수"}
//           </li>
//         </ul>
//       </TeamContainer>

//       <InningTable>
//         <TableHeader>
//           <tr>
//             <th>팀명</th>
//             <th></th>
//             {/* 이닝 수에 따라 동적으로 헤더 생성 */}
//             {Array.from({ length: 12 }, (_, i) => (
//               <th key={i + 1}>{i + 1}</th>
//             ))}
//             <th></th>
//             <th>R</th>
//             <th>H</th>
//             <th>E</th>
//             <th>B</th>
//           </tr>
//         </TableHeader>
//         <tbody>
//           <tr>
//             <TableCell>{away || "원정팀"}</TableCell>
//             {awayInnings.map((score, index) => (
//               <TableCell key={index + 1}>
//                 {score !== "-" ? score : "-"}
//               </TableCell>
//             ))}
//           </tr>
//           <tr>
//             <TableCell>{home || "홈팀"}</TableCell>
//             {homeInnings.map((score, index) => (
//               <TableCell key={index + 1}>
//                 {score !== "-" ? score : "-"}
//               </TableCell>
//             ))}
//           </tr>
//         </tbody>
//       </InningTable>
//     </MatchContainer>
//   );
// };

// export default MatchCard;

// 0926
// import React from "react";
// import { getTeamEmblem } from "./commuinad/common/teamsData";
// import { RxDividerVertical } from "react-icons/rx";
// import { WinLoseText, ScoreText } from "./ScheduleTableView";
// import styled from "styled-components";

// const MatchContainer = styled.div`
//   border: 1px solid #ddd;
//   border-radius: 10px;
//   background-color: #fff;
//   padding: 20px;
//   margin-bottom: 20px;
// `;

// const TeamContainer = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   ul {
//     display: flex;
//     list-style: none;
//     margin: 0;
//     padding: 0;
//     li {
//       margin-right: 10px;
//     }
//   }
// `;

// const StatusContainer = styled.div`
//   text-align: center;
//   div {
//     list-style: none;
//     margin: 0;
//     padding: 0;

//     &:nth-child(2), &:nth-child(3) {
//     display: inline-block;
//   }
// `;

// export const InningTable = styled.table`
//   border-collapse: collapse;
//   margin-top: 10px;
//   border-bottom: none;

//   th:not(:first-child) {
//     width: 30px;
//     text-align: center;
//   }
// `;

// export const TableHeader = styled.thead`
//   th {
//     height: 47px;
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
//   }
// `;

// const TableCell = styled.td`
//   padding: 5px;
//   text-align: center;
//   width: 30px; /* 이닝 너비 */
//   border-bottom: none;
// `;

// const MatchCard = ({ match }) => {
//   if (!match) return null;

//   const {
//     status,
//     ground,
//     gameDate,
//     time,
//     awayTeam,
//     awayPitcher,
//     awayWinOrLose,
//     awayScore,
//     awayRuns,
//     awayHits,
//     awayErrors,
//     awayBalls,
//     homeTeam,
//     homePitcher,
//     homeWinOrLose,
//     homeScore,
//     homeRuns,
//     homeHits,
//     homeErrors,
//     homeBalls,
//     ...innings
//   } = match;

//   const awayInnings = Array.from(
//     { length: 12 },
//     (_, i) => innings[`awayInning${i + 1}`] || "원정 이닝"
//   );
//   const homeInnings = Array.from(
//     { length: 12 },
//     (_, i) => innings[`homeInning${i + 1}`] || "홈 이닝"
//   );

//   console.log(match);
//   return (
//     <MatchContainer>
//       <TeamContainer>
//         <ul>
//           <li>{awayTeam || "원정팀"}</li>
//           <li>
//             {awayPitcher || "원정 투수"}
//             <WinLoseText winLose={awayWinOrLose}>
//               &nbsp;{awayWinOrLose}
//             </WinLoseText>
//           </li>
//           <li>
//             <img
//               src={getTeamEmblem(awayTeam)}
//               alt={`원정 팀 ${awayTeam} 엠블럼`}
//             />
//           </li>
//           <ScoreText isWin={awayWinOrLose === "승"}>{`${
//             awayRuns || "-"
//           }`}</ScoreText>
//         </ul>
//         <StatusContainer>
//           <div>{status || "N/A"}</div>
//           <div>
//             {gameDate.slice(5, 10).split("-").join(".") || "N/A"}
//             <RxDividerVertical />
//           </div>

//           <div>{time || "N/A"}</div>
//           <div>{ground || "N/A"}</div>
//         </StatusContainer>
//         <ul>
//           <ScoreText isWin={homeWinOrLose === "승"}>{`${
//             homeRuns || "-"
//           }`}</ScoreText>
//           <li>
//             <img
//               src={getTeamEmblem(homeTeam)}
//               alt={`홈 팀 ${homeTeam} 엠블럼`}
//             />
//           </li>
//           <li>{homeTeam || "홈팀"}</li>
//           <li>
//             <WinLoseText winLose={homeWinOrLose}>
//               {homeWinOrLose}&nbsp;
//             </WinLoseText>
//             {homePitcher || "홈 투수"}
//           </li>
//         </ul>
//       </TeamContainer>

//       <InningTable>
//         <TableHeader>
//           <tr>
//             <th>팀명</th>
//             {Array.from({ length: 15 }, (_, i) => (
//               <th key={i + 1}>{`${i + 1}`}</th>
//             ))}
//           </tr>
//         </TableHeader>
//         <tbody>
//           <tr>
//             <TableCell>{awayTeam}</TableCell>
//             {awayInnings.map((inning, index) => (
//               <TableCell key={index}>{inning}</TableCell>
//             ))}
//           </tr>
//           <tr>
//             <TableCell>{homeTeam}</TableCell>
//             {homeInnings.map((inning, index) => (
//               <TableCell key={index}>{inning}</TableCell>
//             ))}
//           </tr>
//         </tbody>
//       </InningTable>
//     </MatchContainer>
//   );
// };

// export default MatchCard;

// 0926 2차 수정
import React from "react";
import { getTeamEmblem } from "../../contexts/teamsData";
import { RxDividerVertical } from "react-icons/rx";
import { WinLoseText, ScoreText } from "./ScheduleTableView";
import styled from "styled-components";
import { Table, TableHeader } from "../../styles/CommonStyles";

const MatchContainer = styled.div`
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fff;
  padding: 20px 56px;
  margin-bottom: 40px;
  // height: 350px;
  font-family: "GongGothicMedium", sans-serif;
  min-width: 909px;
`;

export const TeamContainer = styled.div`
  padding: 0 20px;
  margin-top: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .team-info {
    display: flex;
    align-items: center;
    gap: 40px;
  }
    
  .team-name,
  .team-pitcher {
    flex-direction: column;
  }

  .team-name {
    font-size: 35px;
    color: #6f6f6f;
  }

  .team-pitcher {
    font-size: 13px;
    color: #757575;
  }

  .game-score {
    font: 3rem bold; !important;
    font-family: "GongGothicMedium", sans-serif;
    font-weight: bold;

    &.away {
      margin-right: 45px;
    }

    &.home {
      margin-left: 45px;
    }
  }
`;

const StatusContainer = styled.div`
  text-align: center;
  font-family: "NanumSquareRound", sans-serif;

  /* 경기 상태 */
  .game-status {
    width: 100px;
    padding: 6px 12px;
    border-radius: 63px;
    background-color: #eaeaea;
    color: #6f6f6f;
    margin-bottom: 5px;
    font-size: 13px;
  }

  div {
    list-style: none;
    margin-bottom: 3px;
    padding: 0;
    color: #6f6f6f;
    font-size: 13px;
  }
`;

// 스코어보드 이닝 테이블 스타일
export const InningTable = styled(Table)`
  border-collapse: collapse;
  // width: 100%;
  table-layout: fixed;
  th:not(:first-child) {
    width: 15px; /* 이닝 테이블에 맞춘 고정 너비 */
  }
`;

/* 테이블 내용 */
const TableCell = styled.td`
  padding: 5px;
  text-align: center;
  border-bottom: none;
`;

const MatchCard = ({ match }) => {
  if (!match) return null;

  const {
    status,
    ground,
    gameDate,
    time,
    awayTeam,
    awayPitcher,
    awayWinOrLose,
    awayScore,
    awayRuns,
    awayHits,
    awayErrors,
    awayBalls,
    homeTeam,
    homePitcher,
    homeWinOrLose,
    homeScore,
    homeRuns,
    homeHits,
    homeErrors,
    homeBalls,
    season,
    ...innings
  } = match;

  // // 기본 이닝 수 설정
  // let totalInnings = 12;

  // 정규 시즌은 12이닝, 포스트 시즌은 15이닝
  const totalInnings = season === "포스트" ? 15 : 12;

  const awayInnings = Array.from(
    { length: totalInnings },
    (_, i) => innings[`awayInning${i + 1}`] || "-"
  );
  const homeInnings = Array.from(
    { length: totalInnings },
    (_, i) => innings[`homeInning${i + 1}`] || "-"
  );

  // // 포스트 시즌이면 최대 15이닝까지 표시 가능, 13~15이닝 중 데이터가 있는지 확인
  // if (season === "post") {
  //   const extraInningExists = Array.from(
  //     { length: 3 },
  //     (_, i) => innings[`awayInning${i + 13}`] || innings[`homeInning${i + 13}`]
  //   ).some(
  //     (inning) => inning !== undefined && inning !== null && inning !== "-"
  //   );

  //   // 추가 이닝 데이터가 있으면 15이닝으로 설정
  //   totalInnings = extraInningExists ? 15 : 12;
  // }

  // // 이닝 데이터 설정
  // const awayInnings = Array.from(
  //   { length: totalInnings },
  //   (_, i) => innings[`awayInning${i + 1}`] || "-"
  // );
  // const homeInnings = Array.from(
  //   { length: totalInnings },
  //   (_, i) => innings[`homeInning${i + 1}`] || "-"
  // );

  return (
    <MatchContainer>
      <TeamContainer>
        <div className="team-info">
          <div>
            <div className="team-name">{awayTeam || "원정 팀"}</div>
            <div className="team-pitcher">
              {awayPitcher || "원정 투수"}
              <WinLoseText $winLose={awayWinOrLose}>
                &nbsp;{awayWinOrLose}
              </WinLoseText>
            </div>
          </div>
          <div className="teamEM">
            <img
              src={getTeamEmblem(awayTeam)}
              alt={`원정 팀 ${awayTeam} 엠블럼`}
            />
          </div>
          <ScoreText
            className="game-score away"
            $isWin={awayWinOrLose === "승"}
          >{`${awayRuns || "-"}`}</ScoreText>
        </div>
        <StatusContainer>
          <div className="game-status">{status || "N/A"}</div>
          <div className="game-date">
            <span>
              {gameDate.slice(5, 10).split("-").join(".") || "N/A"}
              <RxDividerVertical />
            </span>
            <span>{time || "N/A"}</span>
          </div>
          <div className="ground">{ground || "N/A"}</div>
        </StatusContainer>
        <div className="team-info">
          <ScoreText
            className="game-score home"
            $isWin={homeWinOrLose === "승"}
          >{`${homeRuns || "-"}`}</ScoreText>
          <div className="teamEM">
            <img
              src={getTeamEmblem(homeTeam)}
              alt={`홈 팀 ${homeTeam} 엠블럼`}
            />
          </div>
          <div>
            <div className="team-name">{homeTeam || "홈 팀"}</div>
            <div className="team-pitcher">
              <WinLoseText $winLose={homeWinOrLose}>
                {homeWinOrLose}&nbsp;
              </WinLoseText>
              {homePitcher || "홈 투수"}
            </div>
          </div>
        </div>
      </TeamContainer>

      <InningTable>
        <TableHeader>
          <tr>
            <th>팀명</th>
            {Array.from({ length: totalInnings }, (_, i) => (
              <th key={i + 1}>{`${i + 1}`}</th>
            ))}
            {/* 이닝 옆에 H, R, E, B 헤더 추가 */}
            <th>H</th>
            <th>R</th>
            <th>E</th>
            <th>B</th>
          </tr>
        </TableHeader>
        <tbody>
          {/* 원정팀 이닝 및 HREB 정보 */}
          <tr>
            <TableCell>{awayTeam}</TableCell>
            {awayInnings.map((inning, index) => (
              <TableCell key={index}>{inning}</TableCell>
            ))}
            <TableCell>{awayHits || "-"}</TableCell>
            <TableCell>{awayRuns || "-"}</TableCell>
            <TableCell>{awayErrors || "-"}</TableCell>
            <TableCell>{awayBalls || "-"}</TableCell>
          </tr>

          {/* 홈팀 이닝 및 HREB 정보 */}
          <tr>
            <TableCell>{homeTeam}</TableCell>
            {homeInnings.map((inning, index) => (
              <TableCell key={index}>{inning}</TableCell>
            ))}
            <TableCell>{homeHits || "-"}</TableCell>
            <TableCell>{homeRuns || "-"}</TableCell>
            <TableCell>{homeErrors || "-"}</TableCell>
            <TableCell>{homeBalls || "-"}</TableCell>
          </tr>
        </tbody>
      </InningTable>
    </MatchContainer>
  );
};

export default MatchCard;
