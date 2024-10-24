import styled from "styled-components";
import { Link } from "react-router-dom";

/* 페이지 컨텐트 컨테이너 */
export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 170px 0 150px; // 위아래 간격
  padding: 0 50px; // 좌우 여백은
  width: 100%; // 가로폭을 전체로 설정
`;

/* 서브 컨텐트 컨테이너 - 내용 부 */
export const SubContentContainer = styled.div`
  text-align: center;
  // width: 1150px;
  width: 60vw;
  min-width: 950px
  max-width: 100%;
`;

/* 페이지 타이틀 */
export const ContentTitle = styled.h1`
  font-family: "NanumSquareRound", sans-serif;
  font-size: 1.8rem;
  font-weight: bold;
  color: #222222;
  line-height: 50px;
  margin-bottom: 25px;
`;

/* 내용부 타이틀 */
export const SubTitle = styled.h2`
  font-family: "NanumSquareRound", sans-serif;
  font-size: 1.8rem;
  font-weight: bold;
  color: #222222;
  line-height: 50px;
  text-align: left;
  margin-bottom: 0;
`;

/* 카테고리 컨테이너 */
export const SubCategoryContainer = styled.div`
  font-family: "NanumSquareRound", sans-serif;
  font-weight: normal;
  margin: 0 auto 30px;
  display: flex;
  justify-content: center;
  gap: 25px;
`;

/* 구분선 */
export const HR = styled.hr`
  border-top: 1px solid #000;
  margin: 13px 0;
`;

export const EM = styled.em`
  font-family: "NanumSquareRound", sans-serif;
  color: #dedede;
  font-style: normal;
`;

export const Strong = styled.strong`
  font-family: "NanumSquareRound", sans-serif;
  font-style: normal;
`;

export const P = styled.p`
  font-family: "NanumSquareRound", sans-serif;
  font-size: 0.8rem;
  font-weight: normal;
  color: #222222;
`;

/* 테이블 스타일 */
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 25px;
  font-family: "NanumSquareRound", sans-serif;
  font-size: 0.8rem;

  th,
  td {
    padding: 10px 16px;
    text-align: center;
    white-space: nowrap;
    width: 30px; /* 이닝 테이블에 맞춘 고정 너비 */
  }
`;

/* 테이블 헤더 */
export const TableHeader = styled.thead`
  th {
    height: 47px;
    background-color: #f6f6f6;
    text-align: center;
    border-collapse: collapse;
    border-bottom: none;

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

// 공통 섹션 스타일
export const SectionContainer = styled.div`
  min-height: 880px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  .section-title {
    text-align: center;
    margin: 68px auto;
    font: 50px "GongGothicMedium", sans-serif;
    color: rgba(34, 34, 34, 90%);
  }
`;

/* 승리 예측 전체 박스 컨테이너 */
export const PredictionBoxesContainer = styled.div`
  display: flex;
  width: 73%;
  min-width: 820px;
  height: 142px;
  margin-bottom: 32px;
  padding: 0 40px;
  align-items: center;
  justify-content: center;
  border-radius: 40px;
  background-color: white;
  border-radius: 10px;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-10px);
  }
`;

/* 개별 승리예측 박스 컨테이너 */
export const PredictionBoxContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
`;

/* 기록 전체 박스 컨테이너 */
export const RecordBoxesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 35px; /* 각 박스 사이 간격 35px */
  width: 73%; /* 전체 너비 73% */
  // width: 1200px;
  width: 100%;
  margin: 85px auto; /* 가로 가운데 정렬 */
`;

/* 개별 기록 박스 */
export const RecordBoxContainer = styled.div`
  padding: 60px;
  width: 358px;
  height: 363px;
  border-radius: 47px;
  background-color: rgba(0, 0, 0, 80%);
  transition: transform 0.3s;
  text-align: center;
  // font: 30px/1.5 "GongGothicMedium", sans-serif;
  font-size: 30px;
  font-weight: bold;
  color: rgba(255, 255, 255, 80%);

  ol {
    text-align: center;
    margin: 20px 0 auto;
    padding-left: 50px;
    // padding: 0;
    font-family: "NanumSquareRound", sans-serif;

    li {
      margin: 10px 0; // 각 리스트 아이템의 간격을 설정
    }
  }

  &:hover {
    transform: translateY(-10px);
  }
`;

/* GoToDetail 링크 컨테이너 */
export const LinkContainer = styled(Link)`
  display: flex;
  align-items: center;
  position: absolute; /* 부모 요소를 기준으로 절대 위치 설정 */
  bottom: 7%; /* 부모 요소의 하단부에 위치 */
  left: 50%;
  transform: translateX(-50%);
  text-decoration: none;
  color: #7d7d7d;
  z-index: 10;
  font: 15px "GongGothicLight", sans-serif;
`;

/* 스케줄 섹션 컨테이너 */
export const ScheduleSectionContainer = styled.div`
  position: relative; // 자식 요소의 절대 위치를 기준으로 삼기 위해 상대 위치로 설정
  text-align: center;
  height: 800px; // 혹은 필요한 높이로 설정
`;

/* 전체 스케줄 섹션 박스 컨테이너 */
export const ScheduleBoxesContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 35px;
  position: absolute; // 절대 위치로 설정
  top: 35%; // Carousel의 높이에 맞춰 조정
  left: 50%;
  transform: translateX(-50%); // 수평 중앙 정렬
  z-index: 10; // 다른 요소들 위에 위치하도록 설정
`;

/* 개별 스케줄 섹션 박스 */
export const ScheduleBox = styled.div`
  background-color: rgba(245, 245, 245, 93%);
  padding: 20px 35px;
  width: 220px;
  height: 400px;
  font-family: "GongGothicMedium", sans-serif;
  font-size: 16px;
  font-weight: normal;
  color: rgba(34, 34, 34, 85%);
  border-radius: 30px;
  // box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* 그림자 효과 */

  ul.game-info {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin: 10px 0;
    font-weight: normal;
  }

  /* 경기 상태 */
  .game-status {
    display: inline-block;
    // width: auto;
    width: 112px;
    margin-top: 3px;
    padding: 6px 12px;
    border-radius: 63px;
    background-color: #a7a7a7; /* 회색 배경 d7d7d7*/
    color: #ffffff; /* 흰색 텍스트 */
    margin-bottom: 10px;
    font-size: 14px; /* 작은 폰트 크기 */
  }

  /* 투수 */
  li:nth-child(3) {
    margin-top: 3px;
  }
  li:nth-child(3),
  li:nth-child(7) {
    color: #757575;
    font-size: 12px;
    font-weight: normal;
    margin: 5px auto;

    // > span {
    //   color: #757575;
    // }
  }

  li.teamEM-away {
    margin-top: 3px;
  }

  li.teamEM-home {
    margin-bottom: 3px;
  }

  /* 스코어와 VS 이미지 수평 정렬 */
  li.score-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px; /* 점수와 VS 이미지 사이의 간격 */
  }

  .score {
    font-size: 20px; /* 폰트 크기를 동일하게 설정 */
    font-weight: bold;
    margin: 0 13px;
  }

  .vs-image {
    width: 30px;
    height: auto; /* 이미지 비율 유지 */
  }

  &.highlight {
    background-color: #ffc9c7;
    opacity: 1;

    li:nth-child(2) {
      color: #eeeeee;
      background-color: #d71e17;
    }
  }
`;

/* 스케줄 섹션 캐러셀 */
export const CarouselContainer = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;

  .carousel-image {
    width: 100%;
    height: 800px;
    object-fit: cover;
    opacity: 0.8;
  }
`;

/* 스케줄 섹션 날짜 */
export const DateNavContainer = styled.div`
  display: flex;
  position: absolute; // 절대 위치로 설정
  top: 22.5%; // Carousel의 높이에 맞춰 조정
  left: 50%;
  transform: translateX(-50%); // 수평 중앙 정렬
  z-index: 10; // 다른 요소들 위에 위치하도록 설정
  background-color: rgba(255, 255, 255, 85%);
  border-radius: 60px;
  padding: 10px;
  width: 70%;
  min-width: 730px;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-family: "NanumSquareRound", sans-serif;
  color: #222222;

  ul {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 90px;
  }

  button {
    background-color: transparent;
    color: #717171;
    border: none;
    cursor: pointer;
    padding: 0;

    &.active {
      color: rgba(34, 34, 34, 80%);
      font-weight: bold;
    }
  }
`;
