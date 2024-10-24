import React, { useState, useEffect } from "react";

// 사용자 목록 컴포넌트
const UserList = () => {
  const [users, setUsers] = useState([]); // 사용자 목록 상태

  // API를 호출해 사용자 목록을 가져오는 함수
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8090/api/admin/users", {
        method: "GET",
      });

      if (response.ok) {
        const users = await response.json();
        setUsers(users); // 사용자 목록을 상태에 저장
      } else {
        console.error("사용자 목록을 가져오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("API 요청 중 오류 발생:", error);
    }
  };

  // 컴포넌트가 처음 렌더링될 때 API를 호출
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>사용자 목록</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={styles.header}>고유번호</th>
            <th style={styles.header}>관리자 고유번호</th>
            <th style={styles.header}>아이디</th>
            <th style={styles.header}>이름</th>
            <th style={styles.header}>닉네임</th>
            <th style={styles.header}>이메일</th>
            <th style={styles.header}>회원가입 날짜</th>
            <th style={styles.header}>유저 상태</th>
            <th style={styles.header}>정지 횟수</th>
            <th style={styles.header}>정지 날짜</th>
            <th style={styles.header}>성별</th>
            <th style={styles.header}>생년월일</th>
            <th style={styles.header}>좋아하는 팀</th>
            <th style={styles.header}>서비스 이용 동의</th>
            <th style={styles.header}>개인정보 처리 방침 동의</th>
            <th style={styles.header}>소셜 로그인 구분</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userUniqueNumber}>
              <td style={styles.cell}>{user.userUniqueNumber}</td>
              <td style={styles.cell}>
                {user.adminUniqueNumber
                  ? user.adminUniqueNumber
                  : "일반 사용자"}
              </td>
              <td style={styles.cell}>{user.userId}</td>
              <td style={styles.cell}>{user.userName}</td>
              <td style={styles.cell}>{user.userNickname}</td>
              <td style={styles.cell}>{user.userEmail}</td>
              <td style={styles.cell}>{user.userCreateDate}</td>
              <td style={styles.cell}>{user.userState}</td>
              <td style={styles.cell}>{user.userStopCount}</td>
              <td style={styles.cell}>
                {user.userStopDate ? user.userStopDate : "N/A"}
              </td>
              <td style={styles.cell}>
                {user.userGender === 1
                  ? "남성"
                  : user.userGender === 2
                  ? "여성"
                  : "미지정"}
              </td>
              <td style={styles.cell}>{user.userBirthDay}</td>
              <td style={styles.cell}>{user.userFavoriteTeam}</td>
              <td style={styles.cell}>
                {user.userSvcUsePcyAgmtYn === "Y" ? "동의" : "비동의"}
              </td>
              <td style={styles.cell}>
                {user.userPsInfoProcAgmtYn === "Y" ? "동의" : "비동의"}
              </td>
              <td style={styles.cell}>{user.userSocialLoginSep}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// 스타일 정의
const styles = {
  header: {
    backgroundColor: "#f2f2f2",
    padding: "10px",
    border: "1px solid black",
  },
  cell: {
    padding: "10px",
    border: "1px solid black",
  },
};

export default UserList;
