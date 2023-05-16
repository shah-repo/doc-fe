import { useEffect } from 'react';
import { IotService } from '../../common/utils/iot/iotService';

const iotService = IotService.getInstance();

const useMqttSubscription = (
  topic: string,
  callback: (...args: any[]) => any | Promise<any>,
) => {
  useEffect(() => {
    if (topic && callback) {
      iotService.subscribeToTopic(topic, callback);
    }
    return () => {
      if (topic && callback) {
        iotService.unsubscribeFromTopic(topic, callback);
      }
    };
  }, [topic, callback]);
};

export default useMqttSubscription;
