import { apiAction, apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import { SUPPLIER_SURVEY, SUPPLIER_SURVEY_ASYNC, SUPPLIER_SURVEY_ROOT_URL, SUPPLIER_SURVEY_SUBMIT } from "./constants";
import { SubmitSupplierSurvey, SupplierSurveyAction, SupplierSurveyForm, SupplierSurveySubmitAction } from "./types";

const supplierSurveyList = (
  supplierSurvey: SupplierSurveyForm,
): SupplierSurveyAction => ({
  type: SUPPLIER_SURVEY,
  payload: supplierSurvey,
});

const submitSurvey = (supplierSurvey: SupplierSurveyForm): SupplierSurveySubmitAction => ({
  type: SUPPLIER_SURVEY_SUBMIT,
  payload: supplierSurvey,
});

const loadSupplierSurveyList = (token: string): ApiAction<SupplierSurveyForm> =>
  apiAction({
    url: `${SUPPLIER_SURVEY_ROOT_URL}/${token}`,
    method: "get",
    asyncType: SUPPLIER_SURVEY_ASYNC,
    onSuccess: (supplierSurvey, dispatch) => {
      dispatch(supplierSurveyList(supplierSurvey));
    },
  });

const submitSupplierSurvey = (token: string, body: SubmitSupplierSurvey, handlers: Handlers):
ApiAction<SupplierSurveyForm> => apiActionWithCallbacks({
  url: `${SUPPLIER_SURVEY_ROOT_URL}/${token}/submit_survey`,
  method: "post",
  data: body,
  onSuccess: (supplierSurvey, dispatch) => {
    dispatch(submitSurvey(supplierSurvey));
  },
  handlers,
});

export default {
  supplierSurveyList,
  loadSupplierSurveyList,
  submitSupplierSurvey,
  submitSurvey,
};
