import { combineReducers } from "redux";
import { ADD_WATERMARK, CLEAR_WATERMARKS, REMOVE_WATERMARK } from "./constants";
import { WatermarkActions, WatermarkState } from "./types";

const WATERMARKS_DEFAULT_STATE: WatermarkState = [];

const watermarks = (
  state = WATERMARKS_DEFAULT_STATE,
  action: WatermarkActions,
): WatermarkState => {
  switch (action.type) {
    case ADD_WATERMARK:
      return [...state, action.payload];
    case REMOVE_WATERMARK:
      return state.filter((id) => id !== action.payload);
    case CLEAR_WATERMARKS:
      return [];
    default:
      return state;
  }
};

const reducer = combineReducers({
  watermarks,
});

export default reducer;
