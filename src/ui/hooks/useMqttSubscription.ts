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
  }, [subscribe, unsubscribe]);
  useEffect(() => {
    if (didMqttConnect) {
      subscribe();
    }
  }, [didMqttConnect, subscribe]);
};

export default useMqttSubscription;
