import React, { useState } from "react";
import styled from "styled-components";
import Button from "../ui/Button";
import Input from "../ui/Input";
import axios from "axios";

const EmailVerificationWrapper = styled.div`
  .form-group {
    position: relative;
  }
  .error-message {
    color: red;
    font-size: 12px;
    margin-top: 5px;
  }

  .success-message {
    color: green;
    font-size: 12px;
    margin-top: 5px;
  }
`;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EmailVerification = ({
  formData,
  setFormData,
  setVerificationSuccess,
  isRequired = false,
  actionType,
}) => {
  const [userEmailError, setUserEmailError] = useState("");
  const [verificationCodeError, setVerificationCodeError] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      userEmail: value,
    });

    if (!emailRegex.test(value)) {
      setUserEmailError("올바른 이메일 형식이 아닙니다.");
    } else {
      setUserEmailError("");
    }
  };

  const handleSendVerification = async () => {
    if (!emailRegex.test(formData.userEmail)) {
      setUserEmailError("올바른 이메일 형식이 아닙니다.");
      return;
    }

    try {
      const response = await axios.post("/send-auth-code", {
        email: formData.userEmail,
        actionType: actionType,
      });

      if (response.data.success) {
        alert("인증번호가 이메일로 발송되었습니다.");
      } else {
        setUserEmailError(
          response.data.message || "인증번호 전송에 실패했습니다."
        );
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 409 &&
        actionType === "signup"
      ) {
        setUserEmailError(
          error.response.data.message || "이메일이 중복되었습니다."
        );
      } else {
        console.error("인증번호 발송 중 오류 발생", error);
        setUserEmailError(
          "인증번호 발송 중 문제가 발생했습니다. 다시 시도해주세요."
        );
      }
    }
  };

  const handleVerifyCode = async () => {
    if (!formData.verificationCode) {
      setVerificationCodeError("인증번호를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post("/verify-auth-code", {
        email: formData.userEmail,
        authCode: formData.verificationCode,
      });

      if (response.data.success) {
        setVerificationSuccess(true);
        setVerificationMessage("인증번호가 일치합니다.");
        setVerificationCodeError("");
      } else {
        setVerificationSuccess(false);
        setVerificationMessage("");
        setVerificationCodeError("인증번호가 틀렸습니다. 다시 확인해주세요.");
      }
    } catch (error) {
      console.error("인증번호 확인 중 오류 발생", error);
      setVerificationCodeError("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <EmailVerificationWrapper>
      {/* 이메일 입력 */}
      <div className="form-group">
        <Input
          type="email"
          placeholder="이메일 *"
          name="userEmail"
          value={formData.userEmail}
          onChange={handleEmailChange}
          className="input-field"
          required={isRequired}
          $inputType="user"
        />
        <Button
          children="확인"
          onClick={handleSendVerification}
          $buttonType="doubleCheck"
          className="button"
          type="button"
        />
      </div>
      {userEmailError && <p className="error-message">{userEmailError}</p>}

      {/* 인증번호 입력 */}
      <div className="form-group">
        <Input
          type="text"
          placeholder="인증번호 *"
          name="verificationCode"
          value={formData.verificationCode}
          onChange={(e) =>
            setFormData({ ...formData, verificationCode: e.target.value })
          }
          className="input-field"
          required={isRequired}
          $inputType="user"
        />
        <Button
          children="확인"
          onClick={handleVerifyCode}
          $buttonType="doubleCheck"
          className="button"
          type="button"
        />
      </div>
      {(verificationCodeError || verificationMessage) && (
        <p
          className={
            verificationCodeError
              ? "error-message"
              : verificationMessage === "인증번호가 일치합니다."
              ? "success-message"
              : "error-message"
          }
        >
          {verificationCodeError || verificationMessage}
        </p>
      )}
    </EmailVerificationWrapper>
  );
};

export default EmailVerification;
