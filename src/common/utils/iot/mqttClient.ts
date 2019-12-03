import { config, Credentials } from 'aws-sdk/global';
import _ from "lodash";
import { authActions } from "../../../state/ducks/auth";
import { store } from "../../../state/store";
const AWSMqttClient = require('aws-mqtt');
let clientMqtt:any;
let credentialsMqtt:any;

export class IotService {
    async setMqttCreds(endpointRedux:any): Promise<any> {
      credentialsMqtt = endpointRedux;
      console.log(`Credentials for IOT: ${credentialsMqtt}`);
    }
    async connectToClient(): Promise<any> {
        try {
        if(!credentialsMqtt) {
          await store.dispatch(authActions.getIotCreds());
        }
        console.log(`Credentials for IOT: ${credentialsMqtt}`);
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
            clientId: `mqtt-fe-${credentialsMqtt.environment}-${randomId}`,
            will: {
            topic: 'WillMsg',
            payload: 'Connection Closed abnormally..!',
            qos: 0,
            retain: false
            } 
        });
        clientMqtt = client;
        console.log(`Client Generated: ${clientMqtt}`);
        } catch (err) {
        return false;
        }
    }

    async subscribeToTopic(topic:string, notif:any): Promise<any> {
        try {
            if (!clientMqtt) {
              console.log(`Client doesn't exist, Creating Client...`);
              await this.connectToClient();
              console.log(`Trying to subscribe`);
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

    subscribe(topic:string) {
      const fullTopic = `${credentialsMqtt.environment}/company/${credentialsMqtt.companyId}/${topic}`;
      const noSubscriptions = _.isEmpty(clientMqtt.messageIdToTopic);
      const alreadySubscribed = _.some(clientMqtt.messageIdToTopic,
        id => id["0"] === fullTopic,
      );
      debugger
      if(noSubscriptions) {
        clientMqtt.subscribe(fullTopic);
        console.log(`Subscribed to: ${fullTopic}`);

      } else if (!alreadySubscribed) {
        clientMqtt.subscribe(fullTopic);
        console.log(`Subscribed to: ${fullTopic}`);
      }
    }

    async unsubscribeFromTopic(topic:string) {
      const fullTopic = `${credentialsMqtt.environment}/company/${credentialsMqtt.companyId}/${topic}`;
      const noSubscriptions = _.isEmpty(clientMqtt.messageIdToTopic);
      const alreadySubscribed = _.some(clientMqtt.messageIdToTopic,
        id => id["0"] === fullTopic,
      );
      if(noSubscriptions) {
        console.log("Nothing to unsubscribe from")
      } else if (alreadySubscribed) {
        debugger
        clientMqtt.unsubscribe(fullTopic);
        console.log(`Subscribed to: ${fullTopic}`);
      }
    }
}

