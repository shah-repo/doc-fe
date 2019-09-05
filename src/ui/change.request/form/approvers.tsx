import React from "react";
import { connect } from "react-redux";
import { changeRequestsActions, changeRequestsSelectors } from "../../../state/ducks/changeRequest";
import { ApplicationState } from "../../../state/reducers";
import { AsyncState } from "../../../state/types";
import AsyncGate from "../../components/AsyncGate";
import AutcompleteField from "../../components/forms/fields/Autocomplete/Autocomplete";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";

interface StateProps {
  loadApproversAsyncState: AsyncState;
  availableApprovers: OptionType[];
}

interface DispatchProps {
  loadAvailableApprovers: typeof changeRequestsActions.loadAvailableApprovers;
}

type Props = StateProps & DispatchProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  loadApproversAsyncState: changeRequestsSelectors.getLoadApproversAsyncState(state),
  availableApprovers: changeRequestsSelectors.getApproversListForAssessmentForm(state),
});

export const Approvers: React.FunctionComponent<Props> = ({
  availableApprovers,
  loadApproversAsyncState,
  loadAvailableApprovers,
}) => {

  return (
    <AsyncGate asyncState={loadApproversAsyncState} asyncAction={loadAvailableApprovers} startActionOnMount={true}>
      <AutcompleteField
        name="approvals"
        label="common.approvers"
        autocompleteProps={{ id: "approvals", isMulti: true }}
        options={availableApprovers}
      />
    </AsyncGate>
  );
};

export default connect<StateProps, DispatchProps, {}, ApplicationState>(mapStateToProps, {
  loadAvailableApprovers: changeRequestsActions.loadAvailableApprovers,
})(Approvers);
