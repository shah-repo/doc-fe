import { Typography, withStyles, WithStyles } from "@material-ui/core";
import { Form, FormikProps, Field, FieldProps } from "formik";
import React from "react";
import { AsyncState } from "../../../../state/types";
import InputField from "../../../components/forms/fields/Input";
import DatePickerField from "../../../components/forms/fields/DatePicker";
import { required, validator, requiredAtLeastOne } from "../../../components/forms/fields/validators";
import AutcompleteField from "../../../components/forms/fields/Autocomplete/Autocomplete";
import FormMessage from "../../../components/forms/FormMessage";
import FormProgress from "../../../components/forms/FormProgress";
import SubmitButton from "../../../components/forms/SubmitButton";
import Text from "../../../components/Text";
import { ChangeRequestFormValues } from "../types.js";
import AssessmentFormJustifications from './AssessmentFormJustifications';
import AssessmentFormAssessments from './AssessmentFormAssessments';
import AssessmentFormImplementationPlan from './AssessmentFormImplementationPlan';
import styles from './AssessmentForm.styles';
import { OptionType } from "../../../components/forms/fields/Autocomplete/types";

interface Props extends WithStyles<typeof styles>, FormikProps<ChangeRequestFormValues> {
  asyncState: AsyncState;
  changeRequestId?: string;
  availableApprovers: OptionType[],
}

const AssessmentFormPresenter: React.FunctionComponent<Props> = ({ asyncState, availableApprovers, classes }) => {
  const renderJustifications = (props: FieldProps<ChangeRequestFormValues>) => <AssessmentFormJustifications {...props} />;
  const renderAssessments = (props: FieldProps<ChangeRequestFormValues>) => <AssessmentFormAssessments {...props} />;
  const renderimplementationPlan = (props: FieldProps<ChangeRequestFormValues>) => <AssessmentFormImplementationPlan {...props} />;

  return (
    <div className={classes.container}>
      <Form>
        <FormMessage asyncState={asyncState} />
        <FormProgress asyncState={asyncState} />
        <InputField
          name="description"
          label="changeRequest.assessmentForm.description"
          inputProps={{ id: "description" }}
          validate={validator(required)}
        />
        <Field name="justifications" render={renderJustifications} />
        <Field name="assessment" render={renderAssessments} />
        <Field name="implementationPlan" render={renderimplementationPlan} />
        <DatePickerField
          name="effectiveDate"
          label="changeRequest.assessmentForm.targetDate"
          datePickerProps={{ minDate: new Date() }}
        />
        <AutcompleteField
          name="approvals"
          autocompleteProps={{
            id: "approvals",
            isMulti: true,
            placeholder: <Text translation="changeRequest.assessmentForm.selectApprover" />
          }}
          options={availableApprovers}
        />
        <SubmitButton asyncState={asyncState} label="document.save" />
      </Form>
    </div>
  );
};

export default withStyles(styles)(AssessmentFormPresenter);
