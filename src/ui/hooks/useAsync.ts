import { CancelTokenSource } from "axios";
import { useState } from "react";
import { AsyncState, AsyncStatus } from "../../state/types";
import useCallbackHandler from "./useCallbackHandler";

interface AsyncHandlers<T> {
  onSuccess?: (arg?: T) => void;
  onError?: (message?: string) => void;
  setCancelToken?: (token?: CancelTokenSource) => void;
}

export const ASYNC_DEFAULT_STATE = {
  status: AsyncStatus.Idle,
  message: "",
};

const useAsync = <T>({
  onSuccess = () => undefined,
  onError = () => undefined,
}: AsyncHandlers<T> = {}) => {
  const [asyncState, setAsyncState] = useState<AsyncState>(ASYNC_DEFAULT_STATE);
  const [cancelToken, setCancelToken] = useState<CancelTokenSource | undefined>(undefined);

  const start = <A extends (...args: any) => any>(
    action: A,
    ...args: Parameters<A>
  ) => {
    setAsyncState({ status: AsyncStatus.Active, message: "" });
    return action(...args);
  };

  const successHandler = useCallbackHandler((result: T) => {
    setAsyncState({ status: AsyncStatus.Success, message: "" });
    onSuccess(result);
  });

  const errorHandler = useCallbackHandler((message: string) => {
    setAsyncState({ status: AsyncStatus.Error, message });
    onError(message);
  });

  const reset = () => {
    if (cancelToken) {
      cancelToken.cancel();
    }
    setAsyncState(ASYNC_DEFAULT_STATE);
  };

  return {
    asyncState,
    start,
    reset,
    successHandler,
    errorHandler,
    setCancelToken,
  };
};

export type Async = ReturnType<typeof useAsync>;

export default useAsync;
