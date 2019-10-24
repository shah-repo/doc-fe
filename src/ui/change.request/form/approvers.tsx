import React from "react";
import { connect } from "react-redux";
import { changeRequestsActions, changeRequestsSelectors } from "../../../state/ducks/changeRequest";
import { ApplicationState } from "../../../state/reducers";
import { AsyncState } from "../../../state/types";
import { Approval } from "../../../state/ducks/common";
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

interface OwnProps {
  dataProp?: Approval[];
}

export type Props = StateProps & DispatchProps & OwnProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  loadApproversAsyncState: changeRequestsSelectors.getLoadApproversAsyncState(state),
  availableApprovers: changeRequestsSelectors.getApproversListForAssessmentForm(state),
});

export const Approvers: React.FunctionComponent<Props> = ({
  availableApprovers,
  loadApproversAsyncState,
  loadAvailableApprovers,
  dataProp,
}) => {

  const styles = {
      multiValueRemove: (base: React.CSSProperties, state: any) => {
        return (dataProp! && dataProp!.some(approver => approver.approver.email === state.data.value)) ? { ...base, display: "none" } : base ;
     },
  };

  return (
    <AsyncGate asyncState={loadApproversAsyncState} asyncAction={loadAvailableApprovers} startActionOnMount={true}>
      <AutcompleteField
        name="approvals"
        label="common.approvers"
        autocompleteProps={{
          id: "approvals",
          isMulti: true,
          isClearable: false,
          styles,
          backspaceRemovesValue: false,
        }}
        options={availableApprovers}
      />
    </AsyncGate>
  );
};

export default connect<StateProps, DispatchProps, {}, ApplicationState>(mapStateToProps, {
  loadAvailableApprovers: changeRequestsActions.loadAvailableApprovers,
})(Approvers);
