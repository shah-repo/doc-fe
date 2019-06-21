import { Formik, FormikActions, FormikProps, FormikErrors } from "formik";
import React from "react";
import _ from 'lodash';
import { AsyncState } from "../../../../state/types";
import AssessmentFormPresenter from "./AssessmentForm.presenter";
import { ChangeRequestFormValues } from "../types";
import { OptionType } from "../../../components/forms/fields/Autocomplete/types";
import { changeRequestsActions, changeRequestsSelectors, ChangeRequest } from "../../../../state/ducks/changeRequest";
import { connect } from "react-redux";
import { ApplicationState } from "../../../../state/reducers";
import AsyncGate from "../../../components/AsyncGate";

interface StateProps {
  loadApproversAsyncState: AsyncState;
  availableApprovers: OptionType[];
}

interface DispatchProps {
  loadAvailableApprovers: typeof changeRequestsActions.loadAvailableApprovers;
}
interface OwnProps {
  initialValues: ChangeRequestFormValues;
  asyncState: AsyncState;
  onSubmit: (values: ChangeRequestFormValues, actions: FormikActions<ChangeRequestFormValues>) => void;
  changeRequest?: ChangeRequest;
}

type AssessmentFormContainerProps = StateProps & DispatchProps & OwnProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  loadApproversAsyncState: changeRequestsSelectors.getLoadApproversAsyncState(state),
  availableApprovers: changeRequestsSelectors.getApproversListForAssessmentForm(state),
});

const validate = (values: ChangeRequestFormValues) => {
  let errors: FormikErrors<any> = {};
  const { assessment, justifications } = values;
  const descriptionOrAttachment = "changeRequest.assessmentForm.error.descriptionOrAttachment";

  if (!assessment.description && assessment.attachments.length === 0) {
    _.set(errors, 'assessment.description', descriptionOrAttachment);
  } 
  
  if (!justifications.description && justifications.attachments.length === 0) {
    _.set(errors, 'justifications.description', descriptionOrAttachment);
  }

  return errors;
}

const AssessmentFormContainer: React.FunctionComponent<AssessmentFormContainerProps> =
  ({ onSubmit, initialValues, asyncState, availableApprovers, loadApproversAsyncState, loadAvailableApprovers, changeRequest }) => {
    const render = (props: FormikProps<ChangeRequestFormValues>) => (
      <AssessmentFormPresenter {...props} asyncState={asyncState} availableApprovers={availableApprovers} changeRequest={changeRequest} />
    );

    return (
      <AsyncGate asyncState={loadApproversAsyncState} asyncAction={loadAvailableApprovers} startActionOnMount={true}>
        <Formik
          render={render}
          initialValues={initialValues}
          onSubmit={onSubmit}
          enableReinitialize={true}
          validate={validate}
        />
      </AsyncGate>
    );
  };


export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  loadAvailableApprovers: changeRequestsActions.loadAvailableApprovers,
})(AssessmentFormContainer);
