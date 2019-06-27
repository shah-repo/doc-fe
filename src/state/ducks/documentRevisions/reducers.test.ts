import { DOCUMENT_REVISION_SET, DOCUMENT_REVISION_LIST, DOCUMENT_REVISION_LIST_ASYNC, DOCUMENT_SET, DOCUMENT_REVISION_AUDIT_SET } from "./constants";
import { allIds, byId, documentsById, auditsByCRId, auditsAllId } from "./reducers";
import { getDocumentRevision, getDocument, getAudit } from "./tests/factories";
import { DocumentRevision, DocumentRevisionsListAction, DocumentRevisionSetAction, DocumentSetAction, DocumentRevisionAuditSetAction } from "./types";

describe("document revisions reducers tests", () => {
  const documentRevisionList: DocumentRevision[] = [
    getDocumentRevision(),
    getDocumentRevision(),
  ];
  const documentRevision = getDocumentRevision();
  const document = getDocument();
  const audit = [
    getAudit(),
    getAudit(),
  ]
  const auditPayload = {
    id: documentRevision.id,
    audit,
  }

  const documentRevisionListAction: DocumentRevisionsListAction = {
    type: DOCUMENT_REVISION_LIST,
    payload: documentRevisionList,
  };

  const documentRevisionSetAction: DocumentRevisionSetAction = {
    type: DOCUMENT_REVISION_SET,
    payload: documentRevision,
  };

  const documentSetAction: DocumentSetAction = {
    type: DOCUMENT_SET,
    payload: document,
  };

  const auditAction: DocumentRevisionAuditSetAction = {
    type: DOCUMENT_REVISION_AUDIT_SET,
    payload: auditPayload,
  };

  describe("byId reducer tests", () => {
    const initialDocumentRevision = getDocumentRevision();
    const initialState = {
      [initialDocumentRevision.id]: initialDocumentRevision,
    };

    const expectedState = {
      ...initialState,
      [documentRevisionList[0].id]: documentRevisionList[0],
      [documentRevisionList[1].id]: documentRevisionList[1],
    };

    it("sets ids on DOCUMENT_REVISION_LIST action", () => {
      expect(byId(initialState, documentRevisionListAction)).toEqual(expectedState);
    });

    it("sets new document on DOCUMENT_REVISION_SET action", () => {
      expect(byId(initialState, documentRevisionSetAction)).toEqual({
        ...initialState,
        [documentRevision.id]: documentRevision,
      });
    });
  });

  describe("allIds reducer tests", () => {
    const initialDocumentRevision = getDocumentRevision();
    const initialState = [initialDocumentRevision.id];

    const expectedState = [
      ...initialState,
      documentRevisionList[0].id,
      documentRevisionList[1].id,
    ];

    it("sets ids on DOCUMENT_REVISION_LIST action", () => {
      expect(allIds(initialState, documentRevisionListAction)).toEqual(expectedState);
    });

    it("sets new document on DOCUMENT_REVISION_SET action", () => {
      expect(allIds(initialState, documentRevisionSetAction)).toEqual([
        ...initialState,
        documentRevision.id,
      ]);
    });
  });

  describe("documentsById reducer tests", () => {
    const initialDocument = getDocument();
    const initialState = {
      [initialDocument.id]: initialDocument,
    };

    it("sets new document on DOCUMENT_SET action", () => {
      expect(documentsById(initialState, documentSetAction)).toEqual({
        ...initialState,
        [document.id]: document,
      });
    });
  });

  describe("auditsByCRId reducer tests", () => {
    const initialState = {};

    const expectedState = {
      ...initialState,
      [documentRevision.id]: audit,
    };

    it("sets ids on CHANGE_REQUEST_AUDIT_SET action", () => {
      expect(auditsByCRId(initialState, auditAction)).toEqual(expectedState);
    });
  });

  describe("auditsAllId reducer tests", () => {
    const initialState = [documentRevisionList[0].id];

    const expectedState = [
      ...initialState,
      documentRevision.id,
    ];

    it("sets ids on CHANGE_REQUEST_AUDIT_SET action", () => {
      expect(auditsAllId(initialState, auditAction)).toEqual(expectedState);
    });
  });
});
