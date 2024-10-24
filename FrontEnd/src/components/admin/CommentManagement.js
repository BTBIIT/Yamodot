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
import "../../styles/CommentManagement.css";
import { getTeamNameById } from "../../contexts/teamsData";
import { FaUserCircle } from "react-icons/fa"; // 사용자 아이콘 임포트

const CommentManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage, setCommentsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("content");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null); // 모달에 표시할 댓글
  const [selectedComments, setSelectedComments] = useState([]);
  const [comments, setComments] = useState([]); // 댓글 데이터 저장
  const [postsPerPage, setPostsPerPage] = useState(10); // 페이지 당 게시물 수
  const [postViews, setPostViews] = useState({}); // 댓글의 조회수 저장

  // 검색 카테고리 정의
  const searchCategories = [
    { value: "content", label: "댓글" },
    { value: "author", label: "작성자" },
    { value: "categoryName", label: "게시판명" }, // 게시판 필터링용
  ];

  // API에서 댓글 데이터 가져오기
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8090/api/comments/all",
          {
            withCredentials: true, // 댓글 리스트 API
          }
        );
        console.log("Fetched Comments:", response.data); // API로부터 받은 데이터 확인

        // 댓글 데이터를 최신 작성일 순으로 정렬
        const sortedComments = response.data.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB - dateA; // 최신 작성일이 먼저 오도록 내림차순 정렬
        });

        setComments(sortedComments); // 상태에 정렬된 댓글 데이터 저장
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments(); // 컴포넌트가 처음 렌더링될 때 호출
  }, []);

  // 모달 열기/닫기 핸들러 수정: 모달에 표시할 데이터 추가
  const handleCommentClick = (comment) => {
    const categoryName = getTeamNameById(comment.categoryName); // 카테고리 이름으로 변환
    setSelectedComment({
      ...comment,
      //   categoryName, // 게시판명 추가
      //   postView: comment.postView || 0, // 조회수 추가 (기본값 0)
      //   date: comment.date, // 작성일 추가
    });
    setIsModalOpen(true); // 모달 열기
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달 닫기
    setSelectedComment(null); // 선택된 댓글 초기화
  };

  // 검색 처리 함수
  const handleSearch = (term, category) => {
    setSearchTerm(term); // 검색어 설정
    setSearchCategory(category); // 검색 카테고리 설정
  };

  // 선택된 댓글 또는 대댓글 삭제 처리 함수
  const handleDeleteSelected = async () => {
    if (selectedComments.length === 0) {
      alert("삭제할 댓글을 선택하세요.");
      return;
    }

    const confirmDelete = window.confirm("선택한 댓글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await Promise.all(
        selectedComments.map(async (commentKey) => {
          // commentKey에서 postId와 postCommentNum을 분리
          const [postId, postCommentNum] = commentKey.split("_");
          console.log("Deleting comment:", { postId, postCommentNum });

          await axios.delete(
            `http://localhost:8090/api/comments/${postId}/delete`,
            {
              params: {
                type: "comment", // "reply" 또는 "comment"
                postCommentNum: postCommentNum,
              },
              withCredentials: true,
            }
          );
        })
      );

      // 삭제 후 남은 댓글로 상태 업데이트
      const remainingComments = comments.filter(
        (comment) =>
          !selectedComments.includes(
            `${comment.postId}_${comment.postCommentNum}`
          )
      );
      setComments(remainingComments); // 댓글 목록 상태 업데이트
      setSelectedComments([]); // 선택된 댓글 목록 초기화

      alert("선택한 댓글이 성공적으로 삭제되었습니다.");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting selected comments:", error);
      alert("댓글 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  // 개별 댓글 또는 대댓글 삭제 처리 함수 (관리 쪽에서)
  const handleDelete = async (postId, postCommentNum, replyId = null) => {
    // postId나 postCommentNum이 없는 경우 처리
    if (!postId || !postCommentNum) {
      alert("댓글 또는 게시물 ID가 유효하지 않습니다. 삭제할 수 없습니다.");
      return;
    }

    try {
      const confirmationMessage = replyId
        ? "이 답글을 삭제하시겠습니까?"
        : "이 댓글을 삭제하시겠습니까?";

      const isConfirmed = window.confirm(confirmationMessage);
      if (!isConfirmed) return;

      // URL 생성 시 postCommentNum이 제대로 반영되도록 합니다.
      const url = replyId
        ? `http://localhost:8090/api/comments/post/${postId}/comment/${postCommentNum}/reply/${replyId}`
        : `http://localhost:8090/api/comments/post/${postId}/comment/${postCommentNum}`;

      await axios.delete(url, { withCredentials: true });

      alert("삭제가 완료되었습니다.");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting comment or reply:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // 모달에서 댓글 또는 대댓글 삭제 처리 함수
  const handleDeleteFromModal = async (
    postId,
    postCommentNum,
    replyId = null
  ) => {
    try {
      // 삭제 전 확인 알림창 띄우기
      const confirmationMessage = replyId
        ? "이 답글을 삭제하시겠습니까?" // 답글일 경우 메시지
        : "이 댓글을 삭제하시겠습니까?"; // 댓글일 경우 메시지

      // 사용자가 확인 버튼을 눌렀을 경우에만 삭제 진행
      const isConfirmed = window.confirm(confirmationMessage);

      if (!isConfirmed) {
        // 사용자가 취소를 누른 경우 삭제하지 않음
        return;
      }

      // 기본 API URL 경로 설정
      let url;

      if (replyId) {
        // replyId가 있으면 답글 삭제 경로
        url = `http://localhost:8090/api/comments/post/${postId}/comment/${postCommentNum}/reply/${replyId}`;
      } else {
        // replyId가 없으면 댓글 삭제 경로
        url = `http://localhost:8090/api/comments/post/${postId}/comment/${postCommentNum}`;
      }

      // API 호출을 통해 댓글 또는 답글 삭제 처리
      const response = await axios.delete(url, {
        withCredentials: true, // 쿠키 전송 옵션
      });

      if (response.status === 200) {
        // 삭제 성공 시 알림
        alert(
          replyId
            ? "답글이 성공적으로 삭제되었습니다."
            : "댓글이 성공적으로 삭제되었습니다."
        );

        // 모달 닫기
        setIsModalOpen(false);

        // 댓글 또는 답글 삭제 후 강제 새로고침
        window.location.reload(); // 페이지 새로고침으로 삭제 후 상태 반영
      } else {
        // 상태 코드가 200이 아니면 오류 처리
        alert(
          replyId
            ? "답글 삭제에 실패했습니다. 다시 시도해주세요."
            : "댓글 삭제에 실패했습니다. 다시 시도해주세요."
        );
      }
    } catch (error) {
      console.error("Error deleting comment or reply from modal:", error); // 오류 처리

      // 오류 처리 시 답글과 댓글에 따라 다른 메시지 표시
      alert(
        replyId
          ? "답글 삭제 중 오류가 발생했습니다. 다시 시도해주세요."
          : "댓글 삭제 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    }
  };

  // 필터링된 댓글 처리 함수 (검색어에 따라)
  const filteredData = comments.filter((item) => {
    const matchesSearch =
      searchCategory === "content"
        ? (item.content || "").toLowerCase().includes(searchTerm.toLowerCase())
        : searchCategory === "author"
        ? (item.author || "미작성")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : searchCategory === "categoryName"
        ? getTeamNameById(item.categoryName)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : false;

    return matchesSearch;
  });
  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredData.length / commentsPerPage); // 총 페이지 수 계산
  const startIndex = (currentPage - 1) * commentsPerPage; // 시작 인덱스 계산
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + commentsPerPage // 페이지네이션된 데이터 추출
  );

  const handleSelectRows = (selectedRowKeys) => {
    console.log("Selected row keys: ", selectedRowKeys); // 선택된 행의 postCommentNum 확인
    setSelectedComments(selectedRowKeys); // 선택된 행의 postCommentNum을 상태로 저장
  };

  // 전체 선택 핸들러
  const handleSelectAllRows = (allRows) => {
    setSelectedComments(allRows);
  };

  // 테이블 컬럼 정의
  const columns = [
    { header: "", key: "select", isCheckbox: true },
    { header: "번호", key: "index" }, // 번호 추가
    {
      header: "게시판명",
      key: "categoryName",
      render: (item) => getTeamNameById(item.categoryName), // categoryName을 카테고리 이름으로 변환
    },
    { header: "게시물 번호", key: "postId" }, // 게시물 번호
    { header: "댓글", key: "content", width: "30%" }, // 댓글 내용
    { header: "작성자", key: "author" }, // 작성자 (author가 null이면 "미작성"으로 처리)
    { header: "작성일", key: "date" }, // 작성일
    {
      header: "관리", // 관리 (삭제 버튼)
      key: "manage",
      render: (item) => (
        <span
          style={{ cursor: "pointer", color: "#d71e17" }}
          onClick={() =>
            handleDelete(item.postId, item.postCommentNum, item.replyId)
          }
        >
          삭제
        </span>
      ),
    },
  ];

  // 댓글 내용을 10글자로 자르고 "..."을 추가
  const truncateContent = (content) => {
    if (!content) return "내용 없음";
    return content.length > 10 ? content.substring(0, 10) + "..." : content;
  };

  // 테이블 데이터 준비
  const tableData = paginatedData.map((item, index) => ({
    key: `${item.postId}_${item.postCommentNum}_${
      item.author || "unknown"
    }_${new Date(item.date).getTime()}`, // 고유 key 설정
    select: item.postCommentNum, // 선택을 위해 postCommentNum 사용
    index: startIndex + index + 1,
    categoryName: getTeamNameById(item.categoryName), // 게시판명
    postId: item.postId,
    postCommentNum: item.postCommentNum, // postCommentNum을 저장
    content: (
      <span
        className="comment-postTitle"
        onClick={() => handleCommentClick(item)} // 클릭하면 모달로 전체 내용을 확인
      >
        {truncateContent(item.content)} {/* 댓글 내용을 10글자로 자름 */}
      </span>
    ),
    author: item.author || "미작성",
    date: item.date,
    postView: item.postView || 0, // 조회수 추가 (없을 경우 0으로 표시)
    manage: (
      <span
        className="comment-delete"
        onClick={() =>
          handleDelete(item.postId, item.postCommentNum, item.replyId)
        }
      >
        삭제
      </span>
    ),
  }));

  // 작성일 포맷 함수 추가
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return (
    <ContentContainer>
      <ContentTitle>댓글 관리</ContentTitle>

      <SubContentContainer>
        {/* 페이지 당 게시물 수 선택 */}
        <PostPerPageSelector
          postsPerPage={commentsPerPage}
          setPostsPerPage={setCommentsPerPage}
        />

        {/* 댓글 테이블 */}
        <Table
          columns={columns}
          data={tableData}
          selectedRows={selectedComments} // 선택된 행을 추적
          onSelectRows={handleSelectRows} // 개별 행 선택 처리
          onSelectAllRows={(allRowKeys) => setSelectedComments(allRowKeys)} // 전체 선택 처리
        />

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            children={"삭제"}
            onClick={handleDeleteSelected}
            disabled={selectedComments.length === 0}
            $buttonType="delete"
          />
        </div>
        {isModalOpen && selectedComment && (
          <Modal
            isOpen={isModalOpen} // 모달 열림 상태 전달
            onClose={handleCloseModal} // 모달 닫기 이벤트
            title={null} // title 제거, 직접 모달 헤더로 커스텀함
            message={
              <div>
                <div className="comment-header">
                  <strong>{selectedComment.postTitle}</strong>
                </div>

                <HR style={{ border: "2px solid #222222" }} />

                <div className="comment-meta-info">
                  <div>
                    <FaUserCircle
                      size={22}
                      style={{ marginRight: "6px", color: "#8e8e8e" }}
                    />
                    <span>{selectedComment.author}</span>
                  </div>

                  <div className="comment-info">
                    <p>{formatDate(selectedComment.date)}</p>
                    <p>조회수 {selectedComment.postView}</p>
                  </div>
                </div>

                <HR style={{ marginTop: 0 }} />

                <div className="modal-comment-content">
                  <p>{selectedComment.content}</p> {/* 전체 댓글 내용 표시 */}
                </div>

                <HR style={{ border: "2px solid #222222" }} />
              </div>
            }
            confirmText="삭제"
            width="35%"
            height="auto"
            onConfirm={() =>
              handleDeleteFromModal(
                selectedComment.postId,
                selectedComment.postCommentNum,
                selectedComment.replyId
              )
            }
          />
        )}
      </SubContentContainer>

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
    </ContentContainer>
  );
};

export default CommentManagement;
