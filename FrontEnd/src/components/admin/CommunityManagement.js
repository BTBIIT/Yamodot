import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "../ui/Pagination";
import PostPerPageSelector from "../ui/PostPerPageSelector";
import SearchBar from "../ui/SearchBar";
import Modal from "../ui/Modal";
import Table from "../ui/Table";
import Button from "../ui/Button";
import {
  ContentContainer,
  ContentTitle,
  SubContentContainer,
  HR,
} from "../../styles/CommonStyles";
import { getTeamNameById } from "../../contexts/teamsData";
import "../../styles/CommunityManagement.css";
import { FaUserCircle } from "react-icons/fa"; // FaUserCircle 아이콘 불러오기

const CommunityManagement = () => {
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [postsPerPage, setPostsPerPage] = useState(10); // 페이지 당 게시물 수
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [searchCategory, setSearchCategory] = useState("title"); // 검색 카테고리
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 여부
  const [selectedPost, setSelectedPost] = useState(null); // 선택된 게시물 상태
  const [selectedPosts, setSelectedPosts] = useState([]); // 선택된 게시물 목록
  const [postData, setPostData] = useState([]); // 게시물 데이터 상태

  // 검색 카테고리 목록
  const searchCategories = [
    { value: "title", label: "제목" },
    { value: "author", label: "작성자" },
    { value: "boardName", label: "게시판명" },
  ];

  // 게시물 데이터 가져오기
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8090/api/community/admin/posts"
        ); // axios로 API 요청
        const data = response.data; // 응답 데이터
        console.log("Received post data:", data);

        if (Array.isArray(data)) {
          setPostData(data); // 데이터가 배열일 경우 상태 업데이트
        } else {
          setPostData([]); // 데이터가 배열이 아닐 경우 빈 배열 설정
        }
      } catch (error) {
        console.error("Error fetching post data:", error); // 에러 처리
        setPostData([]); // 에러 발생 시 빈 배열 설정
      }
    };

    fetchPostData(); // 함수 호출
  }, []); // 한 번만 실행되도록 설정

  // 제목 클릭 시 API 호출 후 모달 열기
  const handleTitleClick = async (post) => {
    if (!post || !post.postId) {
      console.error("Invalid post object:", post);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8090/api/community/post/${post.postId}`
      );
      const fetchedPost = response.data;
      console.log(fetchedPost); // 데이터 확인을 위해 로그 출력

      const categoryName = getTeamNameById(fetchedPost.categoryName);
      setSelectedPost({ ...fetchedPost, categoryName });

      setIsModalOpen(true); // 모달 열기
    } catch (error) {
      console.error("Error fetching post details:", error);
    }
  };

  //##################################### 여기부터 ##################################
  // 이미지 경로 생성 함수 추가
  const getImagePath = (filePath) => {
    const imageUrl = `http://localhost:8090/api/community/images/${encodeURIComponent(
      filePath.split("/").pop()
    )}`;
    console.log("Constructed Image URL:", imageUrl); // 디버깅을 위한 로그 추가
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
    if (selectedPost.postImgPath && isImageFile(selectedPost.postImgPath)) {
      return (
        <div className="community-detail-file">
          <img
            src={getImagePath(selectedPost.postImgPath)}
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
          href={`http://localhost:8090/api/community/downloadFile/${encodeURIComponent(
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

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null); // 모달이 닫힐 때만 selectedPost 초기화
  };

  // 날짜 형식을 "YYYY-MM-DD"로 변환하는 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 검색 처리 함수
  const handleSearch = (term, category) => {
    setSearchTerm(term); // 사용자가 입력한 검색어를 상태로 저장
    setSearchCategory(category); // 선택한 검색 카테고리를 상태로 저장
  };

  // **선택된 게시물 삭제 처리 함수**
  const handleDeletePost = async (postId) => {
    try {
      if (!postId) {
        throw new Error("Invalid postId"); // postId가 유효하지 않을 경우 예외 발생
      }

      // 삭제 확인용 alert 창 띄우기
      const confirmDelete = window.confirm(
        "정말 이 게시물을 삭제하시겠습니까?"
      );
      if (!confirmDelete) {
        return; // 사용자가 취소 버튼을 클릭하면 삭제 작업 중단
      }

      console.log("Deleting post with ID:", postId); // postId 로그 출력

      const response = await axios.delete(
        `http://localhost:8090/api/community/post/${postId}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const remainingPosts = postData.filter(
          (post) => post.postId !== postId
        );
        setPostData(remainingPosts);
        alert("게시물이 성공적으로 삭제되었습니다.");
        // 페이지 새로고침으로 최신화
        window.location.reload();
        setIsModalOpen(false); // 모달 닫기
      } else {
        console.error("Unexpected response:", response);
        alert("게시물 삭제 중 문제가 발생했습니다. 다시 시도해 주세요.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("게시물 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
    window.location.reload();
  };

  // 여러 개의 게시물 삭제 처리 함수
  const handleDeleteSelectedPosts = async () => {
    if (selectedPosts.length === 0) {
      alert("삭제할 게시물을 선택하세요.");
      return;
    }

    const confirmDelete = window.confirm("선택한 게시물을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await Promise.all(
        selectedPosts.map(async (postId) => {
          if (!postId) {
            console.error(`Invalid postId for post: ${postId}`);
            throw new Error(`Invalid postId: ${postId}`);
          }
          await axios.delete(
            `http://localhost:8090/api/community/post/${postId}`,
            { withCredentials: true }
          );
        })
      );

      // 삭제된 게시물 제외한 나머지 게시물로 상태 업데이트
      const remainingPosts = postData.filter(
        (post) => !selectedPosts.includes(post.postId)
      );
      setPostData(remainingPosts); // 게시물 목록 상태 업데이트
      setSelectedPosts([]); // 선택 목록 초기화

      alert("선택한 게시물이 성공적으로 삭제되었습니다.");
      // 페이지 새로고침으로 최신화
      window.location.reload();
    } catch (error) {
      console.error("Error deleting selected posts:", error);
      alert("게시물 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  // 검색 필터 적용된 데이터 (선택한 검색 카테고리별로 필터링)
  const filteredData = postData.filter((item) => {
    const matchesSearch =
      searchCategory === "title" // 검색 카테고리가 '제목'일 경우
        ? item.postTitle &&
          item.postTitle.toLowerCase().includes(searchTerm.toLowerCase()) // 제목에서 검색어가 포함된 게시물 필터링
        : searchCategory === "author" // 검색 카테고리가 '글쓴이'일 경우
        ? item.communityId &&
          item.communityId.toLowerCase().includes(searchTerm.toLowerCase()) // 글쓴이에서 검색어가 포함된 게시물 필터링
        : searchCategory === "boardName" && item.categoryName // 검색 카테고리가 '게시판'일 경우
        ? getTeamNameById(item.categoryName) // 게시판 이름으로 변환 후 필터링
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : false; // 검색 조건에 맞지 않으면 아무것도 필터링하지 않음

    return matchesSearch;
  });

  // 페이지네이션 처리
  const totalPages = Math.ceil(filteredData.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + postsPerPage
  );

  // 테이블 컬럼 정의 (체크박스 포함)
  const columns = [
    { header: "", key: "select", isCheckbox: true },
    { header: "번호", key: "rowNumber" },
    {
      header: "게시판명",
      key: "categoryName",
      render: (item) => getTeamNameById(item.categoryName),
    },
    {
      header: "제목",
      key: "postTitle",
      width: "30% ",
    },
    { header: "댓글수", key: "commentCount" },
    { header: "작성자", key: "communityId" },
    { header: "조회수", key: "postView" },
    { header: "작성일", key: "communityDate" },
    { header: "관리", key: "manage" },
  ];

  // 테이블 데이터 준비
  const tableData = paginatedData.map((item, index) => ({
    key: item.postId,
    rowNumber: startIndex + index + 1,
    categoryName: getTeamNameById(item.categoryName),
    postTitle: (
      <span
        className="community-content "
        onClick={() => handleTitleClick(item)}
      >
        {item.postTitle}
      </span>
    ),

    commentCount: item.commentCount,
    communityId: item.communityId,
    postView: item.postView,
    communityDate: formatDate(item.communityDate),
    manage: (
      <span
        className="community-delete"
        onClick={() => handleDeletePost(item.postId)}
      >
        삭제
      </span>
    ),
  }));

  const maxPageGroupSize = 5;
  const currentPageGroup = Math.ceil(currentPage / maxPageGroupSize);
  const startPageInGroup = (currentPageGroup - 1) * maxPageGroupSize + 1;
  const endPageInGroup = Math.min(
    currentPageGroup * maxPageGroupSize,
    totalPages
  );

  return (
    <ContentContainer>
      <ContentTitle>커뮤니티 관리</ContentTitle>

      <SubContentContainer>
        <PostPerPageSelector
          postsPerPage={postsPerPage}
          setPostsPerPage={setPostsPerPage}
        />

        <Table
          columns={columns}
          data={tableData}
          selectedRows={selectedPosts}
          onSelectRows={(selectedRowKeys) => setSelectedPosts(selectedRowKeys)} // 선택된 행의 키 값을 상태로 저장
        />

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            children={"삭제"}
            onClick={handleDeleteSelectedPosts} // 선택한 게시물 삭제 함수 연결
            disabled={selectedPosts.length === 0} // 선택된 게시물이 없을 때 비활성화
            $buttonType="delete"
          />
        </div>
      </SubContentContainer>

      {/* 모달 렌더링 */}
      {isModalOpen && selectedPost && selectedPost.postId && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          message={
            <div>
              <div className="post-header">
                <strong>{selectedPost.postTitle}</strong>
              </div>

              <HR style={{ border: "2px solid #222222" }} />

              <div className="post-meta-info">
                <div>
                  <FaUserCircle
                    size={22}
                    style={{ marginRight: "6px", color: "#8e8e8e" }}
                  />
                  <span>{selectedPost.communityId}</span>
                </div>

                <div className="post-info">
                  <p>{formatDate(selectedPost.communityDate)}</p>
                  <p>조회수 {selectedPost.postView}</p>
                </div>
              </div>

              <HR style={{ marginTop: 0 }} />

              <div
                className="post-content"
                dangerouslySetInnerHTML={{ __html: selectedPost.postContent }}
              />

              {/* 파일과 이미지 */}
              {selectedPost.postImgPath && (
                <div className="post-image">
                  {renderFileDownload(selectedPost.postImgPath)}
                </div>
              )}
              <div>{renderImage()}</div>

              <HR style={{ border: "2px solid #222222" }} />
            </div>
          }
          onConfirm={() => handleDeletePost(selectedPost.postId)}
          confirmText="삭제"
          cancelText="취소"
          width="35%"
          height="auto"
        />
      )}

      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          postsPerPage={postsPerPage}
          totalPosts={filteredData.length}
        />
      )}

      <SearchBar onSearch={handleSearch} searchCategories={searchCategories} />
    </ContentContainer>
  );
};

export default CommunityManagement;
