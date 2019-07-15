import { withStyles, WithStyles } from "@material-ui/core";
import { Field, FieldProps, Form, FormikProps } from "formik";
import React from "react";
import { ChangeRequest } from "../../../../state/ducks/changeRequest";
import { AsyncState } from "../../../../state/types";
import AssessmentContainer from "../../../change.request/assessment/container";
import AutcompleteField from "../../../components/forms/fields/Autocomplete/Autocomplete";
import { OptionType } from "../../../components/forms/fields/Autocomplete/types";
import DatePickerField from "../../../components/forms/fields/DatePicker";
import InputField from "../../../components/forms/fields/Input";
import { required, validator } from "../../../components/forms/fields/validators";
import FormMessage from "../../../components/forms/FormMessage";
import FormProgress from "../../../components/forms/FormProgress";
import SubmitButton from "../../../components/forms/SubmitButton";
import Text from "../../../components/Text";
import { ChangeRequestFormValues } from "../types.js";
import styles from "./AssessmentForm.styles";
import AssessmentFormControlsContainer from "./AssessmentFormControls.container";
import AssessmentFormJustifications from "./AssessmentFormJustifications";
import AssessmentFormImplementationPlan from "./implementationPlan/Container";

interface Props extends WithStyles<typeof styles>, FormikProps<ChangeRequestFormValues> {
  asyncState: AsyncState;
  changeRequest?: ChangeRequest;
  availableApprovers: OptionType[];
}

const AssessmentFormPresenter: React.FunctionComponent<Props> = ({
  asyncState,
  availableApprovers,
  classes,
  changeRequest,
}) => {

  const renderJustifications = (props: FieldProps<ChangeRequestFormValues>) => (
    <AssessmentFormJustifications {...props} />
  );

  const renderAssessments = (props: FieldProps<ChangeRequestFormValues>) => (
    <AssessmentContainer {...props} />
  );

  const renderimplementationPlan = (props: FieldProps<ChangeRequestFormValues>) => (
    <AssessmentFormImplementationPlan {...props} />
  );

  return (
    <div className={classes.container}>
      <Form>
        <FormMessage asyncState={asyncState} />
        <FormProgress asyncState={asyncState} />
        <InputField
          name="description"
          label="common.description"
          inputProps={{ id: "description" }}
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
        <AutcompleteField
          name="approvals"
          autocompleteProps={{
            id: "approvals",
            isMulti: true,
            placeholder: <Text translation="changeRequest.assessmentForm.selectApprover" />,
          }}
          options={availableApprovers}
        />
        <SubmitButton asyncState={asyncState} label="document.save" />
        <AssessmentFormControlsContainer changeRequest={changeRequest} />
      </Form>
    </div>
  );
};

export default withStyles(styles)(AssessmentFormPresenter);
