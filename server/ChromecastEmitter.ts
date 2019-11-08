import { Client } from 'castv2';
import * as multicastdns from 'multicast-dns';
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
  private listeners: Listener[] = [];
  private media?: Channel;
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

      this.heartbeatId = setInterval(() => this.heartbeat.send({ type: 'PING' }), 5000);

      this.connection.on('disconnect', () => this.chromecastHost && this.destroy());

      this.connection.on('message', status => {
        console.log('connection status');
        console.log(status.type);
        console.log(status.status);
      });

      const heartbeatTimeout = () => setTimeout(() => {
        console.log('heartbeat timeout');
        this._isConnected = false;
        this.dispatch(connection(this.isConnected));
      }, 10000);
      let heartbeatTimeoutId = heartbeatTimeout();
      this.heartbeat.on('message', status => {
        if (status.type === 'PONG') {
          clearTimeout(heartbeatTimeoutId);
          heartbeatTimeoutId = heartbeatTimeout();
        }
      });

      this.receiver.on('message', (status: receiverStatus) => {
        console.log('status');
        console.log(status.type);
        console.log(status.status);
        this.dispatch(setStatus(status));

        if (status.status.applications) {
          const application = status.status.applications[0];
          if (application.namespaces.some(({ name }) => name === MEDIA_NAMESPACE)) {
            console.log('it can play media, launching media channel');
            this.connectMedia(application.transportId);
          }
        }

      });

      this.client.on('error', errorLogger('client'));
      this.connection.on('error', errorLogger('client'));
      this.heartbeat.on('error', errorLogger('client'));
      this.receiver.on('error', errorLogger('client'));
    });
  }

  connectMedia(transportId: string) {
    console.log(`transportId: ${transportId}`);
    if (this.media) {
      this.media.close();
      this.media.removeAllListeners();
    }

    this.media = this.client.createChannel('sender-0', transportId, MEDIA_NAMESPACE, 'JSON');
    const connection = this.client.createChannel('sender-0', transportId, 'urn:x-cast:com.google.cast.tp.connection', 'JSON');

    connection.send({ type: 'CONNECT' });

    this.media.on('message', status => {
      console.log('media status');
      console.log(status);
      this.dispatch(setStatus(status));
    });

    this.media.on('error', status => {
      console.log('media error');
      console.log(status);
    });
  }

  destroy() {
    this.connection?.send({ type: 'CLOSE' });
    this.chromecastHost = null;
    this.client?.close();
    this.connection?.close();
    this.connection.removeAllListeners();
    this.heartbeat?.close();
    this.heartbeat?.removeAllListeners();
    this.media?.close();
    this.media?.removeAllListeners();
    this.receiver?.close();
    this.receiver?.removeAllListeners();
    clearInterval(this.heartbeatId);

    this.dispatch(connection(false));
  }

  getStatus() {
    this.connection?.send({ type: 'GET_STATUS' });
  }

  async launch(filePath: string) {
    if (!this.isConnected) return;

    this.receiver.send({ type: 'LAUNCH', appId: 'CC1AD845', requestId: 1 });

    setTimeout(async () => {
      const fileUrl = await getFileUrl(filePath);

      const media = {
        contentId: fileUrl,
        contentType: 'video/mp4',
        // streamType: 'BUFFERED',
        metadata: {
          type: 0,
          metadataType: 0,
          title: 'please work',
          images: [],
        }
      };

      const command = {
        autoplay: true,
        // currentTime: 0,
        media,
        // repeatMode: 'REPEAT_OFF',
        requestId: 2,
        type: 'LOAD',
      };

      console.log(command);
      this.media.send(command);
    }, 3000);

    // const fileUrl = await getFileUrl(filePath);

    //var media = {
    //
    //       	// Here you can plug an URL to any mp4, webm, mp3 or jpg file with the proper contentType.
    //         contentId: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/big_buck_bunny_1080p.mp4',
    //         contentType: 'video/mp4',
    //         streamType: 'BUFFERED', // or LIVE
    //
    //         // Title and cover displayed while buffering
    //         metadata: {
    //           type: 0,
    //           metadataType: 0,
    //           title: "Big Buck Bunny",
    //           images: [
    //             { url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg' }
    //           ]
    //         }
    //       };

    // const media = {
    //   contentId: fileUrl,
    //   contentType: 'video/mp4',
    //   streamType: 'BUFFERED',
    // };
    //
    // this.receiver.send({
    //   autoplay: true,
    //   media,
    //   repeatMode: 'REPEAT_OFF',
    //   type: 'LOAD',
    // });
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

  private dispatch(action) {
    this.listeners.forEach(listener => listener(action));
  }
}

const errorLogger = channel => errorStats => console.log(`${channel} error: ${JSON.stringify(errorStats, null, 2)}`);
