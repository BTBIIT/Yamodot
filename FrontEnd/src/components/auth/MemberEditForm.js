import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../ui/Button";
import Input from "../ui/Input";
import TeamSelect from "../ui/TeamSelect";
import GenderInput from "./GenderInput";
import NicknameInput from "./NicknameInput";
import BirthDayInput from "./BirthDayInput";
import { useNavigate } from "react-router-dom";
import { ContentContainer, ContentTitle } from "../../styles/CommonStyles";
import { resetFormData } from "../../utils/restFormData";
function MemberEditForm() {
  const [formData, setFormData] = useState(resetFormData());
  const [selectedTeam, setSelectedTeam] = useState("구단선택");
  const [isNicknameChanged, setIsNicknameChanged] = useState(false);
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [isBirthDayValid, setIsBirthDayValid] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/auth/update/get-user", {
          withCredentials: true,
        });
        const userData = response.data;

        setFormData((prevState) => ({
          ...prevState,
          userId: userData.userId,
          userName: userData.userName,
          userEmail: userData.userEmail,
          userNickname: userData.userNickname,
          userBirthDay: userData.userBirthDay,
          userGender: userData.userGender,
          userFavoriteTeam: userData.userFavoriteTeam || "구단선택",
        }));
        setSelectedTeam(userData.userFavoriteTeam || "구단선택");
      } catch (error) {
        console.error("사용자 정보 가져오기 실패:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "userNickname") {
      setIsNicknameChanged(true);
      setIsNicknameValid(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.userBirthDay && !isBirthDayValid) {
      alert("생년월일이 올바르지 않습니다.");
      return;
    }

    if (isNicknameChanged && !isNicknameValid) {
      alert("닉네임 중복 확인이 필요합니다.");
      return;
    }

    try {
      const dataToUpdate = {
        userUniqueNumber: formData.userId,
        userNickname: formData.userNickname,
        userBirthDay: formData.userBirthDay,
        userGender: formData.userGender,
        userFavoriteTeam: selectedTeam,
      };
      console.log("전송되는 데이터:", dataToUpdate);
      const response = await axios.put("/api/auth/update/info", dataToUpdate, {
        withCredentials: true,
      });

      const backendMessage = response.data.message || response.data;

      if (response.status === 200) {
        alert(backendMessage);
        navigate("/");
      } else {
        alert("회원정보 수정에 실패했습니다.");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("닉네임이 중복되었습니다. 다른 닉네임을 사용해주세요.");
      } else {
        console.error("회원정보 수정 중 오류 발생:", error);
        alert("회원정보 수정 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <ContentContainer>
      <ContentTitle>회원정보 수정</ContentTitle>
      <form onSubmit={handleSubmit}>
        <div>
          <Input
            placeholder="아이디"
            name="userId"
            value={formData.userId}
            disabled
            $inputType="user"
          />
        </div>
        <div>
          <Input
            placeholder="이름"
            name="userName"
            value={formData.userName}
            disabled
            $inputType="user"
          />
        </div>
        <div>
          <Input
            placeholder="이메일"
            name="userEmail"
            value={formData.userEmail}
            disabled
            $inputType="user"
          />
        </div>

        <NicknameInput
          value={formData.userNickname}
          onChange={(value) =>
            handleInputChange({ target: { name: "userNickname", value } })
          }
          onValidityChange={setIsNicknameValid}
          showDuplicateCheck={isNicknameChanged}
        />

        <BirthDayInput
          value={formData.userBirthDay}
          onChange={(value) =>
            handleInputChange({ target: { name: "userBirthDay", value } })
          }
          onValidityChange={setIsBirthDayValid}
        />

        <GenderInput
          selectedGender={formData.userGender}
          onGenderChange={(value) =>
            setFormData((prevState) => ({
              ...prevState,
              userGender: value,
            }))
          }
        />

        <TeamSelect
          selectedTeam={selectedTeam}
          setSelectedTeam={setSelectedTeam}
          $selectType="custom"
          labelType=""
        />

        <div>
          <Button children="회원정보 수정" type="submit" $buttonType="user" />
        </div>
      </form>
    </ContentContainer>
  );
}

export default MemberEditForm;
