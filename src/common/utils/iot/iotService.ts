/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import * as AWSMqttClient from "aws-mqtt";
import { Credentials } from "aws-sdk/global";
import  debug  from "debug";
import { Dictionary, isEmpty, some } from "lodash";
import moment from "moment";
import MQTTPattern from "mqtt-pattern";
import { IotCredentials } from "../../../state/ducks/auth/types";

const debugLog = debug("enlil:iotservice")

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
    topic: string;
    payload: string;
    qos: number;
    retain: boolean;
  };
}

let credentialsMqtt: IotCredentials;
let creatingClient = false;
let retrySubscriptions: Dictionary<any> = {};

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
  private connectedSubscriptions: Dictionary<any> = {};

  private constructor(
    public mqttClientInstance: AwsMqttClient,
  ) {
    this.mqttClientInstance = mqttClientInstance;
  }

  public async updateMqttClient(endpointRedux: any): Promise<any> {
    credentialsMqtt = endpointRedux;
    debugLog("(updateMqttClient) Updating credentials");
    await this.createMqttClient();
  }

  public subscribeToTopic(topic: string, notif: any): any {
    if (!this.isConnected()) {
      debugLog("(subscribeToTopic) Could not subscribe. Client not connected", topic);
      retrySubscriptions[topic] = notif;
      return;
    }

    this.subscribe(topic, notif);
  }

  public async unsubscribeFromTopic(topic: string) {
    if (!this.isConnected()) {
      debugLog("(unsubscribeFromTopic) Could not unsubscribe. Client not connected", topic);
      return;
    }

    const fullTopic = `${credentialsMqtt.environment}/${credentialsMqtt.companyId}/${topic}`;
    const topicSubscribed = some(Object.keys(this.mqttClientInstance._resubscribeTopics),
      (id) => id === fullTopic,
    );
    if (topicSubscribed) {
      await this.mqttClientInstance.unsubscribe(fullTopic);

      delete this.emitter[fullTopic];
    } else {
      debugLog(`(unsubscribeFromTopic) cannot unsubscribe from ${topic}, not subscribed`)
    }
  }

  public async unsubscribeAll() {
    if (!this.isConnected()) {
      debugLog("(unsubscribeAll) Could not unsubscribe all. Client not connected");
      return;
    }

    const hasSubscriptions = !isEmpty(Object.keys(this.mqttClientInstance._resubscribeTopics));
    if (hasSubscriptions) {
      const topics = Object.keys(this.mqttClientInstance._resubscribeTopics);

      await this.mqttClientInstance.unsubscribe(topics);
      this.emitter = {};
      this.connectedSubscriptions = {};
    }
  }

  public subscribedTopics() {
    if (this.mqttClientInstance && this.mqttClientInstance._resubscribeTopics) {
      return Object.keys(this.mqttClientInstance._resubscribeTopics);
    }
    debugLog("(subscribedTopics) No client available");
    return [];
  }

  public isConnected() {
    return this.mqttClientInstance && this.mqttClientInstance.connected;
  }

  private async subscribe(topic: string, notif: any) {
    const fullTopic = `${credentialsMqtt.environment}/${credentialsMqtt.companyId}/${topic}`;
    const noSubscriptions = isEmpty(Object.keys(this.mqttClientInstance._resubscribeTopics));
    const alreadySubscribed = some(Object.keys(this.mqttClientInstance._resubscribeTopics),
      (id) => id === fullTopic,
    );

    if (noSubscriptions || !alreadySubscribed) {
      await this.mqttClientInstance.subscribe(
        MQTTPattern.clean(fullTopic),
      );
      this.emitter[fullTopic] = notif;
      this.connectedSubscriptions[topic] = notif;
      debugLog(`(subscribe) Subscribed to : '${topic}'`)
    } else {
      debugLog(`(subscribe) already subscribed to '${topic}'`)
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
      clientId: `mqtt-client-${credentialsMqtt.environment}-${new Date().valueOf()}-${(Math.floor((Math.random() * 100000) + 1))}`,
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
    
    this.mqttClientInstance.on("error", (error) => {
      debugLog("(createMqttClient) on error", error)
    });

    this.mqttClientInstance.on("offline", () => {
      debugLog("(createMqttClient) on offline")
    });

    this.mqttClientInstance.on("disconnect", (packet) => {
      debugLog("(createMqttClient) on disconnect", packet)
    });

    this.mqttClientInstance.on("reconnect", () => {
      debugLog("(createMqttClient) on reconnect")
    });

    this.mqttClientInstance.on("end", () => {
      debugLog("(createMqttClient) on end")
    }); 

    this.mqttClientInstance.on("connect", (connack) => {
      debugLog("(createMqttClient) on connect", connack)
      Object.keys(this.connectedSubscriptions).forEach((topic) => this.subscribe(topic, this.connectedSubscriptions[topic]));
      Object.keys(retrySubscriptions).forEach((topic) => this.subscribe(topic, retrySubscriptions[topic]));
      creatingClient = false;

      retrySubscriptions = {};
    });
    this.mqttClientInstance.on("message", (topic: string, message: ArrayBufferView) => {
      const emitterKey = Object.keys(this.emitter).find((pattern: string) =>
        MQTTPattern.matches(pattern, topic),
      );

      if (!emitterKey) {
        return;
      }

      const params = MQTTPattern.extract(emitterKey, topic);
      debugLog("(createMqttClient) on message received", {
        params,
        topic,
        decodedMessage: new TextDecoder("utf-8").decode(message),
      });
      this.emitter[emitterKey] && this.emitter[emitterKey](new TextDecoder("utf-8").decode(message), params);
    });
  }
}


export const areValidCredentials = (credentials: IotCredentials, currenEmployeeId: string) => {
  if(!credentials) {
    debugLog("(validCredentials) no credentials");
    return false;
  }
  
  const { Expiration} = credentials.credentials;
  
  if(credentials.employeeId !== currenEmployeeId) {
    debugLog("(validCredentials)", {msg: "different credentials",credentialsEmployeeId: credentials.employeeId, currenEmployeeId: currenEmployeeId} );
    return false;
  }

  if(!Expiration) {
    debugLog("(validCredentials) no expirationIotDate");
    return false;
  }
  if(moment(new Date()).isAfter(moment(Expiration).subtract(10, "minute"))) {
    debugLog("(validCredentials) expired");
    return false;
  }
  debugLog("(validCredentials) credentials valid");
  return true;
}
