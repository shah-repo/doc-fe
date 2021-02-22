import { Document, DocumentListAction, DocumentSetAction, DocumentsToReviewListAction, DOCUMENTS_LIST, DOCUMENTS_TO_REVIEW_LIST, DOCUMENT_SET } from ".";
import { allIds, byId } from "./reducers";
import { getDocument } from "./tests/factories";

describe("documents reducers tests", () => {
  const documentList: Document[] = [
    getDocument(),
    getDocument(),
  ];
  const document = getDocument();

  const documentListAction: DocumentListAction = {
    type: DOCUMENTS_LIST,
    payload: documentList,
  };

  const documentsToReviewListAction: DocumentsToReviewListAction = {
    type: DOCUMENTS_TO_REVIEW_LIST,
    payload: documentList,
  };

  const documentSetAction: DocumentSetAction = {
    type: DOCUMENT_SET,
    payload: document,
  };

  describe("byId reducer tests", () => {
    const initialDocument = getDocument();
    const initialState = {
      [initialDocument.id]: initialDocument,
    };

    const expectedState = {
      ...initialState,
      [documentList[0].id]: documentList[0],
      [documentList[1].id]: documentList[1],
    };

    it("sets ids on DOCUMENTS_LIST action", () => {
      expect(byId(initialState, documentListAction)).toEqual(expectedState);
    });

    it("sets ids on DOCUMENTS_TO_REVIEW_LIST action", () => {
      expect(byId(initialState, documentsToReviewListAction)).toEqual(expectedState);
    });

    it("sets new document on DOCUMENT_SET action", () => {
      expect(byId(initialState, documentSetAction)).toEqual({
        ...initialState,
        [document.id]: document,
      });
    });
  });

  describe("allIds reducer tests", () => {
    const initialDocument = getDocument();
    const initialState = [initialDocument.id];

    const expectedState = [
      ...initialState,
      documentList[0].id,
      documentList[1].id,
    ];

    it("sets ids on DOCUMENTS_LIST action", () => {
      expect(allIds(initialState, documentListAction)).toEqual(expectedState);
    });

    it("sets ids on DOCUMENTS_TO_REVIEW_LIST action", () => {
      expect(allIds(initialState, documentsToReviewListAction)).toEqual(expectedState);
    });

    it("sets new document on DOCUMENT_SET action", () => {
      expect(allIds(initialState, documentSetAction)).toEqual([
        ...initialState,
        document.id,
      ]);
    });
  });

  describe("reviewIds reducer tests", () => {
    it("sets ids on DOCUMENTS_TO_REVIEW_LIST action", () => {
      expect(allIds([], documentsToReviewListAction)).toEqual([
        documentList[0].id,
        documentList[1].id,
      ]);
    });
  });
});
