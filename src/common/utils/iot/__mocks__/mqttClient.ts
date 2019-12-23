export class IotService {
    public static getInstance(): IotService {
      if (!IotService.instance) {
        IotService.instance = new IotService();
      }

      return IotService.instance;
    }
    private static instance: IotService;
      private constructor() {}

    public async setMqttCreds(endpointRedux: any): Promise<any> {
      return;
    }

    public async mqttClient() {
    }

    public async subscribeToTopic(topic: any, notif: any): Promise<any> {
      return;
    }

    public async unsubscribeFromTopic(topic: string) {
      return;
    }

    public async unsubscribeAll() {
      return;
    }

    public subscribedTopics() {
      return;
    }
}
