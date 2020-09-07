import { Client } from 'castv2';
import { random } from 'lodash';
import { MEDIA_NAMESPACE } from '../../../constants';
import { Channel, Listener, MediaStatusServer } from '../../../types';
import { log, setMediaDisconnect, setMediaStatus } from '../../action-creators';
import { channelErrorLogger } from '../../utils';
import Timeout = NodeJS.Timeout;
import StateMachine from '../StateMachine';

const HEARTBEAT_INTERVAL = 5000;
const HEARTBEAT_TIMEOUT = 10000;

export type MediaState = {
  isConnected: false,
  log: object[],
};

export default class MediaStateMachine extends StateMachine<MediaState> {
  private client?: typeof Client;
  private readonly connectionChannel?: Channel;
  private readonly heartbeatChannel?: Channel;
  private heartbeatId?: Timeout;
  private heartbeatTimeoutId?: Timeout;
  private readonly mediaChannel?: Channel;
  private mediaConnectChannel?: Channel;
  private mediaSessionId?: number;

  constructor(client: typeof Client, transportId: string) {
    super();
    this.client = client;
    this.updateState({
      isConnected: false,
      log: [],
    });

    this.mediaChannel = this.client.createChannel('sender-0', transportId, MEDIA_NAMESPACE, 'JSON');
    this.connectionChannel = this.client.createChannel('sender-0', transportId, 'urn:x-cast:com.google.cast.tp.connection', 'JSON');
    this.heartbeatChannel = this.client.createChannel('sender-0', transportId, 'urn:x-cast:com.google.cast.tp.heartbeat', 'JSON');

    this.connectionChannel.send({ type: 'CONNECT' });
    this.setupHeartbeat();

    this.mediaChannel.on('message', status => {
      const log = this.state.log;
      log.push(status);
      if (status.status && status.status[0]) {
        const mediaStatus: MediaStatusServer = status.status[0];
        this.dispatch(setMediaStatus(mediaStatus));
        this.mediaSessionId = mediaStatus.mediaSessionId;
      } else {
        this.dispatch(setMediaDisconnect());
      }
      if (!this.isConnected) this._isConnected = true;
    });

    this.connection.on('message', status => {
      this.dispatch(log(status));
      console.log('media connect status');
      console.log(status);
      status.type === 'CLOSE' && this.destroy();
    });

    this.connection.on('error', channelErrorLogger('media connect'));
    this.media.on('error', channelErrorLogger('media'));

    this.getStatus();
  }

  private setupHeartbeat() {
    this.heartbeatId = setInterval(() => this.heartbeatChannel.send({ type: 'PING' }), HEARTBEAT_INTERVAL);

    const heartbeatTimeout = () => setTimeout(() => {
      console.log('heartbeat timeout');
      this.updateState({ isConnected: false });
      clearInterval(this.heartbeatId);
    }, HEARTBEAT_TIMEOUT);
    this.heartbeatTimeoutId = heartbeatTimeout();
    this.heartbeatChannel.on('message', status => {
      if (status.type === 'PONG') {
        clearTimeout(this.heartbeatTimeoutId);
        this.heartbeatTimeoutId = heartbeatTimeout();
      }
    });
  }


}
