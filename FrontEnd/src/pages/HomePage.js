import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { UserProvider } from "../contexts/UserContext";
import { MenuProvider } from "../contexts/MenuProvider";
import Layout from "../components/layouts/Layout";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
import HomePageContent from "../components/layouts/HomePageContent";
import ScheduleResult from "./ScheduleResult";
import Schedule from "./Schedule";
import Scoreboard from "./Scoreboard";
import RecordAnalysis from "./RecordAnalysis";
import Record from "./Record";
import Analysis from "./Analysis";
import CommunityRoutes from "../routes/CommunityRoutes";
import InquiryRoutes from "../routes/InquiryRoutes";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import IdInquiryPage from "./IdInquiryPage";
import PwInquiryPage from "./PwInquiryPage";
import PwChangePage from "./PwChangePage";
import MemberEditPage from "./MemberEditPage";
import MemberCancelPage from "./MemberCancelPage";
import MyActivityPage from "./MyActivityPage";
import AdminRoutes from "../routes/AdminRoutes";
import PersonalInformationPage from "./PersonalInformationPage";
import {
  usePostFunctions,
  useInquiryFunctions,
  useCommentFunctions,
  useMemberFunctions,
} from "../utils/C_I_functions";

const HomePage = () => {
  const location = useLocation(); // 현재 경로 가져오기
  // 09 26 수정
  // 상태 관리 훅
  const { posts, handleAddPost, handleEditPost, handleDeletePost } =
    usePostFunctions();
  const {
    inquiries,
    handleAddInquiry,
    handleEditInquiry,
    handleDeleteInquiry,
  } = useInquiryFunctions();
  const { comments, handleCommentsChange } = useCommentFunctions();
  const { members } = useMemberFunctions();

  const handleAdminCommentSubmit = (e) => {
    // 관리자 댓글 처리 로직
  };

  // // 로그인 및 회원가입 페이지 경로
  // const isAuthPage = [
  //   "/user/login",
  //   "/user/signup",
  //   "/user/idinquiry",
  //   "/user/pwinquiry",
  // ].includes(location.pathname);

  return (
    <UserProvider>
      <MenuProvider>
        <Layout>
          {/* 로그인 및 회원가입 페이지가 아닐 때만 헤더 표시 */}
          {/* {!isAuthPage && <Header />} */}

          <Routes>
            <Route path="/" element={<HomePageContent />} />
            <Route path="/scheduleresults" element={<ScheduleResult />}>
              <Route path="schedule" element={<Schedule />} />
              <Route path="scoreboard" element={<Scoreboard />} />
            </Route>
            <Route path="/recordanalysis/*" element={<RecordAnalysis />}>
              <Route path="record" element={<Record />} />
              <Route path="analysis" element={<Analysis />} />
            </Route>
            {/* 커뮤니티 관련 라우트 */}
            <Route path="/community/*" element={<CommunityRoutes />} />

            {/* 문의 관련 라우트 */}
            <Route path="/inquiry/*" element={<InquiryRoutes />} />
            <Route path="/user">
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="idinquiry" element={<IdInquiryPage />} />
              <Route path="pwinquiry" element={<PwInquiryPage />} />
              <Route path="agree" element={<PersonalInformationPage />} />
            </Route>
            {/* 2024-9-25수정 */}
            <Route path="/mypage">
              <Route path="pwchange" element={<PwChangePage />} />
              <Route path="memberedit" element={<MemberEditPage />} />
              <Route path="membercancel" element={<MemberCancelPage />} />
              <Route path="myactivity" element={<MyActivityPage />} />
            </Route>

            {/* 관리자 기능 라우트 */}
            <Route
              path="/admin/*"
              element={
                <AdminRoutes
                  posts={posts}
                  handleAddPost={handleAddPost}
                  handleEditPost={handleEditPost}
                  handleDeletePost={handleDeletePost}
                  comments={comments}
                  handleCommentsChange={handleCommentsChange}
                  inquiries={inquiries}
                  handleAddInquiry={handleAddInquiry}
                  handleEditInquiry={handleEditInquiry}
                  handleDeleteInquiry={handleDeleteInquiry}
                  members={members}
                />
              }
            />
          </Routes>

          {/* 로그인 및 회원가입 페이지가 아닐 때만 푸터 표시 */}
          {/* {!isAuthPage && <Footer />} */}
        </Layout>
      </MenuProvider>
    </UserProvider>
  );
};

export default HomePage;
