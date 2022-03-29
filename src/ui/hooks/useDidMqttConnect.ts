import { useEffect, useState } from "react";
import { IotService } from "../../common/utils/iot/mqttClient";

const useDidMqttConnect = () => {
  const [didConnect, setDidConnect] = useState(false);
  useEffect(() => {
    const iotService = IotService.getInstance();

    if (iotService.isConnected()) {
      setDidConnect(true);
      return;
    }

    const interval = setInterval(() => {
      if (iotService.isConnected()) {
        setDidConnect(true);
        clearInterval(interval);
        return;
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return didConnect;
};

export default useDidMqttConnect;
