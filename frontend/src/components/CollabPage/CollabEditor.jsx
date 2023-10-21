import React from "react";
import Editor from "@monaco-editor/react";
import { Skeleton } from "@mui/material";

export default function CollabEditor({ value, onChange }) {

  return (
    <Editor
      width="100%"
      defaultLanguage="javascript"
      defaultValue="// Type your code here..."
      value={value}
      onChange={onChange}
      loading={<Skeleton variant="rectangular" height="100%" />}
    />
  );
};