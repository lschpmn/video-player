const Client = require('castv2-client').Client;
const mdns = require('multicast-dns')();

const chromecastInfo = {
  serviceName: '_googlecast._tcp.local',
  serviceType: 'PTR',
};

export default class Chromecast {
  private readonly client: any;

  constructor() {
    this.client = new Client();

    mdns.on('response', this.response);
    this.connect();
  }

  private connect() {
    mdns.query({
      questions:[{
        name: chromecastInfo.serviceName,
        type: chromecastInfo.serviceType,
      }]
    });
  }

  private response = response => {
    console.log(response);
  }
}

const chromecast = new Chromecast();