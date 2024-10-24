// routes/AdminRoutes.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import UserManagement from "../components/admin/UserManagement";
import CommunityManagement from "../components/admin/CommunityManagement";
import CommentManagement from "../components/admin/CommentManagement";
import InquiryManagement from "../components/admin/InquiryManagement";

const AdminRoutes = ({
  posts,
  handleAddPost,
  handleEditPost,
  handleDeletePost,
  comments,
  handleCommentsChange,
  inquiries,
  handleAddInquiry,
  handleEditInquiry,
  handleDeleteInquiry,
  members,
}) => (
  <Routes>
    <Route
      path="/userManagement"
      element={<UserManagement members={members} />}
    />
    <Route
      path="/communityManagement"
      element={
        <CommunityManagement
          posts={posts}
          onAddPost={handleAddPost}
          onEditPost={handleEditPost}
          onDeletePost={handleDeletePost}
        />
      }
    />
    <Route
      path="/commentManagement"
      element={
        <CommentManagement
          comments={comments}
          onCommentsChange={handleCommentsChange}
        />
      }
    />
    <Route
      path="/inquiryManagement"
      element={
        <InquiryManagement
          inquiries={inquiries}
          onAddInquiry={handleAddInquiry}
          onEditInquiry={handleEditInquiry}
          onDeleteInquiry={handleDeleteInquiry}
        />
      }
    />
  </Routes>
);

export default AdminRoutes;
