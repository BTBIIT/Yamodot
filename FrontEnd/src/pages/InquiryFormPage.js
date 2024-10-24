import React from "react";
import InquiryForm from "../components/inquiry/InquiryForm";

const InquiryFormPage = (props) => {
  return (
    <div>
      <InquiryForm {...props} />
    </div>
  );
};

export default InquiryFormPage;
