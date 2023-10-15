import { MATCH_TIMEOUT_DURATION } from "@/utils/constants";
import { Box, Typography } from "@mui/material";
import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

export default function MatchingTimer({ handleTimeout, isTimeoutComplete }) {
  const showMatchingStatus = ({ remainingTime }) => {
    return (
      <Typography
        variant="h4"
        component="h4"
      >
        {remainingTime}
      </Typography>
    );
  };

  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center',
    }}
    >
      <Typography
        variant="h6"
        noWrap
        component="h6"
        color={isTimeoutComplete ? "error" : "primary"}
        sx={{
          textAlign: 'center',
        }}
      >
        {isTimeoutComplete ? "No match found." : "Finding a match..."}
      </Typography>
      <CountdownCircleTimer
        isPlaying
        duration={MATCH_TIMEOUT_DURATION}
        colors={[ '#62FBD7', '#FBBC1C', '#FB1C52', '#FB1C52']}
        size={200}
        colorsTime={[22.5, 15, 7.5, 0]}
        onComplete={handleTimeout}
      >
        {showMatchingStatus}
      </CountdownCircleTimer>
    </Box>
  );
}
