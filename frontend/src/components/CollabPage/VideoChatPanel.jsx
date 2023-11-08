import { Box, Paper, Stack, Toolbar, Tooltip } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Call, CallEnd, Mic, MicOff, Videocam, VideocamOff } from "@mui/icons-material";
import SolidButton from "../SolidButton";
import ExpandButton from "./ExpandButton";
import VideoPanelBody from "./VideoPanelBody";
import { VIDEO_SVC_HOST, VIDEO_SVC_PORT } from "@/config/uris";
import Peer from "peerjs";
import { useDispatch, useSelector } from "react-redux";
import { VideoEvent } from "@/utils/constants";
import { selectSessionId } from "@/features/match/matchSlice";
import { acceptCall, cancelCall, declineCall, endCall, joinVideoRoom, requestCall } from "@/utils/eventEmitters";
import { selectHasCallRequest, selectIsRequestingCall, setHasCallRequest, setIsRequestingCall } from "@/features/video/videoSlice";

// export default function VideoChatPanel({ user, matchedUser, videoSocket, activeCall, setActiveCall }) {
//   const [isMuted, setIsMuted] = useState(false);
//   const [isVideoOn, setIsVideoOn] = useState(true);
//   const hasCallRequest = useSelector(selectHasCallRequest);
//   const isRequestingCall = useSelector(selectIsRequestingCall)
//   const [myStream, setMyStream] = useState(null);
//   const myVideoRef = useRef();
//   const peerVideoRef = useRef();
//   const sessionId = useSelector(selectSessionId);
//   const dispatch = useDispatch();
//   const [isMinimized, setIsMinimized] = useState(false);

//   const peer = new Peer({
//     // host: VIDEO_SVC_HOST,
//     // port: VIDEO_SVC_PORT,
//     // path: '/peerjs',
//     config: {
//       'iceServers': [
//         // STUN servers (e.g., stun01.sipphone.com, stun.ekiga.net, etc.) are used to discover 
//         // the public IP address and port of a client when they are behind a NAT/firewall.
//         { url: 'stun:stun01.sipphone.com' },
//         { url: 'stun:stun.ekiga.net' },
//         { url: 'stun:stunserver.org' },
//         { url: 'stun:stun.softjoys.com' },
//         { url: 'stun:stun.voiparound.com' },
//         { url: 'stun:stun.voipbuster.com' },
//         { url: 'stun:stun.voipstunt.com' },
//         { url: 'stun:stun.voxgratia.org' },
//         { url: 'stun:stun.xten.com' },
//         // TURN servers (e.g., 192.158.29.39:3478) are used when direct peer-to-peer communication is 
//         // not possible due to strict firewalls or other network configurations. 
//         // TURN servers relay traffic between peers to ensure connectivity.
//         {
//           url: 'turn:192.158.29.39:3478?transport=udp',
//           credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
//           username: '28224511:1379330808'
//         },
//         {
//           url: 'turn:192.158.29.39:3478?transport=tcp',
//           credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
//           username: '28224511:1379330808'
//         }
//       ]
//     },
//     debug: 3
//   });

//   const toggleMinimize = () => {
//     setIsMinimized(!isMinimized);
//   };

//   const resetVideoState = () => {
//     setIsMuted(true);
//     setIsVideoOn(false);
//     dispatch(setHasCallRequest(false));
//     dispatch(setIsRequestingCall(false));
//     setMyStream(null);
//     if (myVideoRef.current) {
//       myVideoRef.current.srcObject = null;
//     }

//     if (peerVideoRef.current) {
//       peerVideoRef.current.srcObject = null;
//     }

//     setActiveCall(null);
//   };

//   const handleMicToggle = () => {
//     console.log("Audio tracks:", myStream.getAudioTracks()[0].enabled)
//     myStream.getAudioTracks()[0].enabled = !isMuted;
//     setIsMuted(!isMuted);
//   };

//   const handleVideoToggle = () => {
//     console.log("video tracks:", myStream.getVideoTracks()[0].enabled)
//     myStream.getVideoTracks()[0].enabled = !isVideoOn;
//     setIsVideoOn(!isVideoOn);
//   }

//   const handleCallRequest = () => {
//     requestCall(videoSocket, sessionId, user.username);
//     dispatch(setIsRequestingCall(true));

//     videoSocket.on(VideoEvent.ACCEPT, (userId) => {
//       handleAcceptedCall(userId);
//     });
//   };

//   const handleCancelCallRequest = () => {
//     cancelCall(videoSocket, sessionId);
//     dispatch(setIsRequestingCall(false));
//   }

//   const handleEndCall = () => {
//     if (activeCall) {
//       console.log("closing call....")
//       activeCall.close();
//       endCall(videoSocket, sessionId);
//     }
//     resetVideoState();
//   };

//   const addVideoStream = (ref, stream) => {
//     if (ref.current) {
//       console.log("add video stream: ", ref.current)
//       ref.current.srcObject = stream;
//       ref.current.play();
//     } else {
//       console.log("no ref:", ref)
//     }
//   };

//   const handleAcceptedCall = (userId) => {
//     let tempStream;

//     navigator.mediaDevices
//       .getUserMedia({
//         audio: true,
//         video: true
//       })
//       .then((stream) => {
//         tempStream = stream;
//         setMyStream(stream);
//         console.log("stream", stream);

//         addVideoStream(myVideoRef, stream);

//         const call = peer.call(userId, stream);

//         if (call) {
//           setActiveCall(call);
    
//           call.on("stream", (peerStream) => {
//             console.log("peer stream:", peerStream)
//             addVideoStream(peerVideoRef, peerStream);
//           });
//         }
//       });
//   };

//   const handleDeclineCall = () => {
//     declineCall(videoSocket, sessionId);
//     dispatch(setHasCallRequest(false));
//   };

//   const handleAcceptCall = () => {
//     dispatch(setHasCallRequest(false));
//     let tempStream;

//     navigator.mediaDevices
//       .getUserMedia({
//         audio: true,
//         video: true
//       })
//       .then((stream) => {
//         tempStream = stream;
//         console.log("stream", stream);
//         setMyStream(stream);

//         addVideoStream(myVideoRef, stream);
//         acceptCall(videoSocket, sessionId);

//         peer.on("call", (call) => {
//           call.answer(stream);
//           setActiveCall(call);

//           call.on("stream", (peerStream) => {
//             console.log("peer stream:", peerStream)
//             addVideoStream(peerVideoRef, peerStream);
//           });
//         });
        
//         videoSocket.on(VideoEvent.LEAVE, () => {
//           handleEndCall();
//         });
//       });
//   };

//   useEffect(() => {
//     return () => {
//       peer.destroy();

//       if (myStream) {
//         myStream.getVideoTracks()[0].stop();
//         myStream.getAudioTracks()[0].stop();
//       }

//       handleEndCall();
//     }
//   }, []);

//   useEffect(() => {
//     if (hasCallRequest) {
//       setIsMinimized(false);
//     }

//   }, [hasCallRequest]);

//   return (
//     <Box
//       component={Paper}
//       height={isMinimized ? 'auto' : '40%'}
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         position: 'absolute',
//         bottom: 10,
//         right: 10,
//       }}
//     >
//       <Toolbar variant="dense" disableGutters sx={{ px: 2, bgcolor: (theme) => theme.palette.primary.main }}>
//         <Stack direction="row" gap={0.5}>
//           {myStream &&
//             <Tooltip title="End call">
//               <SolidButton
//                 size="small"
//                 variant="contained"
//                 color="error"
//                 sx={{ borderRadius: 10 }}
//                 onClick={handleEndCall}
//               >
//                 <CallEnd />
//               </SolidButton>
//             </Tooltip>
//           }
//           {(!myStream && isMinimized && !isRequestingCall && !hasCallRequest) &&
//             <Tooltip title="Start call">
//               <SolidButton
//                 size="small"
//                 variant="contained"
//                 color="success"
//                 sx={{ borderRadius: 10 }}
//                 onClick={handleCallRequest}
//               >
//                 <Call />
//               </SolidButton>
//             </Tooltip>
//           }
//           {(!myStream && isMinimized && isRequestingCall && !hasCallRequest) &&
//             <Tooltip title="Cancel call">
//               <SolidButton
//                 size="small"
//                 variant="contained"
//                 color="error"
//                 sx={{ borderRadius: 10 }}
//                 onClick={handleCancelCallRequest}
//               >
//                 <CallEnd />
//               </SolidButton>
//             </Tooltip>
//           }
//           {(hasCallRequest && isMinimized) &&
//             <>
//               <Tooltip title="Accept call">
//                 <SolidButton
//                   size="small"
//                   variant="contained"
//                   color="success"
//                   sx={{ borderRadius: 10 }}
//                   onClick={handleAcceptCall}
//                 >
//                   <Call />
//                 </SolidButton>
//               </Tooltip>
//               <Tooltip title="Decline call">
//                 <SolidButton
//                   size="small"
//                   variant="contained"
//                   color="error"
//                   sx={{ borderRadius: 10 }}
//                   onClick={handleDeclineCall}
//                 >
//                   <CallEnd />
//                 </SolidButton>
//               </Tooltip>
//             </>
//           }
//           {myStream && 
//             <>
//               <Tooltip title={isMuted ? "Unmute mic" : "Mute mic"}>
//                 <SolidButton size="small" variant="contained" sx={{ borderRadius: 10 }} onClick={handleMicToggle}>
//                   {isMuted ? <MicOff /> : <Mic />}
//                 </SolidButton>
//               </Tooltip>
//               <Tooltip title={isVideoOn ? "Switch camera off" : "Switch camera on"}>
//                 <SolidButton size="small" variant="contained" sx={{ borderRadius: 10 }} onClick={handleVideoToggle}>
//                   {isVideoOn ? <Videocam /> : <VideocamOff />}
//                 </SolidButton>
//               </Tooltip>
//             </>
//           }
//         </Stack>
//         <ExpandButton
//           size="small"
//           sx={{ ml: 'auto', color: (theme) => theme.palette.primary.contrastText}}
//           onClick={toggleMinimize}
//           isUp={isMinimized}
//           iconSize="large"
//         />
//       </Toolbar>
      
//       {!isMinimized && myStream &&
//         // <VideoPanelBody
//         //   matchedUser={matchedUser}
//         //   handleCallRequest={handleCallRequest}
//         //   handleCancelCallRequest={handleCancelCallRequest}
//         //   handleDeclineCall={handleDeclineCall}
//         //   handleAcceptCall={handleAcceptCall}
//         //   videoRefs={{ myVideoRef, peerVideoRef }}
//         //   myStream={myStream}
//         //   videoSocket={videoSocket}
//         // />
//         <>
//           <Box component="video" maxWidth={300} ref={myVideoRef}></Box>
//           <Box component="video" maxWidth={300} ref={peerVideoRef}></Box>
//         </>
//       }
//     </Box>
//   );
// };
const VideoFeed = ({videoRefs}) => {
  return (
    <>
      <Box component="video" maxWidth={300} ref={videoRefs.myVideo} muted></Box>
      <Box component="video" maxWidth={300} ref={videoRefs.peerVideo}></Box>
    </>
  );
};

export default function VideoChatPanel({ user, matchedUser, videoSocket }) {
  const myVideo = useRef();
	const peerVideo = useRef();
  const sessionId = useSelector(selectSessionId);
  const [localStream, setLocalStream] = useState(null);
  const peer = new Peer({
    host: VIDEO_SVC_HOST,
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
    if (videoSocket) {
      let temp;
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          temp = stream;
          setLocalStream(stream);
          myVideo.current.srcObject = stream;
          myVideo.current.play();
          joinVideoRoom(videoSocket, sessionId, user.username);
          
          peer.on('error',(err)=>{
            console.log(err);
          });

          peer.on("call", call => {
            console.log("call received:", call);
            call.answer(stream);
            call.on("stream", userVideoStream => {
              peerVideo.current.srcObject = userVideoStream;
              peerVideo.current.play();
            });
          });
          console.log("listening for calls...")

          videoSocket.on(VideoEvent.JOIN, (data) => {
            console.log("received join event: ", data);
            const call2 = peer.call(data.username, stream);
            console.log("call2 made:", call2);
            if (call2) {
              call2.on("stream", userVideoStream => {
                peerVideo.current.srcObject = userVideoStream;
                peerVideo.current.play();
                console.log("play peer video")
              });

              call2.on('error',(error)=>{
                console.log(error);
              })
            }
          });

          videoSocket.on(VideoEvent.LEAVE, () => {
            peerVideo.current.srcObject = null;
          });
        })

      return () => {
        peer.destroy();
        if (temp) {
          temp.getVideoTracks()[0].stop();
          temp.getAudioTracks()[0].stop();
        }
      };
    }
  }, [videoSocket]);

  return (
    <Box
      component={Paper}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        bottom: 10,
        right: 10,
      }}
    >
      <Stack direction="row" sx={{ maxWidth: 600, gap: 1, height: '100%', alignItems: 'center' }}>
        {/* <Box component="video" maxWidth={300} ref={myVideo} muted></Box>
        <Box component="video" maxWidth={300} ref={peerVideo}></Box> */}
        <VideoFeed videoRefs={{ myVideo, peerVideo}} />
      </Stack>
    </Box>
  );
};
