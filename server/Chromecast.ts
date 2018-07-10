const Client = require('castv2-client').Client;
const mdns = require('multicast-dns')();

const chromecastInfo = {
  serviceName: '_googlecast._tcp.local',
  serviceType: 'PTR',
};

export default class Chromecast {
  private readonly client: any;
  chromecasts: ChromeCast[];

  constructor() {
    this.client = new Client();

    mdns.on('response', this.response);
    this.connect();
  }

  private connect() {
    mdns.query({
      questions: [{
        name: chromecastInfo.serviceName,
        type: chromecastInfo.serviceType,
      }]
    });
  }

  private response = (response: Response) => {
    this.chromecasts = response.answers
      .map(answer => {
        const nameArray = answer.data.split('-');
        const name = `${nameArray[0]} ${nameArray[1]}`;

        return {
          address: answer.data,
          name,
        };
      });
    console.log(this.chromecasts);
  }
}

const chromecast = new Chromecast();

type ChromeCast = {
  address: string,
  name: string,
}

type Response = {
  answers: {
    class: string,
    // The name
    data: string,
    flush: boolean,
    // Network name, ignore
    name: string,
    ttl: number,
    type: string,
  }[],
};