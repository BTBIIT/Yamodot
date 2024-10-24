import React from "react";
import styled from "styled-components";

// 모달 오버레이 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

// 모달 콘텐츠 스타일 (반응형 적용)
const ModalContent = styled.div`
  background: #ffffff;
  padding: 30px 20px;
  border-radius: 30px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: ${(props) => (props.width ? props.width : "600px")};
  max-width: 90vw;
  height: ${(props) => props.height || "auto"};
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

// 모달 타이틀 스타일
const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 1vh;
  margin-bottom: 1vh;
  color: #333;
  text-align: center;
`;

// 모달 메시지/테이블 스크롤 가능 영역
const ModalMessage = styled.div`
  flex: 1; /* 테이블 영역이 남은 공간을 차지하도록 설정 */
  overflow-y: auto; /* 메시지나 테이블이 길 경우 스크롤 가능 */
  padding: 20px 0;
  text-align: center;
  max-height: 70vh; /* 높이를 제한하여 스크롤 활성화 */
`;

// 버튼 래퍼 스타일 (고정 위치 설정)
const ModalButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  position: relative;
  margin-top: 20px;
  padding-bottom: 20px;
`;

// 확인 버튼 스타일
const ConfirmButton = styled.button`
  background-color: #ffc9c7;
  width: 3.5vw;
  height: 4vh;
  min-width: 50px;
  min-height: 35px;
  color: #d71e17;
  padding: 8px 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
`;

// 취소 버튼 스타일
const CancelButton = styled.button`
  background-color: #d2d2d2;
  width: 3.5vw;
  height: 4vh;
  min-width: 50px;
  min-height: 35px;
  color: #ffffff;
  padding: 8px 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
`;

// 닫기 버튼 스타일
const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #333;
`;

// 모달 컴포넌트 정의
const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  width = "600px",
  height = "auto",
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent width={width} height={height}>
        <CloseButton onClick={onClose}>X</CloseButton>
        {title && <ModalTitle>{title}</ModalTitle>}
        <ModalMessage>{message}</ModalMessage>
        <ModalButtonWrapper>
          <ConfirmButton onClick={onConfirm}>{confirmText}</ConfirmButton>
          <CancelButton onClick={onClose}>{cancelText}</CancelButton>
        </ModalButtonWrapper>
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;
