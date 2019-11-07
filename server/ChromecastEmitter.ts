import { Client } from 'castv2';
import * as multicastdns from 'multicast-dns';
import { Channel, ChromecastInfo } from '../types';
import { connection, setStatus } from './action-creators';
import { getFileUrl } from './FileUtils';
import Timeout = NodeJS.Timeout;

type Listener = (action: { type: string, payload: Object }) => void;

export default class ChromecastEmitter {
  private chromecastHost?: string;
  private client?: typeof Client;
  private connection?: Channel;
  private heartbeat?: Channel;
  private heartbeatId?: Timeout;
  private _isConnected: boolean = false;
  private listeners: Listener[] = [];
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

  connect(host: string, ...listeners: Listener[]): Promise<boolean> {
    if (this.chromecastHost === host) return Promise.resolve(true);
    else if (this.chromecastHost) this.destroy();
    this.chromecastHost = host;

    this.client = new Client();
    this.addListeners(...listeners);

    return new Promise((resolve, reject) => {
      this.client.connect(host, () => {
        console.log('connected');
        this._isConnected = true;
        // create various namespace handlers
        this.connection = this.client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.tp.connection', 'JSON');
        this.heartbeat = this.client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.tp.heartbeat', 'JSON');
        this.receiver = this.client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.receiver', 'JSON');

        this.connection.send({ type: 'CONNECT' });

        this.heartbeatId = setInterval(() => this.heartbeat.send({ type: 'PING' }), 5000);

        // TODO: move to launch function
        // this.receiver.send({ type: 'LAUNCH', appId: 'CC1AD845', requestId: 1 });

        this.connection.on('disconnect', () => this.chromecastHost && this.destroy());

        this.receiver.on('message', status => {
          console.log('status');
          console.log(status.type);
          console.log(status.status);
          this.dispatch(setStatus(status));
        });

        this.client.on('error', console.log);
        this.connection.on('error', console.log);
        this.heartbeat.on('error', console.log);
        this.receiver.on('error', console.log);

        resolve(true);
      });
    });
  }

  addListeners(...listeners: Listener[]) {
    this.listeners.push(...listeners);
  }

  destroy() {
    this.connection?.send({ type: 'CLOSE' });
    this.chromecastHost = null;
    this.client?.close();
    this.connection?.close();
    this.heartbeat?.close();
    this.receiver?.close();
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
        streamType: 'BUFFERED',
        metadata: {
          type: 0,
          metadataType: 0,
          title: '',
          images: [],
        }
      };

      this.receiver.send({
        autoplay: true,
        media,
        repeatMode: 'REPEAT_OFF',
        type: 'LOAD',
      });
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
