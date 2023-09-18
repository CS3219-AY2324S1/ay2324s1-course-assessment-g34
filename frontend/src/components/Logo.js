import React from "react";
import { Typography } from "@mui/material";
import { Bree_Serif } from 'next/font/google';

const breeSerif = Bree_Serif({ subsets: ['latin'], weight: '400' });

export default function Logo({ display, flexGrow }) {
  return (
    <>
      <Typography
        variant="h5"
        noWrap
        component="a"
        href="/"
        sx={{
          mr: 2,
          display: display,
          flexGrow: flexGrow,
          fontFamily: breeSerif.style,
          letterSpacing: '.1rem',
          // color: (theme) => theme.palette.success.main,
          textDecoration: 'none',
        }}
      >
        PeerPrep
      </Typography>
    </>
  );
}