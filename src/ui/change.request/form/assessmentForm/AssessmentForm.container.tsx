import { Formik, FormikHelpers as FormikActions, FormikProps } from "formik";
import React from "react";
import { ChangeRequest } from "../../../../state/ducks/changeRequest";
import { AsyncState } from "../../../../state/types";
import { ChangeRequestFormValues } from "../types";
import AssessmentFormPresenter from "./AssessmentForm.presenter";

interface Props {
  initialValues: ChangeRequestFormValues;
  asyncState: AsyncState;
  onSubmit: (values: ChangeRequestFormValues, actions: FormikActions<ChangeRequestFormValues>) => void;
  changeRequest?: ChangeRequest;
  doNotPrompt?: boolean;
}

const AssessmentFormContainer: React.FunctionComponent<Props> = ({
  onSubmit,
  initialValues,
  asyncState,
  changeRequest,
  doNotPrompt,
}) => {
  const render = (props: FormikProps<ChangeRequestFormValues>) => (
    <AssessmentFormPresenter
      {...props}
      asyncState={asyncState}
      changeRequest={changeRequest}
      doNotPrompt={doNotPrompt}
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
