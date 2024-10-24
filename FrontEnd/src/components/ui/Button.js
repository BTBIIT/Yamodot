import React from "react";
import styled, { css } from "styled-components";

/* 기본 버튼 스타일 */
const StyledButton = styled.button`
  font-family: "NanumSquareRound", sans-serif;
  width: 19.5vw;
  height: 6vh;
  border-radius: 60px;
  background-color: #d71e17;
  color: white;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  font-weight: bold;
  margin-top: 20px;

  &:hover {
    background-color: #be1c15;
  }

  ${(props) =>
    props.$buttonType === "user" &&
    css`
      font-family: "NanumSquareRound", sans-serif;
      width: 19.5vw;
      height: 6vh;
      min-width: 400px;
      min-height: 62px;
      border-radius: 60px;
      background-color: #d71e17;
      color: white;
      font-size: 1rem;
      border: none;
      cursor: pointer;
      font-weight: bold;
      margin-top: 20px;

      &:hover {
        background-color: #be1c15;
      }
    `}

  /* 일정, 기록, 마이페이지 서브 카테고리 선택 버튼 */
  ${(props) =>
    props.$buttonType === "subCategory" &&
    css`
      display: flex-row;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      padding: 7px 2px;
      width: 130px;
      // width: 9vw;
      height: auto;
      border: 1px solid;
      cursor: pointer;
      font-size: 0.8rem;
      transition: background-color 0.3s, color 0.3s;

      &:hover {
        background-color: #ffffff;
        color: #d02233;
        border-color: #d02233;
      }

      ${props.$selected
        ? css`
            color: black;
            border-color: #d02233;
            background-color: #ffffff;
          `
        : css`
            background-color: #e0e0e0; /* 선택되지 않은 sub-select 버튼의 배경 색 */
            color: #9a9a9a;
            border-color: #e0e0e0;
          `}
    `}

  /* 인증, 중복 확인 등 */
  ${(props) =>
    props.$buttonType === "doubleCheck" &&
    css`
      position: absolute;
      right: 5%;
      top: 28%;
      transform: translateY(-50%);
      width: 3vw;
      height: 3.1vh;
      min-width: 61px;
      min-height: 30px;
      font-size: 0.8rem;
      background-color: #ffffff;
      color: #d71e17;
      border-radius: 50px;
      cursor: pointer;

      &:hover {
        background-color: #ffffff;
        border: 0.3px solid #d71e17;
      }
    `}

  /* 성별 체크 버튼 */
  ${(props) =>
    props.$buttonType === "gender" &&
    css`
      position: absolute;
      bottom: -1px;
      transform: translateY(-50%);
      width: 3vw;
      height: 3.1vh;
      min-width: 61px;
      min-height: 30px;
      background-color: #ffffff;
      color: #a9a9a9;
      border-radius: 50px;
      font-size: 0.8rem;
      border: none;
      cursor: pointer;

      &:hover {
        background-color: #ffffff;
        border: 0.3px solid #d71e17;
        color: #d71e17; /* hover 시 텍스트 색상 변경 */
      }

      ${props.$selected &&
      css`
        background-color: #d71e17;
        color: #ffffff;
      `}
    `}

   /* 서치바 검색 버튼 스타일*/
    ${(props) =>
    props.$buttonType === "search" &&
    css`
      padding: 0 14px;
      border: none;
      border-radius: 60px;
      width: 3.3vw;
      height: 3.5vh;
      min-width: 60px;
     min-height: 40px;
      background-color: #d71e17;
      font-size: 0.83rem;
      font-color:ffffff;
      margin: 0;

      &:hover {
       background-color: #ffffff;
        border: 0.3px solid #d71e17;
        color: #d71e17; 
      '}
    `}

 /* 삭제 버튼*/
     ${(props) =>
    props.$buttonType === "delete" &&
    css`
      margin: 0;
      padding: auto 12px;
      border: none;
      border-radius: 5px;
      width: 2.5vw;
      min-width: 55px;
      height: 3vh;
      min-height: 30px;
      background-color: #f2f2f2;
      font-size: 0.9rem;
      color: #222222;

      &:hover {
       background-color: #dcdcdc;
     
      '}
    `}

  /* 투타수 선택 버튼 스타일 */
    ${(props) =>
    props.$buttonType === "playerSelect2" &&
    css`
      width: 4vw;
      min-width: 43px;
      height: 30px;
      border-radius: 5px;
      margin: 0;
      font-size: 0.9rem;
      font-weight: normal;

      /* 마우스 올렸을 때 */
      &:hover {
        background-color: #ffffff;
        border: 0.3px solid #d71e17;
        color: #d71e17; /* hover 시 텍스트 색상 변경 */
      }

      /* 선택된 버튼 스타일 */
      ${props.$selected
        ? css`
            border: none;
            color: #000000;
            background-color: #eeeeee;
          `
        : css`
            /* 선택되지 않은 버튼 스타일 */
            border: 1px solid #eeeeee;
            color: #9c9c9c;
            background-color: #ffffff;
          `}
    `}

/* 공통 스타일: 게시물수정, 게시물삭제, 게시물 댓글 추가 버튼에 적용 */
  ${(props) =>
    props.$buttonType === "c_i" &&
    css`
      margin: 0;
      padding: auto 12px;
      border: none;
      border-radius: 5px;
      width: 3vw;
      min-width: 55px;
      height: 3vh;
      min-height: 28px;
      background-color: #ff5252;
      color: white;
      cursor: pointer;
      font-size: 0.8rem;

      &:hover {
        background-color: #ff5252;
      }
    `}

    /* 수정 완료/취소 / 등록 10-07 */
    ${(props) =>
    props.$buttonType === "c_i_Edit" &&
    css`
      margin: 0;
      padding: auto 12px;
      border: none;
      border-radius: 5px;
      width: 5vw;
      min-width: 65px;
      height: 3vh;
      min-height: 28px;
      font-size: 0.8rem;
      cursor: pointer;
      background-color: #d71e17; /* 공개 버튼과 동일한 빨간색 배경 */
      color: #ffffff; /* 흰색 텍스트 */
      transition: background-color 0.3s, color 0.3s;

      &:hover {
        background-color: #c61715; /* hover 시 더 어두운 빨간색 */
      }
    `}
    
    /* 공통 스타일: 댓글수정, 댓글삭제, 대댓글 버튼에 적용 */
  ${(props) =>
    props.$buttonType === "reply" &&
    css`
      font-family: "NanumSquareRound", sans-serif;
      width: 60px;
      height: 10px;
      background-color: white;
      color: #b8b8b8;
      font-size: 0.7rem;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      margin: 0;

      &:hover {
        background-color: white;
        color: #d71e17;
      }
    `}

  /* 공개/비공개 버튼 스타일 9-29 */
  ${(props) =>
    props.$buttonType === "visibility-toggle" &&
    css`
      width: 120px;
      border-radius: 50px;
      font-size: 17px;
      cursor: pointer;
      background-color: ${props.active ? "#D71E17" : "#e0e0e0"};
      color: ${props.active ? "#fff" : "#9a9a9a"};
      transition: background-color 0.3s, color 0.3s;

      &:hover {
        background-color: ${props.active ? "#c61715" : "#ffffff"};
      }
    `}


  /* 다음글, 이전글 보기 버튼 스타일*/
  ${(props) =>
    props.$buttonType === "footer-button" &&
    css`
      width: 6vw;
      height: 4vh;
      margin: 5px;
      font-size: 0.9rem;
      display: flex;
      justify-content: center;
      align-items: center;
      white-space: nowrap;
      border-radius: 60px;
      background-color: #ffffff;
      border: 2px solid #e9e9e9;
      color: #d0d0d0;
      cursor: pointer;
      transition: background-color 0.3s ease, color 0.3s ease;
      justifycontent: "center";
      flexdirection: "row";

      &:hover {
        background-color: #e9e9e9;
      }
    `}

 /* 카테고리 버튼 스타일 10-07 */
  ${(props) =>
    props.$buttonType === "com-sub-category" &&
    css`
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      background-color: #f4f4f4;
      border: 1px solid #f4f4f4; /* 기본 테두리 */
      padding: 10px;
      text-align: center;
      transition: transform 0.2s ease, border 0.2s ease;
      border-radius: 50px;
      width: 5vw;
      min-width: 68px;
      height: 34px;
      font: 0.75rem "GongGothicMedium", sans-serif;
      font-weight: normal;
      color: #333;
      margin: 0 0 5px 0;

      &:hover {
        transform: scale(1.1); /* 호버 시 버튼 확대 */
        border: 1px solid #d02233; /* 선택된 구단 테두리 강조 */
        background-color: white; /* 호버 시 배경색 변경 */
      }

      ${props.$selected &&
      css`
        transform: scale(1.1);
        border: 1px solid #d02233;
        background-color: white;
      `}
    `}

  /* 글쓰기 버튼 스타일 10-07 */
  ${(props) =>
    props.$buttonType === "writing" &&
    css`
    display: inline-flex;
    align-items: center;
    padding: 0px 13px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.8rem;
    color: #333;
    transition: background-color 0.3s ease, color 0.3s ease;
    display: flex;
    justify-content: flex-end;
    margin: 3px;
    width: auto;
    height: 30px;
    margin: 0px;

    &:hover {
    border: 0.3px solid #d71e17;
      background-color: #fff;
      color: #d71e17;

    `}
`;

/* Button 컴포넌트 */
function Button({
  children,
  onClick,
  className,
  $buttonType,
  $selected,
  type,
  active, // 추가: active 상태 10-5
}) {
  return (
    <StyledButton
      onClick={onClick}
      className={className}
      $buttonType={$buttonType}
      $selected={$selected}
      type={type}
      active={active} // 추가: active 상태 전달 10-5
    >
      {children}
    </StyledButton>
  );
}

export default Button;
