import React, { useState } from "react";
import DataTable from "../components/shared/DataTable";
import Pagination from "../components/shared/Pagination";
import PostPerPageSelector from "../components/shared/PostPerPageSelector";
import SearchBar from "../components/shared/SearchBar";
import { useNavigate } from "react-router-dom";

const PostmanagementPage = ({ posts }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("title");

  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 사용

  const handleSearch = (term, category) => {
    setSearchTerm(term);
    setSearchCategory(category);
  };

  const handlePostDetail = (postId) => {
    // 게시물 상세 페이지로 이동하는 함수
    navigate(`/post/${postId}`);
  };

  const filteredPosts = posts.filter((post) => {
    if (searchCategory === "title") {
      return post.title.includes(searchTerm);
    } else if (searchCategory === "content") {
      return post.content.includes(searchTerm);
    } else if (searchCategory === "author") {
      return post.author.includes(searchTerm);
    }
    return false;
  });

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <div>
      <h1>게시물 관리</h1>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchCategory={searchCategory}
        setSearchCategory={setSearchCategory}
        onSearch={handleSearch}
      />
      <PostPerPageSelector
        postsPerPage={postsPerPage}
        setPostsPerPage={setPostsPerPage}
      />
      <DataTable
        data={paginatedPosts}
        type="post"
        onRowClick={handlePostDetail}
      />
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default PostmanagementPage;
