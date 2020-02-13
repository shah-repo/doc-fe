
import { useEffect, useState } from "react";
import CallbackHandler, { CallbackHandlerFn } from "../../common/callbackHandler";

const useCallbackHandler = <T>(handler: CallbackHandlerFn<T>) => {
  const [callbackHandler] = useState(new CallbackHandler<T>(handler));

  callbackHandler.connect(handler); // reconnect on every render

  useEffect(() => () => {
    callbackHandler.disconnect(); // disconnect on unmount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return callbackHandler;
};

export default useCallbackHandler;
