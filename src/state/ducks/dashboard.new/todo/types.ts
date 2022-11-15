import { MY_FEEDS_LIST } from "./constants";
import { MyFeedsListApiResponse } from "../my.feeds/types";

export * from "../my.feeds/types";

export interface MyFeedsListAction {
  type: typeof MY_FEEDS_LIST;
  payload: MyFeedsListApiResponse;
  initialLoad?: boolean;
}
