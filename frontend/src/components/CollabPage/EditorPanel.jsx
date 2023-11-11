import {
  Box, IconButton, MenuItem, Paper, Select, Skeleton, Toolbar,
} from '@mui/material';
import React from 'react';
import dynamic from 'next/dynamic';
import { ExitToApp } from '@mui/icons-material';
import PropTypes from 'prop-types';
import SolidButton from '../commons/SolidButton';
import { Language } from '@/utils/constants';

const Editor = dynamic(() => import('./CollabEditor'), {
  ssr: false,
  loading: () => <Skeleton variant="rectangular" height="100vh" />,
});

const languageOptions = Object.values(Language);

export default function EditorPanel({
  value, onChange, language, handleLanguageSelect, openConfirmationModal,
}) {
  return (
    <Box
      component={Paper}
      sx={{
        display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflowY: 'hidden', minWidth: 120, bgcolor: (theme) => theme.palette.primary.light,
      }}
    >
      <Toolbar disableGutters variant="dense" sx={{ width: '100%', minWidth: 180, px: 2 }}>
        <Select
          value={language}
          onChange={handleLanguageSelect}
          size="small"
          variant="standard"
          sx={{
            color: (theme) => theme.palette.primary.contrastText,
            '& .MuiSvgIcon-root': {
              color: (theme) => theme.palette.primary.contrastText,
            },
            fontSize: 14,
            borderBottom: '1px solid',
          }}
        >
          {languageOptions.map((lang) => (
            <MenuItem key={lang} value={lang.toLowerCase()}>{lang}</MenuItem>
          ))}
        </Select>
        <SolidButton
          color="error"
          size="small"
          sx={{
            display: { xs: 'none', sm: 'block' }, ml: 'auto', fontSize: 12, fontWeight: 600, textTransform: 'none',
          }}
          onClick={openConfirmationModal}
        >
          End Session
        </SolidButton>
        <IconButton color="error" sx={{ display: { sm: 'none' }, ml: 'auto' }} onClick={openConfirmationModal}>
          <ExitToApp />
        </IconButton>
      </Toolbar>
      <Box sx={{ height: '100%', width: '100%' }}>
        <Editor value={value} onChange={onChange} language={language} />
      </Box>
    </Box>
  );
}

EditorPanel.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  handleLanguageSelect: PropTypes.func.isRequired,
  openConfirmationModal: PropTypes.func.isRequired,
};
