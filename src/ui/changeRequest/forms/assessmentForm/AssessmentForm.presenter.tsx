import { withStyles, WithStyles, Typography } from "@material-ui/core";
import { Field, FieldProps, FormikProps } from "formik";
import React, { useEffect } from "react";
import { ChangeRequest } from "../../../../state/ducks/changeRequest";
import { AsyncState } from "../../../../state/types";
import ApproversField from "../../../change.request/form/approvers";
import AssessmentContainer from "../../../change.request/form/assessment/container";
import DatePickerField from "../../../components/forms/fields/DatePicker";
import FilledInputField from "../../../components/forms/fields/FilledInput";
import {
  required,
  validator,
} from "../../../components/forms/fields/validators";
import FormMessage from "../../../components/forms/FormMessage";
import FormProgress from "../../../components/forms/FormProgress";
import SubmitButton from "../../../components/forms/SubmitButton";
import { ChangeRequestFormValues } from "../types.js";
import styles from "./AssessmentForm.styles";
import AssessmentFormControlsContainer from "./AssessmentFormControls.container";
import AssessmentFormJustifications from "./AssessmentFormJustifications";
import AssessmentFormImplementationPlan from "./implementationPlan/Container";
import PromptIfDirty from "../../../components/forms/PromptIfDirty";
import FormWrapper from "../../../components/forms/FormWrapper";
import Text from "../../../components/Text";

interface Props
  extends WithStyles<typeof styles>,
    FormikProps<ChangeRequestFormValues> {
  asyncState: AsyncState;
  changeRequest?: ChangeRequest;
  documentRevisionsList: string[];
  doNotPrompt?: boolean;
  onDirtyFlagChange?: (dirty: boolean) => void;
}

const AssessmentFormPresenter: React.FunctionComponent<Props> = ({
  asyncState,
  classes,
  changeRequest,
  dirty,
  initialValues,
  resetForm,
  documentRevisionsList,
  setFieldValue,
  doNotPrompt,
  onDirtyFlagChange,
}) => {
  useEffect(() => {
    setFieldValue("documentRevisions", documentRevisionsList);
  }, [documentRevisionsList]);

  const renderJustifications = (props: FieldProps<ChangeRequestFormValues>) => (
    <AssessmentFormJustifications {...props} />
  );

  const renderAssessments = (props: FieldProps<ChangeRequestFormValues>) => (
    <AssessmentContainer {...props} />
  );

  const renderimplementationPlan = (
    props: FieldProps<ChangeRequestFormValues>,
  ) => <AssessmentFormImplementationPlan {...props} />;

  const renderCrId = () => 
    changeRequest && changeRequest.id && (
      <Typography variant="h5">
        <Text translation="common.crid" />: {changeRequest.crId}
      </Typography>
    );

  return (
    <div className={classes.container}>
      <FormWrapper dirty={dirty} resetForm={resetForm} initialValues={initialValues}>
        <PromptIfDirty dirty={dirty} doNotPrompt={doNotPrompt} onDirtyFlagChange={onDirtyFlagChange} />
        <FormMessage asyncState={asyncState} />
        <FormProgress asyncState={asyncState} />
        {renderCrId()}
        <FilledInputField
          name="title"
          label="cr.title"
          inputProps={{ id: "title", multiline: true, rows: "2" }}
          validate={validator(required)}
        />
        <FilledInputField
          name="description"
          label="cr.description"
          inputProps={{ id: "description", multiline: true, rows: "2" }}
          validate={validator(required)}
        />
        <Field name="justifications" render={renderJustifications} />
        <Field name="assessments" render={renderAssessments} />
        <Field name="implementationPlan" render={renderimplementationPlan} />
        <DatePickerField
          name="effectiveDate"
          label="common.target.date"
          datePickerProps={{ minDate: new Date() }}
        />
        <ApproversField />
        <SubmitButton asyncState={asyncState} label="document.save" />
        <AssessmentFormControlsContainer changeRequest={changeRequest} />
      </FormWrapper>
    </div>
  );
};

export default withStyles(styles)(AssessmentFormPresenter);
