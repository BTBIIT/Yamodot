import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import "../../styles/PwInquiryForm.css";
import { Link } from "react-router-dom";
import axios from "axios";
import EmailVerification from "./EmailVerification";
import { ContentContainer, ContentTitle } from "../../styles/CommonStyles";
import { resetFormData } from "../../utils/restFormData";

function PwInquiryForm() {
  const [formData, setFormData] = useState(resetFormData());
  const [errorMessage, setErrorMessage] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  useEffect(() => {
    setFormData({
      ...resetFormData(),
      userId: "",
      userEmail: "",
      verificationCode: "",
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userId) {
      setErrorMessage("아이디를 입력해주세요.");
      return;
    }

    if (!formData.userEmail) {
      setErrorMessage("이메일를 입력해세요.");
    }

    if (!verificationSuccess) {
      setErrorMessage("이메일과 인증번호 확인을 완료해주세요.");
      return;
    }

    try {
      const response = await axios.get(`/api/findmypassword`, {
        params: {
          userId: formData.userId,
          userEmail: formData.userEmail,
        },
      });

      if (response.status === 200) {
        alert(response.data.message);
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
        비밀번호 찾기
      </ContentTitle>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="아이디 *"
          name="userId"
          className="pwinquiry-input"
          value={formData.userId}
          onChange={handleChange}
          $inputType="user"
        />

        <EmailVerification
          formData={formData}
          setFormData={setFormData}
          setVerificationSuccess={setVerificationSuccess}
          isRequired={false}
          actionType="PwInquiry"
        />

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <Button
          children="확인"
          className="pwinquiry-button"
          type="submit"
          $buttonType="user"
        />
      </form>

      <span className="pwinquiry-id">
        아이디가 기억나지 않는다면? <Link to="/user/idinquiry"> ID 찾기</Link>
      </span>
    </ContentContainer>
  );
}

export default PwInquiryForm;
