import { Formik, FormikActions, FormikProps, FormikErrors } from "formik";
import React from "react";
import _ from 'lodash';
import { AsyncState } from "../../../state/types";
import AssessmentFormPresenter from "./AssessmentForm.presenter";
import { ChangeRequestFormValues } from "./types";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";

interface AssessmentFormContainerProps {
  changeRequestId?: string;
  initialValues: ChangeRequestFormValues;
  asyncState: AsyncState;
  onSubmit: (values: ChangeRequestFormValues, actions: FormikActions<ChangeRequestFormValues>) => void;
  availableApprovers: OptionType[];
}

const validate = (values: ChangeRequestFormValues) => {
  let errors: FormikErrors<any> = {};
  const { assessment, justifications, implementationPlan } = values;
  const descriptionOrAttachment = "changeRequest.assessmentForm.error.descriptionOrAttachment";

  if (!assessment.description && assessment.attachments.length === 0) {
    _.set(errors, 'assessment.description', descriptionOrAttachment);
  } 
  
  if (!justifications.description && justifications.attachments.length === 0) {
    _.set(errors, 'justifications.description', descriptionOrAttachment);
  }
  
  if (!implementationPlan.description && implementationPlan.attachments.length === 0) {
    _.set(errors, 'implementationPlan.description', descriptionOrAttachment);
  }

  return errors;
}

const AssessmentFormContainer: React.FunctionComponent<AssessmentFormContainerProps> =
  ({ onSubmit, initialValues, asyncState, changeRequestId, availableApprovers }) => {
    const render = (props: FormikProps<ChangeRequestFormValues>) => (
      <AssessmentFormPresenter {...props} asyncState={asyncState} changeRequestId={changeRequestId} availableApprovers={availableApprovers} />
    );

    return (
      <Formik
        render={render}
        initialValues={initialValues}
        onSubmit={onSubmit}
        enableReinitialize={true}
        validate={validate}
      />
    );
  };

export default AssessmentFormContainer;
