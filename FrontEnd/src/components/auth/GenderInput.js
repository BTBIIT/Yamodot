import React from "react";
import styled from "styled-components";
import Button from "../ui/Button";
import Input from "../ui/Input";

const GenderInputWrapper = styled.div`
  .gender-buttons {
    position: relative;
  }

  .gender-button {
    position: absolute;
    cursor: pointer;
  }

  .gender-button:nth-child(1) {
    right: 41%;
  }

  .gender-button:nth-child(2) {
    right: 23%;
  }

  .gender-button:nth-child(3) {
    right: 5%;
  }

  .selected {
    background-color: #d71e17;
    color: white;
  }
`;

const GenderInput = ({ selectedGender, onGenderChange }) => {
  const genderMapping = {
    남자: 1,
    여자: 2,
    선택안함: 3,
  };

  return (
    <GenderInputWrapper>
      <Input
        type="text"
        placeholder="성별"
        name="userGender"
        value="성별"
        disabled
        $inputType="user"
      />

      <div className="gender-buttons">
        <Button
          children="선택안함"
          $buttonType="gender"
          type="button"
          $selected={selectedGender === genderMapping.선택안함}
          onClick={() => onGenderChange(genderMapping.선택안함)}
          className={`gender-button ${
            selectedGender === genderMapping.선택안함 ? "selected" : ""
          }`}
        />
        <Button
          children="남자"
          $buttonType="gender"
          type="button"
          $selected={selectedGender === genderMapping.남자}
          onClick={() => onGenderChange(genderMapping.남자)}
          className={`gender-button ${
            selectedGender === genderMapping.남자 ? "selected" : ""
          }`}
        />
        <Button
          children="여자"
          $buttonType="gender"
          type="button"
          $selected={selectedGender === genderMapping.여자}
          onClick={() => onGenderChange(genderMapping.여자)}
          className={`gender-button ${
            selectedGender === genderMapping.여자 ? "selected" : ""
          }`}
        />
      </div>
    </GenderInputWrapper>
  );
};

export default GenderInput;
