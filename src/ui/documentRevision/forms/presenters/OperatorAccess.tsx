import * as React from "react";
import { useSelector } from "react-redux";
import { authSelectors } from "../../../../state/ducks/auth";
import { changeRequestsActions, changeRequestsSelectors } from "../../../../state/ducks/changeRequest";
import { ApplicationState } from "../../../../state/reducers";
import AsyncGate from "../../../components/AsyncGate";
import AutocompleteField from "../../../components/forms/fields/Autocomplete/Autocomplete";
import { useAssignOperatorsToDocument } from "../../../hooks/docCustomization/useCustomization";
import useActionCreator from "../../../hooks/useActionCreator";

interface Props {
  documentTypeId: string;
}

const OperatorAccess: React.FunctionComponent<Props> = ({ documentTypeId }) => {
  const loadAvailableApproversAction = useActionCreator(
    changeRequestsActions.loadAvailableApprovers
  );
  const loadApproversAsyncState = useSelector(
    changeRequestsSelectors.getLoadApproversAsyncState
  );
  const availableApprovers = useSelector((state: ApplicationState) => {
    const currentUserId = authSelectors.currentUserId(state);
    return changeRequestsSelectors.getApproversListWithoutCurrentUser(
      state,
      currentUserId
    );
  });
  const [isVisible] = useAssignOperatorsToDocument(documentTypeId);

  if (!isVisible) {
    return null;
  }

  return (
    <AsyncGate
      asyncState={loadApproversAsyncState}
      asyncAction={loadAvailableApproversAction}
      startActionOnMount={true}
    >
      <AutocompleteField
        name="operators"
        label="document.assign.to"
        autocompleteProps={{
          id: "operators",
          isMulti: true,
          closeMenuOnSelect: false,
        }}
        options={availableApprovers}
      />
    </AsyncGate>
  );
};

export default OperatorAccess;
