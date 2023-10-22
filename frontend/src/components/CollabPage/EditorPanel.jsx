import { Box, IconButton, MenuItem, Paper, Select, Skeleton, Toolbar } from "@mui/material";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import SolidButton from "../SolidButton";
import { ExitToApp } from "@mui/icons-material";

const Editor = dynamic(() => import('./CollabEditor'), {
  ssr: false,
  loading: () => <Skeleton variant="rectangular" height="100vh" />,
})

const languageOptions = [
  { label: 'C++', value: 'cpp' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' }
];

export default function EditorPanel({ value, onChange, language, handleLanguageSelect }) {
  
  return (
    <Box component={Paper} sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflowY: 'hidden', minWidth: 120, bgcolor: (theme) => theme.palette.primary.main }}>
      <Toolbar disableGutters variant="dense" sx={{ width: '100%', minWidth: 180, px: 2 }}>
        <Select
          value={language}
          onChange={handleLanguageSelect}
          size="small"
          variant="standard"
          sx={{ 
            color: (theme) => theme.palette.primary.contrastText,
            "& .MuiSvgIcon-root": {
              color: (theme) => theme.palette.primary.contrastText,
            },
            fontSize: 14,
            borderBottom: '1px solid'
          }}
        >
          {languageOptions.map((lang) => (
            <MenuItem key={lang.value} value={lang.value}>{lang.label}</MenuItem>
          ))}
        </Select>
        <SolidButton variant="contained" color="error" size="small" sx={{ display: { xs: 'none', sm: 'block' }, ml: 'auto', fontSize: 12, fontWeight: 600, textTransform: 'none' }}>
          End Session
        </SolidButton>
        <IconButton color="error" sx={{ display: { sm: 'none' }, ml: 'auto'}}>
          <ExitToApp />
        </IconButton>
      </Toolbar>
      <Box sx={{ height: '100%', width: '100%' }}>
        <Editor value={value} onChange={onChange} language={language} />
      </Box>
    </Box>
  );
}