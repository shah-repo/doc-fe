import { get, some, sortBy } from "lodash";
import { createSelector } from "reselect";
import { stripTags, stripTagsFromObject } from "../../../common/utils/helpers";
import { OptionType } from "../../../ui/components/forms/fields/Autocomplete/types";
import { DocumentRevisionFormValues } from "../../../ui/documentRevision/forms/types";
import { isDocumentRevisionInStatus, isDocumentRevisionPendingChange, isDocumentRevisionReleased } from "../../../ui/documentRevision/helpers/documentRevisionStatus";
import { ApplicationState } from "../../reducers";
import { AsyncState } from "../../types";
import { Audit, AuditGroupType } from "../audit/types";
import { DocumentRevisionStatus } from "./types";

const allIds = (state: ApplicationState) => state.documentRevisions.allIds;
const byId = (state: ApplicationState) => state.documentRevisions.byId;

const documentsById = (state: ApplicationState) =>
  state.documentRevisions.documentsById;
const auditsByCRId = (state: ApplicationState) =>
  state.documentRevisions.auditsByCRId;

const getDocumentRevisionsList = createSelector(
  allIds,
  byId,
  (ids, documentRevisions) =>
    ids.map((id) => stripTagsFromObject(documentRevisions[id])),
);

const getDocumentRevision = (
  state: ApplicationState,
  documentRevisionId: string,
) => byId(state)[documentRevisionId];

const getDocument = (state: ApplicationState, documentId: string) =>
  documentsById(state)[documentId];
const getDocumentRevisions = (state: ApplicationState, documentId: string) =>
  get(documentsById(state)[documentId], "documentRevisions", []);

const getAudit = (
  state: ApplicationState,
  documentRevisionId: string,
): AuditGroupType => auditsByCRId(state)[documentRevisionId];

const getDocId = (state: ApplicationState, documentId: string) =>
  get(documentsById(state)[documentId], "docId", "");

const makeGetDocumentRevisions = () => createSelector(
  getDocumentRevisions,
  (documentRevisions) => sortBy(documentRevisions, (docRev) => -docRev.version),
);

const makeGetDisableCreateNewVersion = () => createSelector(
  [getDocumentRevisions],
  (documentRevisions) =>
    some(
      documentRevisions,
      (docRev) => isDocumentRevisionInStatus(
        [DocumentRevisionStatus.Draft, DocumentRevisionStatus.PendingChange, DocumentRevisionStatus.InReview],
        docRev.status,
      ),
    ),
);

const getCurrentDocumentValues = (
  state: ApplicationState,
  docRev: DocumentRevisionFormValues,
) => docRev;

const makeGetAvailableReferences = () => createSelector(
  [allIds, byId, getCurrentDocumentValues],
  (ids, docRevs, currentDocRev): OptionType[] => {
    const filteredIds = ids.filter((id) => {
      const { status, changeRequest } = docRevs[id];

      if (
        currentDocRev.document && currentDocRev.document.id === docRevs[id].id
      ) {
        return false;
      }

      if (isDocumentRevisionReleased(status)) {
        return true;
      }

      if (isDocumentRevisionPendingChange(status)) {
        if (
          changeRequest &&
            currentDocRev.changeRequest &&
            changeRequest.id === currentDocRev.changeRequest.id
        ) {
          return true;
        }
      }

      return false;
    });

    // filter all doc revs from same document
    const uniqueIds = filteredIds.filter((id) => {
      const docRev = docRevs[id];
      return currentDocRev.document?.id !== docRev.document.id;
    });

    return uniqueIds.map((id) => {
      const { document, name, displayRevision } = docRevs[id];

      return {
        value: document.id,
        label: `${document.docId} - ${displayRevision} - ${name}`,
      };
    });
  },
);

const makeGetAudit = () => createSelector(
  getAudit,
  (audits: AuditGroupType = {}) => {
    Object.keys(audits).forEach((groupId) => {
      audits[groupId].forEach((audit: Audit) => {
        if (audit.field === "description") {
          const html = audit.nextValue as string;
          audit.nextValue = stripTags(html).substring(0, 30);
        }
      });
    });
    return audits;
  },
);

const getLoadAsyncState = (state: ApplicationState): AsyncState =>
  state.documentRevisions.loadAsyncInfo;
const getLoadListAsyncState = (state: ApplicationState): AsyncState =>
  state.documentRevisions.loadListAsyncInfo;
const getLoadDocumentAsyncState = (state: ApplicationState): AsyncState =>
  state.documentRevisions.loadDocumentAsyncInfo;
const getLoadAuditAsyncState = (state: ApplicationState): AsyncState =>
  state.documentRevisions.loadAuditAsyncInfo;

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
  makeGetAudit,
  makeGetDisableCreateNewVersion,
  getDocId,
};
