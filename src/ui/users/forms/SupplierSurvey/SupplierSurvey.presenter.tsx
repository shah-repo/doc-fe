import {
  Box,
  Grid,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import { FormikProps } from "formik";
import _ from "lodash";
import * as React from "react";
import { SupplierSurveyForm } from "../../../../state/ducks/supplierSurvey";
import { AsyncState } from "../../../../state/types";
import FormWrapper from "../../../components/forms/FormWrapper";
import SubmitButton from "../../../components/forms/SubmitButton";
import FBWorkspace from "../../../form.builder/main/workspace/FBWorkspace";
import FBStore from "../../../form.builder/stores/FBStore";
import { FBDocumentFlowProps } from "../../../form.builder/types/formik";
import styles from "./SupplierSurvey.styles";

interface Props
  extends WithStyles<typeof styles>,
    FormikProps<FBDocumentFlowProps> {
  asyncState: AsyncState;
  supplierSurvey: SupplierSurveyForm;
}

const SupplierSurveyPresenter: React.FunctionComponent<Props> = ({
  classes,
  asyncState,
  supplierSurvey,
  dirty,
  resetForm,
  initialValues,
}) => {
  const { name } = supplierSurvey.surveyFormDocumentRevision;
  const schema =
    _.get(supplierSurvey, "surveyFormDocumentRevision.formTemplate.schema") ||
    [];

  FBStore.setSchema(schema);

  return (
    <Grid container={true} className={classes.root}>
      <FormWrapper
        dirty={dirty}
        initialValues={initialValues}
        resetForm={resetForm}
      >
        <Grid item direction="row" className={classes.title}>
          <Typography variant="h4">{name}</Typography>
        </Grid>
        <Grid item direction="row">
          <Box>
            <FBWorkspace mode="form" includeTransport={false} />
          </Box>
        </Grid>
        <Grid item direction="row">
          <SubmitButton asyncState={asyncState} label={"common.save"} />
        </Grid>
      </FormWrapper>
    </Grid>
  );
};

export default withStyles(styles)(SupplierSurveyPresenter);
