import React from "react";
import { Collapse, Progress, Row, Col } from "antd";
import StatusMessage from "../ui/StatusMessage"; // StateMessage 컴포넌트 임포트

const { Panel } = Collapse;

const VictoryPredictionCard = ({ match }) => {
  const { awayTeam, homeTeam, awayWinProb, homeWinProb, matchDate } = match;

  return (
    <Collapse style={{ marginBottom: "40px" }}>
      <Panel header={formattedDate} key={match.id}>
        <Row align="middle">
          <Col span={5}>
            <img
              src={awayTeam.emblem}
              alt={`${awayTeam.name} 엠블럼`}
              style={{ width: "50px" }}
            />
          </Col>
          <Col span={14}>
            <Progress
              percent={awayWinProb}
              success={{ percent: homeWinProb }}
              showInfo={false}
              strokeColor="blue"
              trailColor="red"
            />
            <Row justify="space-between">
              <Col>{awayWinProb}%</Col>
              <Col>{homeWinProb}%</Col>
            </Row>
          </Col>
          <Col span={5}>
            <img
              src={homeTeam.emblem}
              alt={`${homeTeam.name} 엠블럼`}
              style={{ width: "50px" }}
            />
          </Col>
        </Row>
        <div>{/* 여기에 경기 세부 정보를 추가할 수 있습니다 */}</div>
      </Panel>
    </Collapse>
  );
};

const VictoryPredictionList = ({ matches = [], loading, error }) => {
  // 기본값을 빈 배열로 설정
  return (
    <div>
      <StatusMessage
        loading={loading}
        error={error}
        noData={
          !loading && matches.length === 0 ? "예측 데이터가 없습니다." : null
        }
      />
      {!loading &&
        !error &&
        Array.isArray(matches) &&
        matches.length > 0 && // matches가 배열인지 확인
        matches.map((match) => (
          <VictoryPredictionCard key={match.id} match={match} />
        ))}
    </div>
  );
};

export default VictoryPredictionList;
