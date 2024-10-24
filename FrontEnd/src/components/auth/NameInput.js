import React, { useState } from "react";
import styled from "styled-components";
import Input from "../ui/Input";

const NameInputWrapper = styled.div`
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

const nameRegex = /^[가-힣a-zA-Z\s]{2,20}$/;

const NameInput = ({ value, onChange }) => {
  const [error, setError] = useState("");

  const validateName = (name) => {
    if (!nameRegex.test(name)) {
      setError("이름은 2~20자의 한글 또는 영문으로 입력해주세요.");
    } else {
      setError("");
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    onChange(value);
    validateName(value);
  };

  return (
    <NameInputWrapper>
      <div>
        <Input
          type="text"
          placeholder="이름 *"
          name="userName"
          value={value}
          onChange={handleChange}
          className={error ? "input-error" : ""}
          required
          $inputType="user"
        />
        {error && <p className="error-message">{error}</p>}
      </div>
    </NameInputWrapper>
  );
};

export default NameInput;
