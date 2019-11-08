import EventEmitter = NodeJS.EventEmitter;

export type Channel = EventEmitter & {
  send: (data: any) => void,
  close: () => void,
};

export type ChromecastInfo = {
  host: string,
  name: string,
};

export type receiverStatus = {
  requestId: number,
  status: {
    applications?: [
      {
        appId: string,
        displayName: string,
        namespaces: { name: string }[],
        sessionId: string,
        statusText: string,
        transportId: string,
      }
    ],
    isActiveInput: boolean,
    volume: {
      level: number,
      muted: boolean,
    }
  },
  type: 'RECEIVER_STATUS'
};

/*{
  "requestId": 8476438,
  "status": {
    "applications": [
      { "appId": "CC1AD845",
        "displayName": "Default Media Receiver",
        "namespaces": [
          "urn:x-cast:com.google.cast.player.message",
          "urn:x-cast:com.google.cast.media"
        ],
        "sessionId": "7E2FF513-CDF6-9A91-2B28-3E3DE7BAC174",
        "statusText": "Ready To Cast",
        "transportId":  "web-5" }
    ],
    "isActiveInput": true,
    "volume": {
      "level": 1,
      "muted": false
    }
  },
  "type": "RECEIVER_STATUS"
}*/
