// Pagination.js (2024년 10월 2일 수정)
import React from "react";
import "../../styles/Pagination.css";

const Pagination = ({
  postsPerPage,
  totalPosts,
  currentPage,
  setCurrentPage,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalPosts / postsPerPage));

  // 현재 페이지 그룹을 계산 (한 그룹에 5개의 페이지만 표시)
  const currentGroup = Math.ceil(currentPage / 5);
  const startPage = (currentGroup - 1) * 5 + 1; // 그룹의 첫 페이지
  const endPage = Math.min(totalPages, currentGroup * 5); // 그룹의 마지막 페이지

  return (
    <nav>
      <ul className="pagination">
        <li>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
          >
            &laquo; {/* 이전 페이지 버튼 */}
          </button>
        </li>

        {/* 현재 그룹의 페이지들 (항상 5개의 페이지 표시) */}
        {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
          <li
            key={startPage + index}
            className={startPage + index === currentPage ? "active" : ""}
          >
            <button onClick={() => setCurrentPage(startPage + index)}>
              {startPage + index}
            </button>
          </li>
        ))}

        <li>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            &raquo; {/* 다음 페이지 버튼 */}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
