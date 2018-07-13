const Client = require('castv2-client').Client;
const DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver;
const mdns = require('multicast-dns')();

const chromecastInfo = {
  serviceName: '_googlecast._tcp.local',
  serviceType: 'PTR',
};

export default class ChromecastController {
  private readonly client: any;
  addresses: string[];
  player: Player;

  constructor() {
    this.client = new Client();

    this.connect().catch(console.log);
  }

  async getStatus() {
    this.player.getStatus();
  }

  private async connect() {
    this.addresses = await getChromecasts();
  }

  private async getPlayer(address: string): Promise<any> {
    if (this.player) return Promise.resolve(this.player);

    return new Promise((resolve, reject) => {
      this.client.connect(address, () => {
        this.client.launch(DefaultMediaReceiver, (err, player) => {
          if (err) return reject(err);
          this.player = player;
          resolve(player);
        });
      });
    });
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

const chromecastController = new ChromecastController();

interface Player {
  close: () => void,
  getStatus: () => void,
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