import React from "react";
import TextArea from "../ui/TextArea";
import Button from "../ui/Button";
import "../../styles/CommentForm.css";
import { useUser } from "../../contexts/UserContext";

const CommentForm = ({ newComment, setNewComment, addComment }) => {
  const { user } = useUser();
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addComment();
    }
  };

  return (
    <div
      className="comment-form-container"
      style={{ fontSize: "0.9rem", color: "#000" }}
    >
      {user && (
        <div className="comment-user-nickname">
          <strong>{user.userNickname}</strong>님
        </div>
      )}

      <TextArea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="댓글을 입력하세요"
        onKeyPress={handleKeyPress}
        required
        rows={4}
        className="commentForm-textarea"
      />

      <Button
        $buttonType="c_i"
        onClick={addComment}
        className="comment-submit-button"
      >
        등록
      </Button>
    </div>
  );
};

export default CommentForm;
