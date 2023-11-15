import {
  Avatar, Box, Skeleton, Stack, Typography,
} from '@mui/material';
import { stringToAvatar, stringToColor } from '@/utils/utils';
import React from 'react';
import PropTypes from 'prop-types';

export default function ProfileHeader({ username, displayName }) {
  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'center' }}>
        <Avatar sx={{ bgcolor: username ? stringToColor(username) : 'grey', width: 80, height: 80 }}>
          {username ? stringToAvatar(username) : ''}
        </Avatar>
        <Box>
          { displayName
            ? (
              <Typography
                variant="h6"
                textAlign={{ xs: 'center', sm: 'left' }}
              >
                {displayName}
              </Typography>
            )
            : <Skeleton variant="text" sx={{ fontSize: 16 }} />}
          { username
            ? (
              <Typography
                fontStyle="italic"
                textAlign={{ xs: 'center', sm: 'left' }}
              >
                {username}
              </Typography>
            )
            : <Skeleton variant="text" sx={{ fontSize: 14 }} />}
        </Box>
      </Stack>
    </Box>
  );
}

ProfileHeader.propTypes = {
  username: PropTypes.string,
  displayName: PropTypes.string,
};
