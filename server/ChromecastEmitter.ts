import { Client } from 'castv2';
import * as multicastdns from 'multicast-dns';
import Timeout = NodeJS.Timeout;

const mdns = multicastdns();

export default class ChromecastEmitter {
  client: typeof Client;
  connection: any;
  heartbeat: any;
  heartbeatId: Timeout;
  receiver: any;

  static GetChromecasts(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      mdns.once('response', (response) => {
        console.log('mdns query answered');
        resolve(response.answers.map(answer => answer.data));
      });

      console.log('Making mdns query');
      mdns.query('_googlecast._tcp.local', 'PTR');
    });
  }

  constructor(playerAddress: string) {
    this.client = new Client();

    this.client.connect(playerAddress);
    // create various namespace handlers
    this.connection = this.client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.tp.connection', 'JSON');
    this.heartbeat  = this.client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.tp.heartbeat', 'JSON');
    this.receiver   = this.client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.receiver', 'JSON');

    this.connection.send({ type: 'CONNECT' });

    this.heartbeatId = setInterval(() => this.heartbeat.send({ type: 'PING' }), 5000);
  }
}
