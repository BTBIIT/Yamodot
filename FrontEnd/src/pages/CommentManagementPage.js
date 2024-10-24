import React, { useState } from "react";
import DataTable from "../components/shared/DataTable";
import Pagination from "../components/shared/Pagination";
import PostPerPageSelector from "../components/shared/PostPerPageSelector";
import SearchBar from "../components/shared/SearchBar";
import { useNavigate } from "react-router-dom";
import { useCommentFunctions } from "../C_I_functions"; // 함수 임포트

const CommentmanagementPage = ({ comments }) => {
  const { handleCommentsChange } = useCommentFunctions(); // 함수 사용
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage, setCommentsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("title");

  const navigate = useNavigate();

  const filteredComments = comments.filter((comment) => {
    if (searchCategory === "title") return comment.title.includes(searchTerm);
    if (searchCategory === "content")
      return comment.content.includes(searchTerm);
    if (searchCategory === "author") return comment.author.includes(searchTerm);
    return false;
  });

  const paginatedComments = filteredComments.slice(
    (currentPage - 1) * commentsPerPage,
    currentPage * commentsPerPage
  );

  const totalPages = Math.ceil(filteredComments.length / commentsPerPage);

  return (
    <div>
      <h1>댓글 관리</h1>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <PostPerPageSelector
        postsPerPage={commentsPerPage}
        setPostsPerPage={setCommentsPerPage}
      />
      <DataTable
        data={paginatedComments}
        type="comment"
        onRowClick={(id) => navigate(`/comment/${id}`)}
      />
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default CommentmanagementPage;
