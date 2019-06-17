import { createSelector } from "reselect";
import _ from 'lodash';
import { ApplicationState } from "../../reducers";
import { AsyncState } from "../../types";

const allIds = (state: ApplicationState) => state.documentRevisions.allIds;
const byId = (state: ApplicationState) => state.documentRevisions.byId;
const documentsById = (state: ApplicationState) => state.documentRevisions.documentsById;

const getDocumentRevisionsList = createSelector(
  allIds, byId,
  (ids, documentRevisions) => ids.map((id) => documentRevisions[id]),
);

const getDocumentRevision = (state: ApplicationState, documentRevisionId: string) => byId(state)[documentRevisionId];
const getDocument = (state: ApplicationState, documentId: string) => documentsById(state)[documentId];
const getDocumentRevisions = (state: ApplicationState, documentId: string) => _.get(documentsById(state)[documentId], 'documentRevisions', []);

const makeGetDocumentRevisions = () => {
  return createSelector(
    getDocumentRevisions,
    documentRevisions => documentRevisions
  )
}

const getLoadAsyncState = (state: ApplicationState): AsyncState => state.documentRevisions.loadAsyncInfo;
const getLoadListAsyncState = (state: ApplicationState): AsyncState => state.documentRevisions.loadListAsyncInfo;
const getLoadDocumentAsyncState = (state: ApplicationState): AsyncState => state.documentRevisions.loadDocumentAsyncInfo;

export default {
  byId,
  getDocumentRevisionsList,
  getDocumentRevision,
  getLoadAsyncState,
  getLoadListAsyncState,
  getLoadDocumentAsyncState,
  getDocument,
  getDocumentRevisions,
  makeGetDocumentRevisions,
};
