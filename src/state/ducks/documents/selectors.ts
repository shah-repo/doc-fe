import { createSelector } from "reselect";
import { ApplicationState } from "../../reducers";
import { AsyncState } from "../../types";

const allIds = (state: ApplicationState) => state.documents.allIds;
const reviewIds = (state: ApplicationState) => state.documents.reviewIds;
const byId = (state: ApplicationState) => state.documents.byId;

const getDocumentsList = createSelector(
  allIds, byId,
  (ids, documents) => ids.map((id) => documents[id]),
);

const getDocumentsToReviewList = createSelector(
  reviewIds, byId,
  (ids, documents) => ids.map((id) => documents[id]),
);

const getDocument = (state: ApplicationState, documentId: string) => byId(state)[documentId];

const getSaveAsyncState = (state: ApplicationState): AsyncState => state.documents.saveAsyncInfo;
const getLoadAsyncState = (state: ApplicationState): AsyncState => state.documents.loadAsyncInfo;
const getLoadListAsyncState = (state: ApplicationState): AsyncState => state.documents.loadListAsyncInfo;
const getLoadReviewListAsyncState = (state: ApplicationState): AsyncState => state.documents.loadReviewListAsyncInfo;

export default {
  getDocumentsList,
  getDocumentsToReviewList,
  getDocument,
  getSaveAsyncState,
  getLoadAsyncState,
  getLoadReviewListAsyncState,
  getLoadListAsyncState,
};
