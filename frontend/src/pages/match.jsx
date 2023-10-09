import Layout from "@/components/Layout";
import MatchModal from "@/components/MatchPage/MatchModal";
import ComplexitySelector from "@/components/QuestionPage/ComplexitySelector";
import SolidButton from "@/components/SolidButton";
import { Box, Container, LinearProgress, MenuItem, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

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

export default function MatchPage() {
  const [isFinding, setIsFinding] = useState(false);
  const [isMatchFound, setIsMatchFound] = useState(false);
  const [matchedUser, setMatchedUser] = useState("Test_User");

  const handleMatching = (e) => {
    e.preventDefault();

    const matchCriteria = new FormData(e.currentTarget);
    const complexity = matchCriteria.get('complexity');
    const proficiency = matchCriteria.get('proficiency');

    setIsFinding(true);
    // socket logic here
  };

  const handleCancelSearch = (e) => {
    e.preventDefault();
    setIsFinding(false);
  }

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
        <MatchModal isOpen={isMatchFound} setIsOpen={setIsMatchFound} matchedUser={matchedUser}/>
      </Container>
    </Layout>
  );
}
