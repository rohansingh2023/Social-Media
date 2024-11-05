import { useEffect, useRef, useState } from "react";
import { FiMic, FiMicOff, FiVideo, FiVideoOff } from "react-icons/fi";
import { socket } from "../../utils/web-socket";
import { useVideoCardState } from "../../state-management/show-video-card";

interface Props {
  currentUser: User;
  otherUser: User | undefined;
}

const configuration: RTCConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

const StartVideoChat = ({ currentUser, otherUser }: Props) => {
  const [audiostate, setAudio] = useState(false);
  const localVideo = useRef<HTMLVideoElement | null>(null);
  const remoteVideo = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);
  const { showVideoChatCard, setShowVideoChatCard } = useVideoCardState();

  useEffect(() => {
    // Handle incoming answer and ICE candidates
    socket.on("sendAnswer", handleAnswer);
    socket.on("sendCandidate", handleCandidate);

    return () => {
      socket.off("sendAnswer", handleAnswer);
      socket.off("sendCandidate", handleCandidate);
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

  const startB = async () => {
    try {
      const mediaStream: MediaStream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          // audio: true,
        });
      if (localVideo?.current) {
        localVideo.current.srcObject = mediaStream;
      }
      setStream(mediaStream);

      const peerConnection = createPeerConnection();
      mediaStream.getTracks().forEach((track) => {
        // console.log('Adding track:', track);
        peerConnection.addTrack(track, mediaStream);
      });

      // Create and send the offer
      const offer = await peerConnection.createOffer();
      // console.log('Setting local description:', offer);
      await peerConnection.setLocalDescription(offer);

      if (socket.connected) {
        socket.emit("offer", {
          toUserId: otherUser?._id,
          toUserName: otherUser?.name,
          fromUserId: currentUser?._id,
          sdp: offer.sdp,
        });
      } else {
        console.log("Socket is not connected.");
      }
    } catch (error) {
      console.log("Error accessing webcam: ", error);
    }
  };

  const createPeerConnection = () => {
    const peerConn = new RTCPeerConnection(configuration);

    // Handle ICE candidates
    console.log("Before onicecandidate");

    peerConn.onicecandidate = (event) => {
      console.log(event);

      if (event.candidate) {
        socket.emit("candidate", {
          toUserId: otherUser?._id,
          candidate: event.candidate,
        });
      }
    };

    // Handle the incoming remote stream (from the other user)
    peerConn.ontrack = (event) => {
      console.log("Remote track received:", event.streams);
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = event.streams[0];
      } else {
        console.log("Remote video is not set correctly.");
      }
    };

    setPc(peerConn);
    return peerConn;
  };

  const handleAnswer = async (data: any) => {
    if (!pc) return;
    if (pc.signalingState !== "stable") {
      resetPeerConnection();
      console.log("Setting remote description:", data.sdp);
      await pc.setRemoteDescription(
        new RTCSessionDescription({ sdp: data?.sdp, type: "answer" })
      );
    } else {
      console.warn("Peer connection is already stable, ignoring offer.");
    }
  };

  const handleCandidate = async (data: any) => {
    if (!pc) return;
    const candidate = new RTCIceCandidate(data.candidate);
    await pc.addIceCandidate(candidate);
  };

  const hangB = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      if (localVideo.current) {
        localVideo.current.srcObject = null;
      }
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = null;
      }
      if (pc) {
        pc.close();
        setPc(null);
      }
      setStream(null);
    }
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
            onClick={startB}
          >
            <FiVideo />
          </button>
          <button
            disabled={!stream}
            className="flex items-center justify-center w-[50px] h-[50px] text-[#fff] rounded-[50%] btn-end bg-[#e10505] hover:bg-red-300"
            onClick={hangB}
          >
            <FiVideoOff />
          </button>
          <button className="flex items-center justify-center w-[50px] h-[50px] text-[#fff] rounded-[50%] bg-[#0ced23] hover:bg-green-300">
            {audiostate ? <FiMic /> : <FiMicOff />}
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

export default StartVideoChat;
