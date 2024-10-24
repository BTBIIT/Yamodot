import React, { useEffect, useRef, useMemo, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import hljs from "highlight.js"; // highlight.js 임포트
import "highlight.js/styles/atom-one-dark.css"; // 스타일 임포트
import { ImageActions } from "@xeger/quill-image-actions"; // 이미지 액션 모듈
import "../../styles/QuillEditor.css";

// Quill에 ImageActions 모듈 등록
Quill.register("modules/imageActions", ImageActions);

// 사용할 Google Fonts 폰트들 정의 (2024-10-06 추가)
const Font = Quill.import("formats/font");
Font.whitelist = [
  "arial",
  "courier",
  //"comic-sans", // comic-sans 이름 수정
  //"georgia",
  //"impact",
  "times-new-roman",
  //"verdana",
  //"Roboto", // R 대문자 유지
  //"Lobster", // L 대문자 유지
  //"Open-Sans", // O 대문자 유지, Open Sans는 중간에 하이픈 없음
];
Quill.register(Font, true);

const QuillEditor = ({ value, onChange }) => {
  const quillRef = useRef(null);
  const [editorReady, setEditorReady] = useState(false);

  // 포커스 문제 해결
  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      quill.on("editor-change", () => {
        if (!document.activeElement.classList.contains("ql-editor")) {
          quill.focus();
        }
      });
    }
  }, []);

  useEffect(() => {
    // 하이라이팅 초기화
    hljs.configure({
      languages: ["javascript", "python", "ruby", "java"], // 사용할 언어 설정
    });
    setEditorReady(true);
  }, []);

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await axios.post(
            "http://localhost:8090/api/community/uploadImage",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          // 응답 경로에서 중복된 슬래시 제거 10-13
          let imageUrl = response.data.trim();
          console.log("Received Image URL (Before):", imageUrl);

          // 경로에서 중복된 '/uploads/' 제거 10-13
          imageUrl = imageUrl.replace(/(\/uploads\/)+/, "/uploads/");
          console.log("Cleaned Image URL:", imageUrl);

          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();

          if (range) {
            // 중복된 /uploads 방지를 위해 정확한 경로만 삽입
            const cleanedUrl = imageUrl.replace("//uploads/", "/uploads/");
            quill.insertEmbed(range.index, "image", cleanedUrl);
            quill.setSelection(range.index + 1);
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    };
  };

  // useMemo로 모듈 캐싱 및 이미지 액션 추가
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ font: Font.whitelist }, { size: [] }], // 폰트 목록을 툴바에 전달
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ script: "sub" }, { script: "super" }],
          [{ header: "1" }, { header: "2" }, "blockquote", "code-block"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          [{ direction: "rtl" }, { align: [] }],
          ["link", "image", "video", "formula"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      imageActions: {}, // quill-image-actions 모듈 사용
      syntax: {
        highlight: (text) => hljs.highlightAuto(text).value, // highlight.js 연동
      },
    }),
    []
  );

  const formats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "header",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "indent",
    "direction",
    "align",
    "link",
    "image",
    "video",
    "formula",
    "height", // 이미지 높이 조절
    "width", // 이미지 너비 조절
  ];

  return (
    <div className="quill-editor-container">
      {editorReady && (
        <ReactQuill
          ref={quillRef}
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder="내용을 입력하세요..."
          theme="snow"
        />
      )}
    </div>
  );
};

export default QuillEditor;
