import React from "react";
import { useSelector } from "react-redux";
import { authSelectors } from "../../../state/ducks/auth";
import { changeRequestsActions, changeRequestsSelectors } from "../../../state/ducks/changeRequest";
import { Approval } from "../../../state/ducks/common";
import { ApplicationState } from "../../../state/reducers";
import AsyncGate from "../../components/AsyncGate";
import AutcompleteField from "../../components/forms/fields/Autocomplete/Autocomplete";
import useActionCreator from "../../hooks/useActionCreator";

interface OwnProps {
  dataProp?: Approval[];
  withoutCurrentUser?: boolean;
}

export type Props = OwnProps;

export const Approvers: React.FunctionComponent<Props> = ({
  dataProp,
  withoutCurrentUser = false,
}) => {

  const loadApproversAsyncState = useSelector(changeRequestsSelectors.getLoadApproversAsyncState);
  const availableApprovers = useSelector((state: ApplicationState) => {
    if (withoutCurrentUser) {
      const currentUserId = authSelectors.currentUserId(state);
      return changeRequestsSelectors.getApproversListWithoutCurrentUser(state, currentUserId);
    }
    return changeRequestsSelectors.getApproversListForAssessmentForm(state);
  });
  const loadAvailableApproversAction = useActionCreator(changeRequestsActions.loadAvailableApprovers);
  const styles = {
      multiValueRemove: (base: React.CSSProperties, state: any) => {
        return (dataProp! && dataProp!.some((approver) => approver.approver.id === state.data.value)) ?
          { ...base, display: "none" } :
          base;
      },
  };

  return (
    <AsyncGate
      asyncState={loadApproversAsyncState}
      asyncAction={loadAvailableApproversAction}
      startActionOnMount={true}
    >
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

export default Approvers;
