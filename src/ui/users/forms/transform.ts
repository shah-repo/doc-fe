import { pick } from "lodash";
import { FBDocumentRevisionProps } from "../../../state/ducks/documentRevisions";
import { SupplierSurveyForm } from "../../../state/ducks/supplierSurvey";

export const toSupplierSurveyFormValues = (
  supplierSurvey: SupplierSurveyForm,
): FBDocumentRevisionProps => {
  const values: FBDocumentRevisionProps = pick(supplierSurvey.surveyFormDocumentRevision,
    ["formTemplate", "formInput", "formDocument"]);
  return values;
};
