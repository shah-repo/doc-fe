import { keyBy } from "lodash";
import { combineReducers } from "redux";
import { ALL_PAGE_DETAILS_FETCHED } from "./constants";
import { PageDetailsAction, PageDetailsState } from "./types";

const byCategory = (
  state: PageDetailsState = {},
  action: PageDetailsAction,
): PageDetailsState => {
  switch (action.type) {
    case ALL_PAGE_DETAILS_FETCHED: {
      return keyBy(action.payload, (pageDetails) => pageDetails.category);
    }
    default: {
      return state;
    }
  }
};

export default combineReducers({
  byCategory,
});
