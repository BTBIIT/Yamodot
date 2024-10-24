import React, { useState } from "react";
import styled from "styled-components";
import Input from "../ui/Input";
import Button from "../ui/Button";
import axios from "axios";

const InputWrapper = styled.div`
  position: relative;

  .error-message {
    color: red;
    font-size: 12px;
    margin-top: 5px;
    padding-left: 20px;
  }

  .success-message {
    color: green;
    font-size: 12px;
    margin-top: 5px;
    padding-left: 20px;
  }
`;

const nicknameRegex = /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ]{2,10}$/;

const NicknameInput = ({
  value,
  onChange,
  onValidityChange,
  showDuplicateCheck = true,
}) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);

  const validateNickname = (nickname) => {
    if (!nicknameRegex.test(nickname)) {
      setError(
        "2~10자의 영문 대/소문자, 숫자, 한글 자모음 조합만 입력 가능합니다."
      );
      setSuccess("");
      onValidityChange(false);
    } else {
      setError("");
      setSuccess("");
      onValidityChange(isDuplicateChecked);
    }
    setIsDuplicateChecked(false);
  };

  const handleChange = (e) => {
    const { value } = e.target;

    if (typeof onChange !== "function") {
      console.error("onChange prop is not a function", onChange);
      return;
    }

    onChange(value);
    validateNickname(value);
  };

  const handleCheckDuplicate = async () => {
    if (error || !value) return;
    try {
      const response = await axios.post("/check-nickname", { nickname: value });
      if (response.data) {
        setError("");
        setSuccess("사용할 수 있는 닉네임입니다.");
        setIsDuplicateChecked(true);
        onValidityChange(true);
      } else {
        setSuccess("");
        setError("이미 사용 중인 닉네임입니다.");
        setIsDuplicateChecked(false);
        onValidityChange(false);
      }
    } catch (error) {
      setError("오류가 발생했습니다. 다시 시도해주세요.");
      setSuccess("");
    }
  };

  return (
    <InputWrapper>
      <Input
        type="text"
        placeholder="닉네임 *"
        value={value}
        onChange={handleChange}
        className={error ? "input-error" : ""}
        $inputType="user"
      />

      {showDuplicateCheck && (
        <Button
          children="확인"
          onClick={handleCheckDuplicate}
          $buttonType="doubleCheck"
          type="button"
          className="button"
        />
      )}

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </InputWrapper>
  );
};

export default NicknameInput;
