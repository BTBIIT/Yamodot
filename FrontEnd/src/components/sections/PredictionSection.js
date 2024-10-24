// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import dayjs from "dayjs";
// import { getTeamEmblem } from "../../contexts/teamsData";
// import styled from "styled-components";
// import {
//   SectionContainer,
//   PredictionBoxContainer,
//   LinkContainer,
// } from "../../styles/CommonStyles";
// import PredictionGraph from "../record/PredictionGraph"; // PredictionGraph를 임포트

// const ProbabilityBar = styled.div`
//   height: 50px;
//   border-radius: 10px;
//   display: flex;
//   align-items: center;
//   flex-grow: 1;
//   background-color: ${({ $isHome }) => ($isHome ? "#5E5E5E" : "#D02233")};
//   margin: ${({ $isHome }) => ($isHome ? "0 19px 0 4px" : "0 5px 0 19px")};
//   width: ${({ width }) => `${width}%`};
// `;

// const ProbabilityText = styled.span`
//   color: #ffffff;
//   font: 25px "GongGothicMedium", sans-serif;
//   position: relative;
//   left: ${({ $isHome }) => ($isHome ? "10px" : "calc(100% - 45px)")};
// `;

// const PredictionBox = ({ match }) => {
//   const { homeTeam, awayTeam, homeWinProb, awayWinProb } = match;

//   return (
//     <PredictionBoxContainer>
//       <div style={{ display: "flex", alignItems: "center" }}>
//         <img src={getTeamEmblem(awayTeam)} alt={awayTeam} />
//         <ProbabilityBar $isHome={false} width={awayWinProb}>
//           <ProbabilityText>{awayWinProb}</ProbabilityText>
//         </ProbabilityBar>
//         <ProbabilityBar $isHome={true} width={homeWinProb}>
//           <ProbabilityText $isHome={true}>{homeWinProb}</ProbabilityText>
//         </ProbabilityBar>
//         <img src={getTeamEmblem(homeTeam)} alt={homeTeam} />
//       </div>
//     </PredictionBoxContainer>
//   );
// };

// const PredictionSection = () => {
//   const [matches, setMatches] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const userFavoriteTeam = ""; // 사용자가 선택한 팀

//   useEffect(() => {
//     fetchTodayMatches();
//   }, []);

//   const fetchTodayMatches = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const today = dayjs().format("YYYY-MM-DD");
//       const response = await axios.post(
//         "http://localhost:5000/predict",
//         {
//           date: today, // 서버에서 오늘 날짜에 해당하는 경기를 요청
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const result = response.data;
//       setMatches(result || []);
//       console.log("API Response Data:", result);
//     } catch (err) {
//       setError(
//         err.response?.data?.error || "오늘 경기를 가져오는 데 실패했습니다."
//       );
//       console.error("Error fetching today's matches:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const today = dayjs().format("YYYY-MM-DD");
//   console.log("Today:", today);
//   const todayMatches = matches.filter((match) => {
//     const matchDate = dayjs(match.game_date).format("YYYY-MM-DD");
//     console.log("Match Date:", matchDate, "vs Today:", today);
//     return matchDate === today;
//   });

//   const userMatch = todayMatches.find(
//     (match) =>
//       match.home_team === userFavoriteTeam ||
//       match.away_team === userFavoriteTeam
//   );

//   const otherMatches = todayMatches
//     .filter((match) => match !== userMatch)
//     .slice(0, 2);

//   const displayMatches = userMatch
//     ? [userMatch, ...otherMatches]
//     : otherMatches;

//   const noData = !loading && !error && todayMatches.length === 0;

//   return (
//     <div className="prediction-section">
//       <SectionContainer style={{ backgroundColor: "#F6F6F6" }}>
//         <h2
//           style={{
//             textAlign: "center",
//             margin: "68px auto",
//             font: "50px/1.5 'GongGothicMedium', sans-serif",
//             color: "rgba(34,34,34,90%)",
//           }}
//         >
//           {todayMatches.length > 0
//             ? `${today.replace(/-/g, ".")} 승리 예측`
//             : `${today.replace(/-/g, ".")}` +
//               "승리 예측 가능한 경기가 없습니다."}
//         </h2>
//         {/* StatusMessage 내부에서 PredictionGraph를 조건에 따라 표시 */}

//         {!loading && !error && todayMatches.length > 0 && (
//           <PredictionGraph matches={displayMatches} />
//         )}

//         <LinkContainer to="/recordanalysis/analysis">
//           Go To Detail &gt;
//         </LinkContainer>
//       </SectionContainer>
//     </div>
//   );
// };

// export default PredictionSection;

//############################################################################################
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import dayjs from "dayjs";
// import styled from "styled-components";
// import { getTeamEmblem } from "../../contexts/teamsData";
// import StatusMessage from "../ui/StatusMessage";
// import {
//   SectionContainer,
//   PredictionBoxContainer,
//   LinkContainer,
// } from "../../styles/CommonStyles";

// /* 바 그래프 스타일 */
// export const ProbabilityBar = styled.div`
//   height: 50px;
//   border-radius: 10px;
//   display: flex;
//   flex-grow: 1;
//   align-items: center;
//   justify-content: ${({ $isHome }) => ($isHome ? "flex-start" : "flex-end")};
//   background-color: ${({ $isHome }) => ($isHome ? "#5E5E5E" : "#D02233")};
//   margin: ${({ $isHome }) => ($isHome ? "0 19px 0 4px" : "0 5px 0 19px")};
//   width: ${({ width }) => `${width}%`};
// `;

// /* 바 그래프 안 확률 텍스트 스타일 */
// export const ProbabilityText = styled.span`
//   color: #ffffff;
//   font: 25px "GongGothicMedium", sans-serif;
//   margin: ${({ $isHome }) => ($isHome ? "0 0 0 10px" : "0 10px 0 0")};
// `;

// // PredictionSection 컴포넌트
// const PredictionSection = () => {
//   const [matches, setMatches] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const userFavoriteTeam = ""; // 사용자가 선택한 팀

//   useEffect(() => {
//     fetchTodayMatches();
//   }, []);

//   const fetchTodayMatches = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const today = dayjs().format("YYYY-MM-DD");
//       const response = await axios.post(
//         "http://localhost:5000/api/predict",
//         { date: today },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       const result = response.data;
//       console.log("API Response Data:", result);
//       setMatches(result || []);
//     } catch (err) {
//       setError(
//         err.response?.data?.error || "오늘 경기를 가져오는 데 실패했습니다."
//       );
//       console.error("Error fetching today's matches:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const today = dayjs().format("YYYY-MM-DD");
//   const todayMatches = matches.filter((match) => {
//     const matchDate = dayjs(match.game_date).format("YYYY-MM-DD");
//     return matchDate === today;
//   });

//   const userMatch = todayMatches.find(
//     (match) =>
//       match.home_team === userFavoriteTeam ||
//       match.away_team === userFavoriteTeam
//   );

//   const otherMatches = todayMatches
//     .filter((match) => match !== userMatch)
//     .slice(0, 3);

//   const displayMatches = userMatch
//     ? [userMatch, ...otherMatches]
//     : otherMatches;

//   const noData = !loading && !error && todayMatches.length === 0;

//   return (
//     <SectionContainer style={{ backgroundColor: "#F6F6F6" }}>
//       <h2 className="section-title">
//         {todayMatches.length > 0
//           ? `${today.replace(/-/g, ".")} 승리 예측`
//           : `${today.replace(/-/g, ".")} 승리 예측 가능한 경기가 없습니다.`}
//       </h2>

//       {loading ? (
//         <StatusMessage loading="로딩 중입니다..." />
//       ) : error ? (
//         <StatusMessage error={error} />
//       ) : noData ? (
//         <StatusMessage noData="예측할 데이터가 없습니다." />
//       ) : (
//         displayMatches.map((match, index) => (
//           <PredictionBox key={index} match={match} />
//         ))
//       )}

//       <LinkContainer to="/recordanalysis/analysis">
//         Go To Detail &gt;
//       </LinkContainer>
//     </SectionContainer>
//   );
// };

// // PredictionBox 컴포넌트
// const PredictionBox = ({ match }) => {
//   const { home_team, away_team, new_probabilities } = match;
//   const homeWinProb = (new_probabilities?.[0] || 0) * 100;
//   const awayWinProb = (new_probabilities?.[1] || 0) * 100;

//   const homeTeamEmblem = getTeamEmblem(home_team);
//   const awayTeamEmblem = getTeamEmblem(away_team);

//   return (
//     <PredictionBoxContainer>
//       <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
//         <img src={awayTeamEmblem} alt={away_team} />
//         <ProbabilityBar $isHome={false} width={awayWinProb}>
//           <ProbabilityText>{awayWinProb.toFixed(2)}%</ProbabilityText>
//         </ProbabilityBar>
//         <ProbabilityBar $isHome={true} width={homeWinProb}>
//           <ProbabilityText $isHome={true}>
//             {homeWinProb.toFixed(2)}%
//           </ProbabilityText>
//         </ProbabilityBar>
//         <img src={homeTeamEmblem} alt={home_team} />
//       </div>
//     </PredictionBoxContainer>
//   );
// };

// export default PredictionSection;

// // const fetchTodayMatches = async () => {
// //   setLoading(true);
// //   setError(null);

// //   try {
// //     const today = dayjs().format("YYYY-MM-DD");
// //     const response = await axios.post(
// //       "http://localhost:5000/api/predict",
// //       { date: today },
// //       { headers: { "Content-Type": "application/json" } }
// //     );

// //     let result = response.data;
// //     console.log("API Response Data:", result);

// //     // 만약 오늘 경기가 없고, 백엔드에서 다음 경기 데이터를 제공한 경우 처리
// //     if (!result || result.error) {
// //       console.log("오늘 경기가 없습니다. 다음 경기를 찾는 중입니다...");

// //       const nextResponse = await axios.post(
// //         "http://localhost:5000/api/predict",
// //         { date: today, getNext: true },
// //         { headers: { "Content-Type": "application/json" } }
// //       );

// //       result = nextResponse.data;
// //       console.log("Next available game data:", result);
// //     }

// //     setMatches(result || []);
// //   } catch (err) {
// //     setError(
// //       err.response?.data?.error || "오늘 경기를 가져오는 데 실패했습니다."
// //     );
// //     console.error("Error fetching today's matches:", err);
// //   } finally {
// //     setLoading(false);
// //   }
// // };

//###############################################################
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import dayjs from "dayjs";
// import { useUser } from "../../contexts/UserContext";
// import styled from "styled-components";
// import { getTeamEmblem } from "../../contexts/teamsData";
// import StatusMessage from "../ui/StatusMessage";
// import {
//   SectionContainer,
//   PredictionBoxesContainer,
//   PredictionBoxContainer,
//   LinkContainer,
// } from "../../styles/CommonStyles";

// /* 바 그래프 스타일 */
// export const ProbabilityBar = styled.div`
//   height: 50px;
//   border-radius: 10px;
//   display: flex;
//   flex-grow: 1;
//   align-items: center;
//   justify-content: ${({ $isHome }) => ($isHome ? "flex-start" : "flex-end")};
//   background-color: ${({ $isHome }) => ($isHome ? "#5E5E5E" : "#D02233")};
//   margin: ${({ $isHome }) => ($isHome ? "0 19px 0 4px" : "0 5px 0 19px")};
//   width: ${({ width }) => `${width}%`};
// `;

// /* 바 그래프 안 확률 텍스트 스타일 */
// export const ProbabilityText = styled.span`
//   color: #ffffff;
//   font: 25px "GongGothicMedium", sans-serif;
//   margin: ${({ $isHome }) => ($isHome ? "0 0 0 10px" : "0 10px 0 0")};
// `;

// const PredictionSection = () => {
//   const [matches, setMatches] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user } = useUser();
//   console.log("user:", user);
//   const userFavoriteTeam = user?.userFavoriteTeam || null;

//   const fetchTodayMatches = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const today = dayjs().format("YYYY-MM-DD");
//       const response = await axios.post(
//         "http://localhost:5000/api/predict",
//         {
//           withCredentials: true, // 인증 정보를 포함
//         },
//         { date: today },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       let result = response.data;

//       if (!result || result.error) {
//         console.log("오늘 경기가 없습니다. 다음 경기를 찾는 중입니다...");

//         const nextResponse = await axios.post(
//           "http://localhost:5000/api/predict",
//           { date: today, getNext: true },
//           { headers: { "Content-Type": "application/json" } }
//         );

//         result = nextResponse.data;
//         console.log("Next available game data:", result);
//       }

//       setMatches(result || []);
//     } catch (err) {
//       setError(
//         err.response?.data?.error || "오늘 경기를 가져오는 데 실패했습니다."
//       );
//       console.error("Error fetching today's matches:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const matchDate =
//     matches.length > 0 ? dayjs(matches[0].gameDate).format("YYYY.MM.DD") : null;

//   useEffect(() => {
//     fetchTodayMatches();
//   }, []);

//   const displayTitle = matchDate
//     ? `${matchDate} 승리 예측`
//     : `${dayjs().format("YYYY.MM.DD")} 승리 예측 가능한 경기가 없습니다.`;

//   const noData = !loading && !error && matches.length === 0;

//   return (
//     <SectionContainer style={{ backgroundColor: "#F6F6F6" }}>
//       {/* 로딩 중일 때는 제목을 표시하지 않음 */}
//       {!loading && <h2 className="section-title">{displayTitle}</h2>}

//       {loading ? (
//         <StatusMessage loading={loading} />
//       ) : error ? (
//         <StatusMessage error={error} />
//       ) : noData ? (
//         <StatusMessage noData="예측할 경기가 없습니다." />
//       ) : (
//         matches.map((match, index) => (
//           <PredictionBox
//             key={index}
//             match={match}
//             userFavoriteTeam={userFavoriteTeam}
//           />
//         ))
//       )}

//       <LinkContainer to="/recordanalysis/analysis">
//         Go To Detail &gt;
//       </LinkContainer>
//     </SectionContainer>
//   );
// };

// const PredictionBox = ({ match }) => {
//   const { home_team, away_team, new_probabilities } = match;
//   const homeWinProb = (new_probabilities?.[0] || 0) * 100;
//   const awayWinProb = (new_probabilities?.[1] || 0) * 100;

//   const homeTeamEmblem = getTeamEmblem(home_team);
//   const awayTeamEmblem = getTeamEmblem(away_team);

//   return (
//     <PredictionBoxesContainer>
//       <PredictionBoxContainer>
//         <img src={awayTeamEmblem} alt={away_team} />
//         <ProbabilityBar $isHome={false} width={awayWinProb}>
//           <ProbabilityText>{awayWinProb.toFixed(2)}%</ProbabilityText>
//         </ProbabilityBar>
//         <ProbabilityBar $isHome={true} width={homeWinProb}>
//           <ProbabilityText $isHome={true}>
//             {homeWinProb.toFixed(2)}%
//           </ProbabilityText>
//         </ProbabilityBar>
//         <img src={homeTeamEmblem} alt={home_team} />
//       </PredictionBoxContainer>
//     </PredictionBoxesContainer>
//   );
// };

// export default PredictionSection;

//###################################################################################
/* 1012 선호구단 */
import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useUser } from "../../contexts/UserContext";
import styled from "styled-components";
import { getTeamEmblem } from "../../contexts/teamsData";
import StatusMessage from "../ui/StatusMessage";
import {
  SectionContainer,
  PredictionBoxesContainer,
  PredictionBoxContainer,
  LinkContainer,
} from "../../styles/CommonStyles";

/* 바 그래프 스타일 */
export const ProbabilityBar = styled.div`
  height: 50px;
  border-radius: 10px;
  display: flex;
  // flex-grow: 1;
  align-items: center;
  justify-content: ${({ $isHome }) => ($isHome ? "flex-start" : "flex-end")};
  background-color: ${({ $isHome }) => ($isHome ? "#5E5E5E" : "#D02233")};
  margin: ${({ $isHome }) => ($isHome ? "0 19px 0 4px" : "0 5px 0 19px")};
  width: ${({ width }) => `${width}%`};
  min-width: 5%;
  transition: width 0.3s ease; /* 부드럽게 너비 변화 */
`;

/* 바 그래프 안 확률 텍스트 스타일 */
export const ProbabilityText = styled.span`
  color: #ffffff;
  font: 25px "GongGothicMedium", sans-serif;
  margin: ${({ $isHome }) => ($isHome ? "0 0 0 10px" : "0 10px 0 0")};
`;

const PredictionSection = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser(); // 유저 정보에서 선호 구단을 가져옴
  const userFavoriteTeam = user?.userFavoriteTeam || null; // 선호 구단이 없을 수도 있으므로 기본값 처리

  const fetchTodayMatches = async () => {
    setLoading(true);
    setError(null);

    try {
      const today = dayjs().format("YYYY-MM-DD");
      const response = await axios.post(
        "http://localhost:5000/api/predict",
        {
          withCredentials: true, // 인증 정보를 포함
        },
        { date: today },
        { headers: { "Content-Type": "application/json" } }
      );

      let result = response.data;

      if (!result || result.error) {
        console.log("오늘 경기가 없습니다. 다음 경기를 찾는 중입니다...");

        const nextResponse = await axios.post(
          "http://localhost:5000/api/predict",
          { date: today, getNext: true },
          { headers: { "Content-Type": "application/json" } }
        );

        result = nextResponse.data;
        console.log("Next available game data:", result);
      }

      // 유저의 선호 구단이 포함된 경기를 가장 먼저 표시하도록 matches 정렬
      const sortedMatches = result.sort((a, b) => {
        const isAFavorite =
          a.home_team === userFavoriteTeam || a.away_team === userFavoriteTeam;
        const isBFavorite =
          b.home_team === userFavoriteTeam || b.away_team === userFavoriteTeam;

        return isAFavorite === isBFavorite ? 0 : isAFavorite ? -1 : 1;
      });

      setMatches(sortedMatches || []);
    } catch (err) {
      setError(
        err.response?.data?.error || "오늘 경기를 가져오는 데 실패했습니다."
      );
      console.error("Error fetching today's matches:", err);
    } finally {
      setLoading(false);
    }
  };

  const matchDate =
    matches.length > 0 ? dayjs(matches[0].gameDate).format("YYYY.MM.DD") : null;

  useEffect(() => {
    fetchTodayMatches();
  }, []);

  const displayTitle = matchDate
    ? `${matchDate} 승리 예측`
    : `${dayjs().format("YYYY.MM.DD")} 승리 예측 가능한 경기가 없습니다.`;

  const noData = !loading && !error && matches.length === 0;

  return (
    <SectionContainer style={{ backgroundColor: "#F6F6F6" }}>
      {/* 로딩 중일 때는 제목을 표시하지 않음 */}
      {!loading && <h2 className="section-title">{displayTitle}</h2>}

      {loading ? (
        <StatusMessage loading={loading} />
      ) : error ? (
        <StatusMessage error={error} />
      ) : noData ? (
        <StatusMessage noData="예측할 경기가 없습니다." />
      ) : (
        matches.map((match, index) => (
          <PredictionBox
            key={index}
            match={match}
            userFavoriteTeam={userFavoriteTeam}
          />
        ))
      )}

      <LinkContainer to="/recordanalysis/analysis">
        Go To Detail &gt;
      </LinkContainer>
    </SectionContainer>
  );
};

const PredictionBox = ({ match }) => {
  const { home_team, away_team, new_probabilities } = match;
  const homeWinProb = (new_probabilities?.[0] || 0) * 100;
  const awayWinProb = (new_probabilities?.[1] || 0) * 100;

  const homeTeamEmblem = getTeamEmblem(home_team);
  const awayTeamEmblem = getTeamEmblem(away_team);

  return (
    <PredictionBoxesContainer>
      <PredictionBoxContainer>
        <img src={awayTeamEmblem} alt={away_team} />
        <ProbabilityBar $isHome={false} width={awayWinProb}>
          <ProbabilityText>{awayWinProb.toFixed(2)}%</ProbabilityText>
        </ProbabilityBar>
        <ProbabilityBar $isHome={true} width={homeWinProb}>
          <ProbabilityText $isHome={true}>
            {homeWinProb.toFixed(2)}%
          </ProbabilityText>
        </ProbabilityBar>
        <img src={homeTeamEmblem} alt={home_team} />
      </PredictionBoxContainer>
    </PredictionBoxesContainer>
  );
};

export default PredictionSection;
