import { Box, Grid, withStyles, WithStyles } from "@material-ui/core";
import { Field, FieldProps, FormikProps } from "formik";
import _ from "lodash";
import React, { useEffect } from "react";
import { ChangeRequest } from "../../../../state/ducks/changeRequest";
import { AsyncState } from "../../../../state/types";
import ApproversField from "../../../change.request/form/approvers";
import AssessmentsField from "../../../change.request/form/assessments";
import JustificationField from "../../../change.request/form/justification";
import DatePickerField from "../../../components/forms/fields/DatePicker";
import InputField from "../../../components/forms/fields/Input";
import {
  required,
  validator,
} from "../../../components/forms/fields/validators";
import FormMessage from "../../../components/forms/FormMessage";
import FormProgress from "../../../components/forms/FormProgress";
import FormWrapper from "../../../components/forms/FormWrapper";
import PromptIfDirty from "../../../components/forms/PromptIfDirty";
import SubmitButton from "../../../components/forms/SubmitButton";
import useDidMount from "../../../hooks/useDidMount";
import { ChangeRequestFormValues } from "../types.js";
import styles from "./AssessmentForm.styles";
import AssessmentFormControlsContainer from "./AssessmentFormControls.container";
import AssessmentFormImplementationPlan from "./implementationPlan/Container";
import TextEditorField from "../../../components/forms/fields/TextEditor";
import ScrollToError from "../../../components/forms/ScrollToError";

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
  documentRevisionsList,
  setFieldValue,
  doNotPrompt,
  onDirtyFlagChange,
  isSubmitting,
  isValidating,
  initialValues,
  resetForm,
  errors,
}) => {
  const didMount = useDidMount();

  useEffect(() => {
    if (didMount) {
      setFieldValue("documentRevisions", documentRevisionsList);
    }
  }, [documentRevisionsList]);

  const renderCrId = () =>
    changeRequest &&
    changeRequest.id && (
      <InputField
        name=""
        label="common.crid"
        inputProps={{ disabled: true, value: changeRequest.crId }}
      />
    );
  const renderimplementationPlan = (
    props: FieldProps<ChangeRequestFormValues>,
  ) => <AssessmentFormImplementationPlan {...props} />;

  return (
    <div className={classes.container}>
      <FormWrapper
        dirty={dirty}
        resetForm={resetForm}
        initialValues={initialValues}>
        <ScrollToError
          isSubmitting={isSubmitting}
          isValidating={isValidating}
          errors={errors}
        />
        <PromptIfDirty
          dirty={dirty}
          doNotPrompt={doNotPrompt}
          onDirtyFlagChange={onDirtyFlagChange}
        />
        <FormMessage asyncState={asyncState} />
        <FormProgress asyncState={asyncState} />
        {renderCrId()}
        <InputField
          name="title"
          label="cr.title"
          inputProps={{ id: "title", multiline: true, rows: "2" }}
          validate={validator(required)}
        />
        <Box mb={1}>
          <TextEditorField
            name="description"
            label="cr.description"
            validate={validator(required)}
          />
        </Box>
        <JustificationField />
        <AssessmentsField />
        <Field name="implementationPlan" render={renderimplementationPlan} />
        <DatePickerField
          name="effectiveDate"
          label="common.target.date"
          datePickerProps={{ minDate: new Date() }}
        />
        <ApproversField />
        <Box mt={4}>
          <Grid
            item={true}
            container={true}
            alignItems="flex-end"
            direction="column">
            <div>
              <AssessmentFormControlsContainer changeRequest={changeRequest} />
              <SubmitButton
                asyncState={asyncState}
                label={
                  changeRequest
                    ? "common.save"
                    : "navigation.createChangeRequest"
                }
              />
            </div>
          </Grid>
        </Box>
      </FormWrapper>
    </div>
  );
};

export default withStyles(styles)(AssessmentFormPresenter);
