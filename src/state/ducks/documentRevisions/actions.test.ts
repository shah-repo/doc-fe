import _ from "lodash";
import { getCallbackHandler } from "../../../common/tests/factories";
import { Handlers } from "../../types";
import actions from "./actions";
import { DOCUMENT_REVISION_ROOT_URL, DOCUMENT_ROOT_URL } from "./constants";
import { getDocumentRevision, getDocumentRevisionEditRequestBody, getDocument } from "./tests/factories";
import { DocumentRevision, DocumentRevisionEditRequestBody, Document } from "./types";

describe("documents actions tests", () => {
  describe("loadList tests", () => {
    const action = actions.loadList();

    it("calls GET on DOCUMENT_REVISION_ROOT_URL", () => {
      expect(action.url).toBe(DOCUMENT_REVISION_ROOT_URL);
      expect(action.method).toBe("get");
    });

    it("calls dispatch with documentRevisionsList action on success", () => {
      const dispatch = jest.fn();
      action.onSuccess([], dispatch);
      expect(dispatch).toHaveBeenCalledWith(actions.documentRevisionsList([]));
    });
  });

  const documentRevision: DocumentRevision = getDocumentRevision();
  const body: DocumentRevisionEditRequestBody = getDocumentRevisionEditRequestBody();
  const document: Document = getDocument();

  describe("load tests", () => {
    const action = actions.load(documentRevision.id);

    it("calls GET on DOCUMENT_REVISION_ROOT_URL/id", () => {
      expect(action.url).toBe(`${DOCUMENT_REVISION_ROOT_URL}/${documentRevision.id}`);
      expect(action.method).toBe("get");
    });

    it("calls dispatch with documentRevisionSet action on success", () => {
      const dispatch = jest.fn();
      action.onSuccess(documentRevision, dispatch);
      expect(dispatch).toHaveBeenCalledWith(actions.documentRevisionSet(documentRevision));
    });
  });

  describe("save tests", () => {
    const handlers: Handlers<DocumentRevision> = {
      successHandler: getCallbackHandler<DocumentRevision>(),
      errorHandler: getCallbackHandler<string>(),
    };
    const action = actions.save(documentRevision.id, body, handlers);

    it("calls PATCH on DOCUMENT_REVISION_ROOT_URL/id", () => {
      expect(action.url).toBe(`${DOCUMENT_REVISION_ROOT_URL}/${documentRevision.id}`);
      expect(action.method).toBe("patch");
    });

    it("calls dispatch with documentRevisionSet action on success", () => {
      const dispatch = jest.fn();
      action.onSuccess(documentRevision, dispatch);
      expect(dispatch).toHaveBeenCalledWith(actions.documentRevisionSet(documentRevision));
    });
  });

  describe("load document tests", () => {
    const action = actions.loadDocument(documentRevision.document.id);

    it("calls GET on DOCUMENT_ROOT_URL/id", () => {
      expect(action.url).toBe(`${DOCUMENT_ROOT_URL}/${documentRevision.document.id}`);
      expect(action.method).toBe("get");
    });

    it("calls dispatch with documentSet action on success", () => {
      const dispatch = jest.fn();
      action.onSuccess(document, dispatch);
      expect(dispatch).toHaveBeenCalledWith(actions.documentSet(document));
    });
  });
});
