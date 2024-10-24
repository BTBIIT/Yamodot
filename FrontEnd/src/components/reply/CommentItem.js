import React, { useState } from "react";
import Button from "../ui/Button";
import ReplyForm from "./ReplyForm";
import ReplyList from "./ReplyList";
import TextArea from "../ui/TextArea";
import "../../styles/CommentItem.css";
import { formatDateForTable } from "../../utils/DateUtils";
import { useUser } from "../../contexts/UserContext";
import { MdPersonOutline } from "react-icons/md";

const CommentItem = ({ comment, deleteComment, updateComment }) => {
  const { user } = useUser();
  const [editText, setEditText] = useState(comment.commentContent || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isReplyFormOpen, setIsReplyFormOpen] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);
  const [replyKey, setReplyKey] = useState(0); // 상태 변경을 트리거하는 키

  const handleUpdate = async () => {
    try {
      const response = await updateComment(
        comment.postId,
        comment.postCommentNum,
        editText
      );
      const updatedComment = response?.data || response;
      setEditText(updatedComment.commentContent || "");
      setIsEditing(false);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("오류", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleUpdate();
    }
  };

  const addReply = (newReply) => {
    setReplies((prevReplies) => [...prevReplies, newReply]);
    setReplyKey((prevKey) => prevKey + 1); // ReplyList 갱신을 위한 키 업데이트
    setIsReplyFormOpen(false); // 답글 작성 창 닫기
  };

  const filteredReplies = replies.filter(
    (reply) => reply.postCommentNum === comment.postCommentNum
  );

  return (
    <li className="comment-item">
      <div className="comment-content">
        {isEditing ? (
          <div>
            <TextArea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button
              $buttonType="reply"
              onClick={() => {
                handleUpdate();
                setIsEditing(false);
                setIsDropdownOpen(false);
              }}
            >
              댓글 저장
            </Button>
            <Button
              $buttonType="reply"
              onClick={() => {
                setIsEditing(false);
                setEditText(comment.commentContent || "");
                setIsDropdownOpen(false);
              }}
            >
              취소
            </Button>
          </div>
        ) : (
          <>
            <div className="comment-nickname">
              <MdPersonOutline />
              &nbsp;
              <span>{comment.commentName}</span>
            </div>
            <div className="comment-text">
              <span>{comment.commentContent}</span>
            </div>
            <div className="comment-meta">
              <small>{formatDateForTable(comment.commentDate)}</small>

              <Button
                $buttonType="reply"
                onClick={() => setIsReplyFormOpen(!isReplyFormOpen)}
              >
                {isReplyFormOpen ? "답글 닫기" : "답글 쓰기"}
              </Button>
            </div>
          </>
        )}
      </div>

      {user?.userNickname === comment.commentName && (
        <div className="comment-dropdown">
          <button
            className="dropdown-toggle"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            &#x22EE;
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu open">
              <button
                onClick={() =>
                  deleteComment(comment.postId, comment.postCommentNum)
                }
              >
                삭제
              </button>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setIsDropdownOpen(false);
                }}
              >
                수정
              </button>
            </div>
          )}
        </div>
      )}

      {isReplyFormOpen && (
        <ReplyForm
          postId={comment.postId}
          postCommentNum={comment.postCommentNum}
          addReply={addReply}
        />
      )}

      <ReplyList
        key={replyKey}
        replies={filteredReplies}
        postId={comment.postId}
        postCommentNum={comment.postCommentNum}
      />
    </li>
  );
};

export default CommentItem;
