import EventEmitter = NodeJS.EventEmitter;

export type Channel = EventEmitter & {
  send: (data: any) => void,
  close: () => void,
};

export type ChromecastInfo = {
  host: string,
  name: string,
};
