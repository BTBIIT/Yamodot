import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "../ui/Pagination"; // 페이지네이션 컴포넌트
import PostPerPageSelector from "../ui/PostPerPageSelector"; // 페이지당 게시물 수 선택 컴포넌트
import SearchBar from "../ui/SearchBar"; // 검색창 컴포넌트
import Modal from "../ui/Modal"; // 모달 컴포넌트
import Table from "../ui/Table"; // 테이블 컴포넌트
import Button from "../ui/Button"; // 버튼 컴포넌트
import Input from "../ui/Input"; // 체크박스 등을 위한 인풋 컴포넌트
import {
  ContentContainer,
  ContentTitle,
  SubContentContainer,
} from "../../styles/CommonStyles"; // 공통 스타일 정의
import StatusMessage from "../ui/StatusMessage"; // StatusMessage 컴포넌트 가져오기

const UserManagement = () => {
  // 상태 관리 변수들
  const [data, setData] = useState([]); // 전체 사용자 데이터
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [postsPerPage, setPostsPerPage] = useState(10); // 페이지당 게시물 수
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [searchCategory, setSearchCategory] = useState("userName"); // 검색 카테고리
  const [filteredData, setFilteredData] = useState([]); // 필터링된 데이터
  const [selectedMember, setSelectedMember] = useState(null); // 선택된 회원 정보
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 검색 카테고리 설정
  const searchCategories = [
    { value: "userName", label: "이름" },
    { value: "userId", label: "아이디" },
    { value: "userEmail", label: "이메일" },
  ];

  // 회원의 게시글 및 댓글 갯수를 가져오는 함수
  const getUserStats = async (userUniqueNumber) => {
    try {
      const response = await axios.get(
        `http://localhost:8090/api/admin/${userUniqueNumber}/stats`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        return {
          postCount: response.data.postCount || 0,
          commentCount: response.data.commentCount || 0,
        };
      } else {
        console.error("Error fetching user stats");
        return { postCount: 0, commentCount: 0 };
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
      return { postCount: 0, commentCount: 0 };
    }
  };

  // 사용자 데이터를 API로부터 가져옴
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8090/api/admin/users",
          { withCredentials: true }
        );

        const users = response.data;

        // 모든 사용자의 postCount와 commentCount를 비동기적으로 가져옴
        const usersWithCounts = await Promise.all(
          users.map(async (user) => {
            const { postCount, commentCount } = await getUserStats(
              user.userUniqueNumber
            );
            return { ...user, postCount, commentCount };
          })
        );

        // 가입일 기준으로 최신 순으로 정렬
        const sortedUsers = usersWithCounts.sort((a, b) => {
          const dateA = new Date(a.userCreateDate);
          const dateB = new Date(b.userCreateDate);
          return dateB - dateA; // 가입일이 최신인 회원이 먼저 오도록 내림차순 정렬
        });

        setData(sortedUsers); // 정렬된 데이터 저장
        setFilteredData(sortedUsers); // 필터링된 데이터 초기화
        console.log("user data with counts:", sortedUsers);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching member data from API:", error);
        setError("데이터를 가져오는 중 오류가 발생했습니다.");
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // 검색어와 카테고리를 기반으로 데이터 필터링
  const handleSearch = (term, category) => {
    setSearchTerm(term);
    setSearchCategory(category);

    const filtered = data.filter((item) => {
      if (category === "userName") {
        return item.userName?.toLowerCase().includes(term.toLowerCase());
      } else if (category === "userEmail") {
        return item.userEmail?.toLowerCase().includes(term.toLowerCase());
      } else if (category === "userId") {
        return item.userId?.toLowerCase().includes(term.toLowerCase());
      }
      return true;
    });

    setFilteredData(filtered); // 필터링된 데이터 업데이트
  };

  // 현재 페이지와 페이지당 게시물 수에 맞게 데이터 페이징
  const totalPages = Math.ceil(filteredData.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + postsPerPage
  );

  // 회원 정보를 클릭했을 때 모달을 열고 상세 정보를 표시
  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  // 모달 닫기 처리
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  // 날짜 형식 변환 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 회원의 정지를 해제하는 API 호출 함수
  const handleReleaseUser = async (userToRelease) => {
    try {
      // 사용자에게 확인을 요청하는 confirm 창
      const isConfirmed = window.confirm("정말 이 회원을 해제 하시겠습니까?");

      // 확인 버튼을 눌렀을 때만 진행
      if (isConfirmed) {
        const response = await axios.post(
          "http://localhost:8090/api/admin/release-user",
          userToRelease,
          { withCredentials: true }
        );

        if (response.status === 200) {
          alert("사용자의 정지가 성공적으로 해제되었습니다.");
          window.location.reload();
          // 사용자 목록 상태 업데이트
          setData((prevData) =>
            prevData.map((user) =>
              user.userUniqueNumber === userToRelease.userUniqueNumber
                ? { ...user, userState: "R", userStop: false }
                : user
            )
          );
          setFilteredData((prevData) =>
            prevData.map((user) =>
              user.userUniqueNumber === userToRelease.userUniqueNumber
                ? { ...user, userState: "R", userStop: false }
                : user
            )
          );

          handleCloseModal(); // 모달 닫기
          // 페이지 강제 새로고침은 피하는 것이 좋습니다. 상태 업데이트로 충분합니다.
        } else {
          alert("사용자 정지 해제에 실패했습니다.");
        }
      }
    } catch (error) {
      console.error("사용자 정지 해제 중 오류 발생:", error);
      alert("사용자 정지 해제 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 회원 정지/해제 상태를 토글하는 API 호출 함수
  const handleToggleUserStatus = async (userId, isStopped) => {
    try {
      const response = await axios.post(
        "http://localhost:8090/api/admin/update-user",
        {
          userUniqueNumber: userId,
          userStop: !isStopped,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setData((prevData) =>
          prevData.map((user) =>
            user.userUniqueNumber === userId
              ? { ...user, userStop: !isStopped }
              : user
          )
        );
        setFilteredData((prevData) =>
          prevData.map((user) =>
            user.userUniqueNumber === userId
              ? { ...user, userStop: !isStopped }
              : user
          )
        );

        if (selectedMember && selectedMember.userUniqueNumber === userId) {
          setSelectedMember({ ...selectedMember, userStop: !isStopped });
        }
      } else {
        console.error("Error: Unable to update user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  // 테이블 컬럼 정의
  const columns = [
    { key: "rowNumber", header: "번호" },
    { key: "userName", header: "이름" },
    { key: "userId", header: "아이디", width: "13%" },
    { key: "userEmail", header: "이메일", width: "23%" },
    { key: "userCreateDate", header: "가입일" },
    { key: "postCount", header: "게시글 수" },
    { key: "commentCount", header: "댓글 수" },
    { key: "userSocialLoginSep", header: "가입 루트" },
    { key: "userState", header: "회원 정지" },
  ];

  // 테이블에 표시할 데이터 구성
  const tableData = paginatedData.map((item, index) => ({
    key: item.userUniqueNumber,
    select: item.userUniqueNumber,
    rowNumber: startIndex + index + 1,
    userName: (
      <span
        style={{ cursor: "pointer" }}
        onClick={() => handleMemberClick(item)}
      >
        {item.userName}
      </span>
    ),
    userId: item.userId,
    userEmail: item.userEmail,
    userCreateDate: formatDate(item.userCreateDate),
    postCount: item.postCount, // 이제 정의되어 있음
    commentCount: item.commentCount, // 이제 정의되어 있음
    userSocialLoginSep: item.userSocialLoginSep,
    userState: item.userState === "R" ? "활성" : "정지",
  }));

  // 로딩, 오류 또는 데이터 없음 상태 처리
  if (isLoading || error || filteredData.length === 0) {
    return (
      <ContentContainer>
        <ContentTitle>회원 리스트</ContentTitle>
        <StatusMessage
          loading={isLoading}
          error={error}
          noData={
            filteredData.length === 0 && !isLoading && !error
              ? "데이터가 없습니다."
              : null
          }
        />
      </ContentContainer>
    );
  }

  return (
    <ContentContainer>
      <ContentTitle>회원 리스트</ContentTitle>

      <SubContentContainer>
        <PostPerPageSelector
          postsPerPage={postsPerPage}
          setPostsPerPage={setPostsPerPage}
        />

        <Table columns={columns} data={tableData} />

        {isModalOpen && selectedMember && (
          <Modal
            width="550px"
            height="750px"
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title="회원 상세 정보"
            message={
              <Table
                columns={[
                  { header: "항목", key: "key" },
                  { header: "내용", key: "value" },
                ]}
                data={[
                  { key: "이름", value: selectedMember.userName },
                  { key: "아이디", value: selectedMember.userId },
                  { key: "이메일", value: selectedMember.userEmail },
                  {
                    key: "닉네임",
                    value: selectedMember.userNickname || "없음",
                  },
                  {
                    key: "생년월일",
                    value: formatDate(selectedMember.userBirthDay),
                  },
                  {
                    key: "성별",
                    value:
                      selectedMember.userGender === 1
                        ? "남자"
                        : selectedMember.userGender === 2
                        ? "여자"
                        : "선택안함",
                  },
                  {
                    key: "선택 구단",
                    value: selectedMember.userFavoriteTeam || "없음",
                  },
                  {
                    key: "가입일",
                    value: formatDate(selectedMember.userCreateDate),
                  },
                  {
                    key: "회원 정보 수정일",
                    value: formatDate(selectedMember.userUpdateDate),
                  },
                  {
                    key: "가입 경로",
                    value: selectedMember.userSocialLoginSep,
                  },
                  { key: "작성 게시글 수", value: selectedMember.postCount },
                  { key: "작성 댓글 수", value: selectedMember.commentCount },
                ]}
              />
            }
            confirmText={selectedMember.userState === "S" ? "해제" : "정지"}
            cancelText="취소"
            onConfirm={async () => {
              if (selectedMember.userState === "S") {
                // 정지 해제 로직
                await handleReleaseUser(selectedMember);
              } else {
                // 정지 로직
                const confirmMessage = `정말 ${selectedMember.userName} 회원을 정지 하시겠습니까?`;
                const confirmAction = window.confirm(confirmMessage);

                if (confirmAction) {
                  try {
                    await handleToggleUserStatus(
                      selectedMember.userUniqueNumber,
                      selectedMember.userState === "S"
                    );

                    setSelectedMember((prevMember) => ({
                      ...prevMember,
                      userState: "S",
                    }));

                    handleCloseModal();

                    alert(`회원이 성공적으로 정지되었습니다.`);
                    window.location.reload();
                  } catch (error) {
                    console.error(
                      `회원 정지 처리 중 오류가 발생했습니다.`,
                      error
                    );
                    alert(
                      `회원 정지 처리 중 오류가 발생했습니다. 다시 시도해 주세요.`
                    );
                  }
                }
              }
            }}
          />
        )}
      </SubContentContainer>

      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          postsPerPage={postsPerPage} // 페이지당 게시물 수 전달
          totalPosts={filteredData.length} // 전체 게시물 수 전달
        />
      )}

      <div className="user-search-bar">
        <SearchBar
          onSearch={handleSearch}
          searchCategories={searchCategories}
        />
      </div>
    </ContentContainer>
  );
};

export default UserManagement;
