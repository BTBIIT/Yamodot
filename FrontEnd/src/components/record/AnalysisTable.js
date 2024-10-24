// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import PredictionGraph from "./PredictionGraph";
// import VictoryChart from "./VictoryChart";
// import PitcherPlayer from "./PitcherPlayer";
// import BatterPlayer from "./BatterPlayer";
// import DefencePlayer from "./DefencePlayer";
// import GroundPlot from "./GroundPlot";
// import PredictionForm from "./PredictionForm";
// import Button from "../ui/Button";
// import StatusMessage from "../ui/StatusMessage";
// import dayjs from "dayjs";
// import { formatDate } from "../../utils/DateUtils";
// import {
//   ContentContainer,
//   ContentTitle,
//   SubCategoryContainer,
//   HR,
// } from "../../styles/CommonStyles";
// import styled from "styled-components";

// const AccordionContainer = styled.div`
//   margin-bottom: 30px;
// `;

// const AccordionHeader = styled.div`
//   display: flex;
//   align-items: center;
//   padding: 15px;
//   background: #fff;
//   border: 1px solid #bdbdbd;
//   border-radius: 40px;
//   cursor: pointer;
// `;

// const AccordionContent = styled.div`
//   border: 1px solid #bdbdbd;
//   border-radius: 40px;
//   padding: 20px;
//   background: #fff;
//   display: ${({ isOpen }) => (isOpen ? "block" : "none")};
// `;

// const AnalysisAccordion = ({ match }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleAccordion = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <AccordionContainer>
//       <AccordionHeader onClick={toggleAccordion}>
//         <div style={{ display: "flex", alignItems: "center" }}>
//           <PredictionGraph match={match} compact={true} />
//         </div>
//         <div>{isOpen ? "▲" : "▼"}</div>
//       </AccordionHeader>
//       <AccordionContent isOpen={isOpen}>
//         <VictoryChart match={match} />
//         <PitcherPlayer match={match} />
//         <BatterPlayer match={match} />
//         <DefencePlayer match={match} />
//       </AccordionContent>
//     </AccordionContainer>
//   );
// };

// const AnalysisTable = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [matches, setMatches] = useState([]);
//   const [date, setDate] = useState(dayjs());
//   const [selectedCategory, setSelectedCategory] = useState(0);

//   const formatVictoryDate = (date) => formatDate(date, "YYYY.MM.DD (ddd)");

//   const handleCategoryClick = (index) => {
//     setSelectedCategory(index);
//   };

//   useEffect(() => {
//     const fetchMatchData = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:5000/api/today-matches"
//         );

//         const matchData = response.data;

//         // 각 경기에 대해 승리 확률 데이터를 가져와서 match 객체에 추가
//         const enrichedMatches = await Promise.all(
//           matchData.map(async (match) => {
//             try {
//               const predictResponse = await axios.post(
//                 "http://localhost:5000/predict",
//                 { matchTeamName: match.awayTeam && match.homeTeam } // match ID를 이용하여 확률 데이터를 요청 (matchId는 예시)
//               );
//               const probabilities = predictResponse.data.new_probabilities;

//               return {
//                 ...match,
//                 new_probabilities: probabilities,
//               };
//             } catch (error) {
//               console.error("Error fetching prediction data:", error);
//               return match;
//             }
//           })
//         );

//         setMatches(enrichedMatches);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMatchData();
//   }, []);

//   return (
//     <ContentContainer>
//       <ContentTitle>분석</ContentTitle>

//       <SubCategoryContainer>
//         <Button
//           children="승리 예측"
//           $buttonType="subCategory"
//           $selected={selectedCategory === 0}
//           onClick={() => handleCategoryClick(0)}
//         />
//         <Button
//           children="구장별 승리 확률"
//           $buttonType="subCategory"
//           $selected={selectedCategory === 1}
//           onClick={() => handleCategoryClick(1)}
//         />
//         <Button
//           children="승패 예측 서비스"
//           $buttonType="subCategory"
//           $selected={selectedCategory === 2}
//           onClick={() => handleCategoryClick(2)}
//         />
//       </SubCategoryContainer>

//       <HR />

//       <>
//         {selectedCategory === 0 && (
//           <>
//             <h3>{formatVictoryDate(date)} 승리 예측</h3>
//             {matches.map((match, index) => (
//               <AnalysisAccordion key={index} match={match} />
//             ))}
//           </>
//         )}
//         {selectedCategory === 1 && <GroundPlot />}
//         {selectedCategory === 2 && <PredictionForm />}
//       </>
//     </ContentContainer>
//   );
// };

// export default AnalysisTable;

//###########################################################################
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import PredictionGraph from "./PredictionGraph";
// import VictoryChart from "./VictoryChart";
// import PitcherPlayer from "./PitcherPlayer";
// import BatterPlayer from "./BatterPlayer";
// import DefencePlayer from "./DefencePlayer";
// import GroundPlot from "./GroundPlot";
// import PredictionForm from "./PredictionForm";
// import Button from "../ui/Button";
// import StatusMessage from "../ui/StatusMessage";
// import dayjs from "dayjs";
// import { formatDate } from "../../utils/DateUtils";
// import {
//   ContentContainer,
//   ContentTitle,
//   SubCategoryContainer,
//   HR,
// } from "../../styles/CommonStyles";
// import styled from "styled-components";

// const AccordionContainer = styled.div`
//   margin-bottom: 30px;
// `;

// const AccordionHeader = styled.div`
//   display: flex;
//   align-items: center;
//   padding: 15px;
//   background: #fff;
//   border: 1px solid #bdbdbd;
//   border-radius: 40px;
//   cursor: pointer;
// `;

// const AccordionContent = styled.div`
//   border: 1px solid #bdbdbd;
//   border-radius: 40px;
//   padding: 20px;
//   background: #fff;
//   display: ${({ isOpen }) => (isOpen ? "block" : "none")};
// `;

// const AnalysisAccordion = ({ match }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleAccordion = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <AccordionContainer>
//       <AccordionHeader onClick={toggleAccordion}>
//         <div style={{ display: "flex", alignItems: "center" }}>
//           <PredictionGraph match={match} compact={true} />
//         </div>
//         <div>{isOpen ? "▲" : "▼"}</div>
//       </AccordionHeader>
//       <AccordionContent isOpen={isOpen}>
//         <VictoryChart match={match} />
//         <PitcherPlayer match={match} />
//         <BatterPlayer match={match} />
//         <DefencePlayer match={match} />
//       </AccordionContent>
//     </AccordionContainer>
//   );
// };

// const AnalysisTable = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [matches, setMatches] = useState([]);
//   const [date, setDate] = useState(dayjs());
//   const [selectedCategory, setSelectedCategory] = useState(0);

//   const formatVictoryDate = (date) => formatDate(date, "YYYY.MM.DD (ddd)");

//   const handleCategoryClick = (index) => {
//     setSelectedCategory(index);
//   };

//   useEffect(() => {
//     const fetchMatchData = async () => {
//       try {
//         // 오늘의 경기 데이터를 가져옵니다.
//         const response = await axios.get(
//           "http://localhost:5000/api/today-matches"
//         );
//         const matchData = response.data;

//         // prediction 데이터를 가져옵니다.
//         const predictionResponse = await axios.post(
//           "http://localhost:5000/predict"
//         );
//         const predictionData = predictionResponse.data;

//         // pitcher-comparisons 데이터를 가져옵니다.
//         const pitchersResponse = await axios.get(
//           "http://localhost:5000/api/pitcher-comparisons"
//         );
//         const pitchersData = pitchersResponse.data;

//         // batter-comparisons 데이터를 가져옵니다.
//         const battersResponse = await axios.get(
//           "http://localhost:5000/api/batter-comparisons"
//         );
//         const battersData = battersResponse.data;

//         // defences-comparisons 데이터를 가져옵니다.
//         const defencesResponse = await axios.get(
//           "http://localhost:5000/api/defences-comparisons"
//         );
//         const defencesData = defencesResponse.data;

//         // matchData, predictionData, pitchersData, defencesData, battersData를 병합합니다.
//         const enrichedMatches = matchData.map((match, index) => {
//           const prediction = predictionData[index];
//           const pitcher = pitchersData[index];
//           const batter = battersData[index];
//           const defence = defencesData[index];

//           return {
//             ...match,
//             new_probabilities: prediction?.new_probabilities,
//             accuracy: prediction?.accuracy,
//             auc: prediction?.auc,
//             pitcherChart: pitcher.chart, // 투수
//             awayPitchers: pitcher.names.awayPitchers,
//             homePitchers: pitcher.names.homePitchers,
//             batterChart: batter.chart, // 타자
//             awayBatters: batter.names.awayBatters,
//             homeBatters: batter.names.homeBatters,
//             defenceChart: defence.chart, // 수비
//             awayDefences: defence.names.awayDefences,
//             homeDefences: defence.names.homeDefences,
//           };
//         });

//         // 병합된 데이터를 상태로 설정합니다.
//         setMatches(enrichedMatches);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMatchData();
//   }, []);

//   // 분석 타이틀과 버튼들을 항상 렌더링
//   return (
//     <ContentContainer>
//       <ContentTitle>분석</ContentTitle>

//       <SubCategoryContainer>
//         <Button
//           children="승리 예측"
//           $buttonType="subCategory"
//           $selected={selectedCategory === 0}
//           onClick={() => handleCategoryClick(0)}
//         />
//         <Button
//           children="구장별 승리 확률"
//           $buttonType="subCategory"
//           $selected={selectedCategory === 1}
//           onClick={() => handleCategoryClick(1)}
//         />
//         <Button
//           children="승패 예측 서비스"
//           $buttonType="subCategory"
//           $selected={selectedCategory === 2}
//           onClick={() => handleCategoryClick(2)}
//         />
//       </SubCategoryContainer>

//       <HR />

//       {/* 로딩 중일 때 메시지 표시 */}
//       {loading && <StatusMessage loading="로딩 중입니다..." />}

//       {/* 에러가 있을 때 메시지 표시 */}
//       {error && <StatusMessage error={`에러가 발생했습니다: ${error}`} />}

//       {/* 데이터가 없을 때 메시지 표시 */}
//       {!loading && !error && matches.length === 0 && (
//         <StatusMessage noData="예측할 데이터가 없습니다." />
//       )}

//       {/* 데이터가 있을 때 아코디언 표시 */}
//       {matches.length > 0 && selectedCategory === 0 && (
//         <>
//           <h3>{formatVictoryDate(date)} 승리 예측</h3>
//           {matches.map((match, index) => (
//             <AnalysisAccordion key={index} match={match} />
//           ))}
//         </>
//       )}

//       {selectedCategory === 1 && <GroundPlot />}
//       {selectedCategory === 2 && <PredictionForm />}
//     </ContentContainer>
//   );
// };

// export default AnalysisTable;

//#####################################################################################################################
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import PredictionGraph from "./PredictionGraph";
// import VictoryChart from "./VictoryChart";
// import PitcherPlayer from "./PitcherPlayer";
// import BatterPlayer from "./BatterPlayer";
// import DefencePlayer from "./DefencePlayer";
// import GroundPlot from "./GroundPlot";
// import PredictionForm from "./PredictionForm";
// import Button from "../ui/Button";
// import StatusMessage from "../ui/StatusMessage";
// import dayjs from "dayjs";
// import { formatDate } from "../../utils/DateUtils";
// import {
//   ContentContainer,
//   ContentTitle,
//   SubCategoryContainer,
//   SubContentContainer,
//   HR,
// } from "../../styles/CommonStyles";
// import styled from "styled-components";

// const AccordionContainer = styled.div`
//   margin-bottom: 30px;
//   outline: 1px solid #bdbdbd;
//   border-radius: 40px;
// `;

// const AccordionHeader = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: 30px 20px;
//   background: #fff;
//   cursor: pointer;
//   width: 100%;
// `;

// // const AccordionContent = styled.div`
// //   border: 1px solid #bdbdbd;
// //   border-radius: 40px;
// //   padding: 20px;
// //   background: #fff;
// //   display: ${({ isOpen }) => (isOpen ? "block" : "none")};
// // `;

// const AccordionContent = styled.div`
//   padding: ${({ isOpen }) =>
//     isOpen ? "20px" : "0 20px"}; // 닫힌 상태에서는 수직 패딩을 제거
//   background: #fff;
//   height: ${({ isOpen }) => (isOpen ? "auto" : "0")};
//   transform: scaleY(${({ isOpen }) => (isOpen ? 1 : 0)});
//   transform-origin: top;
//   opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
//   transition: transform 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
// `;

// const AnalysisAccordion = ({ match }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleAccordion = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <AccordionContainer className="accordion-container">
//       <AccordionHeader className="accordion-header" onClick={toggleAccordion}>
//         <div style={{ display: "flex", alignItems: "center" }}>
//           <PredictionGraph match={match} />
//         </div>
//         {/* <div>{isOpen ? "▲" : "▼"}</div> */}
//       </AccordionHeader>
//       <AccordionContent isOpen={isOpen}>
//         <VictoryChart match={match} />
//         <PitcherPlayer match={match} />
//         <BatterPlayer match={match} />
//         <DefencePlayer match={match} />
//       </AccordionContent>
//     </AccordionContainer>
//   );
// };

// const AnalysisTable = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [matches, setMatches] = useState([]);
//   const [gameDate, seGameDate] = useState(dayjs());
//   const [selectedCategory, setSelectedCategory] = useState(0);

//   const formatVictoryDate = (gameDate) =>
//     formatDate(gameDate, "YYYY.MM.DD (ddd)");

//   const handleCategoryClick = (index) => {
//     setSelectedCategory(index);
//   };

//   useEffect(() => {
//     const fetchMatchData = async () => {
//       try {
//         // 오늘의 경기 데이터를 가져옵니다.
//         const response = await axios.get(
//           "http://localhost:5000/api/today-matches"
//         );
//         const matchData = response.data;

//         // prediction 데이터를 가져옵니다.
//         const predictionResponse = await axios.post(
//           "http://localhost:5000/api/predict"
//         );
//         const predictionData = predictionResponse.data;

//         // pitcher-comparisons 데이터를 가져옵니다.
//         const pitchersResponse = await axios.get(
//           "http://localhost:5000/api/pitcher-comparisons"
//         );
//         const pitchersData = pitchersResponse.data;

//         // batter-comparisons 데이터를 가져옵니다.
//         const battersResponse = await axios.get(
//           "http://localhost:5000/api/batter-comparisons"
//         );
//         const battersData = battersResponse.data;

//         // defences-comparisons 데이터를 가져옵니다.
//         const defencesResponse = await axios.get(
//           "http://localhost:5000/api/defences-comparisons"
//         );
//         const defencesData = defencesResponse.data;

//         // matchData, predictionData, pitchersData, defencesData, battersData를 병합합니다.
//         const enrichedMatches = matchData.map((match, index) => {
//           const prediction = predictionData[index];
//           const pitcher = pitchersData[index];
//           const batter = battersData[index];
//           const defence = defencesData[index];

//           return {
//             ...match,
//             new_probabilities: prediction?.new_probabilities,
//             gameDate: prediction?.gameDate,
//             accuracy: prediction?.accuracy,
//             auc: prediction?.auc,
//             pitcherChart: pitcher.chart,
//             awayPitchers: pitcher.names.awayPitchers,
//             homePitchers: pitcher.names.homePitchers,
//             batterChart: batter.chart,
//             awayBatters: batter.names.awayBatters,
//             homeBatters: batter.names.homeBatters,
//             defenceChart: defence.chart,
//             awayDefences: defence.names.awayDefences,
//             homeDefences: defence.names.homeDefences,
//             awayTeamColor: batter.awayTeamColor,
//             homeTeamColor: batter.homeTeamColor,
//           };
//         });

//         // 병합된 데이터를 상태로 설정합니다.
//         setMatches(enrichedMatches);

//         // 가장 빠른 경기 날짜를 gameDate 상태로 설정합니다.
//         if (enrichedMatches.length > 0) {
//           const earliestDate = dayjs(enrichedMatches[0].gameDate);
//           seGameDate(earliestDate);
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMatchData();
//   }, []);

//   return (
//     <ContentContainer>
//       <ContentTitle>분석</ContentTitle>

//       <SubCategoryContainer>
//         <Button
//           children="승리 예측"
//           $buttonType="subCategory"
//           $selected={selectedCategory === 0}
//           onClick={() => handleCategoryClick(0)}
//         />
//         <Button
//           children="구장별 승리 확률"
//           $buttonType="subCategory"
//           $selected={selectedCategory === 1}
//           onClick={() => handleCategoryClick(1)}
//         />
//         <Button
//           children="승패 예측 서비스"
//           $buttonType="subCategory"
//           $selected={selectedCategory === 2}
//           onClick={() => handleCategoryClick(2)}
//         />
//       </SubCategoryContainer>

//       <SubContentContainer>
//         <HR />

//         {/* 로딩 중일 때 메시지 표시 */}
//         {loading && <StatusMessage loading="로딩 중입니다..." />}

//         {/* 에러가 있을 때 메시지 표시 */}
//         {error && <StatusMessage error={`에러가 발생했습니다: ${error}`} />}

//         {/* 데이터가 없을 때 메시지 표시 */}
//         {!loading && !error && matches.length === 0 && (
//           <StatusMessage noData="예측할 데이터가 없습니다." />
//         )}

//         {/* 데이터가 있을 때 아코디언 표시 */}
//         {matches.length > 0 && selectedCategory === 0 && (
//           <>
//             <h3>{formatVictoryDate(gameDate)} 승리 예측</h3>
//             {matches.map((match, index) => (
//               <AnalysisAccordion key={index} match={match} />
//             ))}
//           </>
//         )}

//         {selectedCategory === 1 && <GroundPlot />}
//         {selectedCategory === 2 && <PredictionForm />}
//       </SubContentContainer>
//     </ContentContainer>
//   );
// };

// export default AnalysisTable;

//#####################################################################################################################
/* 선호 구단 */
import React, { useState, useEffect } from "react";
import axios from "axios";
import PredictionGraph from "./PredictionGraph";
import VictoryChart from "./VictoryChart";
import PitcherPlayer from "./PitcherPlayer";
import BatterPlayer from "./BatterPlayer";
import DefencePlayer from "./DefencePlayer";
import GroundPlot from "./GroundPlot";
import PredictionForm from "./PredictionForm";
import Button from "../ui/Button";
import StatusMessage from "../ui/StatusMessage";
import dayjs from "dayjs";
import { formatDate } from "../../utils/DateUtils";
import {
  ContentContainer,
  ContentTitle,
  SubCategoryContainer,
  SubContentContainer,
  HR,
  SubTitle,
} from "../../styles/CommonStyles";
import styled from "styled-components";
import { useUser } from "../../contexts/UserContext"; // 유저 정보를 가져옴
import { FaAlignCenter } from "react-icons/fa";

const AccordionContainer = styled.div`
  margin: 30px 0;
  outline: 1px solid #bdbdbd;
  border-radius: 40px;
`;

const AccordionHeader = styled.div`
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px;
  // background: #fff;
  cursor: pointer;
  width: 100%;
`;

const AccordionContent = styled.div`
  min-width: 100%;
  padding: ${({ $isOpen }) => ($isOpen ? "20px" : "0 20px")};
  // background: #fff;
  height: ${({ $isOpen }) => ($isOpen ? "auto" : "0")};
  transform: scaleY(${({ $isOpen }) => ($isOpen ? 1 : 0)});
  transform-origin: top;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: transform 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
`;

const AnalysisAccordion = ({ match }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <AccordionContainer className="accordion-container">
      <AccordionHeader className="accordion-header" onClick={toggleAccordion}>
        <div>
          <PredictionGraph match={match} />
        </div>
      </AccordionHeader>
      <AccordionContent $isOpen={isOpen}>
        <VictoryChart
          match={match}
          style={{ display: "flex", padding: "10px", alignItems: "center" }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
            alignItems: "center",
            width: "100%",
          }}
        >
          <PitcherPlayer match={match} />
          <BatterPlayer match={match} />
          <DefencePlayer match={match} />
        </div>
      </AccordionContent>
    </AccordionContainer>
  );
};

const AnalysisTable = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matches, setMatches] = useState([]);
  const [gameDate, seGameDate] = useState(dayjs());
  const [selectedCategory, setSelectedCategory] = useState(0);

  const { user, loading: userLoading } = useUser(); // 유저 정보 로딩 상태 추가
  const userFavoriteTeam = user?.userFavoriteTeam || null; // 유저 선호 구단

  const formatVictoryDate = (gameDate) =>
    formatDate(gameDate, "YYYY.MM.DD (ddd)");

  const handleCategoryClick = (index) => {
    setSelectedCategory(index);
  };

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        setLoading(true);

        // 유저 정보가 로드되지 않았을 경우 대기
        if (userLoading) {
          return;
        }

        console.log("User Favorite Team:", userFavoriteTeam);

        // 오늘의 경기 데이터를 가져옵니다.
        const response = await axios.get(
          "http://localhost:5000/api/today-matches"
        );
        const matchData = response.data;

        // prediction 데이터를 가져옵니다.
        const predictionResponse = await axios.post(
          "http://localhost:5000/api/predict"
        );
        const predictionData = predictionResponse.data;

        // pitcher-comparisons 데이터를 가져옵니다.
        const pitchersResponse = await axios.get(
          "http://localhost:5000/api/pitcher-comparisons"
        );
        const pitchersData = pitchersResponse.data;

        // batter-comparisons 데이터를 가져옵니다.
        const battersResponse = await axios.get(
          "http://localhost:5000/api/batter-comparisons"
        );
        const battersData = battersResponse.data;

        // defences-comparisons 데이터를 가져옵니다.
        const defencesResponse = await axios.get(
          "http://localhost:5000/api/defences-comparisons"
        );
        const defencesData = defencesResponse.data;

        // matchData, predictionData, pitchersData, defencesData, battersData를 병합합니다.
        const enrichedMatches = matchData.map((match, index) => {
          const prediction = predictionData[index];
          const pitcher = pitchersData[index];
          const batter = battersData[index];
          const defence = defencesData[index];

          return {
            ...match,
            new_probabilities: prediction?.new_probabilities,
            gameDate: prediction?.gameDate,
            accuracy: prediction?.accuracy,
            auc: prediction?.auc,
            pitcherChart: pitcher.chart,
            awayPitchers: pitcher.names.awayPitchers,
            homePitchers: pitcher.names.homePitchers,
            batterChart: batter.chart,
            awayBatters: batter.names.awayBatters,
            homeBatters: batter.names.homeBatters,
            defenceChart: defence.chart,
            awayDefences: defence.names.awayDefences,
            homeDefences: defence.names.homeDefences,
            awayTeamColor: batter.awayTeamColor,
            homeTeamColor: batter.homeTeamColor,
          };
        });

        // 선호 구단 경기를 먼저 정렬합니다.
        const favoriteMatches = enrichedMatches.filter(
          (match) =>
            match.homeTeam === userFavoriteTeam ||
            match.awayTeam === userFavoriteTeam
        );
        const otherMatches = enrichedMatches.filter(
          (match) =>
            match.homeTeam !== userFavoriteTeam &&
            match.awayTeam !== userFavoriteTeam
        );

        // 콘솔에 선호 구단 경기를 출력합니다.
        console.log("Favorite Matches:", favoriteMatches);
        console.log("Other Matches:", otherMatches);

        const sortedMatches = [...favoriteMatches, ...otherMatches];

        // 최종 정렬된 경기를 콘솔에 출력합니다.
        console.log("Sorted Matches:", sortedMatches);

        // 병합된 데이터를 상태로 설정합니다.
        setMatches(sortedMatches);

        // 가장 빠른 경기 날짜를 gameDate 상태로 설정합니다.
        if (sortedMatches.length > 0) {
          const earliestDate = dayjs(sortedMatches[0].gameDate);
          seGameDate(earliestDate);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // 유저 정보가 준비되면 데이터를 가져옵니다.
    if (!userLoading) {
      fetchMatchData();
    }
  }, [userFavoriteTeam, userLoading]); // 유저 선호 구단이 바뀌거나 유저 정보가 로드될 때마다 데이터를 다시 가져옴

  return (
    <ContentContainer>
      <ContentTitle>분석</ContentTitle>

      <SubCategoryContainer>
        <Button
          children="승리 예측"
          $buttonType="subCategory"
          $selected={selectedCategory === 0}
          onClick={() => handleCategoryClick(0)}
        />
        <Button
          children="구장별 승리 확률"
          $buttonType="subCategory"
          $selected={selectedCategory === 1}
          onClick={() => handleCategoryClick(1)}
        />
        <Button
          children="승패 예측 서비스"
          $buttonType="subCategory"
          $selected={selectedCategory === 2}
          onClick={() => handleCategoryClick(2)}
        />
      </SubCategoryContainer>

      <SubContentContainer>
        <HR />

        {/* 유저 정보 로딩 중일 때 메시지 표시 */}
        {userLoading && (
          <StatusMessage loading="유저 정보를 불러오는 중입니다..." />
        )}

        {/* 로딩 중일 때 메시지 표시 */}
        {loading && <StatusMessage loading={loading} />}

        {/* 에러가 있을 때 메시지 표시 */}
        {error && <StatusMessage error={`에러가 발생했습니다: ${error}`} />}

        {/* 데이터가 없을 때 메시지 표시 */}
        {!loading && !error && matches.length === 0 && (
          <StatusMessage noData="예측할 데이터가 없습니다." />
        )}

        {/* 데이터가 있을 때 아코디언 표시 */}
        {matches.length > 0 && selectedCategory === 0 && (
          <>
            <SubTitle style={{ textAlign: "center" }}>
              {formatVictoryDate(gameDate)} 승리 예측
            </SubTitle>
            {matches.map((match, index) => (
              <AnalysisAccordion key={index} match={match} />
            ))}
          </>
        )}
        {selectedCategory === 1 && !loading && !error && <GroundPlot />}
        {selectedCategory === 2 && <PredictionForm />}
      </SubContentContainer>
    </ContentContainer>
  );
};

export default AnalysisTable;
