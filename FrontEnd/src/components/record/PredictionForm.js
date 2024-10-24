import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Button from "../ui/Button";
import Input from "../ui/Input";
import StatusMessage from "../ui/StatusMessage";
import TeamSelect from "../ui/TeamSelect";
import { teams } from "../../contexts/teamsData";
import { GrPowerReset } from "react-icons/gr";
import { Strong, P, SubTitle } from "../../styles/CommonStyles";

const PredictionFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CenterLabel = styled.label`
  font-family: "NanumSquareRound", sans-serif;
  width: 100px;
  text-align: center;
  font-size: 1em;
`;

const GrPowerResetIcon = styled(GrPowerReset)`
  cursor: pointer;
  margin-top: 20px;
  width: 64px;
  height: 64px;
  background-color: transparent;
  border: none;
  color: #d71e17;
`;

function PredictionForm() {
  const [data, setData] = useState({
    홈런: { away: "", home: "" },
    안타: { away: "", home: "" },
    병살타: { away: "", home: "" },
    삼진: { away: "", home: "" },
    볼넷: { away: "", home: "" },
    자책: { away: "", home: "" },
  });
  const [homeTeam, setHomeTeam] = useState("%25");
  const [awayTeam, setAwayTeam] = useState("%25");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [matches, setMatches] = useState([]);
  const [availableAwayTeams, setAvailableAwayTeams] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/today-matches"
        );
        setMatches(response.data);

        // 원정 팀 목록 추출 및 변환
        const extractedAwayTeams = response.data.map((match) => match.awayTeam);
        const formattedAwayTeams = teams.filter((team) =>
          extractedAwayTeams.includes(team.value)
        );
        setAvailableAwayTeams(formattedAwayTeams);
        setLoading(false);
      } catch (err) {
        // setError("오늘의 경기를 불러오는 데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleAwayTeamSelect = (selectedAwayTeam) => {
    setAwayTeam(selectedAwayTeam);

    const match = matches.find((m) => m.awayTeam === selectedAwayTeam);
    if (match) {
      setHomeTeam(match.homeTeam);
    } else {
      setHomeTeam("%25");
    }

    setData({
      홈런: { away: "", home: "" },
      안타: { away: "", home: "" },
      병살타: { away: "", home: "" },
      삼진: { away: "", home: "" },
      볼넷: { away: "", home: "" },
      자책: { away: "", home: "" },
    });
  };

  const handleInputChange = (e, teamType, key) => {
    const { value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [key]: {
        ...prevData[key],
        [teamType]: value,
      },
    }));
  };

  const handleReset = () => {
    setData({
      홈런: { away: "", home: "" },
      안타: { away: "", home: "" },
      병살타: { away: "", home: "" },
      삼진: { away: "", home: "" },
      볼넷: { away: "", home: "" },
      자책: { away: "", home: "" },
    });
    setHomeTeam("%25");
    setAwayTeam("%25");
    setResult(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (homeTeam === "%25" || awayTeam === "%25") {
      setError(
        <Strong style={{ color: "#d71e17" }}>
          홈 팀과 원정 팀을 선택해 주세요.
        </Strong>
      );
      return;
    }

    setLoading(true);
    setError(null);

    // 빈 문자열을 숫자로 변환 (기본값 설정)
    const formatData = (value) => (value === "" ? "0" : value);

    const payload = {
      homeTeam,
      awayTeam,
      homeData: Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          formatData(value.home),
        ])
      ),
      awayData: Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          formatData(value.away),
        ])
      ),
    };
    console.log("Sending data to server:", payload);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/update-predict",
        payload
      );
      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error || "예측 결과를 가져오는 데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PredictionFormContainer>
      {loading && <StatusMessage loading />}
      {error && <StatusMessage error={error} />}

      {!loading && availableAwayTeams.length === 0 ? (
        <P>오늘 경기 일정이 없습니다.</P>
      ) : (
        !loading && (
          <>
            <SubTitle style={{ margin: "30px 0", textAlign: "center" }}>
              오늘 경기는 누가 승리할까요? <br />
              당신의 직감과 데이터를 결합해 승부를 예측해보세요!
            </SubTitle>
            <FormRow className="prediction-form-teamSelect">
              <TeamSelect
                selectedTeam={awayTeam}
                setSelectedTeam={handleAwayTeamSelect}
                // $selectType="board"
                teams={availableAwayTeams}
              />

              <CenterLabel>VS</CenterLabel>
              <TeamSelect
                selectedTeam={homeTeam}
                setSelectedTeam={() => {}}
                // $selectType="board"
                labelType="home"
                teams={[teams.find((team) => team.value === homeTeam)]}
                disabled
              />
            </FormRow>

            {Object.keys(data).map((key) => (
              <FormRow key={key}>
                <InputContainer>
                  <Input
                    type="number"
                    $inputType="analysis-form"
                    name={key}
                    value={data[key].away}
                    placeholder="원정"
                    onChange={(e) => handleInputChange(e, "away", key)}
                    min="0"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, ""); // 숫자 외 문자 제거
                    }}
                  />
                </InputContainer>
                <CenterLabel>{key}</CenterLabel>
                <InputContainer>
                  <Input
                    type="number"
                    $inputType="analysis-form"
                    name={key}
                    value={data[key].home}
                    placeholder="홈"
                    onChange={(e) => handleInputChange(e, "home", key)}
                    min="0"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, ""); // 숫자 외 문자 제거
                    }}
                  />
                </InputContainer>
              </FormRow>
            ))}

            {result && (
              <div className="PredictionForm_Result">
                {/* <h2>예측 결과</h2> */}
                <Strong>
                  {(result[0].new_probabilities[1] * 100).toFixed(2)}%{" "}
                </Strong>
                <Strong>
                  {(result[0].new_probabilities[0] * 100).toFixed(2)}%
                </Strong>
              </div>
            )}
            <div className="PredictionForm_Buttons">
              <div>
                <Button
                  onClick={handleSubmit}
                  disabled={awayTeam === "%25" || homeTeam === "%25"}
                >
                  예측하기
                </Button>
              </div>
              <div>
                <GrPowerResetIcon onClick={handleReset} />
              </div>
            </div>
          </>
        )
      )}
    </PredictionFormContainer>
  );
}

export default PredictionForm;
