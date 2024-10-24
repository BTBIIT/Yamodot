import React, { useState } from "react";
import axios from "axios";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { ContentContainer, ContentTitle } from "../../styles/CommonStyles";

function MemberCancelForm() {
  const [formData, setFormData] = useState({
    userPassword: "",
    isConfirmationModalOpen: false,
    isResultModalOpen: false,
    resultMessage: "",
  });
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleInputChange = (e) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      userPassword: value,
    }));
  };

  // 확인 모달 열기
  const openConfirmationModal = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      isConfirmationModalOpen: true,
    }));
  };

  // 확인 모달 닫기
  const closeConfirmationModal = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      isConfirmationModalOpen: false,
    }));
  };

  // 결과 모달 열기
  const openResultModal = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      isResultModalOpen: true,
    }));
  };

  // 결과 모달 닫기
  const closeResultModal = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      isResultModalOpen: false,
    }));
  };

  // 회원 탈퇴 요청 핸들러
  const handleConfirmCancel = async () => {
    try {
      const requestData = {
        userSocialLoginSep: user?.userSocialLoginSep || "Y", // 소셜 로그인 여부 확인
      };

      // 자체 로그인 사용자의 경우 비밀번호도 포함
      if (requestData.userSocialLoginSep === "Y") {
        requestData.userPassword = formData.userPassword;
      }

      // 올바른 엔드포인트 설정
      const endpoint =
        requestData.userSocialLoginSep === "Y"
          ? "/api/auth/secession/delete" // 자체 로그인 사용자 (비밀번호 필요)
          : "/api/auth/secession/delete-confirm"; // 소셜 로그인 사용자 (비밀번호 필요 없음)

      // 서버에 회원 탈퇴 요청
      const response = await axios.post(endpoint, requestData, {
        withCredentials: true, // JWT 토큰 포함
      });

      if (response.status === 200) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          resultMessage: "탈퇴가 완료되었습니다.",
        }));

        // 로그아웃 및 메인 페이지로 이동
        logout(); // 로그아웃 처리
        navigate("/"); // 메인 페이지로 리다이렉트
      } else {
        // 탈퇴 실패 시 처리
        setFormData((prevFormData) => ({
          ...prevFormData,
          resultMessage: response.data || "회원 탈퇴 중 오류가 발생했습니다.",
        }));
        openResultModal(); // 결과 모달 열기
      }
    } catch (error) {
      console.error("회원 탈퇴 중 오류 발생:", error);
      setFormData((prevFormData) => ({
        ...prevFormData,
        resultMessage: "회원 탈퇴 중 오류가 발생했습니다.",
      }));
      openResultModal(); // 결과 모달 열기
    } finally {
      // 확인 모달을 닫기
      closeConfirmationModal();
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault(); // 폼 제출 시 새로고침 방지
    openConfirmationModal(); // 확인 모달 열기
  };

  return (
    <ContentContainer>
      <ContentTitle style={{ marginTop: "5vh", marginBottom: "3vh" }}>
        회원 탈퇴
      </ContentTitle>
      <form onSubmit={handleSubmit}>
        <div>
          {user?.userSocialLoginSep === "Y" && (
            <Input
              type="password"
              placeholder="비밀번호"
              value={formData.userPassword || ""}
              onChange={handleInputChange}
              $inputType="user"
            />
          )}
        </div>

        <div style={{ marginTop: "10vh" }}>
          <Button children="확인" type="submit" $buttonType="user" />
        </div>
      </form>

      {/* 확인 모달 */}
      <Modal
        isOpen={formData.isConfirmationModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleConfirmCancel}
        message={
          <>
            {user?.userNickname ? (
              <>
                {user.userNickname}님,
                <br /> 정말로 탈퇴하시겠습니까?
              </>
            ) : (
              "사용자 정보를 불러오는 중입니다..."
            )}
          </>
        }
        confirmText="확인"
        cancelText="취소"
        width="350px"
        height="220px"
      />

      {/* 결과 모달 */}
      <Modal
        isOpen={formData.isResultModalOpen}
        onClose={closeResultModal}
        message={formData.resultMessage}
        onConfirm={closeResultModal}
        confirmText="확인"
        width="350px"
        height="220px"
      />
    </ContentContainer>
  );
}

export default MemberCancelForm;
