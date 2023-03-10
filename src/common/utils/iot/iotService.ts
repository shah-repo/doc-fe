/* eslint-disable no-underscore-dangle */
import * as AWSMqttClient from "aws-mqtt";
import { Credentials } from "aws-sdk/global";
import debug from "debug";
import { EventEmitter } from "events";
import { some, uniq } from "lodash";
import moment from "moment";
import MQTTPattern from "mqtt-pattern";
import { IotCredentials } from "../../../state/ducks/auth/types";

const loggerDebug = debug("enlil:iotservice");

interface AwsMqttClient {
  connected: boolean;
  _events: any;
  on: any;
  _resubscribeTopics: any;
  subscribe: (topic: string) => Promise<void>;
  unsubscribe: (topic: any) => Promise<void>;
  end: (force?: boolean, cb?: () => void) => this;
}

interface IAwsMqttClient {
  region: string;
  expires: number;
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

type NotifType = (...args: any) => void;

const REINITIALIZE_TIMEOUT = 5000;

export class IotService {
  public static getInstance(): IotService {
    if (!IotService.instance) {
      IotService.instance = new IotService(AWSMqttClient);
    }

    return IotService.instance;
  }

  private static instance: IotService;
  private emitter = new EventEmitter();
  private connectedSubscriptionsTopics: string[] = [];
  private connectedSubscriptions: {topic: string; notif: NotifType}[] = [];
  private credentialsMqtt!: IotCredentials;
  private constructor(
    public mqttClientInstance: AwsMqttClient,
  ) {
    this.mqttClientInstance = mqttClientInstance;
    this.emitter.setMaxListeners(100);
  }

  public end() {
    if (this.mqttClientInstance) {
      this.mqttClientInstance.end();
    }
  }

  public reinitialize() {
    loggerDebug("(createMqttClient) reinitialize connection");

    if (!this.mqttClientInstance) {
      return this.updateMqttClient(this.credentialsMqtt);
    }

    return new Promise((resolve, reject) => {
      this.mqttClientInstance.end(true, () => {
        this.updateMqttClient(this.credentialsMqtt)
          .then(resolve)
          .catch(reject);
      });
    });
  }

  public async subscribeToTopic(topic: string, notif: NotifType): Promise<any> {
    this.emitter.addListener(topic, notif);
    this.connectedSubscriptionsTopics.push(topic);
    this.connectedSubscriptions.push({ notif, topic });

    await this.subscribeToTopicMqttClientInstance(topic);
  }

  public async unsubscribeFromTopic(topic: string, notif: NotifType) {
    const connectedTopicIndexToPop = this.connectedSubscriptionsTopics
      .findIndex((s) => s === topic);
    if (connectedTopicIndexToPop > -1) {
      this.connectedSubscriptionsTopics =
        this.connectedSubscriptionsTopics.filter((_, index) => connectedTopicIndexToPop !== index);
    }

    const connectedSubsIndexToPop = this.connectedSubscriptions
      .findIndex((s) => s.topic === topic && s.notif === notif);
    if (connectedSubsIndexToPop > -1) {
      this.connectedSubscriptions =
        this.connectedSubscriptions.filter((_, index) => connectedSubsIndexToPop !== index);
    }
    this.emitter.removeListener(topic, notif);

    if (this.emitter.listenerCount(topic)) {
      loggerDebug(
        `(unsubscribeFromTopic) There are listeners for topic ${topic}, ` +
        `skipping unsubscribeFromTopicMqttClientInstance`);
    } else {
      await this.unsubscribeFromTopicMqttClientInstance(topic);
      loggerDebug(`(unsubscribeFromTopic) No more listeners for topic ${topic}, unsubscribing`);
    }
  }

  public async unsubscribeAll() {
    for (const topic of this.connectedSubscriptionsTopics) {
      await this.unsubscribeFromTopicMqttClientInstance(topic);
    }

    this.connectedSubscriptionsTopics = [];
    this.connectedSubscriptions = [];
    this.emitter.removeAllListeners();
  }

  public isConnected() {
    return this.mqttClientInstance && this.mqttClientInstance.connected;
  }

  public async updateMqttClient(endpointRedux: any): Promise<any> {
    this.credentialsMqtt = endpointRedux;
    loggerDebug("(updateMqttClient) Updating credentials");

    const clientConfig: IAwsMqttClient = {
      region: this.credentialsMqtt.region,
      expires: 2700, // Updated expire time to 45 minutes
      credentials: new Credentials(
        {
          accessKeyId: this.credentialsMqtt.credentials.AccessKeyId,
          secretAccessKey: this.credentialsMqtt.credentials.SecretAccessKey,
          sessionToken: this.credentialsMqtt.credentials.SessionToken,
        },
      ),
      clientId: `mqtt-client-${this.credentialsMqtt.environment}-${new Date().valueOf()}-${(Math.floor((Math.random() * 100000) + 1))}`,
      endpoint: this.credentialsMqtt.endpoint,
      will: {
        topic: "WillMsg",
        payload: "Connection Closed abnormally..!",
        qos: 0,
        retain: false,
      },
    };

    this.mqttClientInstance = await new AWSMqttClient(clientConfig);

    this.mqttClientInstance.on("error", (error) => {
      loggerDebug("(createMqttClient) on error", error);
    });

    this.mqttClientInstance.on("offline", () => {
      loggerDebug("(createMqttClient) on offline");

      setTimeout(
        () => {
          this.reinitialize();
        },
        REINITIALIZE_TIMEOUT,
      );
    });

    this.mqttClientInstance.on("disconnect", (packet) => {
      loggerDebug("(createMqttClient) on disconnect", packet);
    });

    this.mqttClientInstance.on("reconnect", () => {
      loggerDebug("(createMqttClient) on reconnect");
    });

    this.mqttClientInstance.on("end", () => {
      loggerDebug("(createMqttClient) on end");
    });

    this.mqttClientInstance.on("connect", async (connack) => {
      loggerDebug("(createMqttClient) on connect", connack);
      for (const cs of this.connectedSubscriptions) {
        await this.subscribeToTopicMqttClientInstance(cs.topic);
      }
    });

    this.mqttClientInstance.on("message", (fullTopic: string, message: ArrayBufferView) => {

      const topicsToNotify = uniq(this.connectedSubscriptionsTopics
        .filter((pattern: string) => {
          const fullPattern = this.generateFullTopic(pattern);
          const match = MQTTPattern.matches(fullPattern, fullTopic);

          return match;
        }));
      for (const topicToNotify of topicsToNotify) {
        const params = MQTTPattern.extract(this.generateFullTopic(topicToNotify), fullTopic);
        loggerDebug("(createMqttClient) on message received", {
          params,
          topic: fullTopic,
          decodedMessage: new TextDecoder("utf-8").decode(message),
        });
        this.emitter.emit(topicToNotify, new TextDecoder("utf-8").decode(message), params);
      }
    });
  }

  private async subscribeToTopicMqttClientInstance(topic: string) {
    if (!this.isConnected()) {
      loggerDebug("(subscribeToTopicMqttClientInstance) Client not connected. Could not subscribe.", topic);
      return;
    }

    const fullTopic = this.generateFullTopic(topic);

    const alreadySubscribed = some(
      Object.keys(this.mqttClientInstance._resubscribeTopics),
      (id) => id === fullTopic,
    );

    if (!alreadySubscribed) {
      await this.mqttClientInstance.subscribe(
        MQTTPattern.clean(fullTopic),
      );
      loggerDebug(`(subscribeToTopicMqttClientInstance) Subscribed to : '${topic}'`);
    } else {
      loggerDebug(`(subscribeToTopicMqttClientInstance) Already subscribed to '${topic}'`);
    }
  }

  private async unsubscribeFromTopicMqttClientInstance(topic: string) {
    if (!this.isConnected()) {
      loggerDebug("(unsubscribeFromTopicMqttClientInstance) Could not unsubscribe. Client not connected", topic);
      return;
    }
    const fullTopic = this.generateFullTopic(topic);
    const topicSubscribed = some(Object.keys(this.mqttClientInstance._resubscribeTopics),
      (id) => id === fullTopic,
    );
    if (topicSubscribed) {
      await this.mqttClientInstance.unsubscribe(fullTopic);
      loggerDebug(`(unsubscribeFromTopicMqttClientInstance) Unsubscribed from ${topic}`);
    } else {
      loggerDebug(`(unsubscribeFromTopicMqttClientInstance) Could not unsubscribe. Not subscribed to topic ${topic}`);
    }
  }

  private generateFullTopic(topic: string) {
    return `${this.credentialsMqtt.environment}/${this.credentialsMqtt.companyId}/${topic}`;
  }
}

export const areValidCredentials = (credentials: IotCredentials, currenEmployeeId: string) => {
  if (!credentials) {
    loggerDebug("(validCredentials) no credentials");
    return false;
  }

  const { Expiration } = credentials.credentials;

  if (credentials.employeeId !== currenEmployeeId) {
    loggerDebug("(validCredentials)", {
      msg: "different credentials",
      credentialsEmployeeId: credentials.employeeId,
      currenEmployeeId,
    } );

    return false;
  }

  if (!Expiration) {
    loggerDebug("(validCredentials) no expirationIotDate");
    return false;
  }
  if (moment(new Date()).isAfter(moment(Expiration).subtract(10, "minute"))) {
    loggerDebug("(validCredentials) expired");
    return false;
  }
  loggerDebug("(validCredentials) credentials valid");
  return true;
};
