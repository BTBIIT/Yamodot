import React from "react";
import Kakao_Logo from "../../assets/images/Kakao_Logo.png";

function KakaoLoginButton() {
  const handleKakaoLogin = () => {
    window.location.href = "http://localhost:8090/api/auth/login/kakao";
  };

  return <img src={Kakao_Logo} alt="Kakao login" onClick={handleKakaoLogin} />;
}

export default KakaoLoginButton;
