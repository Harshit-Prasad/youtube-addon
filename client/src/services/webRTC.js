class WebRTCPeer {
  constructor() {
    this.peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
          ],
        },
        // { urls: "stun:freeturn.net:5349" },
        // {
        //   urls: "turns:freeturn.tel:5349",
        //   username: "free",
        //   credential: "free",
        // },
      ],
    });
  }

  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  }

  async getAnswer(offer) {
    if (this.peer) {
      await this.peer.setRemoteDescription(offer);
      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(new RTCSessionDescription(answer));
      return answer;
    }
  }

  async setLocalDescription(answer) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }
}

export default WebRTCPeer;
