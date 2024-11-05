import { useEffect, useRef, useState } from "react";
import { FiMic, FiMicOff, FiVideo, FiVideoOff } from "react-icons/fi";
import { useVideoCardState } from "../../state-management/show-video-card";
import { socket } from "../../utils/web-socket";

interface Props {
  data: any;
  currentUserId: String | undefined;
}

const configuration: RTCConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

const AcceptedVideoChat = ({ data, currentUserId }: Props) => {
  const [audioState, setAudioState] = useState(false);
  const localVideo = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const remoteVideo = useRef<HTMLVideoElement | null>(null);
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);
  const { showVideoChatCard, setShowVideoChatCard } = useVideoCardState();

  useEffect(() => {
    if (!pc) {
      startLocalStream(); // Start the local stream on component mount
    }

    handleOffer(data);

    // socket.on("sendOffer", async(data)=>{
    //   console.log("Send offer in AcceptedVideoChat");
    //   await handleOffer(data)
    // });
    socket.on("sendCandidate", handleCandidate);

    return () => {
      socket.off("sendOffer", handleOffer);
      socket.off("sendCandidate", handleCandidate);
      if (pc) {
        pc.close(); // Clean up when the component unmounts
        setPc(null);
      }
    };
  }, [pc]);

  const resetPeerConnection = () => {
    if (pc) {
      pc.close();
      setPc(null);
    }
    const newPc = createPeerConnection();
    setPc(newPc);
  
    if (stream) {
      stream.getTracks().forEach((track) => {
        newPc.addTrack(track, stream);
      });
    }
  };

  // Start local video stream and initialize peer connection
  const startLocalStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        // Add audio if needed: audio: true
      });

      if (localVideo.current) {
        localVideo.current.srcObject = mediaStream;
      }

      setStream(mediaStream);

      const peerConnection = createPeerConnection();
      setPc(peerConnection);

      mediaStream.getTracks().forEach((track) => {
        // console.log('Adding track:', track);
        peerConnection.addTrack(track, mediaStream);
      });
    } catch (err) {
      console.error("Failed to access local camera and microphone:", err);
    }
  };

  // Handle incoming offer
  const handleOffer = async (data: any) => {
    console.log("Handle offer in acceptedVideoChat");

    if (!pc) return;

    if (pc.signalingState !== "stable") {
      resetPeerConnection()
      try {
        console.log("Setting remote description:", data.sdp);
        await pc.setRemoteDescription(
          new RTCSessionDescription({ sdp: data.sdp, type: "offer" })
        );

        const answer = await pc.createAnswer({
          iceRestart: true, // Restart ICE for renegotiation
        });
        // console.log('Setting remote description:', answer);
        await pc.setLocalDescription(answer);

        // Send answer back to the caller
        socket.emit("answer", {
          toUserId: data.tuserId,
          sdp: answer.sdp,
        });
      } catch (error) {
        console.error("Error setting remote description:", error);
      }
    } else {
      console.warn("Peer connection is already stable, ignoring offer.");
    }
  };

  // Handle incoming ICE candidates
  const handleCandidate = async (data: any) => {
    if (!pc) return;
    const candidate = new RTCIceCandidate(data.candidate);
    await pc.addIceCandidate(candidate);
  };

  // Create a new peer connection
  const createPeerConnection = () => {
    const peerConnection = new RTCPeerConnection(configuration);

    // Handle ICE candidates
    console.log("Before onicecandidate");

    peerConnection.onicecandidate = (event) => {
      console.log(event);
      
      if (event.candidate) {
        socket.emit("candidate", {
          toUserId: currentUserId,
          candidate: event.candidate,
        });
      }
    };

    // Handle incoming video stream
    peerConnection.ontrack = (event) => {
      console.log("Remote track received:", event.streams);
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = event.streams[0];
      }
    };

    return peerConnection;
  };

  // Hang up and stop streams
  const hangUp = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      if (localVideo.current) {
        localVideo.current.srcObject = null;
      }
      if (pc) {
        pc.close();
        setPc(null);
      }
      setStream(null);
    }
    setShowVideoChatCard(false);
  };

  return (
    <div
      className={
        showVideoChatCard
          ? "fixed z-[999] top-[20%] left-[30%] h-[500px] w-[500px] bg-[#332e33] rounded-md"
          : "hidden fixed z-[999] top-[20%] left-[30%] h-[500px] w-[500px] bg-[#332e33] rounded-md"
      }
    >
      <main className="relative flex flex-col gap-[5px] p-[10px]">
        <div className="flex flex-col items-center justify-center gap-y-[10px] bg-main">
          <video
            ref={localVideo}
            className="w-[60%] h-[150px] border-[2px] border-[#fff] border-solid rounded-[10px] my-[10px] mx-auto"
            autoPlay
            playsInline
          ></video>
          <video
            ref={remoteVideo}
            className="w-[60%] h-[150px] border-[2px] border-[#fff] border-solid rounded-[10px] my-[10px] mx-auto"
            autoPlay
            playsInline
          ></video>
        </div>

        <div className="flex flex-row justify-center mt-[10px] gap-x-[20px]">
          <button
            className="flex items-center justify-center w-[50px] h-[50px] text-[#fff] rounded-[50%] bg-[#0ced23] hover:bg-green-300"
            onClick={startLocalStream}
          >
            <FiVideo />
          </button>
          <button
            disabled={!stream}
            className="flex items-center justify-center w-[50px] h-[50px] text-[#fff] rounded-[50%] btn-end bg-[#e10505] hover:bg-red-300"
            onClick={hangUp}
          >
            <FiVideoOff />
          </button>
          <button
            className="flex items-center justify-center w-[50px] h-[50px] text-[#fff] rounded-[50%] bg-[#0ced23] hover:bg-green-300"
            onClick={() => setAudioState(!audioState)}
          >
            {audioState ? <FiMic /> : <FiMicOff />}
          </button>
        </div>
        <button
          className="absolute right-4 top-4 bg-red-600 h-10 w-10 rounded-full hover:bg-red-300"
          onClick={() => setShowVideoChatCard(false)}
        >
          X
        </button>
      </main>
    </div>
  );
};

export default AcceptedVideoChat;
