import { CancelTokenSource } from "axios";
import { Action, Dispatch } from "redux";
import CallbackHandler from "../common/callbackHandler";

export type ApiActionMethod = "get" | "post" | "put" | "patch" | "delete";

export interface ApiAction<Response = any, Body = any> extends Action {
  type: string;
  method: ApiActionMethod;
  url: string;
  data?: Body;
  params?: any;
  includeAuthorization?: boolean;
  asyncType?: string;
  contentType?: string;
  password?: string;
  onSuccess: (data: Response, dispatch: Dispatch) => void;
  onFailure: (error: any,  dispatch: Dispatch) => void;
  onCompleted: (dispatch: Dispatch) => void;
  cancelToken?: CancelTokenSource;
  sendNoResponseHeader?: boolean;
}

export interface ActionWithPayload<P> extends Action {
  payload: P;
}

export enum AsyncStatus {
  Idle = "IDLE",
  Active = "ACTIVE",
  Success = "SUCCESS",
  Error = "ERROR",
}

export interface AsyncActionPayload {
  status: AsyncStatus;
  message: string;
}

export type AsyncReducerState = AsyncActionPayload;
export type AsyncState = AsyncReducerState;
export type AsyncAction = ActionWithPayload<AsyncActionPayload>;

export interface LoadAsyncState {
  loadAsyncState: AsyncState;
}

export interface Handlers<S = any, E = string> {
  successHandler: CallbackHandler<S>;
  errorHandler: CallbackHandler<E>;
  setCancelToken: (token?: CancelTokenSource) => void;
}
