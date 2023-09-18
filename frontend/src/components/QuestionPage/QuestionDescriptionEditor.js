import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "../../../ckeditor5/build/ckeditor";
import React from "react";

const editorConfig = {
  toolbar: {
    items: [
      'undo', 'redo', '|', 'bold', 'underline', 'italic', 'subscript', 'superscript',
      '|', 'outdent', 'indent', 'bulletedList', 'numberedList', '|', 'imageUpload', 'imageInsert', 'insertTable',
      'code', 'codeBlock', '|', 'findAndReplace'
    ],
    shouldNotGroupWhenFull: true
  }
};

// image upload not fully functional
const QuestionDescriptionEditor = ({ id, data, editorRef, onChange }) => {

  return (
    <CKEditor
      id={id}
      editor={ Editor }
      data={data}
      onReady={ editor => {
        editorRef.current = editor;
        console.log( 'Editor is ready to use!', editor );
      } }
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data.trim());
      }}
      config={editorConfig}
    />
  );
}

export default QuestionDescriptionEditor;