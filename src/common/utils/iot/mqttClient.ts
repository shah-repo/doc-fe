import * as AWSMqttClient from "aws-mqtt";
import { Credentials } from "aws-sdk/global";
import _ from "lodash";

interface AwsMqttClient {
  connected: boolean;
  _events: any;
  on: any;
  _resubscribeTopics: any;
  subscribe: (topic: string) => Promise<void>;
  unsubscribe: (topic: any) => Promise<void>;
}

interface IAwsMqttClient {
  region: string;
  credentials: any;
  clientId: string;
  endpoint: string;
  will: {
    topic: string,
    payload: string,
    qos: number,
    retain: boolean,
  };
}

let credentialsMqtt: any;
let creatingClient: any = false;

export class IotService {
    public static getInstance(): IotService {
      if (!IotService.instance) {
        IotService.instance = new IotService(AWSMqttClient);
      }

      return IotService.instance;
    }

    private static instance: IotService;

    // TODO: try mqtt-this.emitter
    private emitter: any = {};

    private constructor(
      private mqttClientInstance: AwsMqttClient,
    ) {}

    public async setMqttCreds(endpointRedux: any): Promise<any> {
      credentialsMqtt = endpointRedux;
      this.createMqttClient();
    }

    public async subscribeToTopic(topic: any, notif: any): Promise<any> {
      if (this.isConnected()) {
        this.subscribe(topic, notif);
      }
    }

    public async unsubscribeFromTopic(topic: string) {
      if (!this.isConnected()) {
        // tslint:disable-next-line: no-console
        console.log("Could not unsubscribe. Client not connected");
        return;
      }

      const fullTopic = `${credentialsMqtt.environment}/${credentialsMqtt.companyId}/${topic}`;
      const topicSubscribed = _.some(Object.keys(this.mqttClientInstance._resubscribeTopics),
        (id) => id === fullTopic,
      );
      if (topicSubscribed) {
        this.mqttClientInstance.unsubscribe(fullTopic);
        delete this.emitter[fullTopic];
      }
    }

    public async unsubscribeAll() {
      if (!this.isConnected()) {
        // tslint:disable-next-line: no-console
        console.log("Could not unsubscribe all. Client not connected");
        return;
      }

      const hasSubscriptions = !_.isEmpty(Object.keys(this.mqttClientInstance._resubscribeTopics));
      if (hasSubscriptions) {
        const topics = Object.keys(this.mqttClientInstance._resubscribeTopics);
        this.mqttClientInstance.unsubscribe(topics);
        this.emitter = {};
      }
    }

    public subscribedTopics() {
      if (this.mqttClientInstance && this.mqttClientInstance._resubscribeTopics) {
        return Object.keys(this.mqttClientInstance._resubscribeTopics);
      }
      // tslint:disable-next-line: no-console
      console.log("No client available");
      return [];
    }

    public isConnected() {
      return this.mqttClientInstance && this.mqttClientInstance.connected;
    }

    private async subscribe(topic: string, notif: any) {
      const fullTopic = `${credentialsMqtt.environment}/${credentialsMqtt.companyId}/${topic}`;
      const noSubscriptions = _.isEmpty(Object.keys(this.mqttClientInstance._resubscribeTopics));
      const alreadySubscribed = _.some(Object.keys(this.mqttClientInstance._resubscribeTopics),
        (id) => id === fullTopic,
      );

      if (noSubscriptions || !alreadySubscribed) {
        await this.mqttClientInstance.subscribe(fullTopic);
        this.emitter[fullTopic] = notif;
      }
    }

    private async createMqttClient() {
      if (creatingClient) {
        return;
      }

      const clientConfig: IAwsMqttClient = {
        region: credentialsMqtt.region,
        credentials: new Credentials(
          {
            accessKeyId: credentialsMqtt.credentials.AccessKeyId,
            secretAccessKey: credentialsMqtt.credentials.SecretAccessKey,
            sessionToken: credentialsMqtt.credentials.SessionToken,
          },
        ),
        clientId: `mqtt-client-${credentialsMqtt.environment}-${(Math.floor((Math.random() * 100000) + 1))}`,
        endpoint: credentialsMqtt.endpoint,
        will: {
          topic: "WillMsg",
          payload: "Connection Closed abnormally..!",
          qos: 0,
          retain: false,
        },
      };

      creatingClient = true;
      this.mqttClientInstance = await new AWSMqttClient(clientConfig);
      this.mqttClientInstance.on("connect", () => {
        creatingClient = false;
        this.mqttClientInstance.on("message", (topic: string, message: ArrayBufferView) => {
          if (topic.includes("attachment_watermark")) {
            this.emitter[topic] && this.emitter[topic](new TextDecoder("utf-8").decode(message));
          }
        });
      });
    }
}
