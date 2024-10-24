import React from "react";
import PostForm from "../components/community/PostForm";
const CommunityFormPage = (props) => {
  return (
    <div>
      <PostForm {...props} />
    </div>
  );
};

export default CommunityFormPage;
