import { combineReducers } from "redux";
import { ADD_WATERMARK, REMOVE_WATERMARK } from "./constants";
import { WatermarkActions, WatermarkState } from "./types";

export const WATERMARKS_DEFAULT_STATE: WatermarkState = [];

export const watermarks = (
  state = WATERMARKS_DEFAULT_STATE,
  action: WatermarkActions,
): WatermarkState => {
  switch (action.type) {
    case ADD_WATERMARK:
      return [...state, action.payload];
    case REMOVE_WATERMARK:
      return state.filter((id) => id !== action.payload);
    default:
      return state;
  }
};

const reducer = combineReducers({
  watermarks,
});

export default reducer;
