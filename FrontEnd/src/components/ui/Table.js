import styled from "styled-components";
import Input from "./Input";
import { FaLock } from "react-icons/fa";
import { formatDateForTable } from "../../utils/DateUtils"; // 경로에 맞게 수정
import React, { useState, useEffect } from "react";

// 테이블 스타일 정의
const BoardTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  font-size: 0.9rem;
  // table-layout: fixed;

  thead {
    background-color: #ffffff;
  }

  thead th {
    padding: 15px;
    text-align: center;
    font-weight: bold;
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
    text-align: center;
  }

  tbody tr {
    border-bottom: 1px solid #d6d6d6;
  }

  tbody td {
    padding: 15px;
  }

  tfoot {
    background-color: #f5f5f5;
  }

  tfoot td {
    padding: 10px;
    text-align: center;
  }
`;

// 공통 테이블 컴포넌트
const Table = ({
  columns,
  data = [],
  selectedRows = [],
  onSelectRows,
  type = "post",
  showLock = true,
}) => {
  const [isAllSelected, setIsAllSelected] = useState(false);

  useEffect(() => {
    setIsAllSelected(selectedRows.length === data.length && data.length > 0);
  }, [selectedRows, data]);

  // 전체 선택/해제 처리
  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectRows([]); // 모든 선택 해제
    } else {
      const allRowKeys = data.map((item) => item.key); // 모든 행 선택
      onSelectRows(allRowKeys);
    }
  };

  // 개별 행 선택 처리
  const handleSelectRow = (key) => {
    const updatedSelectedRows = selectedRows.includes(key)
      ? selectedRows.filter((row) => row !== key)
      : [...selectedRows, key];

    onSelectRows(updatedSelectedRows); // 선택된 행 상태 업데이트
  };

  return (
    <BoardTable>
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index} style={{ width: col.width }}>
              {col.isCheckbox ? (
                <Input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
              ) : (
                col.header
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length}>데이터가 없습니다.</td>
          </tr>
        ) : (
          data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex} style={{ width: col.width }}>
                  {col.isCheckbox ? (
                    <Input
                      type="checkbox"
                      checked={selectedRows.includes(row.key)} // 개별 행 선택 상태
                      onChange={() => handleSelectRow(row.key)} // 개별 행 선택 처리
                    />
                  ) : col.key === "questionTitle" ? (
                    // 10-16: Link 제거하고 onClick으로 라우팅 처리
                    <div
                      className="title"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <span>{row[col.key]}</span>
                      {showLock && !row.isPublic && (
                        <FaLock
                          style={{
                            marginLeft: "8px",
                            color: "#d9534f",
                            flexShrink: 0,
                          }}
                          title="비공개 문의"
                        />
                      )}
                    </div>
                  ) : col.key === "date" ? (
                    formatDateForTable(row[col.key], true)
                  ) : (
                    row[col.key]
                  )}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </BoardTable>
  );
};

export default Table;
