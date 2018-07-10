const Client = require('castv2-client').Client;
const mdns = require('multicast-dns')();
const ssdp = require('node-ssdp').Client;

const chromecastInfo = {
  serviceName: '_googlecast._tcp.local',
  serviceType: 'PTR',
};

export default class Chromecast {
  private readonly client: any;
  private readonly ssdp: any;

  constructor() {
    this.client = new Client();
    this.ssdp = new ssdp();

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