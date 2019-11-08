import EventEmitter = NodeJS.EventEmitter;

export type Channel = EventEmitter & {
  send: (data: any) => void,
  close: () => void,
};

export type ChromecastInfo = {
  host: string,
  name: string,
};

export type Listener = (action: { type: string, payload: any }) => void;

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
