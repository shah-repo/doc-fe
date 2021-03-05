import { pick } from "lodash";
import { FBDocumentRevisionProps } from "../../../state/ducks/documentRevisions/types";
import { SupplierSurveyForm } from "../../../state/ducks/supplierSurvey/types";

export const toSupplierSurveyFormValues = (
  supplierSurvey: SupplierSurveyForm,
): FBDocumentRevisionProps => {
  const values: FBDocumentRevisionProps = pick(supplierSurvey.surveyFormDocumentRevision,
    ["formTemplate", "formInput", "formDocument"]);
  return values;
};
