export class WebRTCPeer {
  constructor() {
    this.peer = new RTCPeerConnection({
      iceServers: [
        {
          url: "stun:global.stun.twilio.com:3478",
          urls: "stun:global.stun.twilio.com:3478",
        },
        {
          url: "turn:global.turn.twilio.com:3478?transport=udp",
          username:
            "8d404463a01a3784584fed7a8dc40b6adb09842dd059d59c2950d41d5f4ec1a3",
          urls: "turn:global.turn.twilio.com:3478?transport=udp",
          credential: "R4O8a3pkVYeL4lRBKGnl8G5x1W0+PnM9HEDKAHsn/OY=",
        },
        {
          url: "turn:global.turn.twilio.com:3478?transport=tcp",
          username:
            "8d404463a01a3784584fed7a8dc40b6adb09842dd059d59c2950d41d5f4ec1a3",
          urls: "turn:global.turn.twilio.com:3478?transport=tcp",
          credential: "R4O8a3pkVYeL4lRBKGnl8G5x1W0+PnM9HEDKAHsn/OY=",
        },
        {
          url: "turn:global.turn.twilio.com:443?transport=tcp",
          username:
            "8d404463a01a3784584fed7a8dc40b6adb09842dd059d59c2950d41d5f4ec1a3",
          urls: "turn:global.turn.twilio.com:443?transport=tcp",
          credential: "R4O8a3pkVYeL4lRBKGnl8G5x1W0+PnM9HEDKAHsn/OY=",
        },
      ],
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
