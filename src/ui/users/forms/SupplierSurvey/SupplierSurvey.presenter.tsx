import {
  Box,
  Grid,
  Typography,
} from "@material-ui/core";
import { FormikProps } from "formik";
import * as React from "react";
import { SupplierSurveyForm } from "../../../../state/ducks/supplierSurvey";
import { AsyncState } from "../../../../state/types";
import FormWrapper from "../../../components/forms/FormWrapper";
import SubmitButton from "../../../components/forms/SubmitButton";
import FBWorkspace from "../../../form.builder/main/workspace/FBWorkspace";
import { FBDocumentFlowProps } from "../../../form.builder/types/formik";
import { styles } from "./SupplierSurvey.styles";

interface Props extends FormikProps<FBDocumentFlowProps> {
  asyncState: AsyncState;
  supplierSurvey: SupplierSurveyForm;
  name?: string;
  isSubmited: boolean;
  message: string;
}

const SupplierSurveySubmitMessage: React.FunctionComponent<Props> = ({message}) => {
  const classes = styles();
  return (
    <div className={classes.root}>
      {message}
    </div>
  );
};

const SupplierSurveyFormBuild: React.FunctionComponent<Props> = ({
  asyncState,
  dirty,
  resetForm,
  initialValues,
  name,
}) => {
  const classes = styles();
  return (
    <Grid container={true} className={classes.root}>
      <FormWrapper
        dirty={dirty}
        initialValues={initialValues}
        resetForm={resetForm}
      >
        <Grid item className={classes.title}>
          <Typography variant="h4">{name}</Typography>
        </Grid>
        <Grid item>
          <Box>
            <FBWorkspace mode="form" includeTransport={false} />
          </Box>
        </Grid>
        <Grid item>
          <SubmitButton asyncState={asyncState} label={"common.save"} />
        </Grid>
      </FormWrapper>
    </Grid>
  );
};

const SupplierSurveyPresenter: React.FunctionComponent<Props> = (props) => {
  return (
    <div>
      {props.isSubmited ?
        <SupplierSurveySubmitMessage
          {...props}
        /> :
        <SupplierSurveyFormBuild
          {...props}
        />}
    </div>
  );
};

export default SupplierSurveyPresenter;
