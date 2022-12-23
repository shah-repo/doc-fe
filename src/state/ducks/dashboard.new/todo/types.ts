import { MY_FEEDS_LIST } from "./constants";
import * as feedTypes from "../my.feeds/types";

export type MyFeedsListApiResponse = feedTypes.MyFeedsListApiResponse;
export type MyFeedsState = feedTypes.MyFeedsState;

export interface MyFeedsListAction {
  type: typeof MY_FEEDS_LIST;
  payload: MyFeedsListApiResponse;
  initialLoad?: boolean;
}
