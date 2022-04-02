import { useEffect } from "react";

const useMqttSubscription = (
  subscribe: () => void,
  unsubscribe: () => void,
) => {
  useEffect(() => {
    subscribe();
    return () => {
      unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribe, unsubscribe]);
};

export default useMqttSubscription;
