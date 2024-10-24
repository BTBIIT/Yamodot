// import React from "react";
// import { teams } from "../../contexts/teamsData";
// import styled, { css } from "styled-components";

// // 기본 스타일 정의
// export const TeamSelectStyled = styled.select`
//   border: 1px solid #eee;
//   padding: 5px 10px;
//   border-radius: 5px;

//   /* 기록 및 게시판 */
//   ${(props) =>
//     props.$selectType === "board" &&
//     css`
//       width: 132px;
//       height: 48px;
//       border: 1px solid #b1b1b1;
//       background-color: #ffffff;
//       color: #000000;
//       border-radius: 60px;
//     `}

//   /* 회원 정보 구단 선택 */
//   ${(props) =>
//     props.$selectType === "custom" &&
//     css`
//       width: 499px;
//       height: 66px;
//       border-radius: 60px;
//       font-size: 18px;
//       background-color: #ededed;
//       border: none;
//       margin-top: 20px;
//       padding: 0 30px;
//       box-sizing: border-box;

//       &:focus {
//         outline-color: #d71e17;
//       }
//     `}
// `;

// const TeamSelect = ({
//   selectedTeam,
//   setSelectedTeam,
//   $selectType,
//   labelType,
// }) => {
//   return (
//     <TeamSelectStyled
//       value={selectedTeam} // 부모로부터 전달된 selectedTeam 사용
//       onChange={(e) => setSelectedTeam(e.target.value)} // 부모로부터 전달된 setSelectedTeam 사용
//       $selectType={$selectType} // 스타일 타입 적용
//     >
//       {/* labelType에 따라 '투수팀', '타자팀'이 표시되고 '전체'는 표시되지 않음 */}
//       <option value="%25">
//         {labelType === "pitcher"
//           ? "투수 팀"
//           : labelType === "batter"
//           ? "타자 팀"
//           : "구단 선택"}
//       </option>
//       {teams
//         .filter((team) => team.value !== "%25") // teamsData의 '전체' 항목 제거
//         .map((team) => (
//           <option key={team.value} value={team.value}>
//             {team.label} {/* 팀 이름 표시 */}
//           </option>
//         ))}
//     </TeamSelectStyled>
//   );
// };

// export default TeamSelect;

//###########################################################################
import React from "react";
import { teams } from "../../contexts/teamsData";
import styled, { css } from "styled-components";

// 기본 스타일 정의
export const TeamSelectStyled = styled.select`
  border: 1px solid #eee;
  padding: 5px 10px;
  border-radius: 5px;
  font: 0.9rem "NanumSquareRound";
  color: #757575;

  /* 기록 및 게시판 */
  ${(props) =>
    props.$selectType === "board" &&
    css`
      padding: 0px 6px;
      width: 5.2vw;
      height: 4.8vh;
      min-width: 90px;
      min-height: 38px;
      border: 0.3px solid #b1b1b1;
      background-color: #ffffff;
      color: #000000;
      border-radius: 60px;
      font-size: 0.83rem;
    `}

  /* 회원 정보 구단 선택 */
  ${(props) =>
    props.$selectType === "custom" &&
    css`
      width: 21vw;
      height: 6.5vh;
      min-width: 380px;
      min-height: 55px;
      border-radius: 60px;
      font-size: 1rem;
      background-color: #ededed;
      border: none;
      margin-top: 10px;
      padding: 0 25px;
      box-sizing: border-box;

      &:focus {
        outline-color: #d71e17;
      }
    `}
`;

const TeamSelect = ({
  selectedTeam,
  setSelectedTeam,
  $selectType,
  labelType,
  teams: availableTeams, // 추가된 prop: 선택 가능한 팀 목록
}) => {
  // 사용할 팀 목록 결정: availableTeams가 전달되면 이를 사용하고, 아니면 기본 teams 사용
  const teamOptions = availableTeams || teams;

  return (
    <TeamSelectStyled
      value={selectedTeam} // 부모로부터 전달된 selectedTeam 사용
      onChange={(e) => setSelectedTeam(e.target.value)} // 부모로부터 전달된 setSelectedTeam 사용
      $selectType={$selectType} // 스타일 타입 적용
    >
      {/* labelType에 따라 '투수팀', '타자팀'이 표시되고 '전체'는 표시되지 않음 */}
      <option value="%25">
        {labelType === "pitcher"
          ? "투수 팀"
          : labelType === "batter"
          ? "타자 팀"
          : labelType === "all"
          ? "통합"
          : labelType === "boardName"
          ? "게시판명"
          : "구단 선택"}
      </option>
      {teamOptions
        .filter((team) => team.value !== "%25") // teamsData의 '전체' 항목 제거
        .map((team) => (
          <option key={team.value} value={team.value}>
            {team.label} {/* 팀 이름 표시 */}
          </option>
        ))}
    </TeamSelectStyled>
  );
};

export default TeamSelect;
