import React, { useEffect, useState } from 'react';
import { Box, Snackbar } from '@mui/material';
import ShareDBClient from 'sharedb-client';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { COLLAB_SVC_URI } from '@/config/uris';
import QuestionPanel from '@/components/CollabPage/QuestionPanel';
import EditorPanel from '@/components/CollabPage/EditorPanel';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { resetMatchedUser, resetSession, selectMatchedUsername, selectSessionId, setMatchedUser, setSession } from '@/features/match/matchSlice';
import { useRouter } from 'next/router';
import { selectDifficulty, selectIsOngoing, setDifficulty, setIsOnGoing, setQuestionId } from '@/features/session/sessionSlice';
import { handleSessionEvents } from '@/utils/eventHandlers';
import { fetchSessionQuestion, joinSession } from '@/utils/eventEmitters';
import LeaveSessionModal from '@/components/CollabPage/LeaveSessionModal';
import ConfirmEndModal from '@/components/CollabPage/ConfirmEndModal';

const connectShareDBSocket = () => {
  const shareDBSocket = new ReconnectingWebSocket(COLLAB_SVC_URI);
  const connection = new ShareDBClient.Connection(shareDBSocket);
  return connection;
};

const connectSessionSocket = () => {
  const socket = io(COLLAB_SVC_URI, {
    path: "/api/collab-service/socket.io" 
  });

  return socket;
}

export default function CollabPage() {
  const router = useRouter();
  const sessionId = useSelector(selectSessionId);
  const matchedUser = useSelector(selectMatchedUsername);
  const difficulty = useSelector(selectDifficulty);
  const isOnGoing = useSelector(selectIsOngoing); 
  const dispatch = useDispatch();
  const [content, setContent] = useState('');
  const [collabDoc, setCollabDoc] = useState(null);
  const [sessionSocket, setSessionSocket] = useState(null);
  const [language, setLanguage] = useState('javascript');
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const handleEndSession = () => {
    sessionSocket.disconnect();
    dispatch(setIsOnGoing(false));
    dispatch(resetMatchedUser());
    dispatch(resetSession());
    dispatch(setQuestionId(null));
    router.push("/");
  }

  const openSnackbar = () => {
    setIsSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setIsSnackbarOpen(false);
  }

  // TODO: redirect/show 404 not found when no session id is present
  useEffect(() => {
    console.log("session id: ", sessionId)
  
    if (!sessionId) {
      setTimeout(() => router.push("/"), 1000);
    } else {
      dispatch(setSession(sessionId));
    }

  }, [sessionId]);

  useEffect(() => {
    if (matchedUser) {
      dispatch(setMatchedUser(matchedUser));
    }
  }, [matchedUser]);

  useEffect(() => {
    if (!sessionSocket) {
      console.log("connecting to collab socket...");
      const socket = connectSessionSocket();
      setSessionSocket(socket);
      handleSessionEvents(socket, dispatch);
      joinSession(socket, sessionId);
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
      dispatch(setDifficulty(""));
      dispatch(setQuestionId(null));
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      const doc = connectShareDBSocket().get('collab-docs', sessionId);
      console.log(`connect to doc with id ${sessionId}`);
      setCollabDoc(doc);

      doc.subscribe((err) => {
        if (err) {
          console.log("Error on subscribe")
          console.error(err);
        } else {
          console.log("doc type: ", doc.type);
          if (!doc.type) {
            doc.create({ content: '', language: 'javascript' });
            console.log("DOC CREATED");
          }
          console.log('subscribe and set data');
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
  }, []);

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
  }

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
        display: 'flex', flexDirection: 'row', width: '100%', height: '100%', p: 1, gap: 1,
      }}
      >
        <Box sx={{ minWidth: 290, width: 750 }}>
          <QuestionPanel
            fetchSessionQuestion={handleFetchQuestion}
            openSnackbar={openSnackbar}
          />
        </Box>
        <EditorPanel
          value={content}
          onChange={handleInputChange}
          language={language}
          handleLanguageSelect={handleLanguageSelect}
          openConfirmationModal={() => setIsConfirmationModalOpen(true)}
        />
      </Box>
      <LeaveSessionModal handleEndSession={handleEndSession} />
      <ConfirmEndModal isOpen={isConfirmationModalOpen} setIsOpen={setIsConfirmationModalOpen} handleEndSession={handleEndSession} />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isSnackbarOpen}
        onClose={closeSnackbar}
        message="No questions found."
        key={'top' + 'center'}
      />
    </Box>
  );
}
