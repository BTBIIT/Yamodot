import { useState } from "react";
// 게시글 관련 상태 및 함수들
// 게시글 추가, 수정, 삭제 기능을 포함, 게시글 상태를 관리하는 함수
export const usePostFunctions = () => {
  const [posts, setPosts] = useState([]); // 게시글 상태 관리

  // 게시글 추가 함수
  const handleAddPost = (post) => {
    const newPost = { ...post, id: posts.length + 1 }; // 게시글에 고유 ID를 설정하여 추가
    setPosts((prevPosts) => [...prevPosts, newPost]); // 새로운 게시글을 기존 게시글 배열에 추가
  };

  // 게시글 수정 함수
  const handleEditPost = (postId, updatedPost) => {
    setPosts(
      (prevPosts) =>
        prevPosts.map((post) => (post.id === postId ? updatedPost : post)) // 특정 ID에 해당하는 게시글 수정
    );
  };

  // 게시글 삭제 함수
  const handleDeletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId)); // 특정 ID에 해당하는 게시글 삭제
  };

  return { posts, handleAddPost, handleEditPost, handleDeletePost }; // 상태와 함수 반환
};

// 문의글 관련 상태 및 함수들
// 문의글 추가, 수정, 삭제 기능을 포함, 문의글 상태를 관리하는 함수.
export const useInquiryFunctions = () => {
  const [inquiries, setInquiries] = useState([]); // 문의글 상태 관리

  // 문의글 추가 함수
  const handleAddInquiry = (inquiryItem) => {
    const newInquiry = { ...inquiryItem, id: inquiries.length + 1 }; // 문의글에 고유 ID를 설정하여 추가
    setInquiries((prevInquiries) => [...prevInquiries, newInquiry]); // 새로운 문의글을 기존 문의글 배열에 추가
  };

  // 문의글 수정 함수
  const handleEditInquiry = (inquiryId, updatedInquiry) => {
    setInquiries((prevInquiries) =>
      prevInquiries.map(
        (inquiryItem) =>
          inquiryItem.id === inquiryId ? updatedInquiry : inquiryItem // 특정 ID에 해당하는 문의글 수정
      )
    );
  };

  // 문의글 삭제 함수
  const handleDeleteInquiry = (inquiryId) => {
    setInquiries(
      (prevInquiries) =>
        prevInquiries.filter((inquiryItem) => inquiryItem.id !== inquiryId) // 특정 ID에 해당하는 문의글 삭제
    );
  };

  return {
    inquiries,
    handleAddInquiry,
    handleEditInquiry,
    handleDeleteInquiry,
  }; // 상태와 함수 반환
};

// 댓글 관련 상태 및 함수들
// 게시글별 댓글 상태 관리 및 댓글 변경을 처리하는 함수
export const useCommentFunctions = () => {
  const [comments, setComments] = useState({}); // 댓글 상태 관리

  // 특정 게시글의 댓글 변경 함수
  const handleCommentsChange = (postId, newComments) => {
    setComments((prevComments) => ({
      ...prevComments,
      [postId]: newComments, // 게시글 ID별로 새로운 댓글 배열을 설정(이부분 아직 보류 관리자)
    }));
  };

  return { comments, handleCommentsChange }; // 상태와 함수 반환
};

// 회원 관련 상태 및 함수들
// 회원 목록 관리 기능을 포함하는 함수
export const useMemberFunctions = () => {
  const [members, setMembers] = useState([]); // 회원 상태 관리

  return { members, setMembers }; // 상태와 함수 반환
};
