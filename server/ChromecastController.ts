import { Player } from '../client/types';

const Client = require('castv2-client').Client;
const DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver;
const mdns = require('multicast-dns')();

const chromecastInfo = {
  serviceName: '_googlecast._tcp.local',
  serviceType: 'PTR',
};

export default class ChromecastController {
  address: string;
  private readonly client: any;
  private tmpErrorHandler?: (err: Error) => void;
  private player: Player;

  constructor() {
    this.client = new Client();

    this.client.on('error', this.errorHandler);
  }

  async changeAddress(address: string): Promise<void> {
    await this.getPlayer(address);
  }

  async getStatus(address?: string) {
    const player = await this.getPlayer(address);

    player.getStatus((err, status) => {
      if (err) throw err;
      return status;
    });
  }

  async start(url: string, address?: string) {
    return new Promise(async (resolve, reject) => {
      console.log('grabbing player');
      const player = await this.getPlayer(address);

      const media = {
        contentId: url,
        contentType: 'video/mp4',
        streamType: 'BUFFERED',
      };

      console.log('got player, starting media');
      player.load(media, { autoplay: true }, (err, status) => {
        if (err) reject(err);

        console.log('play status');
        console.log(status);

        resolve(status);
      });
    });
  }

  private errorHandler(err) {
    if (this.errorHandler) this.errorHandler(err);
  }

  private async getPlayer(address?: string): Promise<Player> {
    if (this.player && (address === this.address || !address)) return Promise.resolve(this.player);

    if (!this.player && !address) {
      const chromecasts = await getChromecasts();
      console.log(chromecasts);
      address = chromecasts[0];
      if (!address) throw new Error('No Chromecast address found');
    }

    return new Promise((resolve, reject) => {
      this.tmpErrorHandler = reject;

      this.client.connect(address, () => {
        this.client.launch(DefaultMediaReceiver, (err, player) => {
          if (err) return reject(err);
          this.player = player;
          this.address = address;
          this.tmpErrorHandler = null;
          resolve(player);
        });
      });
    }) as Promise<Player>;
  }
}

function getChromecasts(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    mdns.once('response', (response: Response) => {
      console.log('mdns query answered');
      resolve(response.answers.map(answer => answer.data));
    });

    console.log('Making mdns query');
    mdns.query({
      questions: [{
        name: chromecastInfo.serviceName,
        type: chromecastInfo.serviceType,
      }]
    });
  });
}

type Response = {
  answers: {
    class: string,
    // The name and address
    data: string,
    flush: boolean,
    // Network name, ignore
    name: string,
    ttl: number,
    type: string,
  }[],
};