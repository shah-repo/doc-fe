import _ from "lodash";
import { createSelector } from "reselect";
import { ApplicationState } from "../../../reducers";
import { AsyncState } from "../../../types";

const allIds = (state: ApplicationState) => state.documentType.allIds;
const byId = (state: ApplicationState) => state.documentType.byId;

const getDocumentTypeById = (state: ApplicationState, id: string) =>
  state.documentType.byId[id];

const getDocumentTypeList = createSelector(
  allIds, byId,
  (ids, documentTypes) =>
    ids.map((id) => documentTypes[id]),
);

const getDocumentTypeFormOptions = createSelector(
  allIds, byId,
  (ids, documentTypes) =>
    _.orderBy(
      ids.map((id) => {
        return {
          value: documentTypes[id].id,
          text: documentTypes[id].documentTypeName,
        };
      })
      , ["text"], ["asc"]),
);

const getDocumentTypeOptions = createSelector(
  allIds, byId,
  (ids, documentTypes) =>
    _.orderBy(
      ids.map((id) => {
        return {
          value: documentTypes[id].id,
          text: documentTypes[id].documentTypeAcronym,
        };
      })
      , ["text"], ["asc"]),
);

const getLoadListAsyncState = (state: ApplicationState): AsyncState => state.documentType.loadListAsyncInfo;

export default {
  byId,
  getDocumentTypeList,
  getDocumentTypeFormOptions,
  getDocumentTypeOptions,
  getLoadListAsyncState,
  getDocumentTypeById,
};
