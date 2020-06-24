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
const getProposedDocId = (state: ApplicationState): string => state.documents.proposedDocId;

const getLoadAsyncState = (state: ApplicationState): AsyncState => state.documents.loadAsyncInfo;
const getLoadListAsyncState = (state: ApplicationState): AsyncState => state.documents.loadListAsyncInfo;
const getLoadReviewListAsyncState = (state: ApplicationState): AsyncState => state.documents.loadReviewListAsyncInfo;
const getLoadProposedDocIdAsyncState = (state: ApplicationState): AsyncState =>
  state.documents.loadProposedDocIdAsyncInfo;

export default {
  getDocumentsList,
  getDocumentsToReviewList,
  getDocument,
  getLoadAsyncState,
  getLoadReviewListAsyncState,
  getLoadListAsyncState,
  getLoadProposedDocIdAsyncState,
  getProposedDocId,
};
