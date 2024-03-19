export class WebRTCPeer {
  constructor() {
    this.peer = new RTCPeerConnection({
      iceServers: JSON.parse(import.meta.env.VITE_ICE_SERVERS),
    });
  }

  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(offer);
      return offer;
    }
  }

  async getAnswer() {
    if (this.peer) {
      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(answer);
      return answer;
    }
  }
}

export default new WebRTCPeer();
