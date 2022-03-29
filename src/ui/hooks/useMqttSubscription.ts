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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [didMqttConnect]);
};

export default useMqttSubscription;
