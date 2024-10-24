import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../ui/Input";
import { ContentContainer, ContentTitle } from "../../styles/CommonStyles";
import "../../styles/PersonalInfomationForm.css";
import Button from "../ui/Button";
import logo from "../../assets/images/Main_Logo2.png";

const PersonalInfomationForm = () => {
  const [isAgreedService, setIsAgreedService] = useState(false); // 서비스 이용약관 동의
  const [isAgreedPrivacy, setIsAgreedPrivacy] = useState(false); // 개인정보 처리방침 동의
  const [isAgreedAll, setIsAgreedAll] = useState(false); // 전체 동의 체크박스 상태
  const [isAgreedOptional, setIsAgreedOptional] = useState(false); // 선택 사항 동의
  const navigate = useNavigate();

  // 전체 동의 처리
  const handleAllCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setIsAgreedAll(isChecked);
    setIsAgreedService(isChecked);
    setIsAgreedPrivacy(isChecked);
    setIsAgreedOptional(isChecked);
  };

  // 개별 체크박스 처리
  const handleServiceCheckboxChange = (e) => {
    setIsAgreedService(e.target.checked);
    setIsAgreedAll(e.target.checked && isAgreedPrivacy && isAgreedOptional); // 선택항목 포함
  };

  const handlePrivacyCheckboxChange = (e) => {
    setIsAgreedPrivacy(e.target.checked);
    setIsAgreedAll(e.target.checked && isAgreedService && isAgreedOptional);
  };

  const handleOptionalCheckboxChange = (e) => {
    setIsAgreedOptional(e.target.checked);
    setIsAgreedAll(e.target.checked && isAgreedService && isAgreedPrivacy);
  };

  const handleNextStep = () => {
    if (isAgreedService && isAgreedPrivacy) {
      navigate("/user/signup");
    } else {
      alert("필수 항목에 동의해야 회원가입이 가능합니다.");
    }
  };

  // 전체 동의 안내 문구
  const allAgreementNotice = `
   실명 인증된 아이디로 가입, 이벤트・혜택 정보 수신(선택) 동의를 포함합니다.
 `;

  const termsServiceContent = `
여러분을 환영합니다. 야모닷 웹사이트(이하 ‘서비스’)를 이용해 주셔서 감사합니다. 본 약관은 데이터 분석, 일정 확인, 결과 및 기록 제공, 커뮤니티 참여, 문의글 작성 등 다양한 야모닷 서비스의 이용과 관련하여 서비스 제공자와 이용자(이하 ‘회원’) 간의 관계를 설명합니다. 회원으로 가입하거나 서비스를 이용하실 경우 본 약관에 동의하는 것으로 간주됩니다.

1. 서비스 제공
야모닷은 일정, 결과, 기록, 데이터 분석을 확인하고 커뮤니티에 참여하거나 문의글을 작성할 수 있는 다양한 기능을 제공합니다. 회원은 서비스 이용을 통해 제공되는 각종 자료를 열람할 수 있으며, 게시물 작성 등 다양한 활동을 할 수 있습니다.

2. 회원 가입 및 계정 관리
회원 가입을 통해 이용자는 야모닷 서비스에 대한 계정(이하 ‘계정’)을 부여받습니다. 계정은 회원이 서비스에 로그인하여 이용하는 기록을 관리하기 위한 단위입니다. 회원은 계정을 통해 더욱 다양한 서비스를 이용할 수 있으며, 계정 정보는 항상 최신으로 유지해야 합니다.

3. 개인정보 보호
서비스 이용을 위해 수집된 회원의 개인정보는 관련 법령에 따라 안전하게 보호되며, 개인정보 수집과 이용에 대한 상세한 내용은 개인정보 처리 방침에서 확인할 수 있습니다.

4. 게시물의 관리
회원이 작성한 게시물에 대한 권리는 회원에게 있습니다. 회원이 작성한 게시물은 다른 이용자들이 열람할 수 있으며, 회원은 게시물을 삭제하거나 비공개로 설정할 수 있는 기능을 이용할 수 있습니다. 단, 법령을 위반하거나 부적절한 게시물은 사전 통보 없이 삭제될 수 있습니다.

5. 서비스 이용 제한
회원이 본 약관 또는 관련 법령을 위반할 경우, 서비스 이용이 제한될 수 있습니다. 서비스 이용 제한에 대한 구체적인 기준은 게시물 운영정책 또는 별도 공지를 통해 안내됩니다.

6. 서비스 변경 및 중단
야모닷은 운영상의 필요에 따라 서비스의 전부 또는 일부를 변경하거나 중단할 수 있으며, 이러한 경우 사전에 공지할 것입니다. 무료로 제공되는 서비스가 중단될 경우, 이에 대한 별도의 보상은 이루어지지 않습니다.`;

  const termsPrivacyContent = `
  개인정보 수집 및 이용에 관한 동의서

야모닷 웹사이트(이하 ‘서비스’)를 이용해 주셔서 감사합니다. 본 동의서는 서비스 이용과 관련하여 회원 가입 신청 시 수집하는 개인정보 항목, 개인정보의 수집 및 이용 목적, 개인정보의 보유 및 이용 기간, 동의 거부 권리 및 거부 시 불이익에 대해 안내 드립니다. 아래 내용을 자세히 읽으신 후 동의해 주시기 바랍니다.

1. 수집하는 개인정보
이용자는 회원 가입을 하지 않고도 일정 확인, 결과 열람, 기록 확인 등 일부 서비스를 이용할 수 있습니다. 그러나, 커뮤니티 참여, 문의글 작성 등 회원 전용 서비스를 이용하기 위해서는 회원 가입이 필요하며, 다음과 같은 개인정보를 수집합니다:

필수 항목: 아이디, 비밀번호, 이름, 이메일, 휴대전화번호
선택 항목: 선호 구단, 성별, 생년월일
서비스 이용 중에는 IP 주소, 쿠키, 서비스 이용 기록, 기기 정보, 위치 정보가 자동으로 생성 및 수집될 수 있습니다.
2. 수집한 개인정보의 이용 목적
야모닷은 수집한 개인정보를 다음과 같은 목적으로 이용합니다:

회원 가입 의사 확인, 서비스 이용에 따른 본인 식별 및 인증
커뮤니티 참여 및 게시물 작성, 문의글 작성 등 회원 전용 서비스 제공
서비스 개선 및 새로운 서비스 제공을 위한 분석과 연구
불법 또는 부정 이용 방지를 위한 이용 기록 확인 및 관리
서비스 이용 관련 고지 및 통지
3. 개인정보의 보유 및 이용 기간
원칙적으로, 회원 탈퇴 시 수집된 개인정보는 즉시 파기됩니다. 그러나 법령에 따라 일정 기간 동안 정보를 보관해야 할 경우, 해당 기간 동안 안전하게 보관합니다.

회원 탈퇴 시: 회원 탈퇴 즉시 개인정보 파기
관련 법령에 따른 보관:
계약 또는 청약철회 기록: 5년
대금 결제 및 재화 공급 기록: 5년
소비자 불만 또는 분쟁 처리 기록: 3년
4. 개인정보 수집 및 이용 동의 거부 권리
이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다. 다만, 회원 가입 시 필수 항목에 대한 동의를 거부하실 경우, 회원 가입 및 관련 서비스를 이용하실 수 없습니다. 
  
  `;

  const optionalAgreementContent = `
 야모닷은 서비스의 이벤트・혜택 등의 정보를 발송하기 위해 회원의 아이디(아이디 식별값 포함), 이메일주소를 수집합니다.

아이디(아이디 식별값 포함), 휴대전화번호 및 이메일주소는 야모닷 서비스 제공을 위한 필수 수집 항목으로서, 회원 가입 기간 동안 보관됩니다. 그러나 이벤트 및 혜택 정보 수신 동의를 철회하실 경우, 해당 목적에 따른 개인정보 처리는 중지됩니다. 정보주체는 개인정보 수집 및 이용 동의를 거부할 수 있으며, 미동의 시에도 서비스 이용은 가능합니다.

※ 일부 서비스(별도의 회원체계를 운영하거나, 야모닷 가입 후 추가 가입이 필요한 서비스 등)의 경우, 수신에 대해 별도로 안내드리며, 동의를 구합니다.
`;

  return (
    <ContentContainer>
      <div className="personal-logo-title">
        <img src={logo} alt="logo" className="personal-logo" />
        <ContentTitle>개인정보 처리방침</ContentTitle>
      </div>

      {/* 전체 동의 체크박스 */}
      <div className="agree-box-container">
        <div className="agree-checkbox">
          <Input
            type="checkbox"
            checked={isAgreedAll}
            onChange={handleAllCheckboxChange}
          />
          <label>전체 동의하기</label>
        </div>
        <div className="agree-box-all">
          <p>{allAgreementNotice}</p>
        </div>
      </div>

      {/* 서비스 이용약관 */}
      <div className="agree-box-container">
        <div className="agree-checkbox">
          <Input
            type="checkbox"
            checked={isAgreedService}
            onChange={handleServiceCheckboxChange}
          />
          <label>
            <span className="option-point">[필수]</span> 야모닷 이용약관
          </label>
        </div>
        <div className="agree-box">
          <p>{termsServiceContent}</p>
        </div>
      </div>

      {/* 개인정보 처리방침 */}
      <div className="agree-box-container">
        <div className="agree-checkbox">
          <Input
            type="checkbox"
            checked={isAgreedPrivacy}
            onChange={handlePrivacyCheckboxChange}
          />
          <label>
            <span className="option-point">[필수]</span> 개인정보 수집 및 이용
          </label>
        </div>
        <div className="agree-box">
          <p>{termsPrivacyContent}</p>
        </div>
      </div>

      {/* 선택사항 */}
      <div className="agree-box-container">
        <div className="agree-checkbox">
          <Input
            type="checkbox"
            checked={isAgreedOptional}
            onChange={handleOptionalCheckboxChange}
          />
          <label>
            <span className="option-point-select">[선택]</span> 이벤트・혜택
            정보 수신 동의
          </label>
        </div>
        <div className="agree-box">
          <p>{optionalAgreementContent}</p>
        </div>
      </div>
      <Button onClick={handleNextStep} $buttonType="user">
        다음
      </Button>
    </ContentContainer>
  );
};

export default PersonalInfomationForm;
