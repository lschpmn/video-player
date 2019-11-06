import { Client } from 'castv2';
import * as multicastdns from 'multicast-dns';
import { ChromecastInfo } from '../types';
import { setStatus } from './action-creators';
import Timeout = NodeJS.Timeout;

type Listener = (action: { type: string, payload: Object }) => void;

export default class ChromecastEmitter {
  private client: typeof Client;
  private connection: any;
  private heartbeat: any;
  private heartbeatId: Timeout;
  private listeners: Listener[] = [];
  private receiver: any;

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

  constructor(playerAddress: string, ...listeners: Listener[]) {
    this.client = new Client();

    this.client.connect(playerAddress, () => {
      console.log('connected');
      this.listeners.push(...listeners);
      // create various namespace handlers
      this.connection = this.client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.tp.connection', 'JSON');
      this.heartbeat = this.client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.tp.heartbeat', 'JSON');
      this.receiver = this.client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.receiver', 'JSON');

      this.connection.send({ type: 'CONNECT' });

      this.heartbeatId = setInterval(() => this.heartbeat.send({ type: 'PING' }), 5000);

      // TODO: move to launch function
      // this.receiver.send({ type: 'LAUNCH', appId: 'CC1AD845', requestId: 1 });

      this.receiver.on('message', status => {
        console.log('status');
        console.log(status.type);
        console.log(status.status);
        this.listener(setStatus(status));
      });
    });
  }

  private listener(action) {
    this.listeners.forEach(listener => listener(action));
  }
}
