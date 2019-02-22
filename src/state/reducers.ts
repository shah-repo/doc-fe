import { combineReducers } from "redux";

export interface IApplicationState {
    test: { test: boolean };
}

export default combineReducers<IApplicationState>({
    test: (state = { test: true }) => state,
});
