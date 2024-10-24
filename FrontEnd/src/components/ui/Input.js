import React from "react";
import styled, { css } from "styled-components";

const StyledInput = styled.input`
  /* 기본 Input 스타일 회원 가입, 회원 탈퇴 등*/
  width: 19.5vw;
  height: 6.2vh;
  border-radius: 60px;
  font-size: 1rem;
  background-color: #ededed;
  border: none;
  margin-top: 10px;
  padding: 0 30px;
  box-sizing: border-box;

  &:focus {
    outline-color: #d71e17;
  }

  ${(props) =>
    props.$inputType === "user" &&
    css`
      width: 19.5vw;
      height: 6.2vh;
      min-width: 400px;
      min-height: 62px;
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

  /* 서치바 검색어 입력 */
  ${(props) =>
    props.$inputType === "search" &&
    css`
      padding: 0px 14px;
      border: 1px solid #b1b1b1;
      border-radius: 60px;
      width: 15vw;
      height: 3.5vh;
      min-width: 300px;
      min-height: 40px;
      background-color: #ffffff;
      font-size: 0.85rem;
      margin: 0;
    `}

  &:focus {
    border: 0.3px solid #d71e17;
  }

  /* 체크박스 */
  ${(props) =>
    props.type === "checkbox" &&
    css`
      margin: 0;
      padding: 0 5px;
      width: 1.6vw;
      height: 1.6vh;
      min-width: 15px;
      min-height: 15px;
      cursor: pointer;
      accent-color: #d71e17;
    `};

  /* Communit 와 Inquiry 등록 수정의 제목과 파일을 위한 스타일 10-07 */
  ${(props) =>
    props.$inputType === "c_i_title" &&
    css`
      width: 700px;
      height: 50px;
      margin: 20px 0;
      padding-left: 0px; /* 왼쪽 패딩을 줄임 */
      border: none;
      background-color: white;

      &:focus {
        outline: none;
        border-color: black; /* 포커스 시 테두리 효과 제거 */
        box-shadow: none; /* 테두리 그림자 효과 제거 */
        border: 1px solid #ededed;
      }
      text-align: left;
    `}

  ${(props) =>
    props.$inputType === "c_i_file" &&
    css`
      width: 400px;
      height: 35px;
      margin: 20px 0;
      padding-left: 0;
      border: none;
      background-color: white; /* 배경색 추가 */

      &:focus {
        outline: none;
        border-color: black; /* 포커스 시 테두리 효과 제거 */
        box-shadow: none; /* 테두리 그림자 효과 제거 */
      }
    `}
    
  /* 문의 비번 검색어 입력 */
  ${(props) =>
    props.$inputType === "inquiry-form" &&
    css`
      font-family: "NanumSquareRound", sans-serif;
      padding: 12px 14px;
      // border: 1px solid #ededed;
      border-radius: 8px;
      // width: 499px; /* 1013 다은 크기 수정 */
      width: 100%;
      height: 50px;
      margin: 0;
      background-color: #ffffff;
      font-size: 0.9rem;
    `}

    /* 분석 페이지 이용자 입력란 */
  ${(props) =>
    props.$inputType === "analysis-form" &&
    css`
      font-family: "NanumSquareRound", sans-serif;
      text-align: center;
      padding: 12px 14px;
      border: 1px solid #ededed;
      border-radius: 10px;
      // width: 499px; /* 1013 다은 크기 수정 */
      width: 100%;
      height: 5.5vh;
      background-color: #ffffff;
      font-size: 0.9rem;
    `}
`;

/* 서치바 검색어 필터링 */
const StyledSelect = styled.select`
  padding: 0px 6px;
  border: 0.3px solid #b1b1b1;
  border-radius: 60px;
  width: 5vw;
  height: 3.5vh;
  min-width: 95px;
  min-height: 40px;
  background-color: #ffffff;
  font-size: 0.85rem;

  &:focus {
    border: 0.3px solid #d71e17;
  }
`;

/* 2024-09-25  추가*/
function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  required = false,
  className,
  disabled = false,
  $inputType,
  options = [], //  추가
  checked, // 추가된 checked 속성
  autoComplete,
}) {
  // 셀렉트 필드일 경우
  if (type === "select") {
    return (
      <StyledSelect
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={className}
        disabled={disabled}
      >
        {options.length > 0 &&
          options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
      </StyledSelect>
    );
  }

  // 일반 input 필드일 경우
  return (
    <StyledInput
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      required={required}
      className={className}
      disabled={disabled}
      $inputType={$inputType}
      checked={checked} // 체크박스일 때 checked 속성 지원
      autoComplete={autoComplete}
    />
  );
}

export default Input;
