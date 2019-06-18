import _ from "lodash";
import { ApplicationState } from "../../reducers";
import { getAsyncState } from "../../tests/factories";
import initialStoreState from "../../tests/helpers/initialStoreState";
import selectors from "./selectors";
import { getDocumentRevision, getDocument } from "./tests/factories";
import { DocumentRevisionsAllIdsState, DocumentRevisionsByIdState, DocumentByIdState } from "./types";

describe("document revision selectors tests", () => {
  let state: ApplicationState;
  const documentRevisions = [getDocumentRevision(), getDocumentRevision()];
  const allIds: DocumentRevisionsAllIdsState = [documentRevisions[0].id, documentRevisions[1].id];
  const byId: DocumentRevisionsByIdState = {
    [documentRevisions[0].id]: documentRevisions[0],
    [documentRevisions[1].id]: documentRevisions[1],
  };
  const documents = [getDocument(), getDocument()];
  const documentsById: DocumentByIdState = {
    [documents[0].id]: documents[0],
    [documents[1].id]: documents[1],
  };

  beforeAll(() => {
    state = _.cloneDeep(initialStoreState);
    state.documentRevisions.allIds = allIds;
    state.documentRevisions.byId = byId;
    state.documentRevisions.documentsById = documentsById;
    state.documentRevisions.loadAsyncInfo = getAsyncState();
    state.documentRevisions.loadListAsyncInfo = getAsyncState();
    state.documentRevisions.loadDocumentAsyncInfo = getAsyncState();
  });

  it("getDocumentRevisionsList", () => {
    expect(selectors.getDocumentRevisionsList(state)).toEqual(documentRevisions);
  });

  it("getDocument", () => {
    expect(selectors.getDocumentRevision(state, documentRevisions[0].id)).toEqual(documentRevisions[0]);
  });

  it("getDocumentRevisions", () => {
    expect(selectors.getDocumentRevisions(state, documents[0].id)).toEqual(documents[0].documentRevisions);
  });

  it("makeGetDocumentRevisions", () => {
    const getDocumentRevisions = selectors.makeGetDocumentRevisions();
    
    expect(getDocumentRevisions(state, documents[1].id)).toEqual(documents[1].documentRevisions);
  });

  it("getLoadAsyncState", () => {
    expect(selectors.getLoadAsyncState(state)).toBe(state.documentRevisions.loadAsyncInfo);
  });

  it("getLoadListAsyncState", () => {
    expect(selectors.getLoadListAsyncState(state)).toBe(state.documentRevisions.loadListAsyncInfo);
  });

  it("getLoadDocumentAsyncState", () => {
    expect(selectors.getLoadDocumentAsyncState(state)).toBe(state.documentRevisions.loadDocumentAsyncInfo);
  });
});
