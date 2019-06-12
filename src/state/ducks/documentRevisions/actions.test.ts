import _ from "lodash";
import { getCallbackHandler } from "../../../common/tests/factories";
import { Handlers } from "../../types";
import actions from "./actions";
import { DOCUMENT_REVISION_ROOT_URL } from "./constants";
import { getDocumentRevision, getDocumentRevisionEditRequestBody } from "./tests/factories";
import { DocumentRevision, DocumentRevisionEditRequestBody } from "./types";

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
});
