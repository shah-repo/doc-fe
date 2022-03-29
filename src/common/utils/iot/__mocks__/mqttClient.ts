export class IotService {
  public static getInstance(): IotService {
    if (!IotService.instance) {
      IotService.instance = new IotService();
    }

    return IotService.instance;
  }
  private static instance: IotService;

  public async setMqttCreds(endpointRedux: any): Promise<any> {
    return Promise.resolve();
  }

  public async mqttClient() {
    return Promise.resolve();
  }

  public async subscribeToTopic(topic: any, notif: any): Promise<any> {
    return Promise.resolve();
  }

  public async unsubscribeFromTopic(topic: string) {
    return Promise.resolve();
  }

  public async unsubscribeAll() {
    return Promise.resolve();
  }

  public subscribedTopics() {
    return Promise.resolve();
  }
}
