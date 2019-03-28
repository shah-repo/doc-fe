import CallbackHandler from "../callbackHandler";

export const getCallbackHandler = <T>(): CallbackHandler<T> => ({
  execute: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn(),
});
