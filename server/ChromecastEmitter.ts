import { Client } from 'castv2';
import * as multicastdns from 'multicast-dns';
import Timeout = NodeJS.Timeout;

export default class ChromecastEmitter {
  client: typeof Client;
  connection: any;
  heartbeat: any;
  heartbeatId: Timeout;
  receiver: any;

  static GetChromecasts(): Promise<{ host: string, name: string }[]> {
    const mdns = multicastdns();

    return new Promise((resolve, reject) => {
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
      });

      console.log('Making mdns query');
      mdns.query('_googlecast._tcp.local', 'PTR');
    });
  }

  constructor(playerAddress: string) {
    this.client = new Client();

    this.client.connect(playerAddress, () => {
      console.log('connected');
      // create various namespace handlers
      this.connection = this.client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.tp.connection', 'JSON');
      this.heartbeat = this.client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.tp.heartbeat', 'JSON');
      this.receiver = this.client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.receiver', 'JSON');

      this.connection.send({ type: 'CONNECT' });

      this.heartbeatId = setInterval(() => this.heartbeat.send({ type: 'PING' }), 5000);

      this.receiver.send({ type: 'LAUNCH', appId: 'CC1AD845', requestId: 1 });

      this.receiver.on('message', status => {
        console.log('status');
        console.log(status.type);
        console.log(status.status);
      });
    });
  }
}

async function start() {
  const chromecasts = await ChromecastEmitter.GetChromecasts();
  console.log(chromecasts);

  const chromecast = new ChromecastEmitter(chromecasts[0].host);
}

start().catch(console.log);
