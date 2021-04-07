import { Box, Typography } from "@material-ui/core";
import { FormikProps } from "formik";
import * as React from "react";
import { FBDocumentRevisionProps } from "../../../../state/ducks/documentRevisions/types";
import { SupplierSurveyForm } from "../../../../state/ducks/supplierSurvey/types";
import { AsyncState } from "../../../../state/types";
import FormMessage from "../../../components/forms/FormMessage";
import FormProgress from "../../../components/forms/FormProgress";
import FormWrapper from "../../../components/forms/FormWrapper";
import SubmitButton from "../../../components/forms/SubmitButton";
import { FBWorkspace } from "../../../form.builder";

interface Props extends FormikProps<FBDocumentRevisionProps> {
  asyncState: AsyncState;
  supplierSurvey: SupplierSurveyForm;
  name?: string;
}

const SupplierSurveyFormBuild: React.FunctionComponent<Props> = ({
  asyncState,
  dirty,
  resetForm,
  initialValues,
  supplierSurvey,
}) => (
  <Box
    display="flex"
    justifyContent="center"
    bgcolor="white"
    width="100%"
    height="100%"
    position="absolute"
  >
    <FormWrapper
      dirty={dirty}
      initialValues={initialValues}
      resetForm={resetForm}
    >
      <FormProgress asyncState={asyncState} />
      <FormMessage asyncState={asyncState} />
      <Box width="700px" height="38px" borderBottom={1} borderColor="grey.500" my={5}>
        <Typography align="center" variant="h4">{supplierSurvey.surveyFormDocumentRevision.name}</Typography>
      </Box>
      <FBWorkspace mode="form" includeTransport={false} initialValues={initialValues.formInput} />
      <Box width="700px" display="flex" justifyContent="flex-end">
        <SubmitButton
          asyncState={asyncState}
          label={"common.save"}
          id="SupplierSurveyFormBuild-saveSurveyForm"
        />
      </Box>
    </FormWrapper>
  </Box>
);

export default SupplierSurveyFormBuild;
