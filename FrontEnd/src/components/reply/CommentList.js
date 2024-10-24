import React from "react";
import CommentItem from "./CommentItem"; // 개별 댓글 컴포넌트 임포트

// CommentList 컴포넌트: 댓글 목록을 표시하고 각각의 댓글을 CommentItem 컴포넌트를 사용해 렌더링
const CommentList = ({
  comments,
  deleteComment,
  editComment,
  updateComment,
  editCommentId,
  setReplyCommentId,
  replyCommentId,
  newReply,
  setNewReply,
  addReply,
  deleteReply,
  editReply,
  updateReply,
  editReplyInfo,
}) => {
  return (
    <ul>
      {comments
        .filter((comment) => comment.type === "comment") // 댓글만 필터링
        .map((comment) => (
          <CommentItem
            key={comment.postCommentNum} // 각 댓글에 고유 key 설정
            comment={comment}
            deleteComment={deleteComment}
            editComment={editComment}
            updateComment={updateComment}
            editCommentId={editCommentId}
            setReplyCommentId={setReplyCommentId}
            replyCommentId={replyCommentId}
            newReply={newReply}
            setNewReply={setNewReply}
            addReply={addReply}
            deleteReply={deleteReply}
            editReply={editReply}
            updateReply={updateReply}
            editReplyInfo={editReplyInfo}
          />
        ))}
    </ul>
  );
};

export default CommentList;
