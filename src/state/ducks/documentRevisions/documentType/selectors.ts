import { createSelector } from "reselect";
import { ApplicationState } from "../../../reducers";

const allIds = (state: ApplicationState) => state.documentType.allIds;
const byId = (state: ApplicationState) => state.documentType.byId;

const getDocumentTypeList = createSelector(
  allIds, byId,
  (ids, changeRequests) =>
    ids.map((id) => changeRequests[id]),
);

export default {
  getDocumentTypeList,
};
