import { Box, withStyles, WithStyles } from "@material-ui/core";
import { FormikProps } from "formik";
import React, { useEffect } from "react";
import { toStartOfDay } from "../../../../common/utils/date";
import { Group } from "../../../../state/ducks/auth/types";
import { ChangeRequest } from "../../../../state/ducks/changeRequest";
import { AsyncState } from "../../../../state/types";
import DatePickerField from "../../../components/forms/fields/DatePicker";
import InputField from "../../../components/forms/fields/Input";
import TextEditorField from "../../../components/forms/fields/RichTextEditor";
import { required, validator } from "../../../components/forms/fields/validators";
import { useFormContext } from "../../../components/forms/FormContext";
import FormWrapper from "../../../components/forms/FormWrapper";
import PromptIfDirty from "../../../components/forms/PromptIfDirty";
import ScrollToError from "../../../components/forms/ScrollToError";
import useDidMount from "../../../hooks/useDidMount";
import FormHeader from "../../form/assessmentForm/FormHeader";
import ApproversField from "../approvers";
import { ChangeRequestFormValues } from "../types.js";
import styles from "./AssessmentForm.styles";

interface Props
  extends WithStyles<typeof styles>,
  FormikProps<ChangeRequestFormValues> {
  asyncState: AsyncState;
  changeRequest?: ChangeRequest;
  documentRevisionsList: string[];
  doNotPrompt?: boolean;
  onDirtyFlagChange?: (dirty: boolean) => void;
  documentTypeGroups: Group[];
  selectedDocumentRevision: string | null;
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
  documentTypeGroups,
  values,
  selectedDocumentRevision,
  submitForm,
}) => {
  const formContext = useFormContext();
  const didMount = useDidMount();

  useEffect(() => {
    if (didMount) {
      setFieldValue("documentRevisions", documentRevisionsList);
      formContext.submitForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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


  return (
    <div className={classes.container}>
      <FormHeader
        {...{
          changeRequest,
          asyncState,
          selectedDocumentRevision,
        }}
      />
      <FormWrapper
        dirty={dirty}
        resetForm={resetForm}
        initialValues={initialValues}
      >
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
        {renderCrId()}

        <Box mb={1}>
          <InputField
            name="title"
            label="common.title"
            inputProps={{ id: "title", multiline: true, rows: "2" }}
            validate={validator(required)}
          />
          <TextEditorField
            data-testid="description"
            name="description"
            label="common.description"
            validate={validator(required)}
          />
        </Box>
        <DatePickerField
          name="effectiveDate"
          label="common.target.date"
          datePickerProps={{ id: "targetDate", minDate: toStartOfDay(undefined) }}
        />
        <ApproversField documentTypeGroups={documentTypeGroups} values={values} />
      </FormWrapper>
    </div>
  );
};

export default withStyles(styles)(AssessmentFormPresenter);
