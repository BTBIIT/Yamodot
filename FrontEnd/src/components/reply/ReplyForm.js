import React, { useState } from "react";
import axios from "axios";
import TextArea from "../ui/TextArea";
import Button from "../ui/Button";
import "../../styles/ReplyForm.css";

const ReplyForm = ({ postId, postCommentNum, addReply }) => {
  const [newReply, setNewReply] = useState("");

  const handleSubmit = async () => {
    if (newReply.trim() === "") return;

    const replyData = {
      replyContent: newReply,
      replyDate: new Date().toLocaleString(),
    };

    try {
      const response = await axios.post(
        `http://localhost:8090/api/comments/post/${postId}/comment/${postCommentNum}/reply`,
        replyData,
        { withCredentials: true }
      );

      if (response.data) {
        console.log("새 답글이에요: ", response.data);
        addReply(response.data); // 부모 컴포넌트로 상태 전달
        setNewReply(""); // 입력 필드 초기화
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  return (
    <div className="reply-form-container">
      <TextArea
        value={newReply}
        onChange={(e) => setNewReply(e.target.value)}
        placeholder="답글을 입력하세요"
        className="reply-textarea"
      />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "0.4rem 0 0.8rem 0",
        }}
      >
        <Button $buttonType="reply" onClick={handleSubmit}>
          답글 추가
        </Button>
      </div>
    </div>
  );
};

export default ReplyForm;
