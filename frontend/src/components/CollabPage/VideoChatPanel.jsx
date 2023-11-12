import { Box, Paper, Stack, Toolbar, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Videocam, VideocamOff } from "@mui/icons-material";
import SolidButton from "../SolidButton";
import { VIDEO_SVC_HOST, VIDEO_SVC_PORT, VIDEO_SVC_URI } from "@/config/uris";
import Peer from "peerjs";
import { useSelector } from "react-redux";
import { VideoEvent } from "@/utils/constants";
import { selectMatchedUsername, selectSessionId } from "@/features/match/matchSlice";
import { joinVideoRoom, toggleMic, toggleVideo } from "@/utils/eventEmitters";
import { handleVideoEvents } from "@/utils/eventHandlers";
import { useAuthContext } from "@/contexts/AuthContext";
import { io } from "socket.io-client";

const connectVideoSocket = () => {
  const socket = io(VIDEO_SVC_URI, {
    path: '/api/video-service/socket.io'
  });

  return socket;
};

const VideoButtons = ({ videoSocket, myStream }) => {
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
  }

  return (
    <Toolbar variant="dense" disableGutters sx={{ px: 2 }}>
        <Stack direction="row" gap={0.5}>
          {myStream && 
            <>
              <Tooltip title={isMicOn ? "Mute mic" : "Unmute mic"}>
                <SolidButton variant="contained" size="small" sx={{ borderRadius: 10 }} onClick={handleMicToggle}>
                  {isMicOn ? <Mic /> : <MicOff />}
                </SolidButton>
              </Tooltip>
              <Tooltip title={isVideoOn ? "Switch camera off" : "Switch camera on"}>
                <SolidButton variant="contained" size="small" sx={{ borderRadius: 10 }} onClick={handleVideoToggle}>
                  {isVideoOn ? <Videocam /> : <VideocamOff />}
                </SolidButton>
              </Tooltip>
            </>
            }
        </Stack>
      </Toolbar>
  );
};

const VideoFeed = ({ myStream, videoRefs, isPeerMicOn, isPeerVideoOn }) => {
  const { myVideoRef, peerVideoRef } = videoRefs;
  const { user } = useAuthContext();
  const matchedUser = useSelector(selectMatchedUsername);
  
  return (
    <Stack direction="row" sx={{ height: '100%', alignItems: 'flex-end' }}>
      <Stack sx={{ justifyContent: 'flex-end' }}>
        <Box component="video" maxWidth={250} ref={myVideoRef} muted></Box>
        { myStream &&
          <Stack
            direction="row"
            sx={{
              gap: 1, 
              color: (theme) => theme.palette.primary.contrastText,
              p: 1,
              alignItems: 'center'
            }}
          >
            <Typography sx={{ fontSize: 14 }}>
              {user && user.username}
            </Typography>
          </Stack>
        }
      </Stack>
      <Stack sx={{ justifyContent: 'flex-end' }}>
        <Box component="video" maxWidth={250} ref={peerVideoRef}></Box>
        { myStream &&
            <Stack
              direction="row"
              sx={{
                gap: 1, 
                color: (theme) => theme.palette.primary.contrastText,
                p: 1,
                alignItems: 'center'
              }}
            >
              <Typography sx={{ fontSize: 14 }}>
                {matchedUser}
              </Typography>
              { isPeerMicOn ? <Mic fontSize="small"/> : <MicOff fontSize="small"/> }
              { isPeerVideoOn ? <Videocam fontSize="small"/> : <VideocamOff fontSize="small"/> }
            </Stack>
          }
      </Stack>
    </Stack>
  );
};

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
    secure: true,
    port: VIDEO_SVC_PORT,
    path: '/peerjs',
    config: {
      'iceServers': [
        // STUN servers (e.g., stun01.sipphone.com, stun.ekiga.net, etc.) are used to discover 
        // the public IP address and port of a client when they are behind a NAT/firewall.
        { url: 'stun:stun01.sipphone.com' },
        { url: 'stun:stun.ekiga.net' },
        { url: 'stun:stunserver.org' },
        { url: 'stun:stun.softjoys.com' },
        { url: 'stun:stun.voiparound.com' },
        { url: 'stun:stun.voipbuster.com' },
        { url: 'stun:stun.voipstunt.com' },
        { url: 'stun:stun.voxgratia.org' },
        { url: 'stun:stun.xten.com' },
        // TURN servers (e.g., 192.158.29.39:3478) are used when direct peer-to-peer communication is 
        // not possible due to strict firewalls or other network configurations. 
        // TURN servers relay traffic between peers to ensure connectivity.
        {
          url: 'turn:192.158.29.39:3478?transport=udp',
          credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
          username: '28224511:1379330808'
        },
        {
          url: 'turn:192.158.29.39:3478?transport=tcp',
          credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
          username: '28224511:1379330808'
        }
      ]
    },
    debug: 3
  });

  useEffect(() => {
    if (!videoSocket) {
      const socket = connectVideoSocket();
      setVideoSocket(socket);
      handleVideoEvents(socket, { setIsPeerMicOn, setIsPeerVideoOn });

      return () => {
        socket.disconnect();
        setVideoSocket(null)
      }
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
          myVideoRef.current.srcObject = stream;
          myVideoRef.current.play();

          joinVideoRoom(videoSocket, sessionId, peer.id);

          peer.on('error', (err) => {
            console.error(err);
          });

          peer.on("call", call => {
            call.answer(stream);

            call.on("stream", userVideoStream => {
              peerVideoRef.current.srcObject = userVideoStream;
              peerVideoRef.current.play();
            });
          });

          videoSocket.on(VideoEvent.JOIN, (data) => {
            const call2 = peer.call(data.username, stream);

            if (call2) {
              call2.on("stream", userVideoStream => {
                peerVideoRef.current.srcObject = userVideoStream;
                peerVideoRef.current.play();
              });

              call2.on('error', (error) => {
                console.error(error);
              })
            }
          });

          videoSocket.on(VideoEvent.LEAVE, () => {
            peerVideoRef.current.srcObject = null;
            myVideoRef.current.srcObject = null
          });
        })

      return () => {
        peer.destroy();
        if (tempStream) {
          tempStream.getVideoTracks()[0].stop();
          tempStream.getAudioTracks()[0].stop();
        }
      };
    }
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
};
