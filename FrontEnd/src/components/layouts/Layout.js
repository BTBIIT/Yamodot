import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import styled from "styled-components";

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh; // 레이아웃이 화면 전체 높이를 차지하게 설정
`;

const MainContent = styled.main`
  flex: 1; // 메인 콘텐츠가 남는 공간을 차지하도록 설정
`;

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <LayoutContainer>
      <Header />
      <MainContent>{children}</MainContent>
      <Footer />
    </LayoutContainer>
  );
};

export default Layout;
