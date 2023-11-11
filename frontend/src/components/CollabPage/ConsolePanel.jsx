import { ExpandLess, ExpandMore, PlayArrowRounded } from '@mui/icons-material';
import {
  IconButton, Paper, Skeleton, Stack, Toolbar, Typography,
} from '@mui/material';
import axios from 'axios';
import { EXECUTE_CODE_SVC_URI } from '@/config/uris';
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import stripAnsi from 'strip-ansi';
import { Language } from '@/utils/constants';
import SolidButton from '../commons/SolidButton';

const executableLanguages = [Language.PYTHON, Language.JAVASCRIPT].map((lang) => lang.toLowerCase());

function OutputContent({ header, content, isError }) {
  const getColor = () => (theme) => (isError ? theme.palette.error.main : theme.palette.primary.contrastText);

  return (
    <>
      <Typography sx={{ fontWeight: 600, color: getColor() }}>
        {header}
      </Typography>
      <Paper
        elevation={0}
        sx={{
          p: 1,
          width: '100%',
          overflowY: 'scroll',
          bgcolor: (theme) => theme.palette.primary.light,
          color: getColor(),
          whiteSpace: 'pre-line',
        }}
      >
        {content}
      </Paper>
    </>
  );
}

function ConsoleOutput({
  result, error, isExecuting, isExecutableLanguage,
}) {
  const isIdle = !(result || error || isExecuting);

  return (
    <Stack
      sx={{
        gap: 2,
        py: 1,
        px: 2,
        overflowY: 'hidden',
        height: '100%',
        fontSize: 13,
        color: (theme) => theme.palette.primary.contrastText,
        bgcolor: (theme) => theme.palette.primary.main,
      }}
    >
      {isExecuting && (
        <>
          <Skeleton
            variant="text"
            sx={{
              borderRadius: 1,
              fontSize: 25,
              width: 150,
              bgcolor: (theme) => theme.palette.primary.light,
            }}
          />
          <Skeleton
            variant="rectangle"
            height="100%"
            width="100%"
            sx={{ borderRadius: 1, bgcolor: (theme) => theme.palette.primary.light }}
          />
        </>
      )}
      {isIdle && (
        <Stack
          sx={{
            p: 1,
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            color: (theme) => theme.palette.primary.contrastText,
          }}
        >
          {isExecutableLanguage
            ? 'You must run your code first'
            : 'Code execution for this language is not supported'}
        </Stack>
      )}
      { result && <OutputContent header="Result" content={result} /> }
      {error && <OutputContent header="Error" content={error} isError /> }
    </Stack>
  );
}

export default function ConsolePanel({
  code, language, isMinimized, setIsMinimized,
}) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { getAccessToken } = useAuthContext();
  const isExecutableLanguage = executableLanguages.includes(language);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleExecuteCode = async () => {
    setIsMinimized(false);
    setIsExecuting(true);
    setError(null);
    setResult(null);
    try {
      const token = await getAccessToken();

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const codeData = { code, language };

      const response = await axios.post(EXECUTE_CODE_SVC_URI, codeData, config);
      const { output, exitCode } = response.data;
      const strippedOutput = stripAnsi(output);

      setIsExecuting(false);

      if (exitCode === 0) {
        setResult(strippedOutput);
      } else if (exitCode === 1) {
        setError(strippedOutput);
      }
    } catch (err) {
      setIsExecuting(false);
      console.error(err);
      setError(err.error || err.message);
    }
  };

  useEffect(() => {
    if (!isExecuting) {
      setError(null);
      setResult(null);
    }
  }, [language]);

  return (
    <Paper
      sx={{
        height: isMinimized ? 'auto' : '40%',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'hidden',
        bgcolor: (theme) => theme.palette.primary.light,
      }}
    >
      <Toolbar variant="dense" disableGutters sx={{ px: 2 }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: 14,
            color: (theme) => theme.palette.primary.contrastText,
          }}
        >
          Console
        </Typography>
        <IconButton
          size="small"
          onClick={toggleMinimize}
          sx={{ color: (theme) => theme.palette.primary.contrastText }}
        >
          {isMinimized ? <ExpandLess /> : <ExpandMore /> }
        </IconButton>
        <SolidButton
          variant="contained"
          color="success"
          size="small"
          sx={{ ml: 'auto', fontSize: 12, textTransform: 'none' }}
          onClick={handleExecuteCode}
          disabled={isExecuting || !isExecutableLanguage}
          endIcon={<PlayArrowRounded />}
        >
          Run
        </SolidButton>
      </Toolbar>
      {!isMinimized
        && (
        <ConsoleOutput
          result={result}
          error={error}
          isExecuting={isExecuting}
          isExecutableLanguage={isExecutableLanguage}
        />
        )}
    </Paper>
  );
}
