// routes/CommunityRoutes.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import CommunityPage from "../pages/CommunityPage";
import CommunityForm from "../components/community/CommunityForm";
import CommunityDetail from "../components/community/CommunityDetail";
import CommunityEditPage from "../pages/CommunityEditPage";
import { usePostFunctions, useCommentFunctions } from "../utils/C_I_functions";

const CommunityRoutes = () => {
  // usePostFunctions 및 useCommentFunctions 상태 및 함수 사용
  const { posts, handleAddPost, handleEditPost, handleDeletePost } =
    usePostFunctions();
  const { comments, handleCommentsChange } = useCommentFunctions();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <CommunityPage
            posts={posts}
            onAddPost={handleAddPost}
            onEditPost={handleEditPost}
            onDeletePost={handleDeletePost}
          />
        }
      />
      <Route
        path="post-form"
        element={
          <CommunityForm
            onAddPost={handleAddPost}
            onEditPost={handleEditPost}
            posts={posts}
          />
        }
      />
      <Route
        path="post/:id"
        element={
          <CommunityDetail
            posts={posts}
            comments={comments}
            onCommentsChange={handleCommentsChange}
            onEditPost={handleEditPost}
            onDeletePost={handleDeletePost}
          />
        }
      />
      <Route
        path="post/edit/:id"
        element={
          <CommunityEditPage posts={posts} onEditPost={handleEditPost} />
        }
      />
    </Routes>
  );
};

export default CommunityRoutes;

// import React from "react";
// import { Route, Routes } from "react-router-dom";
// import CommunityPage from "../pages/CommunityPage";
// import CommunityForm from "../components/community/CommunityForm";
// import CommunityDetail from "../components/community/CommunityDetail";
// import CommunityEditPage from "../pages/CommunityEditPage";

// const CommunityRoutes = ({
//   posts,
//   handleAddPost,
//   handleEditPost,
//   handleDeletePost,
//   comments,
//   handleCommentsChange,
// }) => (
//   <Routes>
//     <Route path="/" element={<CommunityPage posts={posts} />} />
//     <Route
//       path="post-form"
//       element={<CommunityForm onAddPost={handleAddPost} />}
//     />
//     <Route
//       path="post/:id"
//       element={<CommunityDetail posts={posts} comments={comments} />}
//     />
//     <Route path="post/edit/:id" element={<CommunityEditPage posts={posts} />} />
//   </Routes>
// );

// export default CommunityRoutes;
