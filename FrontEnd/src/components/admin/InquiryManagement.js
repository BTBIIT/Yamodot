import React, { useState, useEffect } from "react";
import Pagination from "../ui/Pagination";
import PostPerPageSelector from "../ui/PostPerPageSelector";
import SearchBar from "../ui/SearchBar";
import Modal from "../ui/Modal";
import Table from "../ui/Table";
import axios from "axios";
import Button from "../ui/Button";
import {
  ContentContainer,
  ContentTitle,
  SubContentContainer,
  HR,
} from "../../styles/CommonStyles";
import "../../styles/InquiryManagement.css";
import { FaUserCircle } from "react-icons/fa";

const InquiryManagement = () => {
  const [inquiries, setInquiries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [inquiriesPerPage, setInquiriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("title");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [selectedInquiries, setSelectedInquiries] = useState([]);
  const [adminReply, setAdminReply] = useState(""); // 답변 상태 관리
  const [file, setFile] = useState(null); // 파일 상태 추가
  const [filePreviewUrl, setFilePreviewUrl] = useState(null); // 파일 미리보기 URL 추가
  const [postsPerPage, setPostsPerPage] = useState(10); // 페이지 당 게시물 수

  const searchCategories = [
    { value: "title", label: "제목" },
    { value: "author", label: "작성자" },
    { value: "answered", label: "답변 유무" },
  ];

  // 날짜 형식을 'YYYY-MM-DD'로 변환하는 함수 (시간 부분 제거)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`; // 시간 제거
  };

  // 검색 기능 핸들러
  const handleSearch = (term, category) => {
    setSearchTerm(term);
    setSearchCategory(category);
  };

  // 검색어와 카테고리에 맞게 데이터를 필터링
  const filteredData = inquiries.filter((item) => {
    if (searchCategory === "title") {
      return (
        item.questionTitle &&
        item.questionTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (searchCategory === "author") {
      return (
        item.questionId &&
        item.questionId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (searchCategory === "answered") {
      const isAnswered = searchTerm.toLowerCase() === "답변 완료";
      const isNotAnswered = searchTerm.toLowerCase() === "미답변";
      if (isAnswered) {
        return item.questionAnswer !== null;
      } else if (isNotAnswered) {
        return item.questionAnswer === null;
      }
    }
    return true;
  });

  // 페이지 계산
  const totalPages = Math.ceil(filteredData.length / inquiriesPerPage);
  const startIndex = (currentPage - 1) * inquiriesPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + inquiriesPerPage
  );

  // 선택된 문의 삭제 핸들러
  const handleDeleteSelected = async () => {
    // 삭제 확인용 alert 창 띄우기
    const confirmDelete = window.confirm("정말 이 문의를 삭제하시겠습니까?");
    if (!confirmDelete) {
      return; // 사용자가 취소 버튼을 클릭하면 삭제 작업을 중단
    }

    try {
      await Promise.all(
        selectedInquiries.map(async (questionNum) => {
          await axios.delete(
            `http://localhost:8090/api/question/${questionNum}`,
            { withCredentials: true }
          );
        })
      );

      // 삭제 후 상태 업데이트
      setInquiries(
        inquiries.filter(
          (inquiry) => !selectedInquiries.includes(inquiry.questionNum)
        )
      );
      setSelectedInquiries([]);

      // 성공 메시지 alert 창 띄우기
      alert("문의가 성공적으로 삭제되었습니다.");

      // 페이지 새로고침으로 최신화
      window.location.reload();
    } catch (error) {
      console.error("Error deleting inquiries:", error);
      alert("문의 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  // 개별 문의 삭제 핸들러
  const handleDeleteInquiry = async (questionNum) => {
    // 삭제 확인용 alert 창 띄우기
    const confirmDelete = window.confirm("정말 이 문의를 삭제하시겠습니까?");
    if (!confirmDelete) {
      return; // 사용자가 취소 버튼을 클릭하면 삭제 작업을 중단
    }

    try {
      await axios.delete(`http://localhost:8090/api/question/${questionNum}`, {
        withCredentials: true,
      });

      // 삭제 후 상태 업데이트
      setInquiries(
        inquiries.filter((inquiry) => inquiry.questionNum !== questionNum)
      );

      // 성공 메시지 alert 창 띄우기
      alert("문의가 성공적으로 삭제되었습니다.");

      // 페이지 새로고침으로 최신화
      window.location.reload();
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      alert("문의 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  // 답변 등록 핸들러 (서버에 상태 반영)
  const handleAnswerInquiry = async (questionNum) => {
    try {
      const confirmAnswer = window.confirm("관리자 답변을 보내시겠습니까?");
      if (!confirmAnswer) {
        return;
      }

      // 서버에 답변을 보내는 API 호출
      const response = await axios.put(
        `http://localhost:8090/api/question/${questionNum}/answer`,
        null,
        {
          params: {
            answer: adminReply, // 입력된 답변 전송
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert("답변을 전송하였습니다.");

        // 서버 응답 데이터를 반영하여 상태 업데이트 (서버에서 받은 최신 상태 사용)
        setInquiries((prevInquiries) =>
          prevInquiries.map((inquiry) =>
            inquiry.questionNum === questionNum
              ? { ...inquiry, questionAnswer: "답변 완료" } // 서버 데이터 반영
              : inquiry
          )
        );

        closeModal(); // 모달 닫기

        // 새로고침 없이 상태 유지
        window.location.reload(); // 새로고침을 통해 강제 적용할 경우 필요할 수 있음
      }
    } catch (error) {
      console.error("답변 등록 중 오류 발생:", error);
      alert("답변 등록 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 문의 목록을 서버에서 가져오는 useEffect
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8090/api/question/list",
          { withCredentials: true }
        );

        // 서버에서 받은 데이터를 클라이언트 상태에 반영
        setInquiries(response.data);
      } catch (error) {
        console.error("Error fetching inquiries data:", error);
      }
    };

    // 페이지가 로드될 때마다 서버에서 최신 데이터를 가져옴
    fetchInquiries();
  }, []);

  // 문의 제목 클릭 시 모달을 열고 문의 상세 정보 가져오기
  const openModalForAnswer = async (e, inquiry) => {
    e.preventDefault(); // 기본 동작인 페이지 이동을 막음
    setIsModalOpen(true); // 모달 열림 상태 true로 설정
    try {
      const response = await axios.get(
        `http://localhost:8090/api/question/${inquiry.questionNum}`,
        { withCredentials: true }
      );
      console.log("문의 상세 정보:", response.data); // 데이터를 로그로 출력하여 확인
      setSelectedInquiry(response.data); // 선택된 문의 데이터 상태에 저장
    } catch (error) {
      console.error("Error fetching inquiry details:", error);
    }
  };

  // 모달 닫기 핸들러
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInquiry(null);
    setAdminReply("");
    setFile(null); // 파일 상태 초기화
    setFilePreviewUrl(null); // 파일 미리보기 초기화
  };

  // 테이블 컬럼 정의
  const columns = [
    { header: "", key: "select", isCheckbox: true },
    { header: "번호", key: "questionNum" },
    { header: "제목", key: "questionTitle", width: "33%" },
    { header: "작성자", key: "questionId" },
    { header: "작성일", key: "questionDate" },
    {
      header: "답변 유무",
      key: "questionAnswer",
      // 서버에서 받아온 'questionAnswer' 값이 존재하면 '답변 완료', 없으면 '미답변'
      render: (item) =>
        item.questionAnswer && item.questionAnswer.trim() !== ""
          ? "답변 완료"
          : "미답변", // 서버에서 받아온 'questionAnswer' 값에 따른 표시
    },
    { header: "관리", key: "manage" },
  ];

  //##################################### 여기부터 ##################################
  // 이미지 경로 생성 함수 추가
  const getImagePath = (filePath) => {
    const imageUrl = `http://localhost:8090/api/question/images/${encodeURIComponent(
      filePath.split("/").pop()
    )}`;
    return imageUrl;
  };

  // 이미지인지 확인
  const isImageFile = (filePath) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif"];
    const extension = filePath.split(".").pop().toLowerCase();
    return imageExtensions.includes(extension);
  };

  // 이미지 렌더링을 위한 함수 정의
  const renderImage = () => {
    if (
      selectedInquiry.questionImgPath &&
      isImageFile(selectedInquiry.questionImgPath)
    ) {
      return (
        <div className="">
          <img
            src={getImagePath(selectedInquiry.questionImgPath)}
            alt="첨부 이미지"
            style={{ maxWidth: "100%" }}
            onError={(e) => {
              console.error("이미지 로드 실패:", e.target.src);
              e.target.src = "/path_to_default_image/default.png"; // 기본 이미지 설정
            }}
          />
        </div>
      );
    }
    return null;
  };

  /* 1014 다은 - 게시물 파일 이름 가져오기 */
  const getFileName = (filePath) => {
    // "/uploads/" 제거하고, 그 이후의 파일 이름만 반환
    const cleanedPath = filePath.replace("/uploads/", "");
    const fileName = cleanedPath.split("/").pop(); // 경로에서 파일명만 추출
    // 첫 번째 "_" 이후의 문자열 반환 (필요한 경우)
    return fileName.split("_").slice(1).join("_") || fileName;
  };

  {
    /* 이미지가 아닌 파일의 다운로드 링크 수정 10-14*/
  }
  const renderFileDownload = (filePath) => {
    if (!filePath || isImageFile(filePath)) {
      return null;
    }

    return (
      <div className="community-detail-file">
        <div>파일</div>
        <a
          href={`http://localhost:8090/api/question/files/${encodeURIComponent(
            getFileName(filePath)
          )}`}
          download
          target="_blank"
          rel="noopener noreferrer"
        >
          {getFileName(filePath)}
        </a>
      </div>
    );
  };

  // ########################## 여기까지 모달내에 이미지/첨부파일 추가되는 코드입니다.
  // ########################## 아래 모달을 직접 확인해주세요.

  // 테이블 데이터 구성
  const tableData = paginatedData.map((item, index) => ({
    key: item.questionNum,
    select: item.questionNum,
    questionNum: startIndex + index + 1,
    questionTitle: (
      <span
        className="inquiry-questionTitle"
        onClick={(e) => openModalForAnswer(e, item)} // 페이지 이동을 막고 모달을 여는 함수 호출
      >
        {item.questionTitle}
      </span>
    ),
    questionId: item.questionId || "작성자 없음",
    questionDate: formatDate(item.questionDate),
    // 답변 여부에 따라 "답변 완료" 또는 "미답변"을 표시
    questionAnswer:
      item.questionAnswer && item.questionAnswer.trim() !== ""
        ? "답변 완료"
        : "미답변",
    manage: (
      <span
        className="inquiry-delete"
        onClick={() => handleDeleteInquiry(item.questionNum)}
      >
        삭제
      </span>
    ),
  }));

  return (
    <ContentContainer>
      <ContentTitle>문의 관리</ContentTitle>
      {/* 페이지당 표시할 항목 수 선택 */}
      <SubContentContainer>
        <PostPerPageSelector
          postsPerPage={inquiriesPerPage}
          setPostsPerPage={setInquiriesPerPage}
        />
        {/* 테이블 컴포넌트 */}
        <Table
          columns={columns}
          data={tableData}
          selectedRows={selectedInquiries}
          onSelectRows={setSelectedInquiries}
          showLock={false}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            children={"삭제"}
            $buttonType="delete"
            onClick={handleDeleteSelected}
            disabled={selectedInquiries.length === 0}
          />
        </div>
      </SubContentContainer>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          postsPerPage={postsPerPage} // 이 부분 추가
          totalPosts={filteredData.length} // 이 부분 추가
        />
      )}

      {/* 검색 바 */}

      <SearchBar onSearch={handleSearch} searchCategories={searchCategories} />

      {/* selectedInquiry 모달 */}
      {isModalOpen && selectedInquiry && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          width="35%"
          height="auto"
          confirmText="등록"
          onConfirm={() => handleAnswerInquiry(selectedInquiry.questionNum)}
          message={
            <div>
              <div className="inquiry-header">
                <strong>{selectedInquiry.questionTitle || "제목 없음"}</strong>
              </div>

              <HR style={{ border: "2px solid #222222", marginTop: "20px" }} />

              <div className="inquiry-meta-info">
                <div>
                  <FaUserCircle
                    size={22}
                    style={{ marginRight: "6px", color: "#8e8e8e" }}
                  />
                  <span>
                    {selectedInquiry.questionID || "작성자 정보 없음"}
                  </span>
                </div>

                <div className="inquiry-info">
                  <p>
                    {" "}
                    {formatDate(selectedInquiry.questionDate) ||
                      "작성일 정보 없음"}
                  </p>
                  <p>조회수 {selectedInquiry.questionPostView || 0}</p>
                </div>
              </div>

              {/* 중간 구분선 */}
              <HR style={{ marginTop: 0 }} />

              {/* 내용 */}
              <div className="inquiry-content">
                {selectedInquiry.questionContent ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: selectedInquiry.questionContent,
                    }}
                  />
                ) : (
                  <div className="inquiry-content"></div> // 내용이 없을 때 공란 처리
                )}
              </div>

              {/* 파일과 이미지 */}
              {selectedInquiry.questionImgPath && (
                <div className="inquiry-image">
                  {renderFileDownload(selectedInquiry.questionImgPath)}
                </div>
              )}
              <div>{renderImage()}</div>

              {/* 하단 구분선 */}
              <HR
                style={{ border: "2px solid #222222", marginBottom: "20px" }}
              />

              {/* 관리자 답변 */}
              <div>
                <h4>관리자 답변</h4>
                <textarea
                  value={adminReply}
                  onChange={(e) => setAdminReply(e.target.value)}
                  placeholder="관리자 답변을 입력하세요."
                  rows={7}
                  className="inquiry-textarea"
                />
              </div>
            </div>
          }
        />
      )}
    </ContentContainer>
  );
};

export default InquiryManagement;
