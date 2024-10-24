import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useUser } from "../../contexts//UserContext";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";

// 로그인 메뉴를 적절히 정렬
const LoginMenuContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto; // 로그인 메뉴를 오른쪽 끝으로
  position: relative;
`;

// 스타일 컴포넌트에서 isVisible을 transient prop으로 사용하기 위해 $isVisible로 변경
export const UserMenuContainer = styled.div`
  width: 170px;
  font-size: 0.8rem;
  font-family: "GongGothicMedium", sans-serif;
  background-color: white;
  border-radius: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px;
  display: ${(props) => (props.$isVisible ? "flex" : "none")}; // 수정된 부분
  flex-direction: column;
  z-index: ${(props) => (props.$isVisible ? "9999" : "")}; // 수정된 부분;
`;

// 공통 스타일
const SubMenuItem = styled(Link)`
  padding: 10px 20px;
  text-decoration: none;
  color: #2b2a2a;
  transition: color 0.3s;

  &:hover {
    color: #d71e17;
  }
`;

const IconContainer = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;

  svg {
    width: 100%;
    height: 40px;
    color: #d71e17;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  svg {
    width: 100%;
    height: 40px;
    color: #d71e17;
  }
`;

// 게스트 메뉴 컴포넌트
const GuestMenu = () => (
  <>
    <SubMenuItem to="/user/login">로그인</SubMenuItem>
    <SubMenuItem to="/user/agree">회원가입</SubMenuItem>
  </>
);

// 사용자 메뉴 컴포넌트
const UserMenu = ({ userSocialLoginSep }) => (
  <>
    <SubMenuItem to="/mypage/memberedit">회원 정보 수정</SubMenuItem>
    {userSocialLoginSep === "Y" && (
      <SubMenuItem to="/mypage/pwchange">비밀번호 변경</SubMenuItem>
    )}
    <SubMenuItem to="/mypage/myactivity">나의 활동</SubMenuItem>
    <SubMenuItem to="/mypage/membercancel">회원 탈퇴</SubMenuItem>
  </>
);

// 관리자 메뉴 컴포넌트
const AdminMenu = () => (
  <>
    <SubMenuItem to="/admin/userManagement">회원 리스트</SubMenuItem>
    <SubMenuItem to="/admin/communityManagement">커뮤니티 관리</SubMenuItem>
    <SubMenuItem to="/admin/commentManagement">댓글 관리</SubMenuItem>
    <SubMenuItem to="/admin/inquiryManagement">문의 관리</SubMenuItem>
  </>
);

const LoginMenu = () => {
  const { user, logout } = useUser();
  const [isVisible, setIsVisible] = useState(false);
  const [timer, setTimer] = useState(null); // 타이머 상태 추가
  const navigate = useNavigate();

  const showMenu = () => {
    clearTimeout(timer); // 이전 타이머가 있으면 취소
    setIsVisible(true);
  };

  const hideMenu = () => {
    const newTimer = setTimeout(() => {
      setIsVisible(false);
    }, 200); // 200ms 후에 메뉴를 숨김
    setTimer(newTimer); // 새로운 타이머 저장
  };

  const handleLogout = async () => {
    await logout(); // 로그아웃 처리
    alert("로그아웃 되었습니다.");
    navigate("/"); // 로그아웃 후 메인 페이지로 이동
  };

  return (
    <LoginMenuContainer>
      {/* 로그인 아이콘 */}
      <IconContainer
        onMouseEnter={showMenu} // 마우스가 들어오면 서브 메뉴 보이게
        onMouseLeave={hideMenu} // 마우스가 나가면 서브 메뉴 숨기게
      >
        <IoPersonCircleOutline />

        {/* 메뉴 */}
        <UserMenuContainer $isVisible={isVisible}>
          {user ? (
            user.role === "admin" ? (
              <AdminMenu />
            ) : (
              <UserMenu userSocialLoginSep={user.userSocialLoginSep} />
            )
          ) : (
            <GuestMenu />
          )}
        </UserMenuContainer>
      </IconContainer>

      {/* 로그아웃 버튼 */}
      {user && (
        <LogoutButton onClick={handleLogout}>
          <IoIosLogOut />
        </LogoutButton>
      )}
    </LoginMenuContainer>
  );
};

export default LoginMenu;
