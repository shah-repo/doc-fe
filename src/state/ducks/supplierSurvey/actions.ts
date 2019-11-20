import { apiAction } from "../../factories";
import { ApiAction } from "../../types";
import { DocumentRevision } from "../documentRevisions";
import {
  SUPPLIER_SURVEY_LIST,
  SUPPLIER_SURVEY_LIST_ASYNC,
  SUPPLIER_SURVEY_ROOT_URL,
} from "./constants";
import { SupplierSurveyListAction } from "./types";

const supplierSurveyList = (
  supplierSurvey: DocumentRevision[],
): SupplierSurveyListAction => ({
  type: SUPPLIER_SURVEY_LIST,
  payload: supplierSurvey,
});

const loadSupplierSurveyList = (token: string): ApiAction<DocumentRevision[]> =>
  apiAction({
    url: `${SUPPLIER_SURVEY_ROOT_URL}/${token}`,
    method: "get",
    asyncType: SUPPLIER_SURVEY_LIST_ASYNC,
    onSuccess: (supplierSurvey, dispatch) => {
      dispatch(supplierSurveyList(supplierSurvey));
    },
  });

export default {
  supplierSurveyList,
  loadSupplierSurveyList,
};
