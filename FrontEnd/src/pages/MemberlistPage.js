import React, { useState } from "react";
import DataTable from "../components/shared/DataTable";
import Pagination from "../components/shared/Pagination";
import PostPerPageSelector from "../components/shared/PostPerPageSelector";
import SearchBar from "../components/shared/SearchBar";
import { useNavigate } from "react-router-dom";

const MemberlistPage = ({ members }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [membersPerPage, setMembersPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("name");

  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 사용

  const handleMemberDetail = (memberId) => {
    // 회원 상세 페이지로 이동하는 함수
    navigate(`/member/${memberId}`);
  };

  const handleSearch = (term, category) => {
    setSearchTerm(term);
    setSearchCategory(category);
  };

  const filteredMembers = members.filter((member) => {
    if (searchCategory === "name") {
      return member.name.includes(searchTerm);
    } else if (searchCategory === "email") {
      return member.email.includes(searchTerm);
    }
    return false;
  });

  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * membersPerPage,
    currentPage * membersPerPage
  );

  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

  return (
    <div>
      <h1>회원 리스트</h1>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchCategory={searchCategory}
        setSearchCategory={setSearchCategory}
        onSearch={handleSearch}
      />
      <PostPerPageSelector
        postsPerPage={membersPerPage}
        setPostsPerPage={setMembersPerPage}
      />
      <DataTable
        data={paginatedMembers}
        type="member"
        onRowClick={handleMemberDetail}
      />
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default MemberlistPage;
