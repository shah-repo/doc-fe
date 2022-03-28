import { useEffect } from "react";
import useDidMqttConnect from "./useDidMqttConnect";

const useMqttSubscription = (
  subscribe: () => void,
  unsubscribe: () => void,
) => {
  const didMqttConnect = useDidMqttConnect();
  useEffect(() => {
    if (didMqttConnect) {
      subscribe();
    }
    
    return () => {
      if (didMqttConnect) {
        unsubscribe();
      }
    };
  }, [didMqttConnect]);
};

export default useMqttSubscription;
