import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useMenu } from "../../contexts/MenuProvider";
import SubMenu from "../ui/SubMenu";

// import { VscBellDot } from "react-icons/vsc";
// import { IoPersonCircleOutline } from "react-icons/io5";
// import { IoIosLogOut, IoMdLogOut } from "react-icons/io";
// import { GoPerson } from "react-icons/go";
// import { BsEnvelopeExclamation } from "react-icons/bs";

const NavbarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  ul {
    list-style: none;
    display: flex;
    gap: 40px; // 메뉴 항목 간격
    padding: 0;
    margin: 0;
  }
`;

const NavMenu = styled.ul`
  list-style: none;
  display: flex;
  gap: 30px;
  padding: 0;
  margin: 0;

  li {
    cursor: pointer;
    position: relative;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #2b2a2a;
  transition: color 0.3s;
  font-size: 1.1rem;
  font-family: "GongGothicMedium", sans-serif;
  display: flex;

  &:hover {
    color: #d71e17;
  }
  &.active-link {
    color: #d71e17;
  }
`;

const Navbar = () => {
  const navItems = useMenu();
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [timer, setTimer] = useState(null); // 타이머 상태 추가
  const location = useLocation();

  const showMenu = (label) => {
    clearTimeout(timer); // 이전 타이머가 있으면 취소
    setActiveSubMenu(label); // 서브 메뉴를 표시할 항목의 레이블을 저장
  };

  const hideMenu = () => {
    const newTimer = setTimeout(() => {
      setActiveSubMenu(null); // 지정된 시간 후에 서브 메뉴 숨기기
    }, 200); // 200ms 후에 숨김
    setTimer(newTimer); // 새로운 타이머 저장
  };

  return (
    <NavbarContainer>
      <NavMenu>
        {navItems.map((item, index) => {
          const isActive = location.pathname.startsWith(item.path);
          const hasSubItems = item.subItems && item.subItems.length > 0;

          return (
            <li
              key={index}
              onMouseEnter={() => showMenu(item.label)} // 마우스가 올라가면 서브 메뉴 표시
              onMouseLeave={hideMenu} // 마우스가 떠나면 서브 메뉴 숨기기
            >
              <NavLink to={item.path} className={isActive ? "active-link" : ""}>
                {item.label}
              </NavLink>
              {hasSubItems && (
                <SubMenu
                  subItems={item.subItems}
                  isVisible={activeSubMenu === item.label} // 현재 활성화된 서브 메뉴 표시
                />
              )}
            </li>
          );
        })}
      </NavMenu>

      {/* <LoginButton to="/user/login">
        <GoPerson style={{ border: "3px solid #d71e17", borderRadius: "50%" }} />
        <IoPersonCircleOutline />
        <VscBellDot style={{ width: "50px" }} />
        <IoIosLogOut /> 
        <IoMdLogOut />
        <BsEnvelopeExclamation />
      </LoginButton> */}
    </NavbarContainer>
  );
};

export default Navbar;
