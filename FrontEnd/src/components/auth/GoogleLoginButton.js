import React from "react";
import Google_Logo from "../../assets/images/Google_Logo.png";

function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8090/api/auth/login/google";
  };

  return (
    <img src={Google_Logo} alt="Google login" onClick={handleGoogleLogin} />
  );
}

export default GoogleLoginButton;
