const Client = require('castv2-client').Client;
const mdns = require('multicast-dns')();

const chromecastInfo = {
  serviceName: '_googlecast._tcp.local',
  serviceType: 'PTR',
};

export default class ChromecastController {
  private readonly client: any;
  chromecasts: Chromecast[];

  constructor() {
    this.client = new Client();

    this.connect().catch(console.log);
  }

  private async connect() {
    this.chromecasts = await getChromecasts();
  }
}

function getChromecasts(): Promise<Chromecast[]> {
  return new Promise((resolve, reject) => {
    mdns.once('response', (response: Response) => {
      resolve(responseMapper(response));
    });

    mdns.query({
      questions: [{
        name: chromecastInfo.serviceName,
        type: chromecastInfo.serviceType,
      }]
    });
  });
}

function responseMapper(response: Response): Chromecast[] {
  return response.answers
    .map(answer => {
      const nameArray = answer.data.split('-');
      const name = `${nameArray[0]} ${nameArray[1]}`;

      return {
        address: answer.data,
        name,
      };
    });
}

const chromecastController = new ChromecastController();

type Chromecast = {
  address: string,
  name: string,
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