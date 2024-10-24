import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import HomePage from "./pages/HomePage"; // 메인 페이지 추가
import "./styles/App.css";

// QueryClient 생성
const queryClient = new QueryClient();

const App = () => {
  return (
    // QueryClientProvider로 앱을 감싸서 모든 컴포넌트가 React-Query에 접근할 수 있도록 설정
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/*" element={<HomePage />} />
          {/* 모든 경로에 대해 HomePage 사용 */}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;

