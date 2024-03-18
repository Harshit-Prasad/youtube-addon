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
            "6912950f7f9e560f19c121309f46f103b411ebbcd8ff9f51f02ab8775d4a96e2",
          urls: "turn:global.turn.twilio.com:3478?transport=udp",
          credential: "JZC8Gem+Aqoyhs+cAxHFcdWfxteAnmowFZ/m/vEy9K0=",
        },
        {
          url: "turn:global.turn.twilio.com:3478?transport=tcp",
          username:
            "6912950f7f9e560f19c121309f46f103b411ebbcd8ff9f51f02ab8775d4a96e2",
          urls: "turn:global.turn.twilio.com:3478?transport=tcp",
          credential: "JZC8Gem+Aqoyhs+cAxHFcdWfxteAnmowFZ/m/vEy9K0=",
        },
        {
          url: "turn:global.turn.twilio.com:443?transport=tcp",
          username:
            "6912950f7f9e560f19c121309f46f103b411ebbcd8ff9f51f02ab8775d4a96e2",
          urls: "turn:global.turn.twilio.com:443?transport=tcp",
          credential: "JZC8Gem+Aqoyhs+cAxHFcdWfxteAnmowFZ/m/vEy9K0=",
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
