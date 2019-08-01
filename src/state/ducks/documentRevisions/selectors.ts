import _ from "lodash";
import { createSelector } from "reselect";
import { OptionType } from "../../../ui/components/forms/fields/Autocomplete/types";
import { ApplicationState } from "../../reducers";
import { AsyncState } from "../../types";
import { DocumentRevisionStatus } from ".";
import { DocumentRevisionFormValues } from "../../../ui/documentRevision/forms/types";

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
const getDocumentRevisions = (state: ApplicationState, documentId: string) => _.get(documentsById(state)[documentId], "documentRevisions", []);
const getAudit = (state: ApplicationState, documentRevisionId: string) => auditsByCRId(state)[documentRevisionId];

const makeGetDocumentRevisions = () => {
  return createSelector(
    getDocumentRevisions,
    (documentRevisions) => _.sortBy(documentRevisions, ["version"]),
  );
};

const getCurrentDocumentValues = (state: ApplicationState, docRev: DocumentRevisionFormValues) => docRev;

const makeGetAvailableReferences = () => {
  return createSelector(
    [allIds, byId, getCurrentDocumentValues],
    (ids, docRevs, currentDocRev): OptionType[] => {
      const filteredIds = ids.filter((id) => {
        const { status, changeRequest, document } = docRevs[id];

        if (currentDocRev.document && currentDocRev.document.id === document.id) {
          return false;
        }

        if (status === DocumentRevisionStatus.Released) {
          return true;
        }

        if (status === DocumentRevisionStatus.PendingChange) {
          if ((changeRequest && currentDocRev.changeRequest) && (changeRequest.id === currentDocRev.changeRequest.id)) {
            return true;
          }
        }

        return false;
      })

      // if two doc revs from same to document, take the one with the higher version number
      const uniqueIds = filteredIds.filter((id) => {
        const docRev = docRevs[id];

        const skipId = _.some(filteredIds, (filteredId) => {
          const filteredDocRev = docRevs[filteredId];

          if (filteredDocRev.document.id === docRev.document.id) {
            return filteredDocRev.version > docRev.version;
          }

          return false;
        })

        return !skipId;
      })

      return uniqueIds.map((id) => {
        const { document, revision, name } = docRevs[id];
    
        return {
          value: document.id,
          label: `${document.docId} - ${revision} - ${name}`,
        };
      });
    }
  );
};

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
  getAudit,
  getLoadAuditAsyncState,
  makeGetAvailableReferences,
};
