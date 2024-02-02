export class IotService {
  public static getInstance (): IotService {
    if (!IotService.instance) {
      IotService.instance = new IotService();
    }

    return IotService.instance;
  }

  private static instance: IotService;

  public async updateMqttClient (endpointRedux: any): Promise<any> {
    return await Promise.resolve();
  }

  public async subscribeToTopic (topic: any, notif: any): Promise<any> {
    return await Promise.resolve();
  }

  public async unsubscribeFromTopic (topic: string) {
    return await Promise.resolve();
  }

  public async unsubscribeAll () {
    return await Promise.resolve();
  }
}
