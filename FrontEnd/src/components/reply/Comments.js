import React, { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";

const Comments = ({ postId, allowAddComment = true, onCommentsChange }) => {
  const [localComments, setLocalComments] = useState([]); // 로컬 댓글 상태
  const [newComment, setNewComment] = useState(""); // 새 댓글 상태
  const [editCommentId, setEditCommentId] = useState(null); // 수정 중인 댓글 ID
  const [replyCommentId, setReplyCommentId] = useState(null); // 답글 작성 중인 댓글 ID
  const [newReply, setNewReply] = useState(""); // 새 답글 상태
  const [editReplyInfo, setEditReplyInfo] = useState({
    commentId: null,
    replyId: null,
  }); // 수정 중인 답글 정보

  const { user } = useUser(); // 로그인한 사용자 정보 가져오기
  const token = localStorage.getItem("jwtToken"); // JWT 토큰을 로컬스토리지에서 가져옴

  // 서버에서 댓글 목록 가져오기
  const fetchComments = () => {
    axios
      .get(`http://localhost:8090/api/comments/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 추가
          "Content-Type": "application/json", // 추가된 헤더
        },
        withCredentials: true,
      })
      .then((response) => {
        setLocalComments(response.data); // 서버에서 댓글 데이터를 가져와 상태에 설정
      })
      .catch((error) => {
        console.error("댓글목록 가져오기 실패", error);
      });
  };

  // 첫 마운트 때 댓글 목록 불러오기
  useEffect(() => {
    fetchComments(); // 댓글 목록을 서버에서 가져옴
  }, [postId, token]);

  // 새 댓글 추가 함수
  const addComment = () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (newComment.trim() === "") return; // 빈 댓글은 추가하지 않음

    const comment = {
      commentContent: newComment,
      userUniqueNumber: user.userUniqueNumber, // 로그인한 사용자의 고유 번호
      postId: postId, // 현재 게시물 ID 추가
    };

    axios
      .post(`http://localhost:8090/api/comments/post/${postId}`, comment, {
        headers: {
          Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 추가
        },
        withCredentials: true,
      })
      .then((response) => {
        if (response.data) {
          const newCommentFromServer = response.data;

          // 서버에서 받은 댓글 데이터를 확인하고 상태에 추가
          setLocalComments((prevComments) => [
            ...prevComments,
            newCommentFromServer,
          ]);
          fetchComments(); // 댓글 목록 다시 불러오기 (렌더링 문제 해결)
          setNewComment(""); // 입력 필드 초기화
          onCommentsChange([...localComments, newCommentFromServer]);
        } else {
          console.error("서버로부터 받은 데이터가 없습니다.");
        }
      })
      .catch((error) => {
        console.error("댓글 추가 중 오류 발생:", error);
      });
  };

  // 댓글 삭제 함수
  const deleteComment = (postId, postCommentNum) => {
    if (!postId || !postCommentNum) {
      console.error(
        "Invalid postId or postCommentNum:",
        postId,
        postCommentNum
      );
      return;
    }
    axios
      .delete(
        `http://localhost:8090/api/comments/post/${postId}/comment/${postCommentNum}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 추가
          },
          withCredentials: true,
        }
      )
      .then(() => {
        const updatedComments = localComments.filter(
          (comment) => comment.postCommentNum !== postCommentNum
        );
        setLocalComments(updatedComments);
        console.log("Comment deleted successfully:", postCommentNum);
      })
      .catch((error) => {
        console.error("Error deleting comment:", error);
      });
  };

  // 댓글 수정 시작 함수
  const editComment = (id) => {
    setEditCommentId(id); // 수정할 댓글의 ID 설정
    const commentToEdit = localComments.find(
      (comment) => comment.postCommentNum === id
    ); // 수정할 댓글 찾기
    if (commentToEdit) setNewComment(commentToEdit.commentContent); // 댓글 내용을 입력 필드에 표시
  };

  // // 댓글 업데이트 함수
  // const updateComment = async (postId, postCommentNum, updatedText) => {
  //   try {
  //     const response = await axios.put(
  //       `http://localhost:8090/api/comments/post/${postId}/comment/${postCommentNum}`,
  //       { commentContent: updatedText },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`, // JWT 토큰을 포함
  //         },
  //         withCredentials: true,
  //       }
  //     );

  //     console.log("Full response:", response); // 전체 응답 확인
  //     const updatedComment = response.data;

  //     if (updatedComment) {
  //       // 기존 댓글 목록에서 업데이트된 댓글 반영
  //       const updatedComments = localComments.map((comment) =>
  //         comment.postCommentNum === postCommentNum
  //           ? { ...comment, ...updatedComment }
  //           : comment
  //       );
  //       setLocalComments(updatedComments); // 상태 업데이트
  //       setEditCommentId(null); // 수정 모드 해제
  //       console.log("Comment updated successfully:", updatedComment);
  //     } else {
  //       console.error("No data found in the response.");
  //     }
  //   } catch (error) {
  //     console.error("Error updating comment:", error);
  //   }
  // };
  // 댓글 업데이트 함수
  const updateComment = async (postId, postCommentNum, updatedText) => {
    try {
      const response = await axios.put(
        `http://localhost:8090/api/comments/post/${postId}/comment/${postCommentNum}`,
        { commentContent: updatedText },
        {
          headers: {
            Authorization: `Bearer ${token}`, // JWT 토큰을 포함
          },
          withCredentials: true,
        }
      );

      const updatedComment = response.data;

      if (updatedComment) {
        // 기존 댓글 목록에서 수정된 댓글 반영
        setLocalComments((prevComments) =>
          prevComments.map((comment) =>
            comment.postCommentNum === postCommentNum
              ? { ...comment, commentContent: updatedText } // 기존 댓글 내용만 수정
              : comment
          )
        );
        setEditCommentId(null); // 수정 모드 해제
      } else {
        console.error("No data found in the response.");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  // 답글 삭제 함수
  const deleteReply = (commentId, replyId) => {
    axios
      .delete(
        `http://localhost:8090/api/comments/${commentId}/replies/${replyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 추가
          },
          withCredentials: true,
        }
      ) // 서버로 답글 삭제 요청
      .then(() => {
        const updatedComments = localComments.map((comment) => {
          if (comment.postCommentNum === commentId) {
            const updatedReplies = comment.replies.filter(
              (reply) => reply.replyId !== replyId
            );
            return { ...comment, replies: updatedReplies }; // 삭제된 답글 반영
          }
          return comment;
        });
        setLocalComments(updatedComments); // 업데이트된 댓글 목록으로 상태 변경
        console.log("Reply deleted successfully:", replyId);
      })
      .catch((error) => {
        console.error("Error deleting reply:", error);
      });
  };

  // 답글 수정 시작 함수
  const editReply = (commentId, replyId) => {
    setEditReplyInfo({ commentId, replyId }); // 수정할 답글의 댓글 ID와 답글 ID 설정
    const comment = localComments.find((c) => c.postCommentNum === commentId); // 해당 댓글 찾기
    if (comment) {
      const replyToEdit = comment.replies.find(
        (reply) => reply.replyId === replyId
      ); // 해당 답글 찾기
      if (replyToEdit) setNewReply(replyToEdit.text); // 답글 내용을 입력 필드에 표시
    }
  };

  // 답글 업데이트 함수
  const updateReply = (commentId, postCommentNum, replyId, updatedText) => {
    axios
      .put(
        `http://localhost:8090/api/comments/post/${commentId}/comment/${postCommentNum}/reply/${replyId}`,
        {
          text: updatedText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 추가
          },
          withCredentials: true,
        }
      ) // 서버로 답글 업데이트 요청
      .then((response) => {
        if (response.data) {
          const updatedComments = localComments.map((comment) => {
            if (comment.postCommentNum === commentId) {
              const updatedReplies = comment.replies.map((reply) =>
                reply.replyId === replyId ? response.data : reply
              );
              return { ...comment, replies: updatedReplies }; // 수정된 답글 반영
            }
            return comment;
          });
          setLocalComments(updatedComments); // 업데이트된 댓글 목록으로 상태 변경
          setEditReplyInfo({ commentId: null, replyId: null }); // 수정 모드 종료
          console.log("Reply updated successfully:", response.data);
        } else {
          console.error("No data found in the response.");
        }
      })
      .catch((error) => {
        console.error("Error updating reply:", error);
      });
  };

  return (
    <div>
      {/* 댓글 목록 먼저 표시 */}
      <CommentList
        comments={localComments}
        deleteComment={deleteComment}
        editComment={editComment}
        updateComment={updateComment}
        editCommentId={editCommentId}
        setReplyCommentId={setReplyCommentId}
        replyCommentId={replyCommentId}
        newReply={newReply}
        setNewReply={setNewReply}
        deleteReply={deleteReply}
        editReply={editReply}
        updateReply={updateReply}
        editReplyInfo={editReplyInfo}
      />
      {/* 댓글 입력 폼 */}
      {allowAddComment && (
        <CommentForm
          newComment={newComment}
          setNewComment={setNewComment}
          addComment={addComment}
          editCommentId={editCommentId}
        />
      )}
    </div>
  );
};

export default Comments;
