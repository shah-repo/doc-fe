import { createSelector } from "reselect";
import _ from 'lodash';
import { ApplicationState } from "../../reducers";
import { AsyncState } from "../../types";
import { OptionType } from "../../../ui/components/forms/fields/Autocomplete/types";
import { documentRevisionIdMask } from "../../../ui/documentRevision/helpers";
import { DocumentRevisionStatus } from "./types";

const allIds = (state: ApplicationState) => state.documentRevisions.allIds;
const byId = (state: ApplicationState) => state.documentRevisions.byId;
const documentsById = (state: ApplicationState) => state.documentRevisions.documentsById;
const auditsByCRId = (state: ApplicationState) => state.documentRevisions.auditsByCRId;
const auditsAllId = (state: ApplicationState) => state.documentRevisions.auditsAllId;

const getDocumentRevisionsList = createSelector(
  allIds, byId,
  (ids, documentRevisions) => ids.map((id) => documentRevisions[id]),
);

const getDocumentRevision = (state: ApplicationState, documentRevisionId: string) => byId(state)[documentRevisionId];
const getDocument = (state: ApplicationState, documentId: string) => documentsById(state)[documentId];
const getDocumentRevisions = (state: ApplicationState, documentId: string) => _.get(documentsById(state)[documentId], 'documentRevisions', []);
const getAudit = (state: ApplicationState, documentRevisionId: string) => auditsByCRId(state)[documentRevisionId];

const makeGetDocumentRevisions = () => {
  return createSelector(
    getDocumentRevisions,
    documentRevisions => _.sortBy(documentRevisions, ['revision']),
  )
}

const allowedStates = [DocumentRevisionStatus.Released, DocumentRevisionStatus.Deprecated, DocumentRevisionStatus.Obsolete];
const getAvailableReferences = createSelector(
  allIds, byId,
  (ids, docRevs): OptionType[] => (
    ids
    .filter((id) => allowedStates.indexOf(docRevs[id].status) > -1)
    .map((id) => ({
      value: id,
      label: `${documentRevisionIdMask(docRevs[id].type, docRevs[id].document.ordinalNumber)} - ${docRevs[id].revision} - ${docRevs[id].name}`
  }))),
);

const getLoadAsyncState = (state: ApplicationState): AsyncState => state.documentRevisions.loadAsyncInfo;
const getLoadListAsyncState = (state: ApplicationState): AsyncState => state.documentRevisions.loadListAsyncInfo;
const getLoadDocumentAsyncState = (state: ApplicationState): AsyncState => state.documentRevisions.loadDocumentAsyncInfo;
const getLoadAuditAsyncState = (state: ApplicationState): AsyncState => state.documentRevisions.loadAuditAsyncInfo;

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
  getAvailableReferences,
  getAudit,
  getLoadAuditAsyncState,
};
