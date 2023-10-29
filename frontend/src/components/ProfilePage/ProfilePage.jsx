import { Avatar, Box, Container, Divider, Grid, Paper, Stack, Switch, Typography } from "@mui/material";
import Layout from "../Layout";
import { stringAvatar, stringToColor } from "@/utils/utils";

const label = { inputProps: { 'aria-label': 'Dark mode switch' } };

export default function ProfilePage() {
  const user = "johndoe123";
  const displayName = "JohnDoe123"
  return (
    <Layout>
      <Container
        maxWidth="xl"
        sx={{ height: '100vh', my: 2, display: 'flex', justifyContent: 'center' }}
      >
        <Stack gap={2}>
          <Box>
            <Stack direction='row' spacing={3} sx={{ alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: stringToColor(user) ,width: 80, height: 80 }}>
                {stringAvatar(displayName)}
              </Avatar>
              <Box>
                <Typography variant="h6">{displayName}</Typography>
                <Typography fontStyle='italic'>{user}</Typography>
              </Box>
            </Stack>
          </Box>
          <Box component={Paper} sx={{ p: 3 }}>
          
            <Grid container>
              <Grid item xs={12}>
                <Typography sx={{ fontWeight: 600, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  Account Information
                </Typography>
              </Grid>
              <Grid container direction='row'>
                <Grid item xs={4}>
                  <Typography sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    Display name
                  </Typography>
                  <Divider orientation="horizontal" flexItem/>
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    {displayName}
                  </Typography>
                  <Divider orientation="horizontal" flexItem/>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'right' }}>
                  <Typography sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    edit
                  </Typography>
                  <Divider orientation="horizontal" flexItem/>
                </Grid>
              </Grid>
              <Grid container direction='row'>
                <Grid item xs={4}>
                  <Typography sx={{ height: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    Username
                  </Typography>
                  <Divider orientation="horizontal" flexItem/>
                </Grid>
                <Grid item xs={4}>
                  {user}
                  <Divider orientation="horizontal" flexItem/>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'right' }}>
                  &nbsp;
                  <Divider orientation="horizontal" flexItem/>
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={1} sx={{ alignItems: 'center'}}>
              <Grid item xs={12}>
                <Typography sx={{ fontWeight: 600, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  Preferences
                </Typography>
              </Grid>
              <Grid container>
                <Grid item xs={4}>
                  <Typography sx={{ height: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    Dark mode
                  </Typography>
                  <Divider orientation="horizontal" flexItem/>
                </Grid>
                <Grid item xs={4} sx={{ height: '100%' }}>
                  <Switch {...label } />
                  <Divider orientation="horizontal" flexItem/>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'right' }}>
                  &nbsp;
                  <Divider orientation="horizontal" flexItem/>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Container>
    </Layout>
  );
}

// history:
// keep track of history of questions done (progress in leetcode)
// display last solved date
// upon clicking the question, it goes to a "read only" version of the room with the attempt
// have a tab to display all past attempts of that question, with info about matched user

// schema
// history = {
//   uid1,
//   uid2,
//   qid,
//   timestamp,
//   content,
//   sessionId,
//   language
// }
