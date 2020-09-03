
import { cloneDeep } from "lodash";
import { ApplicationState } from "../../reducers";
import { getAsyncState } from "../../tests/factories";
import initialStoreState from "../../tests/helpers/initialStoreState";
import selectors from "./selectors";
import { getSurveyFormDocumentRevision } from "./tests/factories";

describe("supplier survey selectors tests", () => {
  let state: ApplicationState;

  const supplierSurveyForm = getSurveyFormDocumentRevision();

  beforeAll(() => {
    state = cloneDeep(initialStoreState);
    state.supplierSurvey.supplierSurvey = supplierSurveyForm;
    state.supplierSurvey.loadSupplierSurveyAsyncInfo = getAsyncState();
  });

  it("supplierSurvey", () => {
    expect(selectors.supplierSurvey(state)).toEqual(supplierSurveyForm);
  });

  it("getLoadSupplierSurveyListAsyncInfo", () => {
    const asyncInfo = state.supplierSurvey.loadSupplierSurveyAsyncInfo;
    expect(selectors.getLoadSupplierSurveyListAsyncInfo(state)).toBe(asyncInfo);
  });
});
