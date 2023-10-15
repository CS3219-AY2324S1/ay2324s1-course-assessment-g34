import Layout from '@/components/Layout';
import MatchModal from '@/components/MatchPage/MatchModal';
import MatchingTimer from '@/components/MatchPage/MatchingTimer';
import ComplexitySelector from '@/components/QuestionPage/ComplexitySelector';
import RouteGuard from '@/components/RouteGuard';
import SolidButton from '@/components/SolidButton';
import { MATCHING_SVC_URL } from '@/config/uris';
import { useAuthContext } from '@/contexts/AuthContext';
import { MatchEvent, Role } from '@/utils/constants';
import { cancelMatch, disconnectMatch, findMatch } from '@/utils/eventEmitters';
import { getUsername } from '@/utils/socketUtils';
import {
  Box, Container, MenuItem, TextField, Typography,
} from '@mui/material';
import React, { use, useState } from 'react';
import { io } from 'socket.io-client';

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

// TODO: disable complexity & proficiency selectors when finding
export default function MatchPage() {
  const [isFinding, setIsFinding] = useState(false);
  const [isTimeoutComplete, setIsTimeoutComplete] = useState(false);
  const [isMatchFound, setIsMatchFound] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [matchSocket, setMatchSocket] = useState(null);
  const [matchCriteria, setMatchCriteria] = useState({
    complexity: 'Easy',
    proficiency: 'Beginner',
  });
  const { user } = useAuthContext();

  const connect = () => {
    const socket = io(MATCHING_SVC_URL);
    // TODO: add event to indicate waiting status?
    socket.on(MatchEvent.TIMEOUT, () => {
      console.log(`User ${user.username} has timed out from matching`);
    });

    socket.on(MatchEvent.CANCELLED, (msg) => {
      console.log(`User ${user.username} cancelled match finding`);
      // reset timer
      // TODO: create popup to inform user if match declined by other user
      setIsMatchFound(false);
      setIsFinding(false);
      disconnectMatch(socket);
      setMatchSocket(null);
    });

    socket.on(MatchEvent.FOUND, (msg) => {
      const match = getUsername(msg);
      setIsFinding(false);
      setMatchedUser(match);
      setIsMatchFound(true);
      console.log(`Match found with user: ${match}`);
    });

    return socket;
  };

  const handleTimeout = () => {
    setIsTimeoutComplete(true);
    setTimeout(() => {
      setIsFinding(false);
      disconnectMatch(matchSocket);
      setMatchSocket(null);
      setIsTimeoutComplete(false);
    }, 2000);
  };

  const handleMatching = (e) => {
    e.preventDefault();

    // socket logic here
    const socket = connect();

    setIsFinding(true);
    // TODO: include access token to handle auth
    findMatch(socket, user.username, matchCriteria.complexity, matchCriteria.proficiency);
    setMatchSocket(socket);
  };

  const handleCancelSearch = (e) => {
    e.preventDefault();
    cancelMatch(matchSocket);
  };

  // this does not cancel the timeout
  const handleDecline = () => {
    setMatchedUser(null);
    setIsMatchFound(false);
    disconnectMatch(matchSocket);
    setMatchSocket(null);
  };

  // this does not cancel the timeout
  const handleAccept = () => {
    // TODO: to handle creating of collab session here
    setMatchedUser(null);
    setIsMatchFound(false);
    disconnectMatch(matchSocket);
    setMatchSocket(null);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setMatchCriteria({
      ...matchCriteria,
      [e.target.name]: value,
    });
  };

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
                <ComplexitySelector
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
              {isFinding && <MatchingTimer handleTimeout={handleTimeout}/>}
              <Box sx={{ display: 'flex', m: 1, justifyContent: 'center' }}>
                {isFinding
                  ? (
                    <SolidButton
                      variant="contained"
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
                      variant="contained"
                      size="medium"
                      color="secondary"
                      type="submit"
                      sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                      Find Match
                    </SolidButton>
                  )}
              </Box>
              <Box sx={{ display: 'flex', m: 1, justifyContent: 'center' }}>
                <SolidButton
                  variant="contained"
                  size="medium"
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                  onClick={() => setIsMatchFound(true)}
                >
                  Open Modal
                </SolidButton>
              </Box>
            </Box>
          </Box>
          <MatchModal
            isOpen={isMatchFound}
            handleDecline={handleDecline}
            handleAccept={handleAccept}
            matchedUser={matchedUser}
          />
        </Container>
      </Layout>
    </RouteGuard>
  );
}
