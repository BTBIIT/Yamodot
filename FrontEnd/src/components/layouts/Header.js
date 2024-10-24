import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import styled from "styled-components";
import Main_Logo2 from "../../assets/images/Main_Logo2.png";
import LoginMenu from "../ui/LoginMenu"; // 로그인 메뉴 컴포넌트
import { useUser } from "../../contexts/UserContext";

const HeaderContainer = styled.header`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  right: 0;
  z-index: 10;
  height: 83px;
  margin: 20px auto;
  width: 87.3%;
  min-width: 1000px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between; // 양 끝에 로고와 로그인 아이콘 배치
  padding: 0 50px; // 양쪽 끝 여백 설정
  border-radius: 60px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Logo = styled(Link)`
  flex: 0 0 auto;
  img {
    width: 174px;
    height: 27px;
  }
`;

const MainMenuContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-grow: 1; // 로고와 로그인 사이의 공간을 최대한 차지하도록 설정
  // margin: 0 10%; // 로고와 로그인 사이에 250px 간격 유지
  gap: 30px; // 메뉴 항목 간격
`;

const Header = () => {
  const { user } = useUser();

  return (
    <HeaderContainer>
      {/* <MenuProvider> */}
      <Logo to="/">
        <img src={Main_Logo2} alt="Logo" />
      </Logo>
      <MainMenuContainer>
        <Navbar /> {/* 중앙에 위치한 네비게이션 바 */}
      </MainMenuContainer>
      <LoginMenu user={user} /> {/* 로그인 아이콘 및 서브메뉴 */}
    </HeaderContainer>
  );
};

export default Header;
