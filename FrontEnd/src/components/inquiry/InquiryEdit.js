// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import QuillEditor from "../ui/QuillEditor";
// import { BsPaperclip } from "react-icons/bs";
// import "../../styles/InquiryEdit.css";
// import Button from "../ui/Button";
// import Input from "../ui/Input";
// import CombinedLoadingAndNoData from "../ui/StatusMessage";
// import {
//   ContentContainer,
//   ContentTitle,
//   SubContentContainer,
//   HR,
// } from "../../styles/CommonStyles";

// const InquiryEdit = ({ onEditInquiry }) => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [editFormData, setEditFormData] = useState({
//     title: "",
//     content: "",
//     file: null,
//     isPublic: true,
//     password: "",
//   });

//   const [isLoading, setIsLoading] = useState(false);
//   const [charCount, setCharCount] = useState(0);
//   const maxTitleLength = 50;
//   const maxCharLimit = 1000;

//   // 비밀번호 정규식: 숫자와 영문자 조합 4~8자, 공백 불허
//   const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,8}$/;

//   // 문의 수정 데이터 가져오기
//   useEffect(() => {
//     setIsLoading(true);
//     axios
//       .get(`http://localhost:8090/api/question/${id}`)
//       .then((response) => {
//         const inquiry = response.data;
//         setEditFormData({
//           title: inquiry.questionTitle,
//           content: inquiry.questionContent,
//           file: inquiry.questionImgPath || null,
//           isPublic: inquiry.privateOption === 0,
//           password: inquiry.privateQuestionPassword || "",
//         });
//         setCharCount(
//           inquiry.questionContent.replace(/<\/?[^>]+(>|$)/g, "").length
//         );
//         setIsLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching inquiry:", error);
//         setIsLoading(false);
//       });
//   }, [id]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "title" && value.length > maxTitleLength) {
//       alert(`제목은 최대 ${maxTitleLength}자까지 입력할 수 있습니다.`);
//       return;
//     }
//     setEditFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setEditFormData((prev) => ({ ...prev, file }));
//   };

//   const handleRemoveFile = () => {
//     axios
//       .put(
//         `http://localhost:8090/api/community/removeFile/${id}`,
//         {},
//         {
//           withCredentials: true,
//         }
//       )
//       .then(() => {
//         setEditFormData((prev) => ({ ...prev, file: null }));
//       })
//       .catch((error) => {
//         console.error("Error removing file:", error);
//       });
//   };

//   const handleTogglePublic = () => {
//     setEditFormData((prevState) => ({
//       ...prevState,
//       isPublic: !prevState.isPublic,
//       password: !prevState.isPublic ? "" : prevState.password,
//     }));
//   };

//   const handleSave = (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     if (!editFormData.isPublic && !passwordRegex.test(editFormData.password)) {
//       alert(
//         "비밀번호는 4~8자 사이의 영문+숫자 조합이어야 하며 공백이 포함될 수 없습니다."
//       );
//       setIsLoading(false);
//       return;
//     }

//     const formData = new FormData();
//     formData.append("questionTitle", editFormData.title);
//     formData.append("questionContent", editFormData.content);
//     formData.append("privateOption", editFormData.isPublic ? 0 : 1);

//     if (editFormData.file) {
//       formData.append("file", editFormData.file);
//     }
//     if (!editFormData.isPublic && editFormData.password) {
//       formData.append("privateQuestionPassword", editFormData.password);
//     }

//     axios
//       .put(`/api/question/${id}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       })
//       .then(() => {
//         onEditInquiry(id, formData);
//         setIsLoading(false);
//         navigate(`/inquiry/${id}`);
//       })
//       .catch((error) => {
//         console.error("Error updating inquiry:", error);
//         setIsLoading(false);
//       });
//   };

//   return (
//     <ContentContainer>
//       <ContentTitle>문의 수정</ContentTitle>

//       <SubContentContainer>
//         <CombinedLoadingAndNoData
//           loading={isLoading}
//           noDataMessage="문의글을 수정해주세요."
//         />
//         {!isLoading && (
//           <form onSubmit={handleSave} className="post-form inquiry-edit">
//             <div className="form-group">
//               <label htmlFor="title">제목 ㅣ</label>
//               <div className="input-with-counter">
//                 <Input
//                   $inputType="inquiry-form"
//                   type="text"
//                   name="title"
//                   value={editFormData.title}
//                   onChange={handleInputChange}
//                   required
//                   placeholder="제목을 입력해 주세요."
//                   className="form-control"
//                 />
//                 <span className="char-counter">
//                   {editFormData.title.length}/{maxTitleLength}
//                 </span>
//               </div>
//             </div>

//             <HR />

//             <div className="form-group">
//               <label htmlFor="file-upload">
//                 파일 <BsPaperclip className="icon-right1" />
//               </label>
//               <div className="from-file">
//                 <div>
//                   <Input
//                     $inputType="inquiry-form"
//                     type="file"
//                     id="file-upload"
//                     accept="image/*,.pdf,.doc,.docx,.txt,.hwp,.pptx"
//                     onChange={handleFileChange}
//                     className="form-control-file"
//                   />
//                 </div>
//                 {editFormData.file && (
//                   <div className="file-file">
//                     {typeof editFormData.file === "string" ? (
//                       <div>
//                         이미 업로드된 파일: {editFormData.file.split("/").pop()}
//                       </div>
//                     ) : (
//                       <p>선택된 파일: {editFormData.file.name}</p>
//                     )}
//                     <Button
//                       type="button"
//                       $buttonType="delete"
//                       onClick={handleRemoveFile}
//                     >
//                       제거
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <HR />

//             <div className="form-group textarea-group">
//               <div>
//                 <label htmlFor="content">내용 ㅣ</label>
//               </div>
//               {/* <div> */}
//               <QuillEditor
//                 value={editFormData.content}
//                 onChange={(content) => {
//                   const textLength = content.replace(
//                     /<\/?[^>]+(>|$)/g,
//                     ""
//                   ).length;
//                   if (textLength <= maxCharLimit) {
//                     setEditFormData((prev) => ({ ...prev, content }));
//                     setCharCount(textLength);
//                   } else {
//                     alert(`최대 ${maxCharLimit}자까지 입력할 수 있습니다.`);
//                   }
//                 }}
//               />
//               {/* </div> */}
//               <div className="char-counter">
//                 {charCount}/{maxCharLimit}
//               </div>
//             </div>

//             <HR />

//             <div className="form-group">
//               <div>
//                 <label>공개 여부 ㅣ</label>
//               </div>
//               <div>
//                 <div className="custom-toggle">
//                   <input
//                     type="checkbox"
//                     id="custom-toggle-checkbox"
//                     className="custom-toggle-input"
//                     checked={editFormData.isPublic}
//                     onChange={handleTogglePublic}
//                   />

//                   <label
//                     className="custom-toggle-label"
//                     htmlFor="custom-toggle-checkbox"
//                   >
//                     <span className="custom-toggle-switch"></span>
//                     <span className="toggle-text toggle-text-left">공개</span>
//                     <span className="toggle-text toggle-text-right">
//                       비공개
//                     </span>
//                   </label>
//                 </div>
//               </div>
//             </div>

//             {!editFormData.isPublic && (
//               <div className="form-group">
//                 <div>
//                   <label htmlFor="password">비밀번호 ㅣ</label>
//                 </div>
//                 <div>
//                   <Input
//                     $inputType="inquiry-form"
//                     type="password"
//                     id="password"
//                     name="password"
//                     value={editFormData.password}
//                     onChange={handleInputChange}
//                     required={!editFormData.isPublic}
//                     placeholder="비밀번호를 입력하세요."
//                     className="inquiry-pw"
//                   />
//                 </div>
//               </div>
//             )}

//             <Button $buttonType="c_i_Edit" type="submit">
//               수정 완료
//             </Button>
//             <Button
//               $buttonType="c_i_Edit"
//               onClick={(e) => {
//                 e.preventDefault();
//                 navigate(`/inquiry/${id}`);
//               }}
//             >
//               취소
//             </Button>
//           </form>
//         )}
//       </SubContentContainer>
//     </ContentContainer>
//   );
// };

// export default InquiryEdit;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import QuillEditor from "../ui/QuillEditor";
import { BsPaperclip } from "react-icons/bs";
import "../../styles/InquiryEdit.css";
import Button from "../ui/Button";
import Input from "../ui/Input";
import CombinedLoadingAndNoData from "../ui/StatusMessage";
import {
  ContentContainer,
  ContentTitle,
  SubContentContainer,
  HR,
} from "../../styles/CommonStyles";

const InquiryEdit = ({ onEditInquiry }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editFormData, setEditFormData] = useState({
    title: "",
    content: "",
    file: null,
    isPublic: true,
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const maxTitleLength = 50;
  const maxCharLimit = 1000;

  // 비밀번호 정규식: 숫자와 영문자 조합 4~8자, 공백 불허
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,8}$/;

  // 문의 수정 데이터 가져오기
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`http://localhost:8090/api/question/${id}`)
      .then((response) => {
        const inquiry = response.data;
        setEditFormData({
          title: inquiry.questionTitle,
          content: inquiry.questionContent,
          file: inquiry.questionImgPath || null,
          isPublic: inquiry.privateOption === 0,
          password: inquiry.privateQuestionPassword || "",
        });
        setCharCount(
          inquiry.questionContent.replace(/<\/?[^>]+(>|$)/g, "").length
        );
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching inquiry:", error);
        setIsLoading(false);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "title" && value.length > maxTitleLength) {
      alert(`제목은 최대 ${maxTitleLength}자까지 입력할 수 있습니다.`);
      return;
    }
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEditFormData((prev) => ({ ...prev, file }));
  };

  const handleRemoveFile = () => {
    axios
      .put(
        `http://localhost:8090/api/community/removeFile/${id}`,
        {},
        {
          withCredentials: true,
        }
      )
      .then(() => {
        setEditFormData((prev) => ({ ...prev, file: null }));
      })
      .catch((error) => {
        console.error("Error removing file:", error);
      });
  };

  const handleTogglePublic = () => {
    setEditFormData((prevState) => ({
      ...prevState,
      isPublic: !prevState.isPublic,
      password: !prevState.isPublic ? "" : prevState.password,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!editFormData.isPublic && !passwordRegex.test(editFormData.password)) {
      alert(
        "비밀번호는 4~8자 사이의 영문+숫자 조합이어야 하며 공백이 포함될 수 없습니다."
      );
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("questionTitle", editFormData.title);
    formData.append("questionContent", editFormData.content);
    formData.append("privateOption", editFormData.isPublic ? 0 : 1);

    if (editFormData.file) {
      formData.append("file", editFormData.file);
    }
    if (!editFormData.isPublic && editFormData.password) {
      formData.append("privateQuestionPassword", editFormData.password);
    }

    axios
      .put(`/api/question/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        onEditInquiry(id, formData);
        setIsLoading(false);
        navigate(`/inquiry/${id}`);
      })
      .catch((error) => {
        console.error("Error updating inquiry:", error);
        setIsLoading(false);
      });
  };

  return (
    <ContentContainer>
      <ContentTitle>문의 수정</ContentTitle>

      <SubContentContainer>
        <CombinedLoadingAndNoData loading={isLoading} />
        {!isLoading && (
          <form onSubmit={handleSave} className="post-form inquiry-edit">
            <div className="form-group">
              <label htmlFor="title">제목 ㅣ</label>
              <Input
                $inputType="inquiry-form"
                type="text"
                name="title"
                value={editFormData.title}
                onChange={handleInputChange}
                required
                placeholder="제목을 입력해 주세요."
                className="form-control"
              />
              <div className="char-counter">
                {editFormData.title.length}/{maxTitleLength}
              </div>
            </div>
            <HR />
            <div className="form-group">
              <label htmlFor="file-upload">
                파일 <BsPaperclip className="icon-right1" />
              </label>
              <div className="from-file">
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
                {editFormData.file && (
                  <div className="file-file">
                    {typeof editFormData.file === "string" ? (
                      <div>
                        이미 업로드된 파일: {editFormData.file.split("/").pop()}
                      </div>
                    ) : (
                      <p>선택된 파일: {editFormData.file.name}</p>
                    )}
                    <Button
                      type="button"
                      $buttonType="delete"
                      onClick={handleRemoveFile}
                    >
                      제거
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <HR />
            <div className="form-group textarea-group">
              <div>
                <label htmlFor="content">내용 ㅣ</label>
              </div>
              <QuillEditor
                value={editFormData.content}
                onChange={(content) => {
                  const textLength = content.replace(
                    /<\/?[^>]+(>|$)/g,
                    ""
                  ).length;
                  if (textLength <= maxCharLimit) {
                    setEditFormData((prev) => ({ ...prev, content }));
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
              <div>
                <div className="custom-toggle">
                  <input
                    type="checkbox"
                    id="custom-toggle-checkbox"
                    className="custom-toggle-input"
                    checked={editFormData.isPublic}
                    onChange={handleTogglePublic}
                  />

                  <label
                    className="custom-toggle-label"
                    htmlFor="custom-toggle-checkbox"
                  >
                    <span className="custom-toggle-switch"></span>
                    <span className="toggle-text toggle-text-left">공개</span>
                    <span className="toggle-text toggle-text-right">
                      비공개
                    </span>
                  </label>
                </div>
              </div>
            </div>
            {!editFormData.isPublic && (
              <div className="form-group">
                <label htmlFor="password" className="password-label">
                  비밀번호 ㅣ
                </label>
                <Input
                  $inputType="inquiry-form"
                  type="password"
                  id="password"
                  name="password"
                  value={editFormData.password}
                  onChange={handleInputChange}
                  required={!editFormData.isPublic}
                  placeholder="비밀번호를 입력하세요."
                  className="inquiry-pw"
                />
              </div>
            )}
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <Button $buttonType="c_i_Edit" type="submit">
                수정 완료
              </Button>
              <Button
                $buttonType="delete"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/inquiry/${id}`);
                }}
              >
                취소
              </Button>
            </div>{" "}
          </form>
        )}
      </SubContentContainer>
    </ContentContainer>
  );
};

export default InquiryEdit;
