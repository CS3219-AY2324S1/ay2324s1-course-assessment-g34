import React, { useEffect, useState } from 'react';
import { Alert, Box, Snackbar, Stack } from '@mui/material';
import ShareDBClient from 'sharedb-client';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { COLLAB_SVC_URI, VIDEO_SVC_URI } from '@/config/uris';
import QuestionPanel from '@/components/CollabPage/QuestionPanel';
import EditorPanel from '@/components/CollabPage/EditorPanel';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetMatchedUser, resetSession, selectMatchedUsername, selectSessionId, setMatchedUser,
  setSession,
} from '@/features/match/matchSlice';
import { useRouter } from 'next/router';
import {
  selectDifficulty, selectIsOngoing, setDifficulty, setIsOnGoing, setQuestionId,
} from '@/features/session/sessionSlice';
import { handleSessionEvents, handleVideoEvents } from '@/utils/eventHandlers';
import { endCall, fetchSessionQuestion, joinSession, joinVideoRoom } from '@/utils/eventEmitters';
import LeaveSessionModal from '@/components/CollabPage/LeaveSessionModal';
import ConfirmEndModal from '@/components/CollabPage/ConfirmEndModal';
import VideoChatPanel from './VideoChatPanel';
import ConsolePanel from './ConsolePanel';
import { useAuthContext } from '@/contexts/AuthContext';

const connectShareDBSocket = () => {
  const shareDBSocket = new ReconnectingWebSocket(COLLAB_SVC_URI);
  const connection = new ShareDBClient.Connection(shareDBSocket);
  return connection;
};

const connectSessionSocket = () => {
  const socket = io(COLLAB_SVC_URI, {
    path: '/api/collab-service/socket.io',
  });

  return socket;
};

const connectVideoSocket = () => {
  const socket = io(VIDEO_SVC_URI, {
    path: '/api/video-service/socket.io'
  });

  return socket;
};

export default function CollabPage() {
  const router = useRouter();
  const [activeCall, setActiveCall] = useState(null);
  const sessionId = useSelector(selectSessionId);
  const matchedUser = useSelector(selectMatchedUsername);
  const difficulty = useSelector(selectDifficulty);
  const isOnGoing = useSelector(selectIsOngoing);
  const dispatch = useDispatch();
  const [content, setContent] = useState('');
  const [collabDoc, setCollabDoc] = useState(null);
  const [sessionSocket, setSessionSocket] = useState(null);
  const [videoSocket, setVideoSocket] = useState(null);
  const [language, setLanguage] = useState('javascript');
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [isConsoleMinimized, setIsConsoleMinimized] = useState(false);
  const { user } = useAuthContext();

  const handleEndSession = () => {
    if (activeCall) {
      activeCall.close();
      endCall(videoSocket, sessionId);
    }
    videoSocket.disconnect();
    sessionSocket.disconnect();
    dispatch(setIsOnGoing(false));
    dispatch(resetMatchedUser());
    dispatch(resetSession());
    dispatch(setQuestionId(null));
    router.push('/');
  };

  const openSnackbar = () => {
    setIsSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setIsSnackbarOpen(false);
  };

  useEffect(() => {
    if (!sessionId) {
      setTimeout(() => router.push('/'), 1000);
    } else {
      dispatch(setSession(sessionId));
    }
  }, [sessionId, dispatch, router]);

  useEffect(() => {
    if (matchedUser) {
      dispatch(setMatchedUser(matchedUser));
    }
  }, [matchedUser, dispatch]);

  useEffect(() => {
    if (!sessionSocket) {
      const socket = connectSessionSocket();
      setSessionSocket(socket);
      handleSessionEvents(socket, dispatch);
      joinSession(socket, sessionId);
      return () => {
        socket.disconnect();
        setSessionSocket(null)
      }
    }
  }, []);

  useEffect(() => {
    if (!videoSocket) {
      const socket = connectVideoSocket();
      setVideoSocket(socket);
      handleVideoEvents(socket, dispatch);
      joinVideoRoom(socket, sessionId, user.username);
      
      return () => {
        socket.disconnect();
        setVideoSocket(null)
      }
    }
  }, []);

  useEffect(() => {
    if (difficulty) {
      dispatch(setDifficulty(difficulty));
    }
  }, [difficulty]);

  useEffect(() => {
    dispatch(setIsOnGoing(isOnGoing));
  }, [isOnGoing]);

  useEffect(() => {
    return () => {
      dispatch(setIsOnGoing(false));
      dispatch(resetMatchedUser());
      dispatch(resetSession());
      dispatch(setDifficulty(''));
      dispatch(setQuestionId(null));
      if (activeCall) {
        activeCall.close();
        endCall(videoSocket, sessionId);
      }
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      const doc = connectShareDBSocket().get('collab-docs', sessionId);
      setCollabDoc(doc);

      doc.subscribe((err) => {
        if (err) {
          console.log('Error on subscribe');
          console.error(err);
        } else {
          console.log('doc type: ', doc.type);
          if (!doc.type) {
            doc.create({ content: '', language: 'javascript' });
          }
          setContent(doc.data.content);
          setLanguage(doc.data.language);
        }
      });

      doc.on('op', (op, source) => {
        if (source !== doc) {
          setContent(doc.data.content);
          setLanguage(doc.data.language);
        }
      });

      return () => {
        doc.unsubscribe((err) => {
          if (err) {
            console.error('An error occurred when unsubscribing: ', err);
          } else {
            console.log('Unsubscribed successfully');
          }
        });
      };
    }
    return () => {};
  }, [sessionId]);

  const handleInputChange = (value, e) => {
    const newContent = value;
    collabDoc.submitOp([{ p: ['content'], oi: newContent }]);
    setContent(collabDoc.data.content);
  };

  const handleLanguageSelect = (e) => {
    const newLanguage = e.target.value;
    collabDoc.submitOp([{ p: ['language'], oi: newLanguage }]);
    setLanguage(collabDoc.data.language);
  };

  const handleFetchQuestion = () => {
    fetchSessionQuestion(sessionSocket, sessionId, difficulty);
  };

  // 4 main components: *question, *editor, program output, video chat
  // all components should be resizable
  // video window should be draggable
  return (
    <Box
      sx={{
        m: 0, width: '100vw', height: '100vh', bgcolor: (theme) => theme.palette.primary.dark,
      }}
    >
      <Box sx={{
        position: 'relative', display: 'flex', flexDirection: 'row', width: '100%', height: '100%', p: 1, gap: 1,
      }}
      >
        <Stack rowGap={1} sx={{ minWidth: 290, width: 750 }}>
          <QuestionPanel
            fetchSessionQuestion={handleFetchQuestion}
            openSnackbar={openSnackbar}
            isMinimized={isConsoleMinimized}
          />
          <ConsolePanel isMinimized={isConsoleMinimized} setIsMinimized={setIsConsoleMinimized} />
        </Stack>
        <EditorPanel
          value={content}
          onChange={handleInputChange}
          language={language}
          handleLanguageSelect={handleLanguageSelect}
          openConfirmationModal={() => setIsConfirmationModalOpen(true)}
        />
        <VideoChatPanel
          user={user}
          matchedUser={matchedUser}
          videoSocket={videoSocket}
          activeCall={activeCall}
          setActiveCall={setActiveCall}
        />
      </Box>
      <LeaveSessionModal handleEndSession={handleEndSession} />
      <ConfirmEndModal
        isOpen={isConfirmationModalOpen}
        setIsOpen={setIsConfirmationModalOpen}
        handleEndSession={handleEndSession}
      />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isSnackbarOpen}
        key="topcenter"
        autoHideDuration={5000}
      >
        <Alert severity="error" variant="filled" elevation={6} onClose={closeSnackbar}>
          No questions found.
        </Alert>
      </Snackbar>
    </Box>
  );
}
