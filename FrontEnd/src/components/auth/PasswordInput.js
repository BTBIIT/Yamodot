import React, { useState } from "react";
import styled from "styled-components";
import Input from "../ui/Input";

const PasswordInputWrapper = styled.div`
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

const PasswordInput = ({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmChange,
  autoCompletePassword = "new-password",
}) => {
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,16}$/;

  const validatePassword = (value) => {
    if (!passwordRegex.test(value)) {
      setPasswordError(
        "8~16자의 영문 대/소문자, 숫자, 특수문자만 입력 가능합니다."
      );
    } else {
      setPasswordError("");
    }
  };

  const validateConfirmPassword = (value) => {
    if (value !== password) {
      setConfirmError("비밀번호가 일치하지 않습니다.");
    } else {
      setConfirmError("");
    }
  };

  return (
    <PasswordInputWrapper>
      <div className="form-group">
        <Input
          type="password"
          placeholder="비밀번호 *"
          required
          value={password}
          autoComplete={autoCompletePassword}
          $inputType="user"
          onChange={(e) => {
            onPasswordChange(e.target.value);
            validatePassword(e.target.value);
          }}
          className={passwordError ? "input-error" : ""}
        />
        {passwordError && <p className="error-message">{passwordError}</p>}
      </div>

      <div className="form-group">
        <Input
          type="password"
          placeholder="비밀번호 확인 *"
          required
          value={confirmPassword}
          autoComplete="off"
          $inputType="user"
          onChange={(e) => {
            onConfirmChange(e.target.value);
            validateConfirmPassword(e.target.value);
          }}
          className={confirmError ? "input-error" : ""}
        />
        {confirmError && <p className="error-message">{confirmError}</p>}
      </div>
    </PasswordInputWrapper>
  );
};

export default PasswordInput;
