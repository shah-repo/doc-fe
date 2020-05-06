import * as React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { authSelectors } from "../../../../state/ducks/auth";
import { changeRequestsActions, changeRequestsSelectors } from "../../../../state/ducks/changeRequest";
import { ApplicationState } from "../../../../state/reducers";
import AsyncGate from "../../../components/AsyncGate";
import AutocompleteField from "../../../components/forms/fields/Autocomplete/Autocomplete";
import useActionCreator from "../../../hooks/useActionCreator";

const SecurityEmployees: React.FunctionComponent = () => {
  const intl = useIntl();
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

  return (
    <AsyncGate
      asyncState={loadApproversAsyncState}
      asyncAction={loadAvailableApproversAction}
      startActionOnMount={true}
    >
      <AutocompleteField
        name="securityEmployees"
        label="document.revision.selected.users"
        autocompleteProps={{
          id: "securityEmployees",
          isMulti: true,
          closeMenuOnSelect: false,
          placeholder: intl.formatMessage({
            id: "document.revision.selected.users.placeholder",
          }),
        }}
        options={availableApprovers}
      />
    </AsyncGate>
  );
};

export default SecurityEmployees;
