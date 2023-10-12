import Layout from "@/components/Layout";
import MatchModal from "@/components/MatchPage/MatchModal";
import ComplexitySelector from "@/components/QuestionPage/ComplexitySelector";
import SolidButton from "@/components/SolidButton";
import { MATCHING_SVC_URL } from "@/config/uris";
import { useAuthContext } from "@/contexts/AuthContext";
import { MatchEvent } from "@/utils/constants";
import { cancelMatch, disconnect, findMatch } from "@/utils/eventEmitters";
import { getUsername } from "@/utils/socketUtils";
import { Box, Container, LinearProgress, MenuItem, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { io } from "socket.io-client";

const proficiencies = [
  {
    value: "Beginner",
    label: "Beginner",
  },
  {
    value: "Intermediate",
    label: "Intermediate",
  },
  {
    value: "Advanced",
    label: "Advanced",
  },
];

// TODO: disable complexity & proficiency selectors when finding
export default function MatchPage() {
  const [isFinding, setIsFinding] = useState(false);
  const [isMatchFound, setIsMatchFound] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [matchSocket, setMatchSocket] = useState(null);
  const [matchCriteria, setMatchCriteria] = useState({
    complexity: "Easy",
    proficiency: "Beginner",
  });
  const { user } = useAuthContext();

  const connect = () => {
    const socket = io(MATCHING_SVC_URL);
    // TODO: add event to indicate waiting status?
    socket.on(MatchEvent.TIMEOUT, (msg) => {
      console.log(`User ${user.username} has timed out from matching`);
      setIsFinding(false);
      disconnect(socket, user.username);
    });

    socket.on(MatchEvent.CANCELLED, (msg) => {
      const match = getUsername(msg);
      console.log(`User ${match} declined the match`);
      // reset timer
      // TODO: create popup to inform user if match declined by other user
      setMatchedUser(null);
      setIsMatchFound(false);
      findMatch(socket, user.username, matchCriteria.complexity, matchCriteria.proficiency);
      setIsFinding(true);
    });

    socket.on(MatchEvent.FOUND, (msg) => {
      const match = getUsername(msg);
      setIsFinding(false);
      setMatchedUser(match);
      setIsMatchFound(true);
      console.log(`Match found with user: ${match}`);
    });

    return socket;
  }

  const handleMatching = (e) => {
    e.preventDefault();

    // socket logic here
    const socket = connect();

    // TODO: include access token to handle auth
    findMatch(socket, user.username, matchCriteria.complexity, matchCriteria.proficiency);
    setMatchSocket(socket);
    setIsFinding(true);
  };

  const handleCancelSearch = () => {
    disconnect(socket, user.username);
    setMatchSocket(null);
    setIsFinding(false);
  };

  const handleDecline = () => {
    cancelMatch(matchSocket);
    setMatchSocket(null);
    setMatchedUser(null);
    setIsMatchFound(false);
    disconnect(socket, user.username);
  };

  const handleAccept = () => {
    // TODO: to handle creating of collab session here
    setIsMatchFound(false); // closes the modal
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setMatchCriteria({
      ...matchCriteria,
      [e.target.name]: value,
    });
  };

  return (
    <Layout>
      <Container
        maxWidth="xl"
        sx={{ height: '100vh', my: 2, display: 'flex', justifyContent: 'center' }}
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
            sx={{ display: 'flex', flexDirection: 'column', m: 2, gap: 3, justifyContent: 'center' }}
          >
            <Box sx={{ display: 'flex', m: 1, gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
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
            {isFinding &&
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                <Typography
                  variant="h6"
                  noWrap
                  component="h6"
                  color="primary"
                  sx={{
                    textAlign: 'center',
                  }}
                >
                  Finding a match...
                </Typography>
                <LinearProgress color="warning" sx={{ width: { xs: '20ch', sm: '100%' } }}/>
              </Box>
            }
            <Box sx={{ display: 'flex', m: 1, justifyContent: 'center' }}>
              {isFinding
                ? <SolidButton
                    variant="contained"
                    size="medium"
                    color="secondary"
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                    onClick={handleCancelSearch}
                  >
                    Cancel Search
                  </SolidButton>
                  : <SolidButton
                      variant="contained"
                      size="medium"
                      color="secondary"
                      type="submit"
                      sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                      Find Match
                    </SolidButton>
              }
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
  );
}
