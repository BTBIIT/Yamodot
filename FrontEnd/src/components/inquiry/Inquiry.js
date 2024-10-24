import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../contexts/UserContext"; // UserContext 가져오기
import Table from "../ui/Table";
import Pagination from "../ui/Pagination";
import PostPerPageSelector from "../ui/PostPerPageSelector";
import SearchBar from "../ui/SearchBar";
import { useNavigate, Link } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import "../../styles/Inquiry.css";
import { formatDateForTable } from "../../utils/DateUtils"; // formatDate 함수 사용
import Button from "../ui/Button";
import {
  ContentContainer,
  ContentTitle,
  SubContentContainer,
} from "../../styles/CommonStyles";

const Inquiry = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [inquiriesPerPage, setInquiriesPerPage] = useState(15);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("title");
  const [inquiries, setInquiries] = useState([]);
  const { user } = useUser(); // 로그인 정보 가져오기
  console.log("user", user);
  const navigate = useNavigate();

  // API에서 문의 목록 가져오기
  useEffect(() => {
    axios
      .get("http://localhost:8090/api/question/all")
      .then((response) => {
        console.log("문의 데이터", response.data);
        setInquiries(response.data);
        setFilteredInquiries(response.data);
      })
      .catch((error) => {
        console.error("문의글 가져오기 오류:", error);
      });
  }, []);

  //글쓰기 페이지로 이동하는 함수
  const handleWriteButtonClick = () => {
    if (user) {
      navigate("/inquiry/inquiry-form");
    } else {
      alert("로그인 후 이용해 주세요.");
      navigate("/user/login"); // 로그인 페이지로 이동
    }
  };

  // 검색어 및 카테고리에 따라 문의 목록 필터링
  useEffect(() => {
    const filteredResults = inquiries.filter((inquiry) => {
      if (searchCategory === "title") {
        return (
          inquiry.questionTitle && inquiry.questionTitle.includes(searchTerm)
        );
      } else if (searchCategory === "content") {
        return (
          inquiry.questionContent &&
          inquiry.questionContent.includes(searchTerm)
        );
      } else if (searchCategory === "userNickname") {
        return inquiry.questionID && inquiry.questionID.includes(searchTerm);
      }
      return false;
    });

    setFilteredInquiries(filteredResults);
  }, [inquiries, searchTerm, searchCategory]);

  // 페이지네이션 처리
  const paginatedInquiries = filteredInquiries.slice(
    (currentPage - 1) * inquiriesPerPage,
    currentPage * inquiriesPerPage
  );

  // 검색 기능 구현
  const handleSearch = (term, category) => {
    setSearchTerm(term);
    setSearchCategory(category);
  };

  // 검색 카테고리 정의
  const searchCategories = [
    { value: "title", label: "제목" },
    { value: "content", label: "내용" },
    { value: "userNickname", label: "작성자" },
  ];

  // 테이블에 적용할 컬럼 정의
  const columns = [
    { header: "번호", key: "inquiryList" },
    { header: "제목", key: "questionTitle" },
    { header: "답변 유무", key: "questionAnswer" },
    { header: "작성자", key: "userNickname" },
    { header: "작성일", key: "questionDate" },
    { header: "조회수", key: "questionPostView" },
  ];

  return (
    <ContentContainer>
      <ContentTitle>문의</ContentTitle>

      <SubContentContainer>
        <PostPerPageSelector
          postsPerPage={inquiriesPerPage}
          setPostsPerPage={setInquiriesPerPage}
        />

        <Table
          columns={columns}
          data={paginatedInquiries.map((inquiry, index) => {
            const isPublic = inquiry.privateOption === 0;
            return {
              inquiryList: (currentPage - 1) * inquiriesPerPage + index + 1,
              questionNum: inquiry.questionNum,
              questionTitle: (
                <Link
                  to={`/inquiry/${inquiry.questionNum}`}
                  className="custom-link"
                >
                  <div style={{ color: "#222", textAlign: "left" }}>
                    {inquiry.questionTitle}
                  </div>
                </Link>
              ),
              questionAnswer: inquiry.questionAnswer ? "답변 완료" : "미답변",
              userNickname:
                inquiry.questionID /* 1013-유니크 넘버에서 닉네입으로 변경 */,
              questionDate: formatDateForTable(inquiry.questionDate, false), // 날짜만 표시
              questionPostView: inquiry.questionPostView,
              isPublic: isPublic,
            };
          })}
          type="inquiry"
          handleSelectRow={() => {}}
          isInquiry={true}
          showLock={true}
        />

        {/* 글쓰기 버튼 항상 표시 */}
        <div className="write-button-container">
          <Button
            $buttonType="writing"
            onClick={handleWriteButtonClick}
            className="write-button"
          >
            <FaPencilAlt className="button-icon" /> 글쓰기
          </Button>
        </div>
      </SubContentContainer>

      <div className="pagination-container">
        <Pagination
          totalPosts={filteredInquiries.length}
          postsPerPage={inquiriesPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>

      <div className="search-bar-container inquiry-search-bar">
        <SearchBar
          onSearch={handleSearch}
          searchCategories={searchCategories}
        />
      </div>
    </ContentContainer>
  );
};

export default Inquiry;
