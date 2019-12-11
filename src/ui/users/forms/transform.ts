import _ from "lodash";
import { SupplierSurveyForm } from "../../../state/ducks/supplierSurvey";
import { FBDocumentFlowProps } from "../../form.builder/types/formik";

export const toSupplierSurveyFormValues = (
    supplierSurvey: SupplierSurveyForm,
    ): FBDocumentFlowProps => {
        const values: FBDocumentFlowProps = _.pick(supplierSurvey.surveyFormDocumentRevision,
            ["formTemplate", "formInput", "formDocument"]);
        return values;
    };
