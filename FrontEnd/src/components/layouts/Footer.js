import React from "react";
import styled from "styled-components";
import Main_Logo2 from "../../assets/images/Main_Logo2.png"; // 이미지 경로

// Footer의 전체 컨테이너
const FooterContainer = styled.footer`
  height: 250px;
  background-color: #f5f6f7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  flex-wrap: wrap;
`;

// 로고와 회사 정보
const CompanyInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 14px;
  color: #878787;
`;

// 소셜 미디어 링크
const SocialMediaLinks = styled.div`
  display: flex;
  gap: 10px;
`;

// 사이트 정보와 정책 링크
const SiteLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 14px;
  color: #878787;
`;

const LogoImage = styled.img`
  width: 118px;
  height: 18px;
`;

// 각종 링크 스타일
const Link = styled.a`
  color: #878787;
  text-decoration: none;
  margin: 5px 0;

  &:hover {
    text-decoration: underline;
  }
`;

// Footer 컴포넌트
const Footer = () => {
  return (
    <FooterContainer>
      {/* 회사 로고 및 정보 */}
      <CompanyInfo>
        <LogoImage src={Main_Logo2} alt="Small logo" />
        {/* <p>YA:MO.</p> */}
        <p>서울특별시 강남구 테헤란로 123</p>
        <p>사업자 등록번호: 123-45-67890</p>
      </CompanyInfo>

      {/* 사이트 링크 */}
      <SiteLinks>
        <Link href="/about">회사소개</Link>
        <Link href="/terms">이용 약관</Link>
        <Link href="/privacy">개인정보 처리방침</Link>
        <Link href="/contact">문의하기</Link>
      </SiteLinks>

      {/* 소셜 미디어 링크 */}
      <SocialMediaLinks>
        <Link
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook
        </Link>
        <Link
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Twitter
        </Link>
        <Link
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </Link>
      </SocialMediaLinks>
    </FooterContainer>
  );
};

export default Footer;
