import { Client } from 'castv2';
import { basename } from 'path';
import { MEDIA_NAMESPACE } from '../../constants';
import { Channel, Listener } from '../../types';
import { setStatus } from '../action-creators';
import { getFileUrl } from '../FileUtils';
import { channelErrorLogger } from '../utils';
import Timeout = NodeJS.Timeout;

export default class MediaEmitter {
  private client?: typeof Client;
  private readonly connection?: Channel;
  private dispatch: Listener;
  private readonly heartbeat?: Channel;
  private heartbeatId?: Timeout;
  private heartbeatTimeoutId?: Timeout;
  private _isConnected: boolean = false;
  private readonly media?: Channel;
  private mediaConnect?: Channel;

  constructor(client: typeof Client, dispatch: Listener, transportId: string) {
    this.client = client;
    this.dispatch = dispatch;

    this.media = this.client.createChannel('sender-0', transportId, MEDIA_NAMESPACE, 'JSON');
    this.connection = this.client.createChannel('sender-0', transportId, 'urn:x-cast:com.google.cast.tp.connection', 'JSON');
    this.heartbeat = this.client.createChannel('sender-0', transportId, 'urn:x-cast:com.google.cast.tp.heartbeat', 'JSON');

    this.connection.send({ type: 'CONNECT' });
    this._isConnected = true;
    this.setupHeartbeat();

    this.media.on('message', status => {
      console.log('media status');
      console.log(status.type);
      console.log(status.status);
      this.dispatch(setStatus(status));
      if (!this.isConnected) this._isConnected = true;
    });

    this.connection.on('message', status => {
      console.log('media connect status');
      console.log(status);
      status.type === 'CLOSE' && this.destroy();
    });

    this.connection.on('error', channelErrorLogger('media connect'));
    this.media.on('error', channelErrorLogger('media'));

    this.getStatus();
  }

  destroy() {
    this._isConnected = false;
    this.dispatch = null;
    this.media?.close();
    this.media?.removeAllListeners();
    this.mediaConnect?.close();
    this.mediaConnect?.removeAllListeners();
  }

  getStatus() {
    this.media.send({ type: 'GET_STATUS', requestId: 1 });
  }

  async launch(filePath: string) {
    if (!this.isConnected) return;

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
      },
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
  }

  pause() {
    this.media.send({ type: 'PAUSE' });
  }

  play() {
    this.media.send({ type: 'PLAY' });
  }

  seek(currentTime: number) {
    this.media.send({ currentTime, type: 'SEEK' });
  }

  get isConnected(): boolean {
    return this._isConnected;
  }

  private setupHeartbeat() {
    this.heartbeatId = setInterval(() => this.heartbeat.send({ type: 'PING' }), 5000);

    const heartbeatTimeout = () => setTimeout(() => {
      console.log('heartbeat timeout');
      this._isConnected = false;
      clearInterval(this.heartbeatId);
    }, 10000);
    this.heartbeatTimeoutId = heartbeatTimeout();
    this.heartbeat.on('message', status => {
      if (status.type === 'PONG') {
        clearTimeout(this.heartbeatTimeoutId);
        this.heartbeatTimeoutId = heartbeatTimeout();
      }
    });
  }
}
