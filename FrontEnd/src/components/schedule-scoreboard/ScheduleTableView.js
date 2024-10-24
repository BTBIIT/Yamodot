import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getTeamEmblem } from "../../contexts/teamsData";
import { formatDate } from "../../utils/DateUtils";
import { SubContentContainer } from "../../styles/CommonStyles";
import { TeamContainer } from "./MatchCard";
import VS from "../../assets/images/VS.png";

const ScheduleCard = styled.div`
  font-family: "NanumSquareRound", sans-serif;
  margin-bottom: 29px;
  border: 1px solid #ddd;
  border-radius: 10px;
`;

// 1008 다은 - 테이블 스타일 병 변경
const ScheduleTable = styled.table`
  font-family: "NanumSquareRound", sans-serif;
  width: 100%;
  border-collapse: collapse;
  margin: 10px auto;
  border-bottom: none;
  table-layout: fixed;

  th:first-child {
    width: 15%;
  }
  th:nth-child(2) {
    width: 10%;
  }
  th:nth-child(3) {
    width: 53%;
  }
  th:nth-child(4) {
    width: 10%;
  }
  th:last-child {
    width: 12%;
  }
  td:first-child {
    width: 15%;
  }
  td:nth-child(2) {
    width: 10%;
  }
  td:nth-child(3) {
    width: 53%;
  }
  td:nth-child(4) {
    width: 10%;
  }
  td:last-child {
    width: 12%;
  }
`;

const Thead = styled.thead`
  th {
    height: 50px;
    padding: 10px;
    background-color: #f6f6f6;
    text-align: center;
    font-size: 0.8rem;

    &:first-child {
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
    }
    &:last-child {
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
    }
  }
`;

const Row = styled.tr`
  border-bottom: 1px solid #ddd;
  &:last-child {
    border-bottom: none;
  }
  
  }
`;

// const ScheduleTeamContainer = styled.div`
//   font-family: "GongGothicMedium", sans-serif;
//   padding: 0;
//   margin: 0;
//   display: flex;
//   align-items: center;
//   justify-content: space-around;

//   .schedule-team-name,
//   .schedule-team-pitcher {
//     flex-direction: column;
//   }

//   .schedule-game-score {
//     font: 20px bold; !important;
//     font-family: "GongGothicMedium", sans-serif;
//     font-weight: bold;

//     &.away {
//       margin-right: 25px;
//     }

//     &.home {
//       margin-left: 25px;
//     }
//   }

//   .schedule-vs-img{
//     width: 30px;}
// `;

// const ScheduleTeamInfo = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 10px;

//   .schedule-team-name {
//     font-size: 20px;
//   }

//   .schedule-team-pitcher {
//     font-size: 12px;
//   }
// `;

// const ScheduleTeamContainer = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-around;
//   width: 100%;
//   gap: 13px; // 각 팀과 VS 이미지 사이 간격을 추가

//   .schedule-team-section {
//     display: flex;
//     align-items: center;
//     gap: 5px; // 요소들 사이의 간격을 조정

//   }

//   .schedule-vs-img {
//     width: 26px; // VS 이미지를 중앙에 배치
//   }
//     .schedule-game-score {
//     font: 20px bold; !important;
//     font-family: "GongGothicMedium", sans-serif;
//     font-weight: bold;

//     &.away {
//       // margin-right: 25px;
//     }

//     &.home {
//       // margin-left: 25px;
//     }

//   }

// `;
const ScheduleTeamContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around; // 좌우에 팀 엠블럼과 팀 정보 배치
  width: 100%;
  gap: 0.5vw; // 좌우 간격 조정
  margin: 10px;
  font-size: 13px;

  img {
    width: 4vw;
    vertical-align: middle;
  }
  .schedule-team-section {
    display: flex;
    align-items: center;
    gap: 2vw; // 엠블럼과 팀 정보 사이 간격
  }

  .schedule-vs-img {
    width: 1.5vw; // VS 이미지 크기
  }

  .schedule-game-score {
    font-size: 1.3rem;
    font-family: "GongGothicMedium", sans-serif;
    font-weight: bold;
    text-align: center;
  }
`;

const ScheduleTeamInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ isAway }) =>
    isAway ? "flex-start" : "flex-end"}; // 원정팀은 왼쪽, 홈팀은 오른쪽 정렬
  gap: 4px;

  .schedule-team-name {
    font-size: 1.1rem;
    font-weight: bold;
  }

  .schedule-team-pitcher {
    font-size: 0.6rem;
    color: #757575;
  }

  .schedule-winlose {
    font-size: 0.6rem;
    font-weight: bold;
  }
`;

const LinkToScoreboard = styled(Link)`
  text-decoration: none;
  color: #7d7d7d;
  font-size: 0.5rem;
`;

const DateCell = styled.td`
  text-align: center;
  font-weight: bold;
  vertical-align: middle;
  border-bottom: none;
  padding: 10px;
  font-size: 0.8rem;
`;

export const WinLoseText = styled.span`
  color: ${({ $winLose }) =>
    $winLose === "승" ? "#D71E17" : $winLose === "패" ? "#0008C5" : "#757575"};
`;

export const ScoreText = styled.span`
  color: ${({ $isWin }) => ($isWin ? "#D71E17" : "#6D6D6D")};
  font-size: 16px;
`;

const ScheduleTableView = ({ scheduleResults }) => {
  const formatScheduleDate = (dateString) =>
    formatDate(dateString, "MM.DD(ddd)");

  // scheduleResults가 없거나 undefined일 때 빈 객체로 초기화
  const results = scheduleResults || {};
  console.log(results);
  return (
    <SubContentContainer>
      <ScheduleTable>
        <Thead>
          <tr>
            <th className="schedule-date">날짜</th>
            <th className="schedule-time">시간</th>
            <th className="schedule-game">경기</th>
            <th className="schedule-ground">구장</th>
            <th className="schedule-etc">비고</th>
          </tr>
        </Thead>
      </ScheduleTable>

      {Object.keys(results).length > 0 ? (
        Object.keys(results).map((dateKey) => (
          <ScheduleCard key={dateKey}>
            <ScheduleTable>
              <tbody>
                {results[dateKey].map((game, gameIndex) => (
                  <Row key={gameIndex}>
                    {gameIndex === 0 && (
                      <DateCell rowSpan={results[dateKey].length}>
                        {formatScheduleDate(dateKey)}
                        <br />
                        <LinkToScoreboard
                          to={`/scheduleresults/scoreboard?date=${dateKey}`}
                        >
                          스코어보드 &gt;
                        </LinkToScoreboard>
                      </DateCell>
                    )}
                    <td>{game.time}</td>
                    <td>
                      <ScheduleTeamContainer>
                        <ScheduleTeamInfo>
                          <div className="schedule-team-section">
                            <img
                              src={getTeamEmblem(game.away)}
                              alt={game.away}
                            />
                            <div>
                              <div className="schedule-team-name">
                                {game.away}
                              </div>
                              <div className="schedule-team-pitcher">
                                {game.awayPitcher}&nbsp;
                                <WinLoseText
                                  $winLose={game.awayWinLose}
                                  className="schedule-winlose"
                                >
                                  {game.awayWinLose}
                                </WinLoseText>
                              </div>
                            </div>
                          </div>
                        </ScheduleTeamInfo>
                        {/* 취소된 경기 처리 */}
                        {game.etc.includes("취소") ? (
                          <div>vs</div>
                        ) : (
                          <>
                            <ScoreText
                              className="schedule-game-score away"
                              $isWin={game.awayWinLose === "승"}
                            >
                              {game.awayScore}
                            </ScoreText>
                            <div>
                              <img
                                src={VS}
                                className="schedule-vs-img"
                                alt=""
                              />
                            </div>
                            <ScoreText
                              className="schedule-game-score home"
                              $isWin={game.homeWinLose === "승"}
                            >
                              {game.homeScore}
                            </ScoreText>
                          </>
                        )}
                        <ScheduleTeamInfo>
                          <div className="schedule-team-section">
                            <div>
                              <div className="schedule-team-name">
                                {game.home}
                              </div>
                              <div className="schedule-team-pitcher">
                                <WinLoseText
                                  $winLose={game.homeWinLose}
                                  className="schedule-winlose"
                                >
                                  {game.homeWinLose}
                                </WinLoseText>
                                &nbsp;
                                {game.homePitcher}
                              </div>
                            </div>
                            <img
                              src={getTeamEmblem(game.home)}
                              alt={game.home}
                            />
                          </div>
                        </ScheduleTeamInfo>
                      </ScheduleTeamContainer>
                    </td>
                    <td>{game.ground}</td>
                    <td>{game.etc}</td>
                  </Row>
                ))}
              </tbody>
            </ScheduleTable>
          </ScheduleCard>
        ))
      ) : (
        <p>데이터가 없습니다.</p>
      )}
    </SubContentContainer>
  );
};

export default ScheduleTableView;
