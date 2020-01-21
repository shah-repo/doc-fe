import * as AWSMqttClient from "aws-mqtt";
import { Credentials } from "aws-sdk/global";
import _ from "lodash";
import { authActions } from "../../../state/ducks/auth";
import { store } from "../../../state/store";
let credentialsMqtt: any;
let creatingClient: any = false;

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

// TODO: try mqtt-emitter
// If we create multiple clients, all of them will use this emitter
let emitter: any = {};
export class IotService {
    public static getInstance(): IotService {
      if (!IotService.instance) {
        IotService.instance = new IotService(AWSMqttClient);
      }

      return IotService.instance;
    }

    private static instance: IotService;

    private constructor(
      private mqttClientInstance: AwsMqttClient,
    ) {}

    public async setMqttCreds(endpointRedux: any): Promise<any> {
      this.unsubscribeAll();
      credentialsMqtt = endpointRedux;
      this.newClient();
    }

    public async mqttClient(): Promise<AwsMqttClient> {
      if (this.mqttClientInstance && this.mqttClientInstance.connected) {
        return this.mqttClientInstance;
      }
      if (!credentialsMqtt) {
        store.dispatch(authActions.getIotCreds());
      }
      if (!creatingClient) {
        this.newClient();
      }
      return this.mqttClientInstance;
    }

    public async subscribeToTopic(topic: any, notif: any): Promise<any> {
        try {
            if (!this.mqttClientInstance) {
              await this.mqttClient();
              this.subscribe(topic, notif);
            } else {
              if (!this.mqttClientInstance.connected) {
                await this.mqttClient();
              }
              this.subscribe(topic, notif);
            }
          } catch (err) {
            return false;
        }
        if (this.mqttClientInstance._events.message) {
          if (this.mqttClientInstance._events.message.length < 1) {
            this.mqttClientInstance.on("message", (topic: string, message: ArrayBufferView) => {
              // notifications shown only for watermarking
              if (topic.includes("attachment_watermark")) {
                emitter[topic] && emitter[topic](new TextDecoder("utf-8").decode(message));
              }
            });
          }
        } else {
          this.mqttClientInstance.on("message", (topic: string, message: ArrayBufferView) => {
            if (topic.includes("attachment_watermark")) {
              emitter[topic] && emitter[topic](new TextDecoder("utf-8").decode(message));
            }
          });
        }
    }

    public async unsubscribeFromTopic(topic: string) {
      if (!credentialsMqtt) {
        // tslint:disable-next-line: no-console
        console.log("No credentials, tried to unsubscribe from topic");
        return;
      }
      const fullTopic = `${credentialsMqtt.environment}/${credentialsMqtt.companyId}/${topic}`;
      const topicSubscribed = _.some(Object.keys(this.mqttClientInstance._resubscribeTopics),
        (id) => id === fullTopic,
      );
      if (topicSubscribed) {
        this.mqttClientInstance.unsubscribe(fullTopic);
        delete emitter[fullTopic];
      }
    }

    public async unsubscribeAll() {
      if (!credentialsMqtt) {
        // tslint:disable-next-line: no-console
        console.log("No credentials, tried to unsubscribe from all topics");
        return;
      }
      const hasSubscriptions = !_.isEmpty(Object.keys(this.mqttClientInstance._resubscribeTopics));
      if (hasSubscriptions) {
        const topics = Object.keys(this.mqttClientInstance._resubscribeTopics);
        this.mqttClientInstance.unsubscribe(topics);
        emitter = {};
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

    private async subscribe(topic: string, notif: any) {
      const fullTopic = `${credentialsMqtt.environment}/${credentialsMqtt.companyId}/${topic}`;
      const noSubscriptions = _.isEmpty(Object.keys(this.mqttClientInstance._resubscribeTopics));
      const alreadySubscribed = _.some(Object.keys(this.mqttClientInstance._resubscribeTopics),
        (id) => id === fullTopic,
      );

      if (noSubscriptions || !alreadySubscribed) {
        await this.mqttClientInstance.subscribe(fullTopic);
        emitter[fullTopic] = notif;
      }
    }

    private async newClient() {
      const clientConfig: IAwsMqttClient = {
        region: credentialsMqtt.region,
        credentials: new Credentials({
                      accessKeyId: credentialsMqtt.credentials.AccessKeyId,
                      secretAccessKey: credentialsMqtt.credentials.SecretAccessKey,
                      sessionToken: credentialsMqtt.credentials.SessionToken,
                    }),
        clientId: `mqtt-client-${credentialsMqtt.environment}-${(Math.floor((Math.random() * 100000) + 1))}`,
        endpoint: credentialsMqtt.endpoint,
        will: {
          topic: "WillMsg",
          payload: "Connection Closed abnormally..!",
          qos: 0,
          retain: false,
        },
      };

      this.mqttClientInstance = await new AWSMqttClient(clientConfig);
      creatingClient = true;
      this.mqttClientInstance.on("connect", () => {
        creatingClient = false;
      });
    }
}
