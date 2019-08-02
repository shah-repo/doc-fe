import { Formik, FormikActions, FormikProps } from "formik";
import _ from "lodash";
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
}

type AssessmentFormContainerProps = OwnProps;

const AssessmentFormContainer: React.FunctionComponent<AssessmentFormContainerProps> = ({
  onSubmit,
  initialValues,
  asyncState,
  changeRequest,
  documentRevisionsList,
}) => {
    const render = (props: FormikProps<ChangeRequestFormValues>) => (
      <AssessmentFormPresenter
        {...props}
        asyncState={asyncState}
        changeRequest={changeRequest}
        documentRevisionsList={documentRevisionsList}
      />
    );

    return (
      <Formik
        render={render}
        initialValues={initialValues}
        onSubmit={onSubmit}
        enableReinitialize={true}
      />
    );
  };

export default AssessmentFormContainer;
