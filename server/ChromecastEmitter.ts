import { Client } from 'castv2';
import * as multicastdns from 'multicast-dns';
import { basename } from 'path';
import { Channel, ChromecastInfo, receiverStatus } from '../types';
import { connection, setStatus } from './action-creators';
import { getFileUrl } from './FileUtils';
import Timeout = NodeJS.Timeout;

type Listener = (action: { type: string, payload: Object }) => void;
const DEFAULT_MEDIA_RECEIVER_ID = 'CC1AD845';
const MEDIA_NAMESPACE = 'urn:x-cast:com.google.cast.media';

export default class ChromecastEmitter {
  private chromecastHost?: string;
  private client?: typeof Client;
  private connection?: Channel;
  private heartbeat?: Channel;
  private heartbeatId?: Timeout;
  private _isConnected: boolean = false;
  private _isMediaConnected: boolean = false;
  private listeners: Listener[] = [];
  private media?: Channel;
  private mediaConnect?: Channel;
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

  constructor(...listeners: Listener[]) {
    this.addListeners(...listeners);
  }

  addListeners(...listeners: Listener[]) {
    this.listeners.push(...listeners);
  }

  connect(host: string, ...listeners: Listener[]): void {
    if (this.chromecastHost === host) {
      this.dispatch(connection(this.isConnected));
      this.isConnected && this.getStatus();
      return;
    }
    else if (this.chromecastHost) this.destroy();
    this.chromecastHost = host;

    this.client = new Client();
    this.addListeners(...listeners);

    this.client.connect(host, () => {
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

      this.receiver.on('message', (status: receiverStatus) => {
        console.log('status');
        console.log(status.type);
        console.log(status.status);
        this.dispatch(setStatus(status));

        if (status.status.applications && !this.isMediaConnected) {
          const application = status.status.applications[0];
          const hasMedia = application.namespaces.some(({ name }) => name === MEDIA_NAMESPACE);
          hasMedia && this.connectMedia(application.transportId);
        }
      });

      this.connection.on('error', errorLogger('connection'));
      this.heartbeat.on('error', errorLogger('heartbeat'));
      this.receiver.on('error', errorLogger('receiver'));

      this.getStatus();
    });

    this.client.on('error', () => {
      errorLogger('client');
      this.destroy();
      this.dispatch(connection(this.isConnected));
    });
  }

  connectMedia(transportId: string) {
    console.log('connecting to media');
    this.isMediaConnected && this.destroyMedia();

    this.media = this.client.createChannel('sender-0', transportId, MEDIA_NAMESPACE, 'JSON');
    this.mediaConnect = this.client.createChannel('sender-0', transportId, 'urn:x-cast:com.google.cast.tp.connection', 'JSON');
    this.mediaConnect.send({ type: 'CONNECT' });
    this._isMediaConnected = true;

    this.media.on('message', status => {
      console.log('media status');
      console.log(status);
      this.dispatch(setStatus(status));
    });

    this.mediaConnect.on('message', status => {
      console.log('media connect status');
      console.log(status);
      status.type === 'CLOSE' && this.destroyMedia();
    });

    this.media.on('error', errorLogger('media'));
    this.mediaConnect.on('error', errorLogger('media connect'));
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
    this._isMediaConnected = false;
    this.media.close();
    this.media.removeAllListeners();
    this.mediaConnect.close();
    this.mediaConnect.removeAllListeners();
  }

  getStatus() {
    this.receiver?.send({ type: 'GET_STATUS', requestId: 1 });
  }

  launch(filePath: string) {
    if (!this.isConnected) return;

    this.receiver.send({ type: 'LAUNCH', appId: 'CC1AD845', requestId: 1 });

    setTimeout(async () => {
      const fileUrl = await getFileUrl(filePath);

      const media = {
        contentId: fileUrl,
        contentType: 'video/mp4',
        streamType: 'BUFFERED',
        metadata: {
          type: 0,
          metadataType: 0,
          title: basename(filePath),
          images: [],
        }
      };

      const command = {
        autoplay: true,
        media,
        repeatMode: 'REPEAT_OFF',
        requestId: 2,
        type: 'LOAD',
      };

      console.log(command);
      this.media.send(command);
    }, 3000);
  }

  removeAllListeners() {
    this.listeners = [];
  }

  removeListeners(...listeners: Listener[]) {
    this.listeners = this.listeners
      .filter(listener => !listeners.includes(listener));
  }

  get isConnected() {
    return this._isConnected;
  }

  get isMediaConnected() {
    return this._isMediaConnected;
  }

  private dispatch(action) {
    this.listeners.forEach(listener => listener(action));
  }

  private setupHeartbeat() {
    this.heartbeatId = setInterval(() => this.heartbeat.send({ type: 'PING' }), 5000);

    const heartbeatTimeout = () => setTimeout(() => {
      console.log('heartbeat timeout');
      this._isConnected = false;
      this.dispatch(connection(this.isConnected));
      clearInterval(this.heartbeatId)
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

const errorLogger = channel => errorStats => console.log(`${channel} error: ${JSON.stringify(errorStats, null, 2)}`);
