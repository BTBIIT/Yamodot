import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuillEditor from "../ui/QuillEditor";
import TeamSelect from "../ui/TeamSelect";
import { BsPaperclip } from "react-icons/bs";
import "../../styles/CommunityEdit.css";
import CombinedLoadingAndNoData from "../ui/StatusMessage";
import axios from "axios";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { teams, getTeamNameById } from "../../contexts/teamsData";
import {
  ContentContainer,
  ContentTitle,
  SubContentContainer,
  HR,
} from "../../styles/CommonStyles";

// 순수 텍스트만 계산하는 함수 (이미지 태그, HTML 태그 등을 제외)
const calculatePlainTextLength = (htmlContent) => {
  const plainText = htmlContent.replace(/<[^>]*>|&nbsp;/g, "").trim();
  return plainText.length;
};

const CommunityEdit = ({ onEditPost }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editFormData, setEditFormData] = useState({
    title: "",
    content: "",
    category: "통합",
    file: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const maxTitleLength = 50; // 제목 최대 길이
  const maxCharLimit = 1000;
  // const { user } = useUser(); // 1012 다은 수정 - 로그인된 사용자 정보 가져오기
  // console.log("User object:", user);
  //const userUniqueNumber = user?.userUniqueNumber;

  // API에서 게시물 데이터를 가져와서 폼에 설정
  useEffect(() => {
    axios
      .get(`http://localhost:8090/api/community/post/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        const post = response.data;
        setEditFormData({
          title: post.postTitle.replace(/\[.*?\]\s*/, ""),
          content: post.postContent,
          category: getTeamNameById(post.categoryName),
          file: post.postImgPath || null,
        });

        const plainTextContent = post.postContent.replace(
          /<\/?[^>]+(>|$)/g,
          ""
        );
        setCharCount(plainTextContent.length);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
        navigate("/community");
      });
  }, [id, navigate]);

  // 입력 값 처리 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // 제목 길이 제한
    if (name === "title" && value.length > maxTitleLength) {
      alert(`제목은 최대 ${maxTitleLength}자까지 입력할 수 있습니다.`);
      return;
    }

    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 파일 변경 핸들러
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEditFormData({ ...editFormData, file });
  };

  // 파일 제거 핸들러
  const handleRemoveFile = () => {
    axios
      .put(
        `http://localhost:8090/api/community/removeFile/${id}`,
        {},
        {
          withCredentials: true,
        }
      )
      .then(() => {
        setEditFormData((prev) => ({ ...prev, file: null }));
      })
      .catch((error) => {
        console.error("Error removing file:", error);
      });
  };

  // 저장 버튼 클릭 핸들러
  const handleSave = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const selectedTeam = teams.find(
      (team) => team.label === editFormData.category
    );
    const teamId = selectedTeam ? selectedTeam.id : 0;

    const finalTitle = decodeURIComponent(editFormData.title);
    console.log("finalTitle", finalTitle);

    const formDataToSend = new FormData();
    formDataToSend.append("postTitle", finalTitle);
    formDataToSend.append("postContent", editFormData.content);
    formDataToSend.append("categoryName", teamId);

    // 파일이 존재할 경우 추가
    if (editFormData.file) {
      if (typeof editFormData.file === "string") {
        console.log("이미 업로드된 파일:", editFormData.file); // **업로드된 파일 경로 처리**
      } else {
        formDataToSend.append("file", editFormData.file); // **새 파일 추가**
      }
    } else {
      console.log("파일없음");
    }

    axios
      .put(`http://localhost:8090/api/community/post/${id}`, formDataToSend, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        onEditPost(id, formDataToSend);
        setIsLoading(false);
        // navigate 호출 시 state로 선택된 카테고리 정보 전달
        navigate(`/community/post/${id}`, {
          state: { selectedCategory: editFormData.category }, // 선택된 카테고리 전달
        });
      })
      .catch((error) => {
        console.error("Error updating post:", error);
        setIsLoading(false);
      });
  };

  return (
    <ContentContainer>
      <ContentTitle>게시물 수정</ContentTitle>

      <SubContentContainer>
        <CombinedLoadingAndNoData loading={isLoading} />
        {!isLoading && (
          <form onSubmit={handleSave} className="post-form community-edit">
            <div className="form-group">
              <label htmlFor="category">카테고리 ㅣ</label>
              <TeamSelect
                labelType="all"
                selectedTeam={editFormData.category}
                setSelectedTeam={(value) =>
                  setEditFormData((prev) => ({ ...prev, category: value }))
                }
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
                value={editFormData.title}
                onChange={handleInputChange}
                required
                placeholder="제목을 입력해 주세요."
                className="form-control"
              />
              <div className="char-counter">
                {editFormData.title.length}/{maxTitleLength}
              </div>
            </div>

            {/* 두 번째 구분선 */}
            <HR />

            <div className="form-group">
              <label htmlFor="file-upload">
                파일 <BsPaperclip className="icon-right1" />
              </label>
              <div className="from-file">
                <label htmlFor="file-upload" className="custom-file-upload">
                  파일 선택
                </label>
                <div>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.hwp,.pptx"
                    onChange={handleFileChange}
                    className="form-control-file"
                  />
                </div>
                {editFormData.file && (
                  <div className="file-file">
                    {/* **파일 유형에 따른 조건부 렌더링** */}
                    {typeof editFormData.file === "string" ? (
                      <p>
                        이미 업로드된 파일: {editFormData.file.split("/").pop()}
                      </p>
                    ) : (
                      <p>선택된 파일: {editFormData.file.name}</p>
                    )}
                    <Button
                      type="button"
                      onClick={handleRemoveFile}
                      $buttonType="delete"
                    >
                      제거
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* 세 번째 구분선 */}
            <HR />

            <div className="form-group textarea-group">
              <label htmlFor="content">내용 ㅣ</label>
              <QuillEditor
                value={editFormData.content}
                onChange={(content) => {
                  const textLength = calculatePlainTextLength(content);
                  if (textLength <= maxCharLimit) {
                    setEditFormData({ ...editFormData, content });
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

            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <Button
                $buttonType="c_i_Edit"
                type="submit"
                className="submit-btn"
              >
                수정 완료
              </Button>
              <Button
                $buttonType="delete"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/community/post/${id}`);
                }}
              >
                취소
              </Button>
            </div>
          </form>
        )}
      </SubContentContainer>
    </ContentContainer>
  );
};

export default CommunityEdit;
