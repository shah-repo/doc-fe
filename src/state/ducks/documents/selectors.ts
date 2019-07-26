import { createSelector } from "reselect";
import { store } from "../../../state/store";
import { ApplicationState } from "../../reducers";
import { AsyncState } from "../../types";
import { DOCUMENT_PROPOSED_DOC_ID_SET } from "./constants";

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
const setProposedDocId = (docId: string) => store.dispatch({
  type: DOCUMENT_PROPOSED_DOC_ID_SET,
  payload: docId,
});

const getLoadAsyncState = (state: ApplicationState): AsyncState => state.documents.loadAsyncInfo;
const getLoadListAsyncState = (state: ApplicationState): AsyncState => state.documents.loadListAsyncInfo;
const getLoadReviewListAsyncState = (state: ApplicationState): AsyncState => state.documents.loadReviewListAsyncInfo;

export default {
  getDocumentsList,
  getDocumentsToReviewList,
  getDocument,
  getLoadAsyncState,
  getLoadReviewListAsyncState,
  getLoadListAsyncState,
  getProposedDocId,
  setProposedDocId,
};
