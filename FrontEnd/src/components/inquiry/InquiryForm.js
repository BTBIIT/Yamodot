// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import QuillEditor from "../ui/QuillEditor";
// import { BsPaperclip } from "react-icons/bs";
// import Button from "../ui/Button";
// import "../../styles/InquiryForm.css";
// import CombinedLoadingAndNoData from "../ui/StatusMessage";
// import Input from "../ui/Input";
// import {
//   ContentContainer,
//   ContentTitle,
//   SubContentContainer,
//   HR,
// } from "../../styles/CommonStyles";

// const InquiryForm = ({ onAddInquiry }) => {
//   const [formData, setFormData] = useState({
//     title: "",
//     content: "",
//     isPublic: true,
//     password: "",
//     file: null,
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const [charCount, setCharCount] = useState(0);

//   const maxTitleLength = 50; // 제목 최대 길이
//   const maxCharLimit = 1000; // 내용 최대

//   // 비밀번호 정규식: 숫자와 영문자 조합 4~8자 공백 불허 10-14 수정
//   const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,8}$/;

//   // 입력 값 변경 처리 (비밀번호 유효성 검사는 제출 시 수행) 10-14 수정
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // 제목 길이 제한
//     if (name === "title" && value.length > maxTitleLength) {
//       alert(`제목은 최대 ${maxTitleLength}자까지 입력할 수 있습니다.`);
//       return;
//     }

//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   // 공개 여부 토글 처리
//   const handleTogglePublic = () => {
//     setFormData((prevState) => ({
//       ...prevState,
//       isPublic: !prevState.isPublic,
//       password: !prevState.isPublic ? "" : prevState.password,
//     }));
//   };

//   const calculatePlainTextLength = (htmlContent) => {
//     const plainText = htmlContent.replace(/<[^>]*>|&nbsp;/g, "").trim();
//     return plainText.length;
//   };

//   // 파일 처리
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData({ ...formData, file });
//     }
//   };

//   // 폼 제출 처리 10-14 수정
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     // 비공개 시 비밀번호 유효성 검사
//     if (!formData.isPublic && !passwordRegex.test(formData.password)) {
//       alert(
//         "비밀번호는 4~8자 사이의 영문+숫자 조합이어야 하며 공백이 포함될 수 없습니다."
//       );
//       setIsLoading(false);
//       return;
//     }

//     console.log("isPublic value:", formData.isPublic); // 확인

//     const newInquiry = {
//       ...formData,
//     };

//     const formDataToSend = new FormData();
//     formDataToSend.append("questionTitle", formData.title);
//     formDataToSend.append("questionContent", formData.content);
//     formDataToSend.append("privateOption", formData.isPublic ? 0 : 1);

//     if (!formData.isPublic) {
//       formDataToSend.append("privateQuestionPassword", formData.password);
//     }

//     if (formData.file) {
//       formDataToSend.append("file", formData.file);
//     }

//     axios
//       .post("http://localhost:8090/api/question/create", formDataToSend, {
//         withCredentials: true, // 쿠키를 포함하여 요청을 보냄
//         headers: {
//           "Content-Type": "multipart/form-data", // 파일이 포함된 요청
//         },
//       })
//       .then(() => {
//         onAddInquiry(newInquiry);
//         setFormData({
//           title: "",
//           content: "",
//           isPublic: true,
//           password: "",
//           file: null,
//         });
//         setCharCount(0);
//         setIsLoading(false);
//         navigate("/inquiry");
//       })
//       .catch((error) => {
//         console.error("Error creating inquiry:", error);
//         setIsLoading(false);
//       });
//   };

//   return (
//     <ContentContainer>
//       <ContentTitle>문의 글쓰기</ContentTitle>
//       <SubContentContainer>
//         <CombinedLoadingAndNoData
//           loading={isLoading}
//           noData="문의글을 등록해주세요."
//         />
//         {!isLoading && (
//           <form onSubmit={handleSubmit} className="post-form inquiry-form">
//             <div className="form-group">
//               <label htmlFor="title">제목 ㅣ</label>
//               <Input
//                 $inputType="inquiry-form"
//                 type="text"
//                 name="title"
//                 id="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 required
//                 placeholder="제목을 입력해 주세요."
//                 className="form-control"
//               />
//               <div className="char-counter">
//                 {formData.title.length}/{maxTitleLength}
//               </div>
//             </div>
//             <HR />

//             <div className="form-group">
//               <label htmlFor="file-upload">
//                 파일
//                 <BsPaperclip className="icon-right1" />
//               </label>
//               <Input
//                 $inputType="inquiry-form"
//                 type="file"
//                 id="file-upload"
//                 name="file"
//                 accept="image/*,.pdf,.doc,.docx,.txt,.hwp,.pptx"
//                 onChange={handleFileChange}
//                 aria-label="파일 선택"
//                 className="form-control"
//               />
//             </div>
//             <HR />

//             <div className="form-group textarea-group">
//               <label htmlFor="content">내용 ㅣ</label>
//               <QuillEditor
//                 value={formData.content}
//                 onChange={(content) => {
//                   const textLength = calculatePlainTextLength(content);
//                   if (textLength <= maxCharLimit) {
//                     setFormData({ ...formData, content });
//                     setCharCount(textLength);
//                   } else {
//                     alert(`최대 ${maxCharLimit}자까지 입력할 수 있습니다.`);
//                   }
//                 }}
//               />
//               <div className="char-counter">
//                 {charCount}/{maxCharLimit}
//               </div>
//             </div>
//             <HR />

//             <div className="form-group">
//               <label>공개 여부 ㅣ</label>
//               <div className="custom-toggle">
//                 {/* 공통으로 사용하려고 했으나 토글오류가 너무 심함 10-07 */}
//                 <input
//                   type="checkbox"
//                   id="custom-toggle-checkbox"
//                   className="custom-toggle-input"
//                   checked={formData.isPublic}
//                   onChange={handleTogglePublic}
//                 />
//                 <label
//                   className="custom-toggle-label"
//                   htmlFor="custom-toggle-checkbox"
//                 >
//                   <span className="custom-toggle-switch"></span>
//                   <span className="toggle-text toggle-text-left">공개</span>
//                   <span className="toggle-text toggle-text-right">비공개</span>
//                 </label>
//               </div>
//             </div>

//             {!formData.isPublic && (
//               <div className="form-group">
//                 <label htmlFor="password">비밀번호 ㅣ</label>
//                 <Input
//                   $inputType="inquiry-form"
//                   type="password"
//                   name="password"
//                   id="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required={!formData.isPublic}
//                   placeholder="4~8자 사이의 영문+숫자 조합 비밀번호를 입력하세요."
//                 />
//               </div>
//             )}
//             <Button $buttonType="c_i_Edit" type="submit" className="submit-btn">
//               등록
//             </Button>
//           </form>
//         )}
//       </SubContentContainer>
//     </ContentContainer>
//   );
// };

// export default InquiryForm;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import QuillEditor from "../ui/QuillEditor";
import { BsPaperclip } from "react-icons/bs";
import Button from "../ui/Button";
import "../../styles/InquiryForm.css";
import CombinedLoadingAndNoData from "../ui/StatusMessage";
import Input from "../ui/Input";
import {
  ContentContainer,
  ContentTitle,
  SubContentContainer,
  HR,
} from "../../styles/CommonStyles";

const InquiryForm = ({ onAddInquiry }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isPublic: true,
    password: "",
    file: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [charCount, setCharCount] = useState(0);

  const maxTitleLength = 50; // 제목 최대 길이
  const maxCharLimit = 1000; // 내용 최대

  // 비밀번호 정규식: 숫자와 영문자 조합 4~8자 공백 불허 10-14 수정
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,8}$/;

  // 입력 값 변경 처리 (비밀번호 유효성 검사는 제출 시 수행) 10-14 수정
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 제목 길이 제한
    if (name === "title" && value.length > maxTitleLength) {
      alert(`제목은 최대 ${maxTitleLength}자까지 입력할 수 있습니다.`);
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 공개 여부 토글 처리
  const handleTogglePublic = () => {
    setFormData((prevState) => ({
      ...prevState,
      isPublic: !prevState.isPublic,
      password: !prevState.isPublic ? "" : prevState.password,
    }));
  };

  const calculatePlainTextLength = (htmlContent) => {
    const plainText = htmlContent.replace(/<[^>]*>|&nbsp;/g, "").trim();
    return plainText.length;
  };

  // 파일 처리
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
    }
  };

  // 폼 제출 처리 10-14 수정
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // 비공개 시 비밀번호 유효성 검사
    if (!formData.isPublic && !passwordRegex.test(formData.password)) {
      alert(
        "비밀번호는 4~8자 사이의 영문+숫자 조합이어야 하며 공백이 포함될 수 없습니다."
      );
      setIsLoading(false);
      return;
    }

    console.log("isPublic value:", formData.isPublic); // 확인

    const newInquiry = {
      ...formData,
    };

    const formDataToSend = new FormData();
    formDataToSend.append("questionTitle", formData.title);
    formDataToSend.append("questionContent", formData.content);
    formDataToSend.append("privateOption", formData.isPublic ? 0 : 1);

    if (!formData.isPublic) {
      formDataToSend.append("privateQuestionPassword", formData.password);
    }

    if (formData.file) {
      formDataToSend.append("file", formData.file);
    }

    axios
      .post("http://localhost:8090/api/question/create", formDataToSend, {
        withCredentials: true, // 쿠키를 포함하여 요청을 보냄
        headers: {
          "Content-Type": "multipart/form-data", // 파일이 포함된 요청
        },
      })
      .then(() => {
        onAddInquiry(newInquiry);
        setFormData({
          title: "",
          content: "",
          isPublic: true,
          password: "",
          file: null,
        });
        setCharCount(0);
        setIsLoading(false);
        navigate("/inquiry");
      })
      .catch((error) => {
        console.error("Error creating inquiry:", error);
        setIsLoading(false);
      });
  };

  return (
    <ContentContainer>
      <ContentTitle>문의 글쓰기</ContentTitle>
      <SubContentContainer>
        <CombinedLoadingAndNoData
          loading={isLoading}
          noData="문의글을 등록해주세요."
        />
        {!isLoading && (
          <form onSubmit={handleSubmit} className="post-form inquiry-form">
            <div className="form-group">
              <label htmlFor="title">제목 ㅣ</label>
              <Input
                $inputType="inquiry-form"
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="제목을 입력해 주세요."
                className="form-control"
              />
              <div className="char-counter">
                {formData.title.length}/{maxTitleLength}
              </div>
            </div>

            <HR />

            <div className="form-group">
              <label htmlFor="file-upload">
                파일 <BsPaperclip className="icon-right1" />
              </label>
              <label htmlFor="file-upload" className="custom-file-upload">
                파일 선택
              </label>
              {/* 이거는 인풋 컴포넌트 못씀 */}
              <input
                type="file"
                id="file-upload"
                name="file"
                accept="image/*,.pdf,.doc,.docx,.txt,.hwp,.pptx"
                onChange={handleFileChange}
                className="form-control-file"
              />
              {formData.file && (
                <div>
                  선택된 파일: {formData.file.name} {/* 파일명을 표시 */}
                </div>
              )}
            </div>

            <HR />

            <div className="form-group textarea-group">
              <label htmlFor="content">내용 I </label>
              <QuillEditor
                value={formData.content}
                onChange={(content) => {
                  const textLength = calculatePlainTextLength(content);
                  if (textLength <= maxCharLimit) {
                    setFormData({ ...formData, content });
                    setCharCount(textLength);
                  } else {
                    alert(`최대 ${maxCharLimit}자까지 입력할 수 있습니다.`);
                  }
                }}
              />
              <div className="char-counter">
                {charCount}/{maxCharLimit}
              </div>
            </div>
            <HR />

            <div className="form-group">
              <label htmlFor="public" className="public-label">
                공개여부 ㅣ
              </label>
              <div className="custom-toggle">
                {/* 공통으로 사용하려고 했으나 토글오류가 너무 심함 10-07 */}
                <input
                  type="checkbox"
                  id="custom-toggle-checkbox"
                  className="custom-toggle-input"
                  checked={formData.isPublic}
                  onChange={handleTogglePublic}
                />
                <label
                  className="custom-toggle-label"
                  htmlFor="custom-toggle-checkbox"
                >
                  <span className="custom-toggle-switch"></span>
                  <span className="toggle-text toggle-text-left">공개</span>
                  <span className="toggle-text toggle-text-right">비공개</span>
                </label>
              </div>
            </div>

            {!formData.isPublic && (
              <div className="form-group">
                <label htmlFor="password" className="password-label">
                  비밀번호 ㅣ
                </label>
                <Input
                  $inputType="inquiry-form"
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!formData.isPublic}
                  placeholder="4~8자 사이의 영문+숫자 조합 비밀번호를 입력하세요."
                />
              </div>
            )}
            <Button $buttonType="c_i_Edit" type="submit" className="submit-btn">
              등록
            </Button>
          </form>
        )}
      </SubContentContainer>
    </ContentContainer>
  );
};

export default InquiryForm;
