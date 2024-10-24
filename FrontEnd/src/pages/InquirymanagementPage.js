import React, { useState } from "react";
import DataTable from "../components/shared/DataTable";
import Pagination from "../components/shared/Pagination";
import PostPerPageSelector from "../components/shared/PostPerPageSelector";
import SearchBar from "../components/shared/SearchBar";
import { useNavigate } from "react-router-dom";

const InquirymanagementPage = ({ inquiries }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [inquiriesPerPage, setInquiriesPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("title");

  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 사용

  const handleInquiryDetail = (inquiryId) => {
    // 문의 상세 페이지로 이동하는 함수
    navigate(`/inquiry/${inquiryId}`);
  };

  const handleSearch = (term, category) => {
    setSearchTerm(term);
    setSearchCategory(category);
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    if (searchCategory === "title") {
      return inquiry.title.includes(searchTerm);
    } else if (searchCategory === "content") {
      return inquiry.content.includes(searchTerm);
    } else if (searchCategory === "author") {
      return inquiry.author.includes(searchTerm);
    }
    return false;
  });

  const paginatedInquiries = filteredInquiries.slice(
    (currentPage - 1) * inquiriesPerPage,
    currentPage * inquiriesPerPage
  );

  const totalPages = Math.ceil(filteredInquiries.length / inquiriesPerPage);

  return (
    <div>
      <h1>문의 관리</h1>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchCategory={searchCategory}
        setSearchCategory={setSearchCategory}
        onSearch={handleSearch}
      />
      <PostPerPageSelector
        postsPerPage={inquiriesPerPage}
        setPostsPerPage={setInquiriesPerPage}
      />
      <DataTable
        data={paginatedInquiries}
        type="inquiry"
        onRowClick={handleInquiryDetail}
      />
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default InquirymanagementPage;
