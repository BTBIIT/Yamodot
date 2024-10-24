import React from "react";
import styled from "styled-components";
import { RingLoader } from "react-spinners";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 20px;
`;

const LoadingText = styled.strong`
  font-size: 1.2rem;
  margin-top: 10px; /* 아이콘과 텍스트 사이 간격 조절 */
`;

const ErrorText = styled.p`
  font-size: 1.2rem;
`;

const NoDataText = styled.p`
  font-size: 1.2rem;
  color: #888;
`;

const StatusMessage = ({ loading, error, noData }) => {
  return (
    <Container>
      {loading ? (
        <>
          <RingLoader color="#36d7b7" size={35} />
          <LoadingText>!! Loding !! Please wait a moment.</LoadingText>
        </>
      ) : error ? (
        <ErrorText>{error}</ErrorText>
      ) : (
        <NoDataText>{noData || ""}</NoDataText>
      )}
    </Container>
  );
};

export default StatusMessage;
