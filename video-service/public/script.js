const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

const user = prompt("Enter your name");

// Create a new PeerJS instance with specified configuration options.
var peer = new Peer({
  host: '127.0.0.1',
  port: 3002,
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

let myVideoStream;

// Request access to the user's microphone and camera.
navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    // Store the user's video stream in 'myVideoStream'.
    myVideoStream = stream;

    // Add the user's video stream to their 'myVideo' element.
    addVideoStream(myVideo, stream);

    // Set up an event listener for incoming calls.
    peer.on("call", (call) => {
      console.log('someone call me');
      // Answer the call and create a video element to display the remote user's video stream.
      call.answer(stream);
      const video = document.createElement("video");

      // Handle the incoming video stream and display it.
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    // Set up an event listener for when a user connects to the application.
    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });

// Function to connect to a new user and add their video stream.
const connectToNewUser = (userId, stream) => {
  console.log('I call someone' + userId);
  const call = peer.call(userId, stream);
  const video = document.createElement("video");

  // Handle the incoming video stream and display it.
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

// Event listener for when the PeerJS connection is opened, emitting user information to the server.
peer.on("open", (id) => {
  console.log('my id is' + id);
  socket.emit("join-room", ROOM_ID, id, user);
});

// Function to add a video stream to a video element and display it.
const addVideoStream = (video, stream) => {
  video.srcObject = stream;

  // When the video metadata is loaded, play the video and append it to the 'videoGrid'.
  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoGrid.append(video);
  });
};

// Chat messages related
let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");

send.addEventListener("click", (e) => {
  if (text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

// Related to muting/unmuting audio and stopping/starting video.
const inviteButton = document.querySelector("#inviteButton");
const muteButton = document.querySelector("#muteButton");
const stopVideo = document.querySelector("#stopVideo");
muteButton.addEventListener("click", () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    // Update the button icon and style.
    html = `<i class="fas fa-microphone-slash"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    // Update the button icon and style.
    html = `<i class="fas fa-microphone"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  }
});

stopVideo.addEventListener("click", () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    html = `<i class="fas fa-video-slash"></i>`;
    stopVideo.classList.toggle("background__red");
    stopVideo.innerHTML = html;
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    html = `<i class="fas fa-video"></i>`;
    stopVideo.classList.toggle("background__red");
    stopVideo.innerHTML = html;
  }
});

inviteButton.addEventListener("click", (e) => {
  prompt(
    "Copy this link and send it to people you want to meet with",
    window.location.href
  );
});


// Event listener for receiving chat messages and displaying them in the chat interface.
socket.on("createMessage", (message, userName) => {
  // Append the new chat message to the chat interface.
  messages.innerHTML =
    messages.innerHTML +
    `<div class="message">
        <b><i class="far fa-user-circle"></i> <span> ${userName === user ? "me" : userName
    }</span> </b>
        <span>${message}</span>
    </div>`;
});