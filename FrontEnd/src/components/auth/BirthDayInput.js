import React, { useState } from "react";
import styled from "styled-components";
import Input from "../ui/Input";

const BirthDayInputWrapper = styled.div`
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

const birthDayRegex = /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/;
const BirthDayInput = ({ value, onChange, onValidityChange }) => {
  const [error, setError] = useState("");

  const validateBirthDay = (birthDay) => {
    if (!birthDayRegex.test(birthDay)) {
      setError("생년월일은 YYYYMMDD 형식으로 입력해주세요.");
      onValidityChange(false);
    } else {
      setError("");
      onValidityChange(true);
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    onChange(value);
    validateBirthDay(value);
  };

  return (
    <BirthDayInputWrapper>
      <div className="form-group">
        <Input
          type="text"
          placeholder="생년월일 (8자리)"
          value={value}
          onChange={handleChange}
          className={error ? "input-error" : ""}
          $inputType="user"
        />
        {error && <p className="error-message">{error}</p>}
      </div>
    </BirthDayInputWrapper>
  );
};

export default BirthDayInput;
