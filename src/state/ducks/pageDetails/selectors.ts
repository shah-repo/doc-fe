import { flatMap } from "lodash";
import { ApplicationState } from "../../reducers";

const byCategory = (state: ApplicationState) => state.pageDetails.byCategory;

const allPageDetails = (state: ApplicationState) => flatMap(state.pageDetails.byCategory);

export default {
  byCategory,
  allPageDetails,
};
