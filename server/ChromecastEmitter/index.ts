import { Client } from 'castv2';
import * as multicastdns from 'multicast-dns';
import { DEFAULT_MEDIA_RECEIVER_ID, MEDIA_NAMESPACE } from '../../constants';
import { Channel, ChromecastInfo, Listener, ReceiverStatus } from '../../types';
import { connection, setMediaDisconnect, setStatus } from '../action-creators';
import { channelErrorLogger, waitForTrue } from '../utils';
import MediaEmitter from './MediaEmitter';
import Timeout = NodeJS.Timeout;

export default class ChromecastEmitter {
  private appId?: string;
  private chromecastHost?: string;
  private chromecastName?: string;
  private client?: Client;
  private connection?: Channel;
  private heartbeat?: Channel;
  private heartbeatId?: Timeout;
  private _isConnected: boolean = false;
  private listener?: Listener;
  private mediaEmitter?: MediaEmitter;
  private receiver?: Channel;

  static GetChromecasts(): Promise<ChromecastInfo[]> {
    const mdns = multicastdns();

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => reject('Timeout'), 30000);

      mdns.once('response', (response) => {
        console.log('mdns query answered');
        const casts = [];
        response.additionals.forEach(additional => {
          if (additional.type === 'SRV') {
            casts.push({
              host: additional.data.target,
              name: additional.name.slice(0, additional.name.indexOf(additional.data.target.slice(0, 8)) - 1),
            });
          }
        });

        resolve(casts);

        mdns.destroy();
        clearTimeout(timeoutId);
      });

      console.log('Making mdns query');
      mdns.query('_googlecast._tcp.local', 'PTR');
    });
  }

  constructor(dispatch?: Listener) {
    if (dispatch) this.setDispatch(dispatch);
  }

  connect(chromecastInfo: ChromecastInfo): void {
    if (this.chromecastHost === chromecastInfo.host) {
      this.dispatch(connection(this.isConnected));
      this.isConnected && this.getStatus();
      return;
    } else if (this.chromecastHost) this.destroy();
    this.chromecastHost = chromecastInfo.host;
    this.chromecastName = chromecastInfo.name;

    this.client = new Client();

    console.log('connecting');
    this.client.connect(chromecastInfo.host, () => {
      console.log('connected');
      this._isConnected = true;
      this.dispatch(connection(this.isConnected));
      // create various namespace handlers
      this.connection = this.client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.tp.connection', 'JSON');
      this.heartbeat = this.client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.tp.heartbeat', 'JSON');
      this.receiver = this.client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.receiver', 'JSON');

      this.connection.send({ type: 'CONNECT' });

      this.connection.on('disconnect', () => {
        console.log('receiver disconnected');
        this.chromecastHost && this.destroy();
        this.dispatch(connection(this.isConnected));
      });

      this.connection.on('message', status => {
        console.log('connection status');
        console.log(status.type);
        console.log(status.status);
      });

      this.setupHeartbeat();

      this.receiver.on('message', (status: ReceiverStatus) => {
        console.log('status');
        console.log(status.type);
        console.log(status.status);
        this.dispatch(setStatus(status));
        if (status.status.applications && status.status.applications[0]) {
          const application = status.status.applications[0];
          const hasMedia = application.namespaces.some(({ name }) => name === MEDIA_NAMESPACE);
          this.appId = application.appId;

          if (!this.isMediaConnected && hasMedia) this.connectMedia(application.transportId);
        }
      });

      this.connection.on('error', channelErrorLogger('connection'));
      this.heartbeat.on('error', channelErrorLogger('heartbeat'));
      this.receiver.on('error', channelErrorLogger('receiver'));

      this.getStatus();
    });

    this.client.on('error', status => {
      channelErrorLogger('client')(status);
      this.chromecastHost = null;
      this._isConnected = false;
      this.dispatch(connection(this.isConnected));
    });
  }

  connectMedia(transportId: string) {
    console.log('connecting to media');
    this.isMediaConnected && this.mediaEmitter?.destroy();

    this.mediaEmitter = new MediaEmitter(this.client, this.dispatch, transportId);
  }

  destroy() {
    this.connection?.send({ type: 'CLOSE' });
    this.chromecastHost = null;
    this.client?.close();
    this.connection?.close();
    this.connection?.removeAllListeners();
    this.heartbeat?.close();
    this.heartbeat?.removeAllListeners();
    this.receiver?.close();
    this.receiver?.removeAllListeners();
    clearInterval(this.heartbeatId);

    this._isConnected = false;
    this.destroyMedia();
    this.dispatch(connection(this.isConnected));
  }

  destroyMedia() {
    this.mediaEmitter?.destroy();
  }

  getMediaStatus() {
     if (this.isMediaConnected) this.mediaEmitter.getStatus();
     else {
       this.dispatch(connection(this.isConnected));
       this.dispatch(setMediaDisconnect());
     }
  }

  getStatus() {
    this.receiver?.send({ type: 'GET_STATUS', requestId: 1 });
    this.isMediaConnected && this.mediaEmitter.getStatus();
  }

  async launch(filePath: string, isUrl = false) {
    if (!this.isConnected) return;

    if (this.appId !== DEFAULT_MEDIA_RECEIVER_ID) this.receiver.send({
      appId: DEFAULT_MEDIA_RECEIVER_ID,
      requestId: 1,
      type: 'LAUNCH',
    });

    await waitForTrue(() => this.isMediaConnected, 15000);

    this.mediaEmitter?.launch(filePath, isUrl).catch(console.log);
  }

  setDispatch(dispatch: Listener) {
    this.listener = dispatch;
  }

  setMuted(muted: boolean) {
    this.receiver?.send({
      requestId: Math.round(Math.random() * 100),
      type: 'SET_VOLUME',
      volume: {
        muted,
      },
    });
  }

  setVolume(level: number) {
    this.receiver?.send({
      requestId: Math.round(Math.random() * 100),
      type: 'SET_VOLUME',
      volume: {
        level,
      },
    });
  }

  get isConnected() {
    return this._isConnected;
  }

  get isMediaConnected(): boolean {
    return this.mediaEmitter?.isConnected;
  }

  // pass-through media controls
  pause = () => this.mediaEmitter?.pause();
  play = () => this.mediaEmitter?.play();
  seek = (currentTime: number) => this.mediaEmitter?.seek(currentTime);
  stop = () => this.mediaEmitter?.stop();

  private dispatch = action => this.listener(action);

  private setupHeartbeat() {
    this.heartbeatId = setInterval(() => this.heartbeat.send({ type: 'PING' }), 5000);

    const heartbeatTimeout = () => setTimeout(() => {
      console.log('heartbeat timeout');
      this._isConnected = false;
      this.dispatch(connection(this.isConnected));
      clearInterval(this.heartbeatId);
    }, 10000);
    let heartbeatTimeoutId = heartbeatTimeout();
    this.heartbeat.on('message', status => {
      if (status.type === 'PONG') {
        clearTimeout(heartbeatTimeoutId);
        heartbeatTimeoutId = heartbeatTimeout();
      }
    });
  }
}
