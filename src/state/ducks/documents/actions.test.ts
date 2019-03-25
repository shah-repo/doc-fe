import CallbackHandler from "../../../common/callbackHandler";
import { resetAsyncStateAction } from "../../factories";
import actions from "./actions";
import { DOCUMENT_SAVE_ASYNC, DOCUMENTS_ROOT_URL, DOCUMENTS_TO_REVIEW_URL } from "./constants";
import { getDocument, getDocumentEditRequestBody } from "./tests/factories";
import { Document, DocumentEditRequestBody } from "./types";

describe("documents actions tests", () => {
  describe("loadList tests", () => {
    const action = actions.loadList();

    it("calls GET on DOCUMENTS_ROOT_URL", () => {
      expect(action.url).toBe(DOCUMENTS_ROOT_URL);
      expect(action.method).toBe("get");
    });

    it("calls dispatch with documentsList action on success", () => {
      const dispatch = jest.fn();
      action.onSuccess([], dispatch);
      expect(dispatch).toHaveBeenCalledWith(actions.documentsList([]));
    });
  });

  describe("loadReviewList tests", () => {
    const action = actions.loadReviewList();

    it("calls GET on DOCUMENTS_TO_REVIEW_URL", () => {
      expect(action.url).toBe(DOCUMENTS_TO_REVIEW_URL);
      expect(action.method).toBe("get");
    });

    it("calls dispatch with documentsToReviewList action on success", () => {
      const dispatch = jest.fn();
      action.onSuccess([], dispatch);
      expect(dispatch).toHaveBeenCalledWith(actions.documentsToReviewList([]));
    });
  });

  const document: Document = getDocument();
  const body: DocumentEditRequestBody = getDocumentEditRequestBody();

  describe("load tests", () => {
    const action = actions.load(document.id);

    it("calls GET on DOCUMENTS_ROOT_URL/id", () => {
      expect(action.url).toBe(`${DOCUMENTS_ROOT_URL}/${document.id}`);
      expect(action.method).toBe("get");
    });

    it("calls dispatch with documentSet action on success", () => {
      const dispatch = jest.fn();
      action.onSuccess(document, dispatch);
      expect(dispatch).toHaveBeenCalledWith(actions.documentSet(document));
    });
  });

  describe("resetDocumentSaveAsyncStatus action tests", async () => {
    const action = actions.resetDocumentSaveAsyncStatus();

    it("calls resetAsyncStateAction", () => {
      expect(action).toEqual(resetAsyncStateAction(DOCUMENT_SAVE_ASYNC));
    });
  });

  describe("create tests", () => {
    const successHandler: CallbackHandler<Document> = new CallbackHandler();
    successHandler.execute = jest.fn();

    const action = actions.create(body, successHandler);

    it("calls POST on DOCUMENTS_ROOT_URL", () => {
      expect(action.url).toBe(DOCUMENTS_ROOT_URL);
      expect(action.method).toBe("post");
    });

    it("calls dispatch with documentSet action and successHandler.execute on success", () => {
      const dispatch = jest.fn();
      action.onSuccess(document, dispatch);

      expect(dispatch).toHaveBeenCalledWith(actions.documentSet(document));
      expect(successHandler.execute).toHaveBeenCalledWith(document);
    });
  });

  describe("save tests", () => {
    const action = actions.save(document.id, body);

    it("calls PATCH on DOCUMENTS_ROOT_URL/id", () => {
      expect(action.url).toBe(`${DOCUMENTS_ROOT_URL}/${document.id}`);
      expect(action.method).toBe("patch");
    });

    it("calls dispatch with documentSet action on success", () => {
      const dispatch = jest.fn();
      action.onSuccess(document, dispatch);
      expect(dispatch).toHaveBeenCalledWith(actions.documentSet(document));
    });
  });
});
