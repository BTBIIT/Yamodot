// 여기는 문의 관리자 답글 제출 파일 (일단 보류)
import React, { useState } from "react";

const AdminComment = ({ inquiryId, onAdminCommentSubmit }) => {
  const [adminComment, setAdminComment] = useState("");

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    onAdminCommentSubmit(inquiryId, adminComment); // 관리자 댓글 제출
    setAdminComment(""); // 제출 후 입력값 초기화
  };

  return (
    <div>
      <h3>관리자 댓글</h3>
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={adminComment}
          onChange={(e) => setAdminComment(e.target.value)}
          placeholder="관리자 댓글 입력"
        />
        <button type="submit">댓글 달기</button>
      </form>
    </div>
  );
};

export default AdminComment;
