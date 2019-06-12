import { createSelector } from "reselect";
import { ApplicationState } from "../../reducers";
import { AsyncState } from "../../types";

const allIds = (state: ApplicationState) => state.documentRevisions.allIds;
const byId = (state: ApplicationState) => state.documentRevisions.byId;

const getDocumentRevisionsList = createSelector(
  allIds, byId,
  (ids, documentRevisions) => ids.map((id) => documentRevisions[id]),
);

const getDocumentRevision = (state: ApplicationState, documentRevisionId: string) => byId(state)[documentRevisionId];

const getLoadAsyncState = (state: ApplicationState): AsyncState => state.documentRevisions.loadAsyncInfo;
const getLoadListAsyncState = (state: ApplicationState): AsyncState => state.documentRevisions.loadListAsyncInfo;

export default {
  byId,
  getDocumentRevisionsList,
  getDocumentRevision,
  getLoadAsyncState,
  getLoadListAsyncState,
};
