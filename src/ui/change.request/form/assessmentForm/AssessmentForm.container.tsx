import { Formik, FormikHelpers as FormikActions, FormikProps } from "formik";
import React from "react";
import { ChangeRequest } from "../../../../state/ducks/changeRequest";
import { AsyncState } from "../../../../state/types";
import { ChangeRequestFormValues } from "../types";
import AssessmentFormPresenter from "./AssessmentForm.presenter";

interface OwnProps {
  initialValues: ChangeRequestFormValues;
  asyncState: AsyncState;
  onSubmit: (values: ChangeRequestFormValues, actions: FormikActions<ChangeRequestFormValues>) => void;
  changeRequest?: ChangeRequest;
  documentRevisionsList: string[];
  doNotPrompt?: boolean;
  onDirtyFlagChange?: (dirty: boolean) => void;
  documentTypeGroups: any[];
}

type AssessmentFormContainerProps = OwnProps;

const AssessmentFormContainer: React.FunctionComponent<AssessmentFormContainerProps> = ({
  onSubmit,
  initialValues,
  asyncState,
  changeRequest,
  documentRevisionsList,
  doNotPrompt,
  onDirtyFlagChange,
  documentTypeGroups,
}) => {
  const render = (props: FormikProps<ChangeRequestFormValues>) => (
    <AssessmentFormPresenter
      {...props}
      asyncState={asyncState}
      changeRequest={changeRequest}
      documentRevisionsList={documentRevisionsList}
      doNotPrompt={doNotPrompt}
      onDirtyFlagChange={onDirtyFlagChange}
      documentTypeGroups={documentTypeGroups}
    />
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {render}
    </Formik>
  );
};

export default AssessmentFormContainer;
