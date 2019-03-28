import _ from "lodash";
import { getCallbackHandler } from "../../../common/tests/factories";
import { resetAsyncStateAction } from "../../factories";
import actions from "./actions";
import { DOCUMENT_SAVE_ASYNC, DOCUMENTS_ROOT_URL, DOCUMENTS_TO_REVIEW_URL } from "./constants";
import { getDocument, getDocumentEditRequestBody } from "./tests/factories";
import { Document, DocumentEditRequestBody, DocumentTransitionRequestBody } from "./types";

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
    const successHandler = getCallbackHandler<Document>();
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

  describe("applyTransition tests", () => {
    const successHandler = getCallbackHandler<string>();
    const errorHandler = getCallbackHandler<string>();
    const transitionBody: DocumentTransitionRequestBody = {
      password: "PASS",
    };

    const action = actions.applyTransition(
      document.id,
      transitionBody,
      "approve",
      successHandler,
      errorHandler,
    );

    it("calls POST on DOCUMENTS_ROOT_URL/id/approve", () => {
      expect(action.url).toBe(`${DOCUMENTS_ROOT_URL}/${document.id}/approve`);
      expect(action.method).toBe("post");
    });

    it("calls dispatch with load action on success", () => {
      const dispatch = jest.fn();
      action.onSuccess(document, dispatch);
      const expectedLoadAction = actions.load(document.id);

      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        url: expectedLoadAction.url,
        method: expectedLoadAction.method,
      }));
      expect(successHandler.execute).toHaveBeenCalledWith(document.id);
    });

    it("calls error handler on error", () => {
      const dispatch = jest.fn();
      action.onFailure("ERROR", dispatch);

      expect(errorHandler.execute).toHaveBeenCalledWith("ERROR");
    });
  });
});
