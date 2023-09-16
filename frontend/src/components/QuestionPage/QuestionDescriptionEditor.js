import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "../../../ckeditor5/build/ckeditor";
import React from "react";

const editorConfig = {
  toolbar: [ 'undo', 'redo', '|', 'bold', 'underline', 'italic', 'subscript', 'superscript', 'link',
    '|', 'outdent', 'indent', 'bulletedList', 'numberedList', '|', 'imageUpload', 'insertTable',
    'code', 'codeBlock', 'sourceEditing', '|', 'findAndReplace'
  ]
}

const QuestionDescriptionEditor = ({ editorRef, value, onChange }) => {
  return (
    <CKEditor
      editor={ Editor }
      data={value}
      onReady={ editor => {
        editorRef.current = editor;
        // You can store the "editor" and use when it is needed.
        console.log( 'Editor is ready to use!', editor );
      } }
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
      onBlur={ ( event, editor ) => {
        console.log( 'Blur.', editor );
      }}
      onFocus={ ( event, editor ) => {
          console.log( 'Focus.', editor );
      }}
      config={editorConfig}
    />
  );
}

export default QuestionDescriptionEditor;