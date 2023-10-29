import { Avatar, Box, Container, Divider, Grid, IconButton, Paper, Stack, Switch, Typography } from "@mui/material";
import Layout from "../Layout";
import { stringAvatar, stringToColor } from "@/utils/utils";
import { Edit } from "@mui/icons-material";
import SolidButton from "../SolidButton";

const label = { inputProps: { 'aria-label': 'Dark mode switch' } };

export default function ProfilePage() {
  const user = "johndoe123dsadadasdadadsadsasascda";
  const displayName = "JohnDoe123adasdadadsadsasascd"
  return (
    <Layout>
      <Container
        maxWidth="xl"
        sx={{ height: '100%', my: 2, display: 'flex', justifyContent: 'center' }}
      >
        <Stack gap={2} sx={{ maxWidth: 700 }}>
          <Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: stringToColor(user), width: 80, height: 80 }}>
                {stringAvatar(displayName)}
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  textAlign={{ xs: 'center',  sm: 'left' }}
                >
                  {displayName}
                </Typography>
                <Typography
                  fontStyle='italic'
                  textAlign={{ xs: 'center',  sm: 'left' }}
                >
                  {user}
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Grid container component={Paper} sx={{ p: 3 }} rowGap={3}>
            <Grid item xs={12}>
              <Grid container sx={{ alignItems: { xs: 'start', sm: 'center' } }} rowGap={1}>
                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: 600, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    Account Information
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <Grid container rowGap={1}>
                    <Grid item xs={12} sm={4}>
                      <Typography sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                        Display name
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography color={(theme) => theme.palette.primary.light} sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                        {displayName}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={2} sx={{ textAlign: 'right' }}>
                  <IconButton size="small">
                    <Edit fontSize="small"/>
                  </IconButton>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={10}>
                  <Grid container rowGap={1}>
                    <Grid item xs={12} sm={4}>
                      <Typography sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                        Username
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography color={(theme) => theme.palette.primary.light} sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                        {user}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container sx={{ alignItems: 'center' }} rowGap={1}>
                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: 600, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    Preferences
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <Typography sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    Dark mode
                  </Typography>
                </Grid>
                <Grid item xs={2} sx={{ textAlign: 'right' }}>
                  <Switch {...label } color="secondary" />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={12}>
                  <SolidButton variant="contained" color="error" sx={{ textTransform: 'none' }}>
                    Delete Account
                  </SolidButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Layout>
  );
}
