import { config, Credentials } from 'aws-sdk/global';
import _ from "lodash";
import { authActions } from "../../../state/ducks/auth";
import { store } from "../../../state/store";
const AWSMqttClient = require('aws-mqtt');
let clientMqtt:any;
let credentialsMqtt:any;
let creatingClient:any = false;

export class IotService {
    async setMqttCreds(endpointRedux:any): Promise<any> {
      credentialsMqtt = endpointRedux;
    }

    async connectToClient(): Promise<any> {
        try {
          if(!credentialsMqtt) {
            await store.dispatch(authActions.getIotCreds());
          }
          if(!creatingClient) {
            creatingClient = true;
            config.region = 'us-west-2';
            config.credentials = new Credentials({
              accessKeyId: credentialsMqtt.credentials.AccessKeyId,
              secretAccessKey: credentialsMqtt.credentials.SecretAccessKey,
              sessionToken: credentialsMqtt.credentials.SessionToken,
            })
            const randomId = (Math.floor((Math.random() * 100000) + 1));
            const client = new AWSMqttClient({
              region: config.region,
              credentials: config.credentials,
              endpoint: credentialsMqtt.endpoint,
              clientId: `mqtt-fe-${credentialsMqtt.environment}-${new Date()}-${randomId}`,
              will: {
              topic: 'WillMsg',
              payload: 'Connection Closed abnormally..!',
              qos: 0,
              retain: false,
              } 
            });
            clientMqtt = client;
            clientMqtt.on('connect', () => {
              console.log('client connected');
              creatingClient = false;
            });
    
            clientMqtt.on('close', () => {
              console.log('client disconnected');
            });
            console.log(`Client Generated: ${clientMqtt}`);
          }
        } catch (err) {
          return false;
        }
    }

    async subscribeToTopic(topic:string, notif:any): Promise<any> {
        try {
            if (!clientMqtt) {
              console.log(`Client doesn't exist, Creating Client...`);
              await this.connectToClient();
              this.subscribe(topic);
            } 
            else 
            {
              if (!clientMqtt.connected) {
                console.log(`Client exists but not connected, Connecting...`);
                await this.connectToClient();
              }
              console.log(`Client exists and is connected, Trying to subscribe...`);
              this.subscribe(topic);
            }
          } 
        catch (err) {
            return false;
        }
        if(clientMqtt._events.message) {
          if(clientMqtt._events.message.length < 1) {
            clientMqtt.on('message', (topic:string, message:ArrayBufferView) => {
              notif(new TextDecoder("utf-8").decode(message));
            });
          }
        } else {
          clientMqtt.on('message', (topic:string, message:ArrayBufferView) => {
            notif(new TextDecoder("utf-8").decode(message));
          });
        }
    }

    async subscribe(topic:string) {
      const fullTopic = `${credentialsMqtt.environment}/company/${credentialsMqtt.companyId}/${topic}`;
      const noSubscriptions = _.isEmpty(Object.keys(clientMqtt._resubscribeTopics));
      const alreadySubscribed = _.some(Object.keys(clientMqtt._resubscribeTopics),
        id => id === fullTopic,
      );
      if(noSubscriptions) {
        console.log(`No subscriptions, Subscribing...`);
        await clientMqtt.subscribe(fullTopic);
        console.log(`Subscribed to: ${fullTopic}`);

      } else if (!alreadySubscribed) {
        console.log(`Requested Topic not already subscribed, Subscribing...`);
        await clientMqtt.subscribe(fullTopic);
        console.log(`Subscribed to: ${fullTopic}`);
      } 
    }

    unsubscribeCallback(topic:any) {
      console.log(`Unsubscribed from: ${topic}`);
    }

    async unsubscribeFromTopic(topic:string) {
      if(credentialsMqtt) {
        const fullTopic = `${credentialsMqtt.environment}/company/${credentialsMqtt.companyId}/${topic}`;
        const noSubscriptions = _.isEmpty(Object.keys(clientMqtt._resubscribeTopics));
        const alreadySubscribed = _.some(Object.keys(clientMqtt._resubscribeTopics),
          id => id === fullTopic,
        );
        if(noSubscriptions) {
          console.log("Nothing to unsubscribe from")
        } else if (alreadySubscribed) {
          clientMqtt.unsubscribe(fullTopic, this.unsubscribeCallback(fullTopic));
          console.log(`Unsubscribed from: ${fullTopic}`);
        }
      }
    }

    async unsubscribeAll() {
      if(credentialsMqtt) {
        const noSubscriptions = _.isEmpty(Object.keys(clientMqtt._resubscribeTopics));
        if(noSubscriptions) {
          console.log("Nothing to unsubscribe from")
        } else {
          const topics = Object.keys(clientMqtt._resubscribeTopics);
          clientMqtt.unsubscribe(topics);
          console.log(`Unsubscribed from all: ${topics}`);
        }
      }
    }
}

