export class PeerService {
  peer: RTCPeerConnection;
  configuration: RTCConfiguration = {
    iceServers: [
      {
        urls: [
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  constructor() {
    this.peer = new RTCPeerConnection(this.configuration);
  }

  init() {}

  async offer() {
    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(new RTCSessionDescription(offer));
    return offer;
  }

  async answer(offer: RTCSessionDescriptionInit) {
    await this.peer.setRemoteDescription(offer);
    const ans = await this.peer.createAnswer();
    await this.peer.setLocalDescription(new RTCSessionDescription(ans));
    return ans;
  }

  async setLocalDescription(ans: RTCSessionDescriptionInit) {
    await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
  }
}
