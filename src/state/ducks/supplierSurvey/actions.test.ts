import faker from "faker";
import { getCallbackHandler } from "../../../common/tests/factories";
import { Handlers } from "../../types";
import actions from "./actions";
import { SUPPLIER_SURVEY_ROOT_URL } from "./constants";
import { getSurveyFormDocumentRevision } from "./tests/factories";
import { SubmitSupplierSurvey, SupplierSurveyForm } from "./types";

describe("supplier survey action test", () => {
  const token = faker.random.uuid();
  const supplierSurveyForm = getSurveyFormDocumentRevision();

  describe("loadSupplierSurveyList tests", () => {
    const action = actions.loadSupplierSurveyList(token);

    it("calls GET on SUPPLIER_SURVEY_ROOT_URL/token", () => {
      expect(action.url).toBe(`${SUPPLIER_SURVEY_ROOT_URL}/${token}`);
      expect(action.method).toBe("get");
    });

    it("calls dispatch with supplierSurveyList action on success", () => {
      const dispatch = jest.fn();
      action.onSuccess(supplierSurveyForm, dispatch);
      expect(dispatch).toHaveBeenCalledWith(
        actions.supplierSurveyList(supplierSurveyForm),
      );
    });
  });

  const body: SubmitSupplierSurvey = {
    formInput: {},
  };

  describe("submitSupplierSurvey tests", () => {
    const handlers: Handlers<SupplierSurveyForm> = {
      successHandler: getCallbackHandler<SupplierSurveyForm>(),
      errorHandler: getCallbackHandler<string>(),
    };
    const action = actions.submitSupplierSurvey(token, body, handlers);

    it("calls POST on SUPPLIER_SURVEY_ROOT_URL/token/submit_survey`", () => {
      expect(action.url).toBe(
        `${SUPPLIER_SURVEY_ROOT_URL}/${token}/submit_survey`,
      );
      expect(action.method).toBe("post");
    });

    it("calls dispatch with submitSurvey action on success", () => {
      const dispatch = jest.fn();
      action.onSuccess(supplierSurveyForm, dispatch);
      expect(dispatch).toHaveBeenCalledWith(
        actions.submitSurvey(supplierSurveyForm),
      );
    });
  });
});
