import { combineReducers } from "redux";
import asyncReducer from "../../reducers/asyncReducer";
import { ATTACHMENT_UPLOAD_ASYNC } from "./constants";

const reducer = combineReducers({
  attachmentAsyncStatus: asyncReducer(ATTACHMENT_UPLOAD_ASYNC),
});

export default reducer;
