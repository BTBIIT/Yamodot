import React from "react";
import { Table, TableHeader } from "../../styles/CommonStyles";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";
import styled from "styled-components";

const RecordDataTable = styled(Table)`
  width: 100%;
  // table-layout: fixed;
  border-collapse: collapse;
  margin-top: 25px;
`;

// 스크롤을 위한 부모 요소 스타일
const TableScroll = styled.div`
  width: 100%;
  overflow-x: auto; /* 가로 스크롤 적용 */
`;

// const RecordDataTable = styled.table`
//   width: 100%;
//   border-collapse: collapse;
//   margin-top: 20px;
//   font-family: "NanumSquareRound", sans-serif;
// `;

// 공통 DataTable 컴포넌트
const RecordTableView = ({
  headers = [], // 테이블의 헤더 정보를 저장하는 배열
  data = [], // 테이블에 표시할 데이터 배열 기본값은 빈 배열
  onSort, // 정렬을 수행할 때 호출하는 함수
  sortField, // 현재 정렬 중인 필드
  sortOrder, // 정렬 방향 ("asc" 또는 "desc")
  selectedPlayerType,
  selectedCategory,
}) => {
  // 고정할 헤더 키 설정
  const stickyHeaderKeys = [
    "ranking",
    "pitchersName",
    "battersName",
    "defenceName",
    "teamName",
    "era",
    "avg",
    "pos",
    "g",
  ];

  // 선택된 선수 유형에 따라 추가로 고정할 열을 설정
  if (selectedPlayerType === 0) {
    stickyHeaderKeys.push("era"); // 투수일 때 ERA 고정
  } else if (selectedPlayerType === 1) {
    stickyHeaderKeys.push("avg"); // 타자일 때 AVG 고정
  } else if (selectedPlayerType === 2) {
    stickyHeaderKeys.push("pos", "g"); // 수비일 때 포지션과 경기 고정
  }

  return (
    <TableScroll>
      <RecordDataTable>
        <TableHeader>
          <tr>
            {/* 순위 헤더 추가 */}
            {selectedCategory !== 2 && <th>순위</th>}
            {headers.map((header, index) => (
              <th
                key={index}
                onClick={() => onSort(header.key)}
                style={{ cursor: "pointer" }}
              >
                {console.log("Selected Category: ", selectedCategory)}
                {header.value}
                {sortField === header.key && (
                  <span>
                    {sortOrder === "asc" ? <FaCaretUp /> : <FaCaretDown />}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </TableHeader>
        <tbody>
          {data.length > 0
            ? data.map((item, index) => (
                <tr key={index}>
                  {/* 순위 데이터 표시 */}
                  {selectedCategory !== 2 && <td>{item.ranking}</td>}
                  {headers.map((header) => (
                    <td
                      key={header.key}
                      style={{
                        backgroundColor:
                          sortField === header.key
                            ? "rgba(255, 67, 67, 0.13)"
                            : "transparent",
                      }}
                    >
                      {item[header.key]}
                    </td>
                  ))}
                </tr>
              ))
            : ""}
        </tbody>
      </RecordDataTable>
    </TableScroll>
  );
};

export default RecordTableView;
