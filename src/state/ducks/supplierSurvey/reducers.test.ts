import {
  SupplierSurveyAction,
  SupplierSurveyForm, SUPPLIER_SURVEY,
} from ".";
import { supplierSurvey, SUPPLIER_SURVEY_DEFAULT_STATE } from "./reducers";
import { getSurveyFormDocumentRevision } from "./tests/factories";

describe("supplier survey reducers tests", () => {
  const initialState: SupplierSurveyForm = SUPPLIER_SURVEY_DEFAULT_STATE;
  const supplierSurveyForm = getSurveyFormDocumentRevision();
  const supplierSurveyAction: SupplierSurveyAction = {
    type: SUPPLIER_SURVEY,
    payload: supplierSurveyForm,
  };

  describe("supplierSurvey reducer test", () => {
    it("sets supplier survey on SUPPLIER_SURVEY action", () => {
      expect(supplierSurvey(initialState, supplierSurveyAction)).toEqual({
        ...supplierSurveyForm,
      });
    });
  });
});
