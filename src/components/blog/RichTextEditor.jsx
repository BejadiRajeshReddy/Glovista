// import React, { useState, useEffect } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const RichTextEditor = ({ initialContent = "", onChange, images = [] }) => {
//   const [content, setContent] = useState(initialContent);

//   useEffect(() => {
//     setContent(initialContent);
//   }, [initialContent]);

//   const handleChange = (value) => {
//     setContent(value);
//     onChange(value);
//   };

//   const modules = {
//     toolbar: [
//       [{ header: [1, 2, false] }],
//       ["bold", "italic", "underline", "strike"],
//       [{ list: "ordered" }, { list: "bullet" }],
//       [{ align: [] }],
//       ["link", "image"],
//       ["clean"],
//     ],
//   };

//   const formats = [
//     "header",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "list",
//     "bullet",
//     "align",
//     "link",
//     "image",
//   ];

//   return (
//     <ReactQuill
//       value={content}
//       onChange={handleChange}
//       modules={modules}
//       formats={formats}
//       className="bg-white border border-gray-300 rounded-md"
//     />
//   );
// };

// export default RichTextEditor;
