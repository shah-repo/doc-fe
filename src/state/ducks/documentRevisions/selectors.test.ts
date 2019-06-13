import _ from "lodash";
import { ApplicationState } from "../../reducers";
import { getAsyncState } from "../../tests/factories";
import initialStoreState from "../../tests/helpers/initialStoreState";
import selectors from "./selectors";
import { getDocumentRevision } from "./tests/factories";
import { DocumentRevisionsAllIdsState, DocumentRevisionsByIdState } from "./types";

describe("document revision selectors tests", () => {
  let state: ApplicationState;
  const documentRevisions = [getDocumentRevision(), getDocumentRevision()];
  const allIds: DocumentRevisionsAllIdsState = [documentRevisions[0].id, documentRevisions[1].id];
  const byId: DocumentRevisionsByIdState = {
    [documentRevisions[0].id]: documentRevisions[0],
    [documentRevisions[1].id]: documentRevisions[1],
  };

  beforeAll(() => {
    state = _.cloneDeep(initialStoreState);
    state.documentRevisions.allIds = allIds;
    state.documentRevisions.byId = byId;
    state.documentRevisions.loadAsyncInfo = getAsyncState();
    state.documentRevisions.loadListAsyncInfo = getAsyncState();
  });

  it("getDocumentRevisionsList", () => {
    expect(selectors.getDocumentRevisionsList(state)).toEqual(documentRevisions);
  });

  it("getDocument", () => {
    expect(selectors.getDocumentRevision(state, documentRevisions[0].id)).toEqual(documentRevisions[0]);
  });

  it("getLoadAsyncState", () => {
    expect(selectors.getLoadAsyncState(state)).toBe(state.documentRevisions.loadAsyncInfo);
  });

  it("getLoadListAsyncState", () => {
    expect(selectors.getLoadListAsyncState(state)).toBe(state.documentRevisions.loadListAsyncInfo);
  });
});
