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

const idRegex = /^[a-zA-Z0-9]{5,10}$/;
const IdInput = ({
  value,
  onChange,
  onValidityChange,
  autoComplete = "off",
}) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);

  const validateId = (id) => {
    if (!idRegex.test(id)) {
      setError("5~10자의 영문 대/소문자, 숫자만 입력 가능합니다.");
      setSuccess("");
      onValidityChange(false);
    } else {
      setError("");
      setSuccess("");
      onValidityChange(false);
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    onChange(value);
    setIsDuplicateChecked(false);
    validateId(value);
  };

  const handleCheckDuplicate = async () => {
    if (error || !value) return;

    try {
      const response = await axios.post("/check-userid", { userId: value });

      if (response.data) {
        setError("");
        setSuccess("사용할 수 있는 아이디입니다.");
        setIsDuplicateChecked(true);
        onValidityChange(true);
      } else {
        if (value.toLowerCase().includes("admin")) {
          setError("아이디에 'admin'을 포함할 수 없습니다.");
        } else {
          setError("이미 사용 중인 아이디입니다.");
        }
        setSuccess("");
        setIsDuplicateChecked(false);
        onValidityChange(false);
      }
    } catch (error) {
      setError("오류가 발생했습니다. 다시 시도해주세요.");
      setSuccess("");
      setIsDuplicateChecked(false);
      onValidityChange(false);
    }
  };

  return (
    <InputWrapper>
      <Input
        type="text"
        placeholder="아이디 *"
        required
        value={value}
        onChange={handleChange}
        className={error ? "input-error" : ""}
        autoComplete={autoComplete}
        $inputType="user"
      />

      <Button
        children="확인"
        $buttonType="doubleCheck"
        className="button"
        type="button"
        onClick={handleCheckDuplicate}
      />

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </InputWrapper>
  );
};

export default IdInput;
