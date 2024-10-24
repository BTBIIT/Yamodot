import React, { useState } from "react";
import axios from "axios";
import Button from "../ui/Button";
import TextArea from "../ui/TextArea";
import { formatDateForTable } from "../../utils/DateUtils";
import { useUser } from "../../contexts/UserContext";
import { MdPersonOutline } from "react-icons/md";
import "../../styles/ReplyItem.css";

const ReplyItem = ({
  reply,
  postId,
  postCommentNum,
  deleteReply,
  updateReplyState,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(reply.replyContent || "");
  const { user } = useUser();

  const handleUpdate = async () => {
    if (!editContent.trim()) {
      alert("수정할 내용을 입력하세요.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8090/api/comments/post/${postId}/comment/${postCommentNum}/reply/${reply.replyId}`,
        { replyContent: editContent },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      updateReplyState(reply.replyId, editContent); // 수정된 대댓글을 상위 컴포넌트에 전달
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating reply:", error);
    }
  };

  return (
    <li className="reply">
      {isEditing ? (
        <div>
          <TextArea
            className="reply-textarea"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="답글을 입력하세요"
          />
          <Button $buttonType="reply" onClick={handleUpdate}>
            수정 완료
          </Button>
          <Button $buttonType="reply" onClick={() => setIsEditing(false)}>
            취소
          </Button>
        </div>
      ) : (
        <div className="reply-content">
          <span>
            <span className="reply-nickname">
              <MdPersonOutline style={{ color: "#b8b8b8" }} />
              {reply.replyName}
            </span>
            <br />
            <span className="reply-text">{reply.replyContent}</span> <br />
            <span className="reply-date">
              <small>{formatDateForTable(reply.replyDate)}</small>
            </span>
          </span>
          {user?.userNickname === reply.replyName && !isEditing && (
            <div className="reply-actions">
              <Button $buttonType="reply" onClick={() => setIsEditing(true)}>
                수정
              </Button>
              <Button
                $buttonType="reply"
                onClick={() => deleteReply(reply.replyId)}
              >
                삭제
              </Button>
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default ReplyItem;
