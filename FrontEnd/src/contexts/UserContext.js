import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({}); // null: guest, user: user info, admin: admin info
  const [savedUserId, setSavedUserId] = useState(""); // 아이디 저장 상태 추가
  const [alertShown, setAlertShown] = useState(false); // alert 표시 여부 상태 추가

  useEffect(() => {
    // 페이지 로드 시 로그인 상태 확인
    const checkUserStatus = async () => {
      try {
        const response = await axios.get("/api/auth/user", {
          withCredentials: true,
        });
        setUser(response.data); // 서버에서 사용자 정보를 받아와 저장
      } catch (error) {
        console.error("사용자 정보 가져오기 실패:", error);
        setUser(null); // 인증되지 않은 사용자로 간주
      }
    };

    checkUserStatus();

    // 쿠키 만료 시간 추적 로직
    const cookieMaxAge = 3600; // 1시간 (서버에서 설정한 쿠키 유효 시간)
    const cookieSetTime = new Date().getTime(); // 로그인 시 시간 기록

    const checkCookieExpiry = () => {
      const currentTime = new Date().getTime();
      const elapsedTime = (currentTime - cookieSetTime) / 1000; // 초 단위 경과 시간
      const remainingTime = cookieMaxAge - elapsedTime; // 남은 시간

      if (remainingTime <= 300 && remainingTime > 0 && !alertShown) {
        alert("쿠키 만료까지 5분 남았습니다.");
        setAlertShown(true); // alert가 한 번만 표시되도록 상태 업데이트
      }
    };

    // 1초마다 남은 시간을 체크하는 타이머 설정
    const intervalId = setInterval(checkCookieExpiry, 1000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearInterval(intervalId);
  }, [alertShown]); // alertShown 상태를 의존성 배열에 추가하여 한 번만 실행되도록 설정

  const login = (userInfo) => {
    setUser(userInfo); // 로그인 시 유저 정보 받아서 user 객체 저장
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      setUser(null); // 로그아웃 시 user 상태 초기화
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, savedUserId, setSavedUserId, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
