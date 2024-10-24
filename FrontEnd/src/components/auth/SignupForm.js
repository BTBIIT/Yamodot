import React, { useState, useEffect } from "react";
import IdInput from "./IdInput";
import PasswordInput from "./PasswordInput";
import NameInput from "./NameInput";
import NicknameInput from "./NicknameInput";
import BirthDayInput from "./BirthDayInput";
import GenderInput from "./GenderInput";
import EmailVerification from "./EmailVerification";
import TeamSelect from "../ui/TeamSelect";
import Button from "../ui/Button";
import axios from "axios";
import { ContentContainer, ContentTitle } from "../../styles/CommonStyles";
import { useNavigate } from "react-router-dom";
import { resetFormData } from "../../utils/restFormData";

const SignupForm = () => {
  const [formData, setFormData] = useState(resetFormData);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [isIdValid, setIsIdValid] = useState(false);
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [isBirthDayValid, setIsBirthDayValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setFormData(resetFormData());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isIdValid) {
      alert("ID 중복 확인을 완료해주세요.");
      return;
    }

    if (!verificationSuccess) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    if (!isNicknameValid) {
      alert("닉네임 중복 확인이 필요합니다.");
      return;
    }

    if (!isBirthDayValid) {
      alert("생년월일이 올바르지 않습니다.");
      return;
    }

    try {
      const response = await axios.post("/signup", formData);
      if (response.status === 201) {
        alert("회원가입이 성공적으로 완료되었습니다.");
        navigate("/user/login");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const backendError = error.response.data;
        setErrorMessage(
          backendError.message || "회원가입 중 오류가 발생했습니다."
        );
      } else {
        console.error("회원가입 실패:", error);
        setErrorMessage("회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <ContentContainer>
      <ContentTitle>회원가입</ContentTitle>
      <form onSubmit={handleSubmit}>
        {/* ID 입력 및 중복 확인 */}
        <IdInput
          value={formData.userId}
          onChange={(value) => setFormData({ ...formData, userId: value })}
          onValidityChange={setIsIdValid} // ID 중복 확인 결과 설정
          autoComplete="off"
        />

        {/* 비밀번호 입력 */}
        <PasswordInput
          password={formData.userPassword}
          confirmPassword={formData.confirmPassword}
          onPasswordChange={(value) =>
            setFormData({ ...formData, userPassword: value })
          }
          onConfirmChange={(value) =>
            setFormData({ ...formData, confirmPassword: value })
          }
          autoComplete="new-password"
        />

        {/* 이름 입력 */}
        <NameInput
          value={formData.userName}
          onChange={(value) => setFormData({ ...formData, userName: value })}
        />

        {/* 이메일 인증 */}
        <EmailVerification
          formData={formData}
          setFormData={setFormData}
          setVerificationSuccess={setVerificationSuccess}
          isRequired={true}
          actionType="signup"
        />

        {/* 닉네임 입력 및 중복 확인 */}
        <NicknameInput
          value={formData.userNickname}
          onChange={(value) =>
            setFormData({ ...formData, userNickname: value })
          }
          onValidityChange={setIsNicknameValid}
          showDuplicateCheck={true}
        />

        {/* 생년월일 입력 */}
        <BirthDayInput
          value={formData.userBirthDay}
          onChange={(value) =>
            setFormData({ ...formData, userBirthDay: value })
          }
          onValidityChange={setIsBirthDayValid}
        />

        {/* 성별 선택 */}
        <GenderInput
          selectedGender={formData.userGender}
          onGenderChange={(value) =>
            setFormData({ ...formData, userGender: value })
          }
        />

        {/* 구단 선택 */}
        <TeamSelect
          selectedTeam={formData.userFavoriteTeam}
          setSelectedTeam={(team) =>
            setFormData({ ...formData, userFavoriteTeam: team })
          }
          $selectType="custom"
          labelType=""
        />

        {/* 에러 메시지 출력 */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* 회원가입 버튼 */}
        <div>
          <Button type="submit" children="회원가입" $buttonType="user" />
        </div>
      </form>
    </ContentContainer>
  );
};

export default SignupForm;
