import { MATCH_TIMEOUT_DURATION } from "@/utils/constants";
import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

export default function MatchingTimer({ handleTimeout }) {
  const [isComplete, setIsComplete] = useState(false);

  const handleComplete = () => {
    setIsComplete(true);
    setTimeout(() => {
      handleTimeout();
      setIsComplete(false);
    }, 3000);
  }

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
        color="primary"
        sx={{
          textAlign: 'center',
        }}
      >
        {isComplete ? "No match found." : "Finding a match..."}
      </Typography>
      <CountdownCircleTimer
        isPlaying
        duration={MATCH_TIMEOUT_DURATION}
        colors={[ '#62FBD7', '#FBBC1C', '#FB1C52', '#FB1C52']}
        size={200}
        colorsTime={[22.5, 15, 7.5, 0]}
        onComplete={handleComplete}
      >
        {showMatchingStatus}
      </CountdownCircleTimer>
    </Box>
  );
}
