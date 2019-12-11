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
      credentialsMqtt = endpointRedux;
    }

    public async mqttClient(): Promise<AwsMqttClient> {
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

      if (this.mqttClientInstance && this.mqttClientInstance.connected) {
        return this.mqttClientInstance;
      }
      if (!credentialsMqtt) {
        store.dispatch(authActions.getIotCreds());
      }
      if (!creatingClient) {
        this.mqttClientInstance = await new AWSMqttClient(clientConfig);
        creatingClient = true;
        this.mqttClientInstance.on("connect", () => {
          creatingClient = false;
        });
      }
      return this.mqttClientInstance;
    }

    public async subscribeToTopic(topic: any, notif: any): Promise<any> {
        try {
            if (!this.mqttClientInstance) {
              await this.mqttClient();
              this.subscribe(topic);
            } else {
              if (!this.mqttClientInstance.connected) {
                await this.mqttClient();
              }
              this.subscribe(topic);
            }
          } catch (err) {
            return false;
        }
        if (this.mqttClientInstance._events.message) {
          if (this.mqttClientInstance._events.message.length < 1) {
            this.mqttClientInstance.on("message", (topic: string, message: ArrayBufferView) => {
              notif(new TextDecoder("utf-8").decode(message));
            });
          }
        } else {
          this.mqttClientInstance.on("message", (topic: string, message: ArrayBufferView) => {
            notif(new TextDecoder("utf-8").decode(message));
          });
        }
    }

    public async unsubscribeFromTopic(topic: string) {
      if (credentialsMqtt) {
        const fullTopic = `${credentialsMqtt.environment}/company/${credentialsMqtt.companyId}/${topic}`;
        const topicSubscribed = _.some(Object.keys(this.mqttClientInstance._resubscribeTopics),
          (id) => id === fullTopic,
        );
        if (topicSubscribed) {
          this.mqttClientInstance.unsubscribe(fullTopic);
        }
      }
      // tslint:disable-next-line: no-console
      console.log("No credentials, tried to unsubscribe from topic");
    }

    public async unsubscribeAll() {
      if (credentialsMqtt) {
        const hasSubscriptions = !_.isEmpty(Object.keys(this.mqttClientInstance._resubscribeTopics));
        if (hasSubscriptions) {
          const topics = Object.keys(this.mqttClientInstance._resubscribeTopics);
          this.mqttClientInstance.unsubscribe(topics);
        }
      }
      // tslint:disable-next-line: no-console
      console.log("No credentials, tried to unsubscribe from all topics");
    }

    public subscribedTopics() {
      if (this.mqttClientInstance) {
        return Object.keys(this.mqttClientInstance._resubscribeTopics);
      }
      // tslint:disable-next-line: no-console
      console.log("No client available");
      return [];
    }

    private async subscribe(topic: string) {
      const fullTopic = `${credentialsMqtt.environment}/${credentialsMqtt.companyId}/${topic}`;
      const noSubscriptions = _.isEmpty(Object.keys(this.mqttClientInstance._resubscribeTopics));
      const alreadySubscribed = _.some(Object.keys(this.mqttClientInstance._resubscribeTopics),
        (id) => id === fullTopic,
      );
      if (noSubscriptions) {
        await this.mqttClientInstance.subscribe(fullTopic);

      } else if (!alreadySubscribed) {
        await this.mqttClientInstance.subscribe(fullTopic);
      }
    }
}
