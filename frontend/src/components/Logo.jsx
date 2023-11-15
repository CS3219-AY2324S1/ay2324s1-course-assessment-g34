import React from 'react';
import { Typography } from '@mui/material';
import { Bree_Serif } from 'next/font/google';
import { PropTypes } from 'prop-types';

const breeSerif = Bree_Serif({ subsets: ['latin'], weight: '400' });

export default function Logo({ display, flexGrow = 0 }) {
  return (
    <Typography
      variant="h5"
      noWrap
      component="a"
      href="/"
      sx={{
        mr: 2,
        display,
        flexGrow,
        fontFamily: breeSerif.style,
        letterSpacing: '.1rem',
        color: (theme) => theme.palette.success.main,
        textDecoration: 'none',
      }}
    >
      PeerPrep
    </Typography>
  );
}

Logo.propTypes = {
  display: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      xs: PropTypes.string,
      sm: PropTypes.string,
      md: PropTypes.string,
      lg: PropTypes.string,
      xl: PropTypes.string,
    }),
  ]).isRequired,
  flexGrow: PropTypes.number,
};
