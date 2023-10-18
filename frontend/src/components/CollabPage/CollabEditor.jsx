import React from "react";
import Editor from "@monaco-editor/react";

export default function CollabEditor({ value, onChange }) {

  return (
    <Editor
      height="100vh"
      defaultLanguage="javascript"
      defaultValue="// Type your code here..."
      value={value}
      onChange={onChange}
    />
  );
};