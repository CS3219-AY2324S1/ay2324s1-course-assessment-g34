import {
  Box, Paper, Stack, Toolbar, Tooltip, Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import {
  Mic, MicOff, Videocam, VideocamOff,
} from '@mui/icons-material';
import { VIDEO_SVC_HOST, VIDEO_SVC_PORT, VIDEO_SVC_URI, VIDEO_SVC_SECURE } from '@/config/uris';
import Peer from 'peerjs';
import { useSelector } from 'react-redux';
import { VideoEvent } from '@/utils/constants';
import { selectMatchedUsername, selectSessionId } from '@/features/match/matchSlice';
import { joinVideoRoom, toggleMic, toggleVideo } from '@/utils/eventEmitters';
import { handleVideoEvents } from '@/utils/eventHandlers';
import { useAuthContext } from '@/contexts/AuthContext';
import { io } from 'socket.io-client';
import { PropTypes } from 'prop-types';
import SolidButton from '../commons/SolidButton';

const connectVideoSocket = () => {
  const socket = io(VIDEO_SVC_URI, {
    path: '/api/video-service/socket.io',
  });

  return socket;
};

function VideoButtons({ videoSocket, myStream }) {
  const sessionId = useSelector(selectSessionId);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const handleMicToggle = () => {
    myStream.getAudioTracks()[0].enabled = !isMicOn;
    setIsMicOn(!isMicOn);
    toggleMic(videoSocket, sessionId, !isMicOn);
  };

  const handleVideoToggle = () => {
    myStream.getVideoTracks()[0].enabled = !isVideoOn;
    setIsVideoOn(!isVideoOn);
    toggleVideo(videoSocket, sessionId, !isVideoOn);
  };

  return (
    <Toolbar variant="dense" disableGutters sx={{ px: 2 }}>
      <Stack direction="row" gap={0.5}>
        {myStream
            && (
            <>
              <Tooltip title={isMicOn ? 'Mute mic' : 'Unmute mic'}>
                <SolidButton variant="contained" size="small" sx={{ borderRadius: 10 }} onClick={handleMicToggle}>
                  {isMicOn ? <Mic /> : <MicOff />}
                </SolidButton>
              </Tooltip>
              <Tooltip title={isVideoOn ? 'Switch camera off' : 'Switch camera on'}>
                <SolidButton variant="contained" size="small" sx={{ borderRadius: 10 }} onClick={handleVideoToggle}>
                  {isVideoOn ? <Videocam /> : <VideocamOff />}
                </SolidButton>
              </Tooltip>
            </>
            )}
      </Stack>
    </Toolbar>
  );
}

function VideoFeed({
  myStream, videoRefs, isPeerMicOn, isPeerVideoOn,
}) {
  const { myVideoRef, peerVideoRef } = videoRefs;
  const { user } = useAuthContext();
  const matchedUser = useSelector(selectMatchedUsername);

  return (
    <Stack direction="row" sx={{ height: '100%', alignItems: 'flex-end' }}>
      <Stack sx={{ justifyContent: 'flex-end' }}>
        <Box component="video" maxWidth={250} ref={myVideoRef} muted />
        { myStream
          && (
          <Stack
            direction="row"
            sx={{
              gap: 1,
              color: (theme) => theme.palette.primary.contrastText,
              p: 1,
              alignItems: 'center',
            }}
          >
            <Typography sx={{ fontSize: 14 }}>
              {user && user.username}
            </Typography>
          </Stack>
          )}
      </Stack>
      <Stack sx={{ justifyContent: 'flex-end' }}>
        <Box component="video" maxWidth={250} ref={peerVideoRef} />
        { myStream
            && (
            <Stack
              direction="row"
              sx={{
                gap: 1,
                color: (theme) => theme.palette.primary.contrastText,
                p: 1,
                alignItems: 'center',
              }}
            >
              <Typography sx={{ fontSize: 14 }}>
                {matchedUser}
              </Typography>
              { isPeerMicOn ? <Mic fontSize="small" /> : <MicOff fontSize="small" /> }
              { isPeerVideoOn ? <Videocam fontSize="small" /> : <VideocamOff fontSize="small" /> }
            </Stack>
            )}
      </Stack>
    </Stack>
  );
}

export default function VideoChatPanel() {
  const myVideoRef = useRef();
  const peerVideoRef = useRef();
  const [videoSocket, setVideoSocket] = useState(null);
  const [isPeerMicOn, setIsPeerMicOn] = useState(true);
  const [isPeerVideoOn, setIsPeerVideoOn] = useState(true);
  const sessionId = useSelector(selectSessionId);
  const [myStream, setMyStream] = useState(null);

  const peer = new Peer({
    host: VIDEO_SVC_HOST,
    port: VIDEO_SVC_PORT,
    secure: VIDEO_SVC_SECURE,
    path: '/peerjs',
    debug: 3
  });

  const attachStream = (ref, stream) => {
    ref.current.srcObject = stream;
    ref.current.play()
  };

  useEffect(() => {
    if (!videoSocket) {
      const socket = connectVideoSocket();
      setVideoSocket(socket);
      handleVideoEvents(socket, { setIsPeerMicOn, setIsPeerVideoOn });

      return () => {
        socket.disconnect();
        setVideoSocket(null);
      };
    }

    return () => {};
  }, []);

  useEffect(() => {
    if (videoSocket) {
      let tempStream;
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          tempStream = stream;
          setMyStream(stream);
          attachStream(myVideoRef, stream);
          // myVideoRef.current.srcObject = stream;
          // myVideoRef.current.play();

          joinVideoRoom(videoSocket, sessionId, peer.id);

          // peer.on('error', (err) => {
          //   console.error(err);
          // });

          peer.on('call', (call) => {
            call.answer(stream);

            call.on('stream', (peerStream) => {
              attachStream(peerVideoRef, peerStream)
              // peerVideoRef.current.srcObject = peerStream;
              // peerVideoRef.current.play();
            });
          });

          videoSocket.on(VideoEvent.JOIN, (data) => {
            const call = peer.call(data.username, stream);

            if (call) {
              call.on('stream', (peerStream) => {
                attachStream(peerVideoRef, peerStream)
                // peerVideoRef.current.srcObject = peerStream;
                // peerVideoRef.current.play();
              });

              // call.on('error', (error) => {
              //   console.error(error);
              // });
            }
          });

          videoSocket.on(VideoEvent.LEAVE, () => {
            peerVideoRef.current.srcObject = null;
            myVideoRef.current.srcObject = null;
          });
        });

      return () => {
        peer.destroy();
        if (tempStream) {
          tempStream.getVideoTracks()[0].stop();
          tempStream.getAudioTracks()[0].stop();
        }
      };
    }
    return () => {};
  }, [videoSocket]);

  return (
    <Paper
      sx={{
        bgcolor: (theme) => theme.palette.primary.main,
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        bottom: 10,
        right: 10,
      }}
    >
      <VideoButtons videoSocket={videoSocket} myStream={myStream} />
      <VideoFeed
        myStream={myStream}
        videoRefs={{ myVideoRef, peerVideoRef }}
        isPeerMicOn={isPeerMicOn}
        isPeerVideoOn={isPeerVideoOn}
      />
    </Paper>
  );
}

VideoButtons.propTypes = {
  videoSocket: PropTypes.any,
  myStream: PropTypes.any,
};

VideoFeed.propTypes = {
  myStream: PropTypes.any,
  videoRefs: PropTypes.shape({
    myVideoRef: PropTypes.any,
    peerVideoRef: PropTypes.any,
  }),
  isPeerMicOn: PropTypes.bool.isRequired,
  isPeerVideoOn: PropTypes.bool.isRequired,
};
