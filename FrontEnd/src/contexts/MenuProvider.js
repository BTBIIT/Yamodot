import React, { createContext, useContext } from "react";
import { useUser } from "./UserContext";

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const { user } = useUser();

  // 기본 메뉴 구성 (로그인 전)
  const guestNavItems = [
    {
      path: "/scheduleresults/schedule",
      label: "일정 / 결과",
      subItems: [
        { path: "/scheduleresults/schedule", label: "일정" },
        { path: "/scheduleresults/scoreboard", label: "스코어보드" },
      ],
    },
    {
      path: "/recordanalysis/record",
      label: "기록 / 분석",
      subItems: [
        { path: "/recordanalysis/record", label: "기록" },
        { path: "/recordanalysis/analysis", label: "분석" },
      ],
    },
    { path: "/community", label: "커뮤니티" },
    { path: "/inquiry", label: "문의" },
  ];

  // 유저 전용 메뉴
  const userNavItems = [
    {
      path: "/scheduleresults/schedule",
      label: "일정 / 결과",
      subItems: [
        { path: "/scheduleresults/schedule", label: "일정" },
        { path: "/scheduleresults/scoreboard", label: "스코어보드" },
      ],
    },
    {
      path: "/recordanalysis/record",
      label: "기록 / 분석",
      subItems: [
        { path: "/recordanalysis/record", label: "기록" },
        { path: "/recordanalysis/analysis", label: "분석" },
      ],
    },
    { path: "/community", label: "커뮤니티" },
    { path: "/inquiry", label: "문의" },
  ];

  // 관리자 전용 메뉴
  const adminNavItems = [
    { path: "/admin/userManagement", label: "회원 리스트" },
    { path: "/admin/communityManagement", label: "커뮤니티 관리" },
    { path: "/admin/commentManagement", label: "댓글 관리" },
    { path: "/admin/inquiryManagement", label: "문의 관리" },
  ];

  const navItems =
    user?.role === "admin"
      ? adminNavItems
      : user
      ? userNavItems
      : guestNavItems;

  // 게스트, 유저 통합
  // const sharedNavItems = [
  //   { path: '/scheduleresults/schedule', label: '일정 / 결과' },
  //   { path: '/recordanalysis/record', label: '기록 / 분석' },
  //   { path: '/community', label: '커뮤니티' },
  //   { path: '/inquiry', label: '문의' },
  // ];

  // const adminNavItems = [
  //   { path: '/admin/user-list', label: '회원 리스트' },
  //   { path: '/admin/community-management', label: '커뮤니티 관리' },
  //   { path: '/admin/comment-management', label: '댓글 관리' },
  //   { path: '/admin/inquiry-management', label: '문의 관리' },
  // ];

  // const navItems = user?.role === 'admin' ? adminNavItems : sharedNavItems;

  return (
    <MenuContext.Provider value={navItems}>{children}</MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);
