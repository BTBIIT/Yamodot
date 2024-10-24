import React from "react";
import "../../styles/PostPerPageSelector.css";

const PostPerPageSelector = ({ postsPerPage, setPostsPerPage }) => {
  const options = [10, 15, 20, 30, 50]; // 선택 가능한 페이지당 데이터 수

  return (
    <div className="post-per-page-selector">
      <select
        value={postsPerPage}
        onChange={(e) => setPostsPerPage(Number(e.target.value))} // 선택한 값을 숫자로 변환하여 상태 업데이트
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PostPerPageSelector;
