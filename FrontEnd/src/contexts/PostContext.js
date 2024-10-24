// contexts/PostContext.js
import { createContext, useContext, useState } from "react";

const PostContext = createContext();

export const usePostContext = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  const handleAddPost = (post) => {
    /* ... */
  };
  const handleEditPost = (id, updatedPost) => {
    /* ... */
  };
  const handleDeletePost = (id) => {
    /* ... */
  };

  return (
    <PostContext.Provider
      value={{ posts, handleAddPost, handleEditPost, handleDeletePost }}
    >
      {children}
    </PostContext.Provider>
  );
};
