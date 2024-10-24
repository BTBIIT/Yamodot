import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";
import Table from "../ui/Table";
import { formatDateForTable } from "../../utils/DateUtils";
import { teams, getTeamNameById } from "../../contexts/teamsData";
import Pagination from "../ui/Pagination";
import PostPerPageSelector from "../ui/PostPerPageSelector";
import SearchBar from "../ui/SearchBar";
import { useNavigate, Link, useLocation } from "react-router-dom";
import CommuSubCategory from "../ui/CommuSubCategory";
import { FaPencilAlt } from "react-icons/fa";
import "../../styles/Community.css";
import Button from "../ui/Button";
import {
  ContentContainer,
  ContentTitle,
  SubContentContainer,
} from "../../styles/CommonStyles";

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("통합");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("postTitle");
  const { user } = useUser(); // 로그인 정보 가져오기
  const navigate = useNavigate();
  const location = useLocation(); // 작성 후 돌아온 카테고리 설정을 위해 사용

  // 첫 로딩 시 사용자 선호 구단을 category에 설정
  useEffect(() => {
    // 만약 글 작성 후 돌아왔을 경우 (location.state에 selectedCategory가 있을 때)
    if (location.state?.selectedCategory) {
      console.log("전달된 카테고리:", location.state.selectedCategory);
      setCategory(location.state.selectedCategory); // 작성 후 돌아온 카테고리 설정
    }
    // 처음 로딩할 때는 사용자 선호 구단을 설정
    else if (user && user.userFavoriteTeam) {
      setCategory(user.userFavoriteTeam); // 선호 구단 설정
    } else {
      setCategory("%25");
    }
  }, [user, location.state]);

  // 게시물 목록 가져오기
  useEffect(() => {
    axios
      .get("http://localhost:8090/api/community/posts")
      .then(async (response) => {
        const postList = response.data;

        // 댓글 수 가져오기
        const postWithComments = await Promise.all(
          postList.map(async (post) => {
            const commentsResponse = await axios.get(
              `http://localhost:8090/api/comments/commentscount`,
              { params: { postId: post.postId } }
            );
            return { ...post, commentsCount: commentsResponse.data };
          })
        );
        console.log(postWithComments);
        setPosts(postWithComments);
        setFilteredPosts(postWithComments);
      })
      .catch((error) => {
        console.error("게시물 가져오기 오류:", error);
      });
  }, []);

  // 게시물 상세 페이지로 이동할 때 로그인 여부 확인
  const handlePostClick = (postId) => {
    if (!user) {
      alert("로그인 후 이용해 주세요.");
      navigate("/user/login");
    } else {
      navigate(`/community/post/${postId}`);
    }
  };

  // 글쓰기 페이지로 이동하는 함수
  const handleWriteButtonClick = () => {
    // user가 null이거나 undefined인 경우 로그인 페이지로 이동
    if (!user || !user?.userState) {
      alert("로그인 후 이용해 주세요.");
      navigate("/user/login"); // 로그인 페이지로 이동
    } else if (user.userState === "S") {
      alert("정지상태입니다.");
      navigate("/community"); // 커뮤니티 목록으로 이동
    } else {
      // 현재 선택된 카테고리 상태를 넘김
      navigate("post-form", { state: { selectedCategory: category } });
    }
  };

  // 필터 및 검색 기능 처리
  useEffect(() => {
    const filteredCommunity = posts.filter((post) => {
      if (searchCategory === "postTitle") {
        return post.postTitle && post.postTitle.includes(searchTerm);
      } else if (searchCategory === "postContent") {
        return post.postContent && post.postContent.includes(searchTerm);
      } else if (searchCategory === "userNickname") {
        return post.communityId && post.communityId.includes(searchTerm);
      }
      return false;
    });

    // 카테고리가 '통합'일 경우 모든 게시물을 반환
    if (category === "통합" || category === "%25") {
      setFilteredPosts(filteredCommunity);
    } else {
      // 'category'가 팀의 이름일 때 해당 팀의 id를 가져옴
      const team = teams.find((team) => team.label === category);
      const teamId = team ? team.id : null;

      const filteredByCategory = filteredCommunity.filter((post) => {
        return Number(post.categoryName) === teamId; // 숫자 타입으로 비교
      });

      setFilteredPosts(filteredByCategory);
    }
  }, [category, posts, searchTerm, searchCategory]);

  // 페이지네이션 처리
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  // 검색 기능: 검색어와 검색 카테고리 설정
  const handleSearch = (term, category) => {
    setSearchTerm(term);
    setSearchCategory(category);
  };

  // 검색 카테고리 정의
  const searchCategories = [
    { value: "postTitle", label: "제목" },
    { value: "postContent", label: "내용" },
    { value: "userNickname", label: "작성자" },
  ];

  // 테이블에 적용할 컬럼 정의
  const columns = [
    { header: "번호", key: "postList" },
    {
      header: "제목",
      key: "postTitle",
      width: "40%",
    },
    {
      header: "작성자",
      key: "userNickname",
    },
    { header: "작성일", key: "communityDate" },
    { header: "조회수", key: "postView" },
  ];

  return (
    <ContentContainer>
      <ContentTitle>커뮤니티</ContentTitle>
      <CommuSubCategory category={category} setCategory={setCategory} />
      <SubContentContainer>
        <PostPerPageSelector
          postsPerPage={postsPerPage}
          setPostsPerPage={setPostsPerPage}
        />
        <Table
          columns={columns}
          data={paginatedPosts.map((post, index) => ({
            postList: (currentPage - 1) * postsPerPage + index + 1,
            postTitle: (
              <div
                style={{ cursor: "pointer", color: "#222", textAlign: "left" }}
                onClick={() => handlePostClick(post.postId)} // 클릭 시 로그인 여부 체크
              >
                <div style={{ color: "#222", textAlign: "left" }}>
                  <span style={{ color: "#A6A6A6" }}>
                    [{getTeamNameById(post.categoryName)}]
                  </span>
                  <span>&nbsp;{post.postTitle}</span>
                  <span style={{ color: "#D71E17" }}>
                    &nbsp;[{post.commentsCount}]
                  </span>
                </div>
              </div>
            ),

            userNickname: post.communityId,
            communityDate: formatDateForTable(post.communityDate, false),
            postView: post.postView,
          }))}
          isTitle={true} // 제목 열에만 왼쪽 정렬을 적용하기 위한 props
        />

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
          totalPosts={filteredPosts.length}
          postsPerPage={postsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
      <div className="search-bar-container community-search-bar">
        <SearchBar
          onSearch={handleSearch}
          searchCategories={searchCategories}
        />
      </div>
    </ContentContainer>
  );
};

export default Community;
