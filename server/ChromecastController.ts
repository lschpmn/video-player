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
  private player: Player;

  constructor() {
    this.client = new Client();
  }

  async changeAddress(address: string): Promise<void> {
    await this.getPlayer(address);
  }

  async getStatus() {
    const player = await this.getPlayer();

    player.getStatus((err, status) => {
      if (err) throw err;
      return status;
    });
  }

  start(url: string, address?: string) {
    const player = this.getPlayer(address);
  }

  private async getPlayer(address?: string): Promise<Player> {
    if (this.player && (address === this.address || !address)) return Promise.resolve(this.player);

    if (!this.player && !address) {
      const a = await getChromecasts();
      console.log(a);
      address = await getChromecasts()[0];
      if (!address) throw new Error('No Chromecast address found');
    }

    return new Promise((resolve, reject) => {
      this.client.connect(address, () => {
        this.client.launch(DefaultMediaReceiver, (err, player) => {
          if (err) return reject(err);
          this.player = player;
          this.address = address;
          resolve(player);
        });
      });
    }) as Promise<Player>;
  }
}

function getChromecasts(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    mdns.once('response', (response: Response) => {
      resolve(response.answers.map(answer => answer.data));
    });

    mdns.query({
      questions: [{
        name: chromecastInfo.serviceName,
        type: chromecastInfo.serviceType,
      }]
    });
  });
}

interface Player {
  close: () => void,
  getStatus: (callback: (err: Error | null, status: any) => void) => void,
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