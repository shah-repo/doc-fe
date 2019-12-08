import * as AWSMqttClient from "aws-mqtt";
import { config, Credentials } from "aws-sdk/global";
import _ from "lodash";
import { authActions } from "../../../state/ducks/auth";
import { store } from "../../../state/store";
let clientMqtt: any;
let credentialsMqtt: any;
let creatingClient: any = false;

export class IotService {
    public async setMqttCreds(endpointRedux: any): Promise<any> {
      credentialsMqtt = endpointRedux;
    }

    public async connectToClient(): Promise<any> {
        try {
          if (!credentialsMqtt) {
            await store.dispatch(authActions.getIotCreds());
          }
          if (!creatingClient) {
            if (!clientMqtt) {
              creatingClient = true;
              config.region = "us-west-2";
              config.credentials = new Credentials({
                accessKeyId: credentialsMqtt.credentials.AccessKeyId,
                secretAccessKey: credentialsMqtt.credentials.SecretAccessKey,
                sessionToken: credentialsMqtt.credentials.SessionToken,
              });
              const randomId = (Math.floor((Math.random() * 100000) + 1));
              const client = new AWSMqttClient({
                region: config.region,
                credentials: config.credentials,
                endpoint: credentialsMqtt.endpoint,
                clientId: `mqtt-fe-${credentialsMqtt.environment}-${new Date()}-${randomId}`,
                will: {
                topic: "WillMsg",
                payload: "Connection Closed abnormally..!",
                qos: 0,
                retain: false,
                },
              });
              clientMqtt = client;
              clientMqtt.on("connect", () => {
                creatingClient = false;
              });

              clientMqtt.on("close", () => {
                console.log("mqtt client connection lost");
              });
            }
          }
        } catch (err) {
          return false;
        }
    }

    public async subscribeToTopic(topic: any, notif: any): Promise<any> {
        try {
            if (!clientMqtt) {
              await this.connectToClient();
              this.subscribe(topic);
            } else {
              if (!clientMqtt.connected) {
                await this.connectToClient();
              }
              this.subscribe(topic);
            }
          } catch (err) {
            return false;
        }
        if (clientMqtt._events.message) {
          if (clientMqtt._events.message.length < 1) {
            clientMqtt.on("message", (topic: string, message: ArrayBufferView) => {
              notif(new TextDecoder("utf-8").decode(message));
            });
          }
        } else {
          clientMqtt.on("message", (topic: string, message: ArrayBufferView) => {
            notif(new TextDecoder("utf-8").decode(message));
          });
        }
    }

    public async unsubscribeFromTopic(topic: string) {
      if (credentialsMqtt) {
        const fullTopic = `${credentialsMqtt.environment}/company/${credentialsMqtt.companyId}/${topic}`;
        const topicSubscribed = _.some(Object.keys(clientMqtt._resubscribeTopics),
          (id) => id === fullTopic,
        );
        if (topicSubscribed) {
          clientMqtt.unsubscribe(fullTopic);
        }
      }
    }

    public async unsubscribeAll() {
      if (credentialsMqtt) {
        const hasSubscriptions = !_.isEmpty(Object.keys(clientMqtt._resubscribeTopics));
        if (hasSubscriptions) {
          const topics = Object.keys(clientMqtt._resubscribeTopics);
          clientMqtt.unsubscribe(topics);
        }
      }
    }

    public subscribedTopics() {
      if (clientMqtt) {
        return Object.keys(clientMqtt._resubscribeTopics);
      }
    }

    private async subscribe(topic: string) {
      const fullTopic = `${credentialsMqtt.environment}/${credentialsMqtt.companyId}/${topic}`;
      const noSubscriptions = _.isEmpty(Object.keys(clientMqtt._resubscribeTopics));
      const alreadySubscribed = _.some(Object.keys(clientMqtt._resubscribeTopics),
        (id) => id === fullTopic,
      );
      if (noSubscriptions) {
        await clientMqtt.subscribe(fullTopic);

      } else if (!alreadySubscribed) {
        await clientMqtt.subscribe(fullTopic);
      }
    }
}
