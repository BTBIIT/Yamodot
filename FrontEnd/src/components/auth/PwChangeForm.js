import React, { useState } from "react";
import axios from "axios";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useNavigate } from "react-router-dom";
import { ContentContainer, ContentTitle } from "../../styles/CommonStyles";

function PwChangeForm() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const navigate = useNavigate();

  const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,16}$/;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // 새 비밀번호 검증을 실시간으로 수행
    if (name === "newPassword") {
      if (!passwordRegex.test(value)) {
        setNewPasswordError(
          "8~16자의 영문 대/소문자, 숫자, 특수문자만 입력 가능합니다."
        );
      } else {
        setNewPasswordError("");
      }
    }

    if (name === "confirmNewPassword") {
      if (value !== formData.newPassword) {
        setConfirmPasswordError("새 비밀번호와 일치하지 않습니다.");
      } else {
        setConfirmPasswordError("");
      }
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmNewPassword } = formData;

    if (!currentPassword) {
      setErrorMessage("현재 비밀번호를 입력해주세요.");
      return;
    }

    if (!newPassword) {
      setErrorMessage("새 비밀번호를 입력해주세요.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage("새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      const response = await axios.put(
        "/api/auth/update/password",
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          withCredentials: true,
        }
      );

      const backendMessage = response.data.message || response.data;

      if (response.status === 200) {
        alert(backendMessage);
        navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(
          error.response.data || "비밀번호 변경 중 오류가 발생했습니다."
        );
      } else {
        setErrorMessage("서버와의 통신 중 오류가 발생했습니다.");
      }
      console.error("비밀번호 변경 중 오류 발생:", error);
    }
  };

  return (
    <ContentContainer>
      <ContentTitle style={{ marginTop: "3vh", marginBottom: "3vh" }}>
        비밀번호 변경
      </ContentTitle>
      <form onSubmit={handleChangePassword}>
        <div>
          <Input
            type="password"
            name="currentPassword"
            placeholder="현재 비밀번호"
            value={formData.currentPassword}
            onChange={handleInputChange}
            $inputType="user"
          />
        </div>
        <div>
          <Input
            type="password"
            name="newPassword"
            placeholder="새 비밀번호"
            value={formData.newPassword}
            onChange={handleInputChange}
            $inputType="user"
          />
        </div>
        {newPasswordError && (
          <p className="error-message">{newPasswordError}</p>
        )}
        <div>
          <Input
            type="password"
            name="confirmNewPassword"
            placeholder="새 비밀번호 확인"
            value={formData.confirmNewPassword}
            onChange={handleInputChange}
            $inputType="user"
          />
        </div>

        {(confirmPasswordError || errorMessage) && (
          <p className="error-message">
            {confirmPasswordError || errorMessage}
          </p>
        )}

        <div style={{ marginTop: "5vh" }}>
          <Button children="확인" type="submit" $buttonType="user" />
        </div>
      </form>
    </ContentContainer>
  );
}

export default PwChangeForm;
