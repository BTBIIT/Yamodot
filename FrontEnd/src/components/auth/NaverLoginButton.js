import React from "react";
import Naver_Logo from "../../assets/images/Naver_Logo.png";

function NaverLoginButton() {
  const handleNaverLogin = () => {
    window.location.href = "http://localhost:8090/api/auth/login/naver";
  };

  return <img src={Naver_Logo} alt="Naver login" onClick={handleNaverLogin} />;
}

export default NaverLoginButton;
