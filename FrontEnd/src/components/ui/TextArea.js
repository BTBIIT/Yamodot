import React from "react";

const TextArea = ({ value, onChange, placeholder, required, className }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    className={className} //10-16 추가
  />
);

export default TextArea;
