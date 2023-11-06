import Layout from '@/components/Layout';
import MatchModal from '@/components/MatchPage/MatchModal';
import MatchingTimer from '@/components/MatchPage/MatchingTimer';
import DifficultySelector from '@/components/QuestionPage/DifficultySelector';
import RouteGuard from '@/components/RouteGuard';
import SolidButton from '@/components/SolidButton';
import { MATCHING_SVC_URI } from '@/config/uris';
import { useAuthContext } from '@/contexts/AuthContext';
import { MatchEvent, Role } from '@/utils/constants';
import { cancelMatch, findMatch } from '@/utils/eventEmitters';
import { getQuestionId, getSessionId, getUsername } from '@/utils/socketUtils';
import {
  Box, Container, MenuItem, TextField, Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectMatchedUsername, selectSessionId, setMatchedUser, setSession,
} from '@/features/match/matchSlice';
import { useRouter } from 'next/router';
import {
  selectIsOngoing, setDifficulty, setIsOnGoing, setQuestionId,
} from '@/features/session/sessionSlice';

const proficiencies = [
  {
    value: 'Beginner',
    label: 'Beginner',
  },
  {
    value: 'Intermediate',
    label: 'Intermediate',
  },
  {
    value: 'Advanced',
    label: 'Advanced',
  },
];

export default function MatchPage() {
  const router = useRouter();
  const sessionId = useSelector(selectSessionId);
  const isCollabOngoing = useSelector(selectIsOngoing);
  const dispatch = useDispatch();
  const [isFinding, setIsFinding] = useState(false);
  const [isTimeoutComplete, setIsTimeoutComplete] = useState(false);
  const [isMatchFound, setIsMatchFound] = useState(false);
  const matchedUser = useSelector(selectMatchedUsername);
  const [matchSocket, setMatchSocket] = useState(null);
  const [matchCriteria, setMatchCriteria] = useState({
    difficulty: 'Easy',
    proficiency: 'Beginner',
  });
  const { user } = useAuthContext();

  const connect = () => {
    const socket = io(MATCHING_SVC_URI, {
      path: '/api/matching-service/socket.io',
    });

    socket.on(MatchEvent.TIMEOUT, () => {
      socket.disconnect();
      setMatchSocket(null);
    });

    socket.on(MatchEvent.FOUND, (msg) => {
      const match = getUsername(msg);
      setIsFinding(false);
      dispatch(setMatchedUser(match));
      setIsMatchFound(true);
      dispatch(setSession(getSessionId(msg)));
      dispatch(setDifficulty(matchCriteria.difficulty));
      dispatch(setIsOnGoing(true));
      dispatch(setQuestionId(getQuestionId(msg)));
    });

    return socket;
  };

  const handleTimeout = () => {
    setIsTimeoutComplete(true);
    setTimeout(() => {
      setIsFinding(false);
      setIsTimeoutComplete(false);
    }, 2000);
  };

  const handleMatching = (e) => {
    e.preventDefault();

    const socket = connect();

    setIsFinding(true);
    // TODO: include access token to handle auth
    findMatch(socket, user.username, matchCriteria.difficulty, matchCriteria.proficiency);
    setMatchSocket(socket);
  };

  const handleCancelSearch = (e) => {
    e.preventDefault();
    cancelMatch(matchSocket);
    setIsFinding(false);
    matchSocket.disconnect();
    setMatchSocket(null);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setMatchCriteria({
      ...matchCriteria,
      [e.target.name]: value,
    });
  };

  useEffect(() => {
    if (sessionId && isCollabOngoing) {
      setTimeout(() => router.push('/collab'), 2000);
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [sessionId, isCollabOngoing]);

  return (
    <RouteGuard allowedRoles={[Role.USER, Role.ADMIN]}>
      <Layout>
        <Container
          maxWidth="xl"
          sx={{
            height: '100vh', my: 2, display: 'flex', justifyContent: 'center',
          }}
        >
          <Box>
            <Typography
              variant="h5"
              noWrap
              component="h5"
              color="primary"
              sx={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '30px',
              }}
            >
              Match Finder
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleMatching}
              sx={{
                display: 'flex', flexDirection: 'column', m: 2, gap: 3, justifyContent: 'center',
              }}
            >
              <Box sx={{
                display: 'flex', m: 1, gap: 3, flexWrap: 'wrap', justifyContent: 'center',
              }}
              >
                <DifficultySelector
                  required
                  size="small"
                  sx={{ width: '20ch' }}
                  variant="standard"
                  onChange={(e) => handleChange(e)}
                  disabled={isFinding}
                />
                <TextField
                  required
                  size="small"
                  sx={{ width: '20ch' }}
                  variant="standard"
                  select
                  id="proficiency"
                  name="proficiency"
                  label="Proficiency"
                  defaultValue="Beginner"
                  onChange={(e) => handleChange(e)}
                  disabled={isFinding}
                >
                  {proficiencies.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              {isFinding
                && (
                <MatchingTimer
                  handleTimeout={handleTimeout}
                  isTimeoutComplete={isTimeoutComplete}
                />
                )}
              <Box sx={{ display: 'flex', m: 1, justifyContent: 'center' }}>
                {isFinding
                  ? (
                    <SolidButton
                      size="medium"
                      color="secondary"
                      type="button"
                      sx={{ textTransform: 'none', fontWeight: 600 }}
                      onClick={(e) => handleCancelSearch(e)}
                      disabled={isTimeoutComplete}
                    >
                      Cancel Search
                    </SolidButton>
                  )
                  : (
                    <SolidButton
                      size="medium"
                      color="secondary"
                      type="submit"
                      sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                      Find Match
                    </SolidButton>
                  )}
              </Box>
            </Box>
          </Box>
          <MatchModal
            isOpen={isMatchFound}
            matchedUser={matchedUser}
          />
        </Container>
      </Layout>
    </RouteGuard>
  );
}
