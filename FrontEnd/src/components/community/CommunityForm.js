import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import QuillEditor from "../ui/QuillEditor";
import TeamSelect from "../ui/TeamSelect";
import { BsPaperclip } from "react-icons/bs";
import "../../styles/CommunityForm.css";
import CombinedLoadingAndNoData from "../ui/StatusMessage";
import axios from "axios";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { teams } from "../../contexts/teamsData"; // teams 데이터 가져오기
import {
  ContentContainer,
  ContentTitle,
  SubContentContainer,
  HR,
} from "../../styles/CommonStyles";

const CommunityForm = ({ onAddPost }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "통합",
    file: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [charCount, setCharCount] = useState(0);
  const maxTitleLength = 50; // 제목 최대 길이
  const maxCharLimit = 1000;

  // 순수 텍스트만 계산하는 함수
  const calculatePlainTextLength = (htmlContent) => {
    const plainText = htmlContent.replace(/<[^>]*>|&nbsp;/g, "").trim();
    return plainText.length;
  };

  // 파일 선택 처리 함수
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, file });
  };

  // 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // 선택된 카테고리 이름에 해당하는 팀 ID를 찾음
    const selectedTeam = teams.find((team) => team.label === formData.category);
    const finalCategory = selectedTeam ? selectedTeam.id : 0; // 카테고리 이름을 숫자로 매핑
    const finalTitle = formData.title; // 카테고리를 포함한 제목 생성

    const formDataToSend = new FormData();
    formDataToSend.append("postTitle", finalTitle);
    formDataToSend.append("postContent", formData.content);
    formDataToSend.append("categoryName", finalCategory); // 숫자로 변환된 카테고리 전송
    // formDataToSend.append("userUniqueNumber", userUniqueNumber);

    if (formData.file) {
      formDataToSend.append("file", formData.file);
      console.log("file", formData.file);
    }

    // 게시물 생성 API 호출
    axios
      .post("http://localhost:8090/api/community/post", formDataToSend, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        onAddPost({
          title: finalTitle,
          content: formData.content,
          categoryName: finalCategory,
        });
        setFormData({
          title: "",
          content: "",
          category: "통합",
          file: null,
        });
        setCharCount(0);
        setIsLoading(false);

        // 선택된 카테고리로 navigate
        navigate("/community", {
          state: { selectedCategory: formData.category },
        }); // 선택된 카테고리 상태 넘기기
      })
      .catch((error) => {
        console.error("Error creating post:", error);
        setIsLoading(false);
      });
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    if (newTitle.length <= maxTitleLength) {
      setFormData({ ...formData, title: newTitle });
    } else {
      alert(`제목은 최대 ${maxTitleLength}자까지 입력할 수 있습니다.`);
    }
  };

  return (
    <ContentContainer>
      <ContentTitle>커뮤니티 글쓰기</ContentTitle>
      <SubContentContainer>
        <CombinedLoadingAndNoData
          loading={isLoading}
          noData="게시글을 등록해주세요."
        />
        {!isLoading && (
          <form onSubmit={handleSubmit} className="post-form community-form">
            <div className="form-group">
              <label htmlFor="category">카테고리 ㅣ</label>
              <TeamSelect
                selectedTeam={formData.category}
                setSelectedTeam={(value) =>
                  setFormData({ ...formData, category: value })
                }
                labelType="all" // 통합이 기본 선택 옵션으로 10-12
              />
            </div>

            {/* 첫 번째 구분선 */}
            <HR />

            <div className="form-group">
              <label htmlFor="title">제목 ㅣ</label>
              <Input
                $inputType="inquiry-form"
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleTitleChange} // 제목 변경 핸들러
                required
                placeholder="제목을 입력해 주세요."
                className="form-control"
              />

              <div className="char-counter">
                {formData.title.length}/{maxTitleLength}
              </div>
            </div>

            {/* 두 번째 구분선 */}
            <HR />

            <div className="form-group">
              <label htmlFor="file-upload">
                파일 <BsPaperclip className="icon-right1" />
              </label>
              <label htmlFor="file-upload" className="custom-file-upload">
                파일 선택
              </label>
              {/* 이거는 인풋 컴포넌트 못씀 */}
              <input
                type="file"
                id="file-upload"
                name="file"
                accept="image/*,.pdf,.doc,.docx,.txt,.hwp,.pptx"
                onChange={handleFileChange}
                className="form-control-file"
              />
              {formData.file && (
                <div>
                  선택된 파일: {formData.file.name} {/* 파일명을 표시 */}
                </div>
              )}
            </div>

            {/* 세 번째 구분선 */}
            <HR />

            <div className="form-group textarea-group">
              <label htmlFor="content">내용 ㅣ</label>
              <QuillEditor
                value={formData.content}
                onChange={(content) => {
                  const textLength = calculatePlainTextLength(content);
                  if (textLength <= maxCharLimit) {
                    setFormData({ ...formData, content });
                    setCharCount(textLength);
                  } else {
                    alert(`최대 ${maxCharLimit}자까지 입력할 수 있습니다.`);
                  }
                }}
              />

              <div className="char-counter">
                {charCount}/{maxCharLimit}
              </div>
            </div>

            {/* 네 번째 구분선 */}
            <HR />

            <Button $buttonType="c_i_Edit" type="submit" className="submit-btn">
              등록
            </Button>
          </form>
        )}
      </SubContentContainer>
    </ContentContainer>
  );
};

export default CommunityForm;
