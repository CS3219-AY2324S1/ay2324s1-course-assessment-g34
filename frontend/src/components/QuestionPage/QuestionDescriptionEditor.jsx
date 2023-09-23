import { CKEditor } from '@ckeditor/ckeditor5-react';
import React from 'react';
import { PropTypes } from 'prop-types';
/* eslint-disable import/no-unresolved */
// Temporary workaround for alias resolution issue
import Editor from '@/ckeditor5-custom-build/build/ckeditor';

const editorConfig = {
  toolbar: {
    items: [
      'undo', 'redo', '|', 'bold', 'underline', 'italic', 'subscript', 'superscript',
      '|', 'outdent', 'indent', 'bulletedList', 'numberedList', '|', 'imageUpload', 'imageInsert', 'insertTable',
      'code', 'codeBlock', '|', 'findAndReplace',
    ],
    shouldNotGroupWhenFull: true,
  },
};

// image upload not fully functional
export default function QuestionDescriptionEditor({
  id, description, editorRef, onChange,
}) {
  return (
    <CKEditor
      id={id}
      editor={Editor}
      data={description}
      onReady={(editor) => {
        editorRef.current = editor;
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data.trim());
      }}
      config={editorConfig}
    />
  );
}

QuestionDescriptionEditor.propTypes = {
  id: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  editorRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
  onChange: PropTypes.func.isRequired,
};
