import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../contexts/UserContext"; // UserContext 가져오기
import Comments from "../reply/Comments";
import Button from "../ui/Button";
import { BsPaperclip } from "react-icons/bs";
import { FaRegCommentDots } from "react-icons/fa";
import "../../styles/CommunityDetail.css";
import { formatDateForTable } from "../../utils/DateUtils";
import { MdPersonOutline } from "react-icons/md";
import { getTeamNameById } from "../../contexts/teamsData";
import {
  ContentContainer,
  SubTitle,
  SubContentContainer,
  HR,
} from "../../styles/CommonStyles";

/* 1014 다은 - 게시물 파일 이름 가져오기 */
export const getFileName = (filePath) => {
  // "/uploads/" 제거하고, 그 이후의 파일 이름만 반환
  const cleanedPath = filePath.replace("/uploads/", "");
  const fileName = cleanedPath.split("/").pop(); // 경로에서 파일명만 추출

  // 첫 번째 "_" 이후의 문자열 반환 (필요한 경우)
  return fileName.split("_").slice(1).join("_") || fileName;
};

const CommunityDetail = ({ onDeletePost }) => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const { user } = useUser(); // 로그인 정보 가져오기
  const navigate = useNavigate();
  const location = useLocation(); // useLocation 사용
  const [commentsCount, setCommentsCount] = useState(0);

  // user가 {} 때는 아직 사용자 정보를 로드 중이므로 아무것도 하지 않음
  useEffect(() => {
    if (user === null) {
      alert("로그인이 필요합니다.");
      navigate("/user/login");
    }
  }, [user, navigate]);

  // 게시물 목록 가져오기
  useEffect(() => {
    axios
      .get("http://localhost:8090/api/community/posts")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  // 특정 게시물 가져오기
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8090/api/community/post/${id}`, {
          withCredentials: true,
        })
        .then((response) => {
          setPost(response.data);
        })
        .catch((error) => {
          console.error("Error fetching post:", error);
          navigate("/community");
        });
      if (user.userState === "S") {
        alert("정지상태입니다.");
      }
    }
  }, [id, navigate]);

  // 댓글 수 가져오기
  const fetchCommentsCount = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8090/api/comments/commentscount`,
        {
          params: { postId: id },
        }
      );
      setCommentsCount(response.data);
    } catch (error) {
      console.error("댓글 수를 불러오는 데 실패했습니다.");
    }
  };

  // 컴포넌트가 마운트될 때 댓글 수 가져오기
  useEffect(() => {
    if (id) {
      // postId가 유효한지 확인
      fetchCommentsCount();
    }
  }, [id]);

  /* 수정 버튼 */
  const handleEdit = () => {
    if (user && user.userNickname === post.communityId) {
      navigate(`/community/post/edit/${id}`);
    } else {
      alert("작성자만 수정할 수 있습니다.");
    }
  };

  const handleDelete = () => {
    if (
      user &&
      user.userNickname === post.communityId &&
      window.confirm("정말로 이 게시물을 삭제하시겠습니까?")
    ) {
      axios
        .delete(`http://localhost:8090/api/community/post/${id}`, {
          withCredentials: true,
        })
        .then(() => {
          onDeletePost(id);
          navigate("/community");
        })
        .catch((error) => {
          console.error("Error deleting post:", error);
        });
    } else {
      alert("작성자만 삭제할 수 있습니다.");
    }
  };

  const isImageFile = (filePath) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif"];
    const extension = filePath.split(".").pop().toLowerCase();
    return imageExtensions.includes(extension);
  };

  // 10-14: 이미지 경로 생성 함수 추가
  const getImagePath = (filePath) => {
    return `http://localhost:8090/api/community/images/${encodeURIComponent(
      filePath.split("/").pop()
    )}`;
  };

  const handlePreviousPost = () => {
    const currentIndex = posts.findIndex((p) => p.postId === parseInt(id));
    if (currentIndex > 0) {
      const previousPost = posts[currentIndex - 1];
      navigate(`/community/post/${previousPost.postId}`);
    } else {
      alert("이전 글이 없습니다.");
    }
  };

  const handleNextPost = () => {
    const currentIndex = posts.findIndex((p) => p.postId === parseInt(id));
    if (currentIndex < posts.length - 1) {
      const nextPost = posts[currentIndex + 1];
      navigate(`/community/post/${nextPost.postId}`);
    } else {
      alert("다음 글이 없습니다.");
    }
  };

  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <ContentContainer>
      <SubContentContainer>
        <div className="community-detail-title">
          <div>
            <SubTitle>
              <span style={{ color: "#A6A6A6" }}>
                [{getTeamNameById(post.categoryName)}]
              </span>
              &nbsp;{post.postTitle}
            </SubTitle>
          </div>
          {/* 수정 및 삭제 버튼: 작성자인 경우에만 표시 */}
          <div className="community-detail-buttons">
            {user && user.userNickname === post.communityId ? (
              <>
                <Button onClick={handleEdit} $buttonType="c_i">
                  수정
                </Button>
                <Button onClick={handleDelete} $buttonType="delete">
                  삭제
                </Button>
              </>
            ) : (
              // 작성자가 아닌 경우에도 동일한 공간을 차지하도록 더미 컨테이너 추가

              <div className="empty-buttons"></div>
            )}
          </div>
        </div>
        {/* 구분선 추가  */}
        <HR style={{ borderTop: "2px solid #000000" }} />

        {/* 게시글 정보 출력 */}
        <div className="community-detail-info">
          <p>
            <MdPersonOutline />
            &nbsp;{post.communityId}
          </p>
          <div className="community-detail-date">
            <p>
              {post.communityDate
                ? formatDateForTable(post.communityDate, true)
                : "날짜 정보 없음"}
            </p>
            <p>조회수&nbsp;{post.postView}</p>
          </div>
        </div>
        <HR />

        {/* 게시글 내용 출력 */}
        <div
          className="community-detail-content"
          dangerouslySetInnerHTML={{ __html: post.postContent }}
        />

        {/* 이미지 파일 렌더링 */}
        {post.postImgPath && isImageFile(post.postImgPath) && (
          <div className="community-detail-file">
            <img
              src={getImagePath(post.postImgPath)} //경로함수 10-14
              alt="첨부 이미지"
              style={{ maxWidth: "100%" }}
            />
          </div>
        )}

        {/* 이미지가 아닌 파일의 다운로드 링크 수정 10-14*/}
        {post.postImgPath && !isImageFile(post.postImgPath) && (
          <div className="community-detail-file">
            <div>파일</div>
            <BsPaperclip className="icon-right1" />
            <a
              href={`http://localhost:8090/api/community/downloadFile/${encodeURIComponent(
                getFileName(post.postImgPath)
              )}`}
              download // 브라우저가 강제로 파일을 다운로드하게 함
              target="_blank" // 새 창에서 파일 열기 (옵션)
              rel="noopener noreferrer" // 보안 강화를 위해 추가
            >
              {getFileName(post.postImgPath)}
            </a>
          </div>
        )}
        <HR style={{ borderTop: "2px solid #000000" }} />

        {/* 댓글 컴포넌트 */}
        <div className="comments-section">
          <div className="comment-count">
            <FaRegCommentDots
              className="comment-icon"
              style={{ fontSize: "1.5rem", marginRight: "8px" }}
            />
            <span> {commentsCount}</span>
          </div>

          <Comments
            postId={id}
            comments={comments}
            onCommentsChange={(updatedComments) => {
              setComments(updatedComments);
              setCommentsCount(updatedComments.length); // 댓글 수를 업데이트
            }}
          />
        </div>
      </SubContentContainer>

      {/* 하단 중앙에 버튼 추가 */}
      <div className="community-detail-footer-buttons">
        <Button
          onClick={handlePreviousPost}
          aria-label="이전글"
          $buttonType="footer-button"
        >
          이전글
        </Button>
        <Button
          onClick={() =>
            navigate("/community", {
              state: {
                selectedCategory: location.state?.selectedCategory || "통합",
              }, // 카테고리 유지
            })
          }
          aria-label="목록"
          $buttonType="footer-button"
        >
          목록
        </Button>
        <Button
          onClick={handleNextPost}
          aria-label="다음글"
          $buttonType="footer-button"
        >
          다음글
        </Button>
      </div>
    </ContentContainer>
  );
};

export default CommunityDetail;
