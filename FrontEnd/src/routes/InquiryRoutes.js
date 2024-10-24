import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import InquiryPage from "../pages/InquiryPage";
import InquiryFormPage from "../pages/InquiryFormPage";
import InquiryDetailPage from "../pages/InquiryDetailPage";
import InquiryEditPage from "../pages/InquiryEditPage";
import { useInquiryFunctions } from "../utils/C_I_functions";

const InquiryRoutes = () => {
  const {
    inquiries,
    handleAddInquiry,
    handleEditInquiry,
    handleDeleteInquiry,
  } = useInquiryFunctions();

  const navigate = useNavigate();

  // 경로 중복 방지를 위한 useEffect 추가
  useEffect(() => {
    const pathname = window.location.pathname;

    // "/inquiry/inquiry" 경로만 수정하는 조건을 추가 10-02
    if (pathname.match(/^\/inquiry\/inquiry\/\d+$/)) {
      const correctedPath = pathname.replace("/inquiry/inquiry", "/inquiry");
      navigate(correctedPath, { replace: true });
    }
  }, [navigate]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <InquiryPage inquiries={inquiries} onAddInquiry={handleAddInquiry} />
        }
      />
      <Route
        path="inquiry-form"
        element={<InquiryFormPage onAddInquiry={handleAddInquiry} />}
      />
      <Route
        path=":id"
        element={
          <InquiryDetailPage
            inquiries={inquiries}
            onEditInquiry={handleEditInquiry}
            onDeleteInquiry={handleDeleteInquiry}
          />
        }
      />
      <Route
        path="edit/:id"
        element={
          <InquiryEditPage
            inquiries={inquiries}
            onEditInquiry={handleEditInquiry}
          />
        }
      />
    </Routes>
  );
};

export default InquiryRoutes;
