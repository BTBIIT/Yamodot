import React, { useEffect, useState } from "react";
import Kakao_Logo from "../../assets/images/Kakao_Logo.png";
import Naver_Logo from "../../assets/images/Naver_Logo.png";
import Google_Logo from "../../assets/images/Google_Logo.png";
import { useLocation } from "react-router-dom";

const SocialLoginButtons = () => {
  const location = useLocation();
  const [alertShown, setAlertShown] = useState(false);

  const platformDetails = {
    kakao: {
      url: "http://localhost:8090/api/auth/login/kakao",
      logo: Kakao_Logo,
      alt: "Kakao login",
    },
    naver: {
      url: "http://localhost:8090/api/auth/login/naver",
      logo: Naver_Logo,
      alt: "Naver login",
    },
    google: {
      url: "http://localhost:8090/api/auth/login/google",
      logo: Google_Logo,
      alt: "Google login",
    },
  };

  const handleSocialLogin = (platform) => {
    window.location.href = platformDetails[platform].url;
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");

    if (error && !alertShown) {
      alert(decodeURIComponent(error));
      setAlertShown(true);
    }
  }, [location.search, alertShown]);

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      {Object.keys(platformDetails).map((platform) => (
        <img
          key={platform}
          src={platformDetails[platform].logo}
          alt={platformDetails[platform].alt}
          onClick={() => handleSocialLogin(platform)}
        />
      ))}
    </div>
  );
};

export default SocialLoginButtons;
