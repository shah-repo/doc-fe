import { SupplierSurveyForm } from "../../../state/ducks/supplierSurvey";
import { FBDocumentFlowProps } from "../../form.builder/types/formik";

export const toSupplierSurveyFormValues = (
    supplierSurvey: SupplierSurveyForm,
    ): FBDocumentFlowProps => {
        const values: FBDocumentFlowProps = {
            formTemplate: supplierSurvey.surveyFormDocumentRevision.formTemplate,
            formInput: supplierSurvey.surveyFormDocumentRevision.formInput,
            formDocument: supplierSurvey.surveyFormDocumentRevision.formDocument,
        };
        return values;
    };
