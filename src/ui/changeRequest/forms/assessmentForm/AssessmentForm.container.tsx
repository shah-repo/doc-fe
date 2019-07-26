import { Formik, FormikActions, FormikErrors, FormikProps } from "formik";
import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { ChangeRequest, changeRequestsActions, changeRequestsSelectors } from "../../../../state/ducks/changeRequest";
import { ApplicationState } from "../../../../state/reducers";
import { AsyncState } from "../../../../state/types";
import AsyncGate from "../../../components/AsyncGate";
import { OptionType } from "../../../components/forms/fields/Autocomplete/types";
import Text from "../../../components/Text";
import { ChangeRequestFormValues } from "../types";
import AssessmentFormPresenter from "./AssessmentForm.presenter";

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

const AssessmentFormContainer: React.FunctionComponent<AssessmentFormContainerProps> = ({
  onSubmit,
  initialValues,
  asyncState,
  availableApprovers,
  loadApproversAsyncState,
  loadAvailableApprovers,
  changeRequest,
}) => {
    const render = (props: FormikProps<ChangeRequestFormValues>) => (
      <AssessmentFormPresenter
        {...props}
        asyncState={asyncState}
        availableApprovers={availableApprovers}
        changeRequest={changeRequest}
      />
    );

    return (
      <AsyncGate asyncState={loadApproversAsyncState} asyncAction={loadAvailableApprovers} startActionOnMount={true}>
        <Formik
          render={render}
          initialValues={initialValues}
          onSubmit={onSubmit}
          enableReinitialize={true}
        />
      </AsyncGate>
    );
  };

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  loadAvailableApprovers: changeRequestsActions.loadAvailableApprovers,
})(AssessmentFormContainer);
