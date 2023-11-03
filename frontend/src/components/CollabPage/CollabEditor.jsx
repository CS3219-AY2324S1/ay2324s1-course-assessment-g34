import React from 'react';
import Editor from '@monaco-editor/react';
import { Skeleton } from '@mui/material';

export default function CollabEditor({ value, onChange, language }) {
  const options = {
    fontSize: 14,
    minimap: { enabled: false },
    scrollBeyondLastLine: 'false',
    padding: {
      top: 8,
      bottom: 8,
    },

  };

  return (
    <Editor
      width="100%"
      height="100%"
      defaultLanguage="javascript"
      defaultValue="// Type your code here..."
      value={value}
      onChange={onChange}
      language={language}
      loading={<Skeleton variant="rectangular" height="100%" />}
      options={options}
    />
  );
}
