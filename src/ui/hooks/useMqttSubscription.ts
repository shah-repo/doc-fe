import { useEffect } from "react";
import useDidMqttConnect from "./useDidMqttConnect";

const useMqttSubscription = (
  subscribe: () => void,
  unsubscribe: () => void,
) => {
  const didMqttConnect = useDidMqttConnect();
  useEffect(() => {
    subscribe();
    return () => {
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (didMqttConnect) {
      subscribe();
    }
  }, [didMqttConnect]);
};

export default useMqttSubscription;
