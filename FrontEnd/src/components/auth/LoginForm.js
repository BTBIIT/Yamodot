import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import "../../styles/LoginForm.css";
import SocialLoginButtons from "./SocialLoginButtons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";
import { ContentContainer, ContentTitle } from "../../styles/CommonStyles";
import { resetFormData } from "../../utils/restFormData";

function LoginForm() {
  const { login, savedUserId = "", setSavedUserId } = useUser();
  const [formData, setFormData] = useState({
    ...resetFormData(),
    userId: savedUserId,
    isRememberChecked: savedUserId ? true : false,
    error: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      userId: savedUserId,
      isRememberChecked: savedUserId ? true : false,
    }));
  }, [savedUserId]);

  const validateForm = () => {
    if (!formData.userId && !formData.userPassword) {
      return "아이디와 비밀번호를 입력해주세요.";
    }
    if (!formData.userId) {
      return "아이디를 입력해주세요.";
    }
    if (!formData.userPassword) {
      return "비밀번호를 입력해주세요.";
    }
    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setFormData((prevData) => ({
        ...prevData,
        error: validationError,
      }));
      return;
    }

    try {
      const response = await axios.post("/api/login", {
        userId: formData.userId,
        userPassword: formData.userPassword,
      });

      if (response.status === 200) {
        const data = response.data;
        const userData = {
          userId: formData.userId,
          userNickname: data.userNickname,
          role: data.role,
          userFavoriteTeam: data.userFavoriteTeam,
          userSocialLoginSep: data.userSocialLoginSep,
        };

        login(userData);

        if (formData.isRememberChecked) {
          setSavedUserId(formData.userId);
        } else {
          setSavedUserId("");
        }

        navigate("/");
        alert(`${formData.userId}님, 로그인 성공!`);
      }
    } catch (error) {
      console.error("로그인 오류:", error);

      if (error.response && error.response.status === 500) {
        setFormData((prevData) => ({
          ...prevData,
          error: "로그인 실패! 아이디 또는 비밀번호를 확인하세요.",
        }));
      } else if (error.response?.data?.message) {
        setFormData((prevData) => ({
          ...prevData,
          error: error.response.data.message,
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          error: "로그인 중 오류가 발생했습니다.",
        }));
      }
    }
  };

  return (
    <ContentContainer>
      <ContentTitle>
        야구의 모든 순간을 분석합니다.
        <br /> 함께 승리하세요!
      </ContentTitle>
      <form onSubmit={handleLogin}>
        <div>
          <Input
            type="text"
            name="userId"
            placeholder="아이디"
            value={formData.userId}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                userId: e.target.value,
              }))
            }
            className="input-custom"
            autoComplete="username"
            $inputType="user"
          />
        </div>

        <div>
          <Input
            type="password"
            name="userPassword"
            placeholder="비밀번호"
            value={formData.userPassword}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                userPassword: e.target.value,
              }))
            }
            className="input-custom"
            autoComplete="current-password"
            $inputType="user"
          />
        </div>
        {formData.error && <p className="error-message">{formData.error}</p>}

        <Button
          children="LOGIN"
          type="submit"
          className="loginform-button"
          $buttonType="user"
        />
      </form>
      <div className="remember-find">
        <div className="custom-checkbox">
          <Input
            type="checkbox"
            id="remember"
            checked={formData.isRememberChecked}
            onChange={() =>
              setFormData((prevData) => ({
                ...prevData,
                isRememberChecked: !prevData.isRememberChecked,
              }))
            }
          />
          <label htmlFor="remember">ID 저장하기</label>
        </div>
        <div className="login-links">
          <ul>
            <li>
              <Link to="/user/agree">회원가입</Link>
            </li>
            <li>|</li>
            <li>
              <Link to="/user/idinquiry">ID 찾기</Link>
            </li>
            <li>|</li>
            <li>
              <Link to="/user/pwinquiry">PW 찾기</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="btn-login">
        <SocialLoginButtons />
      </div>
    </ContentContainer>
  );
}

export default LoginForm;
