import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../contexts/UserContext"; // 로그인한 사용자 정보 가져오기
import Button from "../ui/Button";
import { BsPaperclip } from "react-icons/bs";
import "../../styles/CommunityDetail.css";
import { formatDateForTable } from "../../utils/DateUtils";
import { getFileName } from "../community/CommunityDetail";
import { MdPersonOutline } from "react-icons/md";
import "../../styles/InquiryDetail.css";
import {
  ContentContainer,
  ContentTitle,
  SubTitle,
  SubContentContainer,
  HR,
} from "../../styles/CommonStyles";
import Input from "../ui/Input";

const InquiryDetail = ({ onDeleteInquiry }) => {
  const { id } = useParams();
  const [inquiry, setInquiry] = useState(null); // API로부터 문의 데이터 저장
  const [inquirys, setInqurys] = useState([]); // 문의글 목록 상태
  const { user } = useUser(); // 로그인한 사용자 정보
  const [isPasswordVerified, setIsPasswordVerified] = useState(false); // 비밀번호 확인 상태
  const [inputPassword, setInputPassword] = useState(""); // 비밀번호 입력값
  const navigate = useNavigate();

  // 비로그인 상태라면 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (user === null) {
      alert("로그인이 필요합니다.");
      navigate("/user/login");
    }
  }, [user, navigate]);

  // 문의글 목록 가져오기
  useEffect(() => {
    axios
      .get("http://localhost:8090/api/question/all")
      .then((response) => setInqurys(response.data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  // 특정 문의글 가져오기
  useEffect(() => {
    axios
      .get(`http://localhost:8090/api/question/${id}`, {
        withCredentials: true,
      })
      .then((response) => setInquiry(response.data))
      .catch((error) => {
        console.error("Error fetching inquiry:", error);
        navigate("/inquiry");
      });
  }, [id, navigate]);

  const handleEdit = () => {
    if (user && user.userNickname === inquiry.questionID) {
      navigate(`/inquiry/edit/${id}`);
    } else {
      alert("작성자만 수정할 수 있습니다.");
    }
  };

  const handleDelete = () => {
    if (
      user &&
      user.userNickname === inquiry.questionID &&
      window.confirm("정말로 이 문의를 삭제하시겠습니까?")
    ) {
      axios
        .delete(`/api/question/${id}`, { withCredentials: true })
        .then(() => {
          onDeleteInquiry(id);
          navigate("/inquiry");
        })
        .catch((error) => console.error("오류:", error));
    } else {
      alert("작성자만 삭제할 수 있습니다.");
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`/api/question/${id}/verify-password`, { password: inputPassword })
      .then((response) => {
        if (response.data.success) {
          setIsPasswordVerified(true);
        } else {
          alert(
            "비밀번호가 일치하지 않습니다." + <br /> + "다시 입력해 주세요."
          );
        }
      })
      .catch((error) => console.error("오류", error));
  };

  const isImage = (filePath) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif"];
    return imageExtensions.includes(filePath.split(".").pop().toLowerCase());
  };

  // 이미지 경로 생성 함수
  const getImagePath = (filePath) => {
    return `http://localhost:8090/api/question/images/${encodeURIComponent(
      filePath.split("/").pop()
    )}`;
  };

  const handlePreviousInquiry = () => {
    const currentIndex = inquirys.findIndex(
      (p) => p.questionNum === parseInt(id)
    );
    if (currentIndex > 0) {
      const previousInquiry = inquirys[currentIndex - 1];
      navigate(`/inquiry/${previousInquiry.questionNum}`);
    } else {
      alert("이전 글이 없습니다.");
    }
  };

  const handleNextInquiry = () => {
    const currentIndex = inquirys.findIndex(
      (p) => p.questionNum === parseInt(id)
    );
    if (currentIndex < inquirys.length - 1) {
      const nextInquiry = inquirys[currentIndex + 1];
      navigate(`/inquiry/${nextInquiry.questionNum}`);
    } else {
      alert("다음 글이 없습니다.");
    }
  };

  if (!inquiry) return <div>문의 글을 찾을 수 없습니다.</div>;

  return (
    <ContentContainer>
      <SubContentContainer>
        {inquiry.privateOption === 0 || isPasswordVerified ? (
          <>
            <SubTitle>{inquiry.questionTitle}</SubTitle>
            {/* 수정/삭제 버튼: 작성자일 경우에만 표시 */}
            {user && user.userNickname === inquiry.questionID && (
              <div className="community-detail-buttons">
                <Button $buttonType="c_i" onClick={handleEdit}>
                  수정
                </Button>
                <Button $buttonType="delete" onClick={handleDelete}>
                  삭제
                </Button>
              </div>
            )}
            <HR style={{ borderTop: "5px solid #000000" }} />

            <div className="community-detail-info">
              <p>
                <MdPersonOutline />
                &nbsp;{inquiry.questionID}
              </p>
              <div className="community-detail-date">
                <p>
                  {inquiry.questionDate
                    ? formatDateForTable(inquiry.questionDate, true)
                    : "날짜 정보 없음"}
                </p>
                <p>조회수&nbsp;{inquiry.questionPostView}</p>
              </div>
            </div>
            <HR />

            {/* 9-29 CKEditor로 입력된 HTML을 안전하게 렌더링 */}
            <div
              className="community-detail-content"
              dangerouslySetInnerHTML={{ __html: inquiry.questionContent }}
            />

            {/* 이미지 파일 렌더링 */}
            {inquiry.questionImgPath && isImage(inquiry.questionImgPath) && (
              <img
                src={getImagePath(inquiry.questionImgPath)}
                alt="첨부 이미지"
                style={{ maxWidth: "100%" }}
              />
            )}

            {/* 이미지가 아닌 파일의 다운로드 링크 수정 10-14*/}

            {inquiry.questionImgPath && !isImage(inquiry.questionImgPath) && (
              <div className="community-detail-file">
                <div>파일</div>
                <BsPaperclip className="icon-right1" />
                <a
                  href={`http://localhost:8090/api/question/files/${encodeURIComponent(
                    getFileName(inquiry.questionImgPath)
                  )}`}
                  download // 브라우저가 강제로 파일을 다운로드하게 함
                  target="_blank" // 새 창에서 파일 열기 (옵션)
                  rel="noopener noreferrer" // 보안 강화를 위해 추가
                >
                  {getFileName(inquiry.questionImgPath)}
                </a>
              </div>
            )}

            {/* 관리자 답변 */}
            {inquiry.questionAnswer ? (
              <div className="admin-reply-box">
                <h3>관리자 답변</h3>
                <p>{inquiry.questionAnswer}</p>
              </div>
            ) : (
              <p>아직 관리자의 답변이 없습니다.</p>
            )}
          </>
        ) : (
          <form onSubmit={handlePasswordSubmit}>
            <ContentTitle>
              비공개 문의 글입니다. <br /> 비밀번호를 입력해 주세요.
            </ContentTitle>
            <div>
              <Input
                $inputType="i_p"
                type="password"
                placeholder="비밀번호 입력"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
              />
            </div>
            <div>
              <Button children="확인" type="submit" />
            </div>
          </form>
        )}
      </SubContentContainer>

      {/* 하단 중앙에 버튼 추가 */}
      <div className="community-detail-footer-buttons">
        <Button
          onClick={handlePreviousInquiry}
          aria-label="이전글"
          $buttonType="footer-button"
        >
          이전글
        </Button>

        <Button
          onClick={() => navigate("/inquiry")}
          aria-label="목록"
          $buttonType="footer-button"
        >
          목록
        </Button>

        <Button
          onClick={handleNextInquiry}
          aria-label="다음글"
          $buttonType="footer-button"
        >
          다음글
        </Button>
      </div>
    </ContentContainer>
  );
};

export default InquiryDetail;
