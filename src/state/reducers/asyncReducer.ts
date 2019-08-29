import { AsyncAction, AsyncReducerState, AsyncStatus } from "../types";

export const ASYNC_REDUCER_INITIAL_STATE: AsyncReducerState = {
  status: AsyncStatus.Idle,
  message: "",
};

const asyncReducer = (type: string) =>
  (state: AsyncReducerState = ASYNC_REDUCER_INITIAL_STATE, action: AsyncAction) => {
    switch (action.type) {
      case type:
        return { ...action.payload };
      default:
        return state;
    }
  };

export default asyncReducer;
