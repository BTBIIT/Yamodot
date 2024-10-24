import React, { useEffect, useState } from "react";
import axios from "axios";
import ReplyItem from "./ReplyItem";

const ReplyList = ({ postId, postCommentNum }) => {
  const [replies, setReplies] = useState([]);

  // 대댓글 목록 불러오기
  useEffect(() => {
    axios
      .get(
        `http://localhost:8090/api/comments/post/${postId}/comment/${postCommentNum}/replies`
      )
      .then((response) => setReplies(response.data))
      .catch((error) => console.error("Error fetching replies:", error));
  }, [postId, postCommentNum]);

  // 대댓글 삭제 처리
  const deleteReply = async (replyId) => {
    try {
      await axios.delete(
        `http://localhost:8090/api/comments/post/${postId}/comment/${postCommentNum}/reply/${replyId}`,
        { withCredentials: true } // 쿠키 기반 인증 활성화
      );
      setReplies((prevReplies) =>
        prevReplies.filter((reply) => reply.replyId !== replyId)
      );
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  // 대댓글 추가 처리 (선언됬으나 안사용되서 일단 빼봄) 2024. 10. 14 아마 이건 필요 없을거 같음
  // const addReply = (newReply) => {
  //   setReplies((prevReplies) => [...prevReplies, newReply]); // 새로운 대댓글 추가
  // };

  // 대댓글 수정 처리
  const updateReplyState = (replyId, updatedContent) => {
    setReplies((prevReplies) =>
      prevReplies.map((reply) =>
        reply.replyId === replyId
          ? { ...reply, replyContent: updatedContent }
          : reply
      )
    ); // 대댓글 내용 수정
  };

  return (
    <ul>
      {replies.map((reply) => (
        <ReplyItem
          key={reply.replyId}
          reply={reply}
          postId={reply.postId}
          postCommentNum={reply.postCommentNum}
          deleteReply={deleteReply}
          updateReplyState={updateReplyState} // ReplyItem에 상태 업데이트 함수 전달
        />
      ))}
    </ul>
  );
};

export default ReplyList;
