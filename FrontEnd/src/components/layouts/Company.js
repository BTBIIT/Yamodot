import React from "react";
import styled from "styled-components";
import slogo from "../../assets/images/Main_Logo2.png"; // 이미지 경로

// styled-components로 스타일 정의
const SmallLogoContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #878787;
  margin-left: 10px;
`;

export const LogoImage = styled.img`
  width: 118px;
  height: 18px;
`;

function Company() {
  return (
    <SmallLogoContainer>
      <LogoImage src={slogo} alt="Small logo" />
      <span>Copyright @YA:MO.All Rights Reserved</span>
    </SmallLogoContainer>
  );
}

export default Company;
