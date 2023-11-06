import { Box, Stack, Tooltip, Typography } from "@mui/material";
import React from "react";
import SolidButton from "../SolidButton";
import { Call, CallEnd } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { selectHasCallRequest, selectIsRequestingCall } from "@/features/video/videoSlice";

const CallRequestPanel = ({matchedUser, handleCallRequest, handleCancelCallRequest}) => {
  const isRequestingCall = useSelector(selectIsRequestingCall)
  return (
    <>
      <Box>
        <Typography>
          {isRequestingCall ? "Attempting to call" : "Start a call with"}:
        </Typography>
        <Typography color="secondary" sx={{ fontWeight: 600 }}>
          {matchedUser}
        </Typography>
      </Box>
      {isRequestingCall
        ? <Tooltip title="Cancel call">
            <SolidButton
              size="small"
              variant="contained"
              color="error"
              type="button"
              sx={{ borderRadius: 10 }}
              onClick={handleCancelCallRequest}
            >
              <CallEnd />
            </SolidButton>
          </Tooltip>
        : <Tooltip title="Start call">
            <SolidButton
              size="small"
              variant="contained"
              color="success"
              sx={{ borderRadius: 10 }}
              type="button"
              onClick={handleCallRequest}
            >
              <Call />
            </SolidButton>
          </Tooltip> 
      }
    </>
  );
};

const IncomingCallRequestPanel = ({matchedUser, handleAccept, handleDecline}) => {
  return (
    <>
      <Box>
        <Typography>Incoming call from:</Typography>
        <Typography color="secondary" sx={{ fontWeight: 600 }}>
          {matchedUser}
        </Typography>
      </Box>
      <Stack direction="row" sx={{ justifyContent: 'center', gap: 2 }}>
        <Tooltip title="Decline call">
          <SolidButton
            size="small"
            variant="contained"
            color="error"
            type="button"
            sx={{ borderRadius: 10 }}
            onClick={handleDecline}
          >
            <CallEnd />
          </SolidButton>
        </Tooltip>
        <Tooltip title="Accept call">
          <SolidButton
            size="small"
            variant="contained"
            color="success"
            sx={{ borderRadius: 10 }}
            type="button"
            onClick={handleAccept}
          >
            <Call />
          </SolidButton>
        </Tooltip> 
      </Stack>
    </>
  );
};

const VideoFeed = ({videoRefs}) => {
  return (
    <>
      <Box component="video" maxWidth={300} ref={videoRefs.myVideoRef}></Box>
      <Box component="video" maxWidth={300} ref={videoRefs.peerVideoRef}></Box>
    </>
  );
};

export default function VideoPanelBody({ matchedUser, videoRefs, myStream, handleCallRequest, handleCancelCallRequest, handleAcceptCall, handleDeclineCall }) {
  const hasCallRequest = useSelector(selectHasCallRequest)

  return (
    <Stack direction="row" sx={{ maxWidth: 600, gap: 1, height: '100%', alignItems: 'center' }}>
      {myStream
        ? <VideoFeed videoRefs={videoRefs} />
        : <Stack sx={{ my: 1, mx: 2, textAlign: 'center', justifyContent: 'center', gap: 2 }}>
            {hasCallRequest
              ? <IncomingCallRequestPanel
                  matchedUser={matchedUser}
                  handleAccept={handleAcceptCall}
                  handleDecline={handleDeclineCall}
                />
              : <CallRequestPanel
                  matchedUser={matchedUser}
                  handleCallRequest={handleCallRequest}
                  handleCancelCallRequest={handleCancelCallRequest}
                />
            }
          </Stack>
      }
    </Stack>
  );
}