import { cloneDeep } from "lodash";
import { ApplicationState } from "../../reducers";
import { getAsyncState } from "../../tests/factories";
import initialStoreState from "../../tests/helpers/initialStoreState";
import selectors from "./selectors";
import { getDocument } from "./tests/factories";
import { DocumentsAllIdsState, DocumentsByIdState, DocumentsReviewIdsState } from "./types";

describe("document selectors tests", () => {
  let state: ApplicationState;
  const documents = [getDocument(), getDocument()];
  const allIds: DocumentsAllIdsState = [documents[0].id, documents[1].id];
  const byId: DocumentsByIdState = {
    [documents[0].id]: documents[0],
    [documents[1].id]: documents[1],
  };
  const reviewIds: DocumentsReviewIdsState = [documents[1].id];

  beforeAll(() => {
    state = cloneDeep(initialStoreState);
    state.documents.allIds = allIds;
    state.documents.byId = byId;
    state.documents.reviewIds = reviewIds;
    state.documents.loadAsyncInfo = getAsyncState();
    state.documents.loadListAsyncInfo = getAsyncState();
    state.documents.loadReviewListAsyncInfo = getAsyncState();
  });

  it("getDocumentsList", () => {
    expect(selectors.getDocumentsList(state)).toEqual(documents);
  });

  it("getDocumentsToReviewList", () => {
    expect(selectors.getDocumentsToReviewList(state)).toEqual([
      documents[1],
    ]);
  });

  it("getDocument", () => {
    expect(selectors.getDocument(state, documents[0].id)).toEqual(documents[0]);
  });

  it("getLoadAsyncState", () => {
    expect(selectors.getLoadAsyncState(state)).toBe(state.documents.loadAsyncInfo);
  });

  it("getLoadListAsyncState", () => {
    expect(selectors.getLoadListAsyncState(state)).toBe(state.documents.loadListAsyncInfo);
  });

  it("getLoadReviewListAsyncState", () => {
    expect(selectors.getLoadReviewListAsyncState(state)).toBe(state.documents.loadReviewListAsyncInfo);
  });
});
