import React, { useState, useEffect } from "react";
import "../../styles/IdInquiryForm.css";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { Link } from "react-router-dom";
import axios from "axios";
import EmailVerification from "./EmailVerification";
import { ContentContainer, ContentTitle } from "../../styles/CommonStyles";
import { resetFormData } from "../../utils/restFormData";

function IdInquiryForm() {
  const [formData, setFormData] = useState(resetFormData);
  const [errorMessage, setErrorMessage] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  useEffect(() => {
    setFormData({
      ...resetFormData(),
      userName: "",
      userEmail: "",
      verificationCode: "",
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleIdInquiry = async (e) => {
    e.preventDefault();

    if (!formData.userName) {
      setErrorMessage("이름을 입력해주세요.");
      return;
    }

    if (!formData.userEmail) {
      setErrorMessage("이메일를 입력해세요.");
    }

    if (!verificationSuccess) {
      setErrorMessage("이메일과 인증번호 확인을 완료해주세요.");
      return;
    }
    setErrorMessage("");

    try {
      const response = await axios.get("/api/findmyid", {
        params: {
          userName: formData.userName,
          userEmail: formData.userEmail,
        },
      });

      if (response.status === 200) {
        alert(`찾으신 아이디는 ${response.data.userId}입니다.`);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("서버와 통신 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <ContentContainer>
      <ContentTitle style={{ marginBottom: "3vh", marginTop: "3vh" }}>
        아이디 찾기
      </ContentTitle>
      <form onSubmit={handleIdInquiry}>
        <Input
          type="text"
          placeholder="이름 *"
          value={formData.userName}
          onChange={handleInputChange}
          name="userName"
          className="idinquiry-input"
          $inputType="user"
        />

        <EmailVerification
          formData={formData}
          setFormData={setFormData}
          setVerificationSuccess={setVerificationSuccess}
          isRequired={false}
          actionType="IdInquiry"
        />

        {errorMessage && (
          <p className="idinquiry-error-message">{errorMessage}</p>
        )}

        <Button
          children="확인"
          type="submit"
          className="idinquiry-button"
          $buttonType="user"
        />
      </form>
      <div className="idinquiry-pw">
        <ul>
          <li>
            <Link to="/user/pwinquiry">PW 찾기</Link>
          </li>
          <li>|</li>
          <li>
            <Link to="/user/signup">회원가입</Link>
          </li>
        </ul>
      </div>
    </ContentContainer>
  );
}
export default IdInquiryForm;
