import { Formik, FormikProps } from "formik";
import * as React from "react";
import { SupplierSurveyForm } from "../../../../state/ducks/supplierSurvey";
import { AsyncState } from "../../../../state/types";
import { FormContext } from "../../../components/forms/FormContext";
import { FBDocumentFlowProps } from "../../../form.builder/types/formik";
import { toSupplierSurveyFormValues } from "../transform";
import SupplierSurveyFormBuild from "./SupplierSurveyFormBuild.presenter";

interface Props {
  asyncState: AsyncState;
  supplierSurvey: SupplierSurveyForm;
  onSubmit: () => void;
}

const SupplierSurveyPresenter: React.FunctionComponent<Props> = ({ onSubmit, supplierSurvey, asyncState }) => {
  const renderForm = (props: FormikProps<FBDocumentFlowProps>) => (
    <SupplierSurveyFormBuild
      {...props}
      asyncState={asyncState}
      supplierSurvey={supplierSurvey}
    />
  );

  return (
    <FormContext.Provider value={{ submitOnChange: false }}>
      <Formik
        initialValues={toSupplierSurveyFormValues(supplierSurvey)}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {renderForm}
      </Formik>

    </FormContext.Provider>
  );
};

export default SupplierSurveyPresenter;
