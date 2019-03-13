import { Action, Dispatch } from "redux";

export interface ApiAction<Response = any, Body = any> extends Action {
  type: string;
  method: "get" | "post" | "put" | "patch" | "delete";
  url: string;
  data?: Body;
  params?: any;
  includeAuthorization?: boolean;
  asyncType?: string;
  onSuccess: (data: Response, dispatch: Dispatch) => void;
  onFailure: (error: any,  dispatch: Dispatch) => void;
  onCompleted: (dispatch: Dispatch) => void;
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
