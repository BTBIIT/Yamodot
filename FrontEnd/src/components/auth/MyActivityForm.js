import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "../ui/Table";
import Button from "../ui/Button";
import PostPerPageSelector from "../ui/PostPerPageSelector";
import SearchBar from "../ui/SearchBar";
import Pagination from "../ui/Pagination";
import TeamSelect from "../ui/TeamSelect";
import "../../styles/MyActivityForm.css";
import { useUser } from "../../contexts/UserContext";
import {
  ContentContainer,
  ContentTitle,
  SubCategoryContainer,
  SubContentContainer,
} from "../../styles/CommonStyles";
import { getTeamNameById } from "../../contexts/teamsData";
import { formatDateForTable } from "../../utils/DateUtils";
import { Link } from "react-router-dom";

const MyActivityForm = () => {
  const { user } = useUser();

  const [community, setCommunity] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [comments, setComments] = useState([]);
  const [filteredCommunity, setFilteredCommunity] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);

  const [postsPerPage, setPostsPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTeam, setSelectedTeam] = useState("게시판명");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      const apiUrls = [
        "/api/community/user/posts",
        "/api/question/user/questions",
        "/api/comments/user/comments",
      ];

      const response = await axios.get(apiUrls[selectedCategory], {
        withCredentials: true,
      });

      let mappedData;
      if (selectedCategory === 0) {
        // 작성 글
        mappedData = response.data
          .map((item, index) => {
            return {
              key: item.postId || `post-${index}`,
              postId: item.postId,
              categoryName: getTeamNameById(item.categoryName),
              postTitle: (
                <Link to={`/community/post/${item.postId}`}>
                  <div style={{ color: "#222", textAlign: "left" }}>
                    {item.postTitle}
                  </div>
                </Link>
              ),
              commentCount: item.commentCount,
              postView: item.postView,
              communityDate: formatDateForTable(item.communityDate, false),
              rawDate: new Date(item.communityDate),
            };
          })
          .sort((a, b) => b.rawDate - a.rawDate);
        console.log("나의활동 작성글:", response.data);
        setCommunity(mappedData);
        setFilteredCommunity(mappedData);
      } else if (selectedCategory === 1) {
        // 작성 문의
        mappedData = response.data
          .map((item, index) => {
            return {
              key: item.questionNum || `inquiry-${index}`,
              questionNum: item.questionNum,
              questionTitle: (
                <Link to={`/inquiry/${item.questionNum}`}>
                  <div style={{ color: "#222", textAlign: "left" }}>
                    {item.questionTitle}
                  </div>
                </Link>
              ),
              questionPostView: item.questionPostView,
              questionDate: formatDateForTable(item.questionDate, false),
              isPublic: item.privateOption === 0,
              rawDate: new Date(item.questionDate),
            };
          })
          .sort((a, b) => b.rawDate - a.rawDate);
        console.log("작성 문의글:", response.data);
        setQuestions(mappedData);
        setFilteredQuestions(mappedData);
      } else {
        // 작성 댓글
        mappedData = response.data
          .map((item) => {
            return {
              key: `${item.postId}-${item.postCommentNum}-${
                item.replyId || "comment"
              }`,
              postId: item.postId,
              postCommentNum: item.postCommentNum,
              categoryName: getTeamNameById(item.categoryName),
              postTitle: (
                <Link to={`/community/post/${item.postId}`}>
                  <div style={{ color: "#222", textAlign: "left" }}>
                    {item.postTitle}
                  </div>
                </Link>
              ),
              commentContent: item.commentContent,
              commentDate: formatDateForTable(item.commentDate, false),
              type: item.type,
              replyId: item.replyId,
              rawDate: new Date(item.commentDate),
            };
          })
          .sort((a, b) => b.rawDate - a.rawDate);
        console.log("나의활동 작성댓글:", response.data);
        setComments(mappedData);
        setFilteredComments(mappedData);
      }
    } catch (error) {
      console.error("데이터 가져오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const handleTabChange = (categoryIndex) => {
    setCommunity([]);
    setQuestions([]);
    setComments([]);
    setFilteredCommunity([]);
    setFilteredQuestions([]);
    setFilteredComments([]);
    setCurrentPage(1);
    setSelectedCategory(categoryIndex);
    setSelectedTeam("게시판명");
    setSelectedRows([]);
    setSearchTerm("");
  };

  const handleSearch = (searchTerm, searchCategory) => {
    const normalizeString = (str) => String(str || "").toLowerCase();

    let dataToFilter =
      selectedCategory === 0
        ? community
        : selectedCategory === 1
        ? questions
        : comments;

    // 팀 필터링
    if (selectedTeam !== "게시판명") {
      dataToFilter = dataToFilter.filter(
        (item) =>
          normalizeString(item.categoryName) === normalizeString(selectedTeam)
      );
    }

    // 검색어 필터링
    if (searchTerm) {
      dataToFilter = dataToFilter.filter((item) => {
        let fieldValue = "";
        if (selectedCategory === 0) {
          fieldValue = item.postTitle ? item.postTitle.props.children : "";
        } else if (selectedCategory === 1) {
          fieldValue = item.questionTitle
            ? item.questionTitle.props.children
            : "";
        } else {
          fieldValue =
            searchCategory === "postTitle"
              ? item.postTitle
                ? item.postTitle.props.children
                : ""
              : item.commentContent || "";
        }
        return normalizeString(fieldValue).includes(
          normalizeString(searchTerm)
        );
      });
    }

    if (selectedCategory === 0) {
      setFilteredCommunity(dataToFilter);
    } else if (selectedCategory === 1) {
      setFilteredQuestions(dataToFilter);
    } else {
      setFilteredComments(dataToFilter);
    }

    setCurrentPage(1);
  };

  const handleDeleteSelected = async () => {
    const filteredDataKey =
      selectedCategory === 0
        ? filteredCommunity
        : selectedCategory === 1
        ? filteredQuestions
        : filteredComments;

    const itemsToDelete = filteredDataKey.filter((item) =>
      selectedRows.includes(item.key)
    );

    if (itemsToDelete.length === 0) {
      alert("선택할 항목을 선택해 주세요.");
      return;
    }

    try {
      let deleteRequests = [];

      if (selectedCategory === 0) {
        deleteRequests = itemsToDelete.map((item) =>
          axios.delete(`/api/community/post/${item.postId}`, {
            withCredentials: true,
          })
        );
      } else if (selectedCategory === 1) {
        deleteRequests = itemsToDelete.map((item) =>
          axios.delete(`/api/question/${item.questionNum}`, {
            withCredentials: true,
          })
        );
      } else {
        deleteRequests = itemsToDelete.map((item) =>
          axios.delete(`/api/comments/${item.postId}/delete`, {
            params: {
              type: item.type === "reply" ? "reply" : "comment",
              postCommentNum: item.postCommentNum,
              replyId: item.replyId,
            },
            withCredentials: true,
          })
        );
      }

      await Promise.all(deleteRequests);
      alert(
        `선택한 ${
          selectedCategory === 0
            ? "게시물"
            : selectedCategory === 1
            ? "문의글"
            : "댓글/답글"
        }이 성공적으로 삭제되었습니다.`
      );

      const updatedData = filteredDataKey.filter(
        (item) => !selectedRows.includes(item.key)
      );

      if (selectedCategory === 0) {
        setFilteredCommunity(updatedData);
      } else if (selectedCategory === 1) {
        setFilteredQuestions(updatedData);
      } else {
        setFilteredComments(updatedData);
      }

      setSelectedRows([]);
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const currentData = (
    selectedCategory === 0
      ? filteredCommunity
      : selectedCategory === 1
      ? filteredQuestions
      : filteredComments
  ).slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  const dataWithNumber = currentData.map((item, index) => ({
    ...item,
    number: (currentPage - 1) * postsPerPage + (index + 1),
  }));

  const columns =
    selectedCategory === 0
      ? [
          { key: "selectAll", isCheckbox: true },
          { header: "번호", key: "number" },
          { header: "게시판명", key: "categoryName" },
          { header: "제목", key: "postTitle", width: "30%" },
          { header: "댓글수", key: "commentCount" },
          { header: "조회수", key: "postView" },
          { header: "작성일", key: "communityDate" },
        ]
      : selectedCategory === 1
      ? [
          { key: "selectAll", isCheckbox: true },
          { header: "번호", key: "number" },
          { header: "제목", key: "questionTitle" },
          { header: "조회수", key: "questionPostView" },
          { header: "작성일", key: "questionDate" },
        ]
      : [
          { key: "selectAll", isCheckbox: true },
          { header: "번호", key: "number" },
          { header: "게시판명", key: "categoryName" },
          { header: "제목", key: "postTitle", width: "30%" },
          { header: "댓글", key: "commentContent" },
          { header: "작성일", key: "commentDate" },
        ];

  return (
    <ContentContainer>
      <ContentTitle>나의 활동</ContentTitle>

      <SubCategoryContainer>
        <Button
          children="작성 글"
          $buttonType="subCategory"
          $selected={selectedCategory === 0}
          onClick={() => handleTabChange(0)}
        />
        <Button
          children="작성 문의"
          $buttonType="subCategory"
          $selected={selectedCategory === 1}
          onClick={() => handleTabChange(1)}
        />
        <Button
          children="작성 댓글"
          $buttonType="subCategory"
          $selected={selectedCategory === 2}
          onClick={() => handleTabChange(2)}
        />
      </SubCategoryContainer>

      <SubContentContainer>
        <PostPerPageSelector
          postsPerPage={postsPerPage}
          setPostsPerPage={setPostsPerPage}
        />

        <Table
          columns={columns}
          data={dataWithNumber}
          selectedRows={selectedRows}
          onSelectRows={setSelectedRows}
        />

        <div className="delete-button">
          <Button
            children="삭제"
            $buttonType="delete"
            onClick={handleDeleteSelected}
          />
        </div>
      </SubContentContainer>

      <Pagination
        className="pagination-container"
        postsPerPage={postsPerPage}
        totalPosts={
          selectedCategory === 0
            ? filteredCommunity.length
            : selectedCategory === 1
            ? filteredQuestions.length
            : filteredComments.length
        }
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <div className="search-bar-container">
        {selectedCategory !== 1 && (
          <TeamSelect
            selectedTeam={selectedTeam}
            setSelectedTeam={setSelectedTeam}
            $selectType="board"
            labelType="boardName"
          />
        )}
        <SearchBar
          searchTerm={searchTerm}
          searchCategory={
            selectedCategory === 2 ? "commentContent" : "postTitle"
          }
          onSearch={handleSearch}
          searchCategories={
            selectedCategory === 0
              ? [{ value: "postTitle", label: "제목" }]
              : selectedCategory === 1
              ? [{ value: "questionTitle", label: "제목" }]
              : [
                  { value: "postTitle", label: "제목" },
                  { value: "commentContent", label: "댓글" },
                ]
          }
        />
      </div>
    </ContentContainer>
  );
};

export default MyActivityForm;
