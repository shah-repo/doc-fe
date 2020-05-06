import * as React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { userManagementActions, userManagementSelectors } from "../../../../state/ducks/userManagement";
import AsyncGate from "../../../components/AsyncGate";
import AutocompleteField from "../../../components/forms/fields/Autocomplete/Autocomplete";
import useActionCreator from "../../../hooks/useActionCreator";


const SecurityGroups: React.FunctionComponent = () => {
  const intl = useIntl();
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
  const loadGroupAsyncState = useSelector(
    userManagementSelectors.getLoadGroupsAsyncState
  );
  const loadGroupsAction = useActionCreator(
    userManagementActions.loadCompanyGroups
  );

  return (
    <AsyncGate
      asyncState={loadGroupAsyncState}
      asyncAction={loadGroupsAction}
      startActionOnMount={true}
    >
      <AutocompleteField
        name="securityGroups"
        label="document.revision.selected.groups"
        autocompleteProps={{
          id: "securityGroups",
          isMulti: true,
          closeMenuOnSelect: false,
          placeholder: intl.formatMessage({
            id: "document.revision.selected.groups.placeholder",
          }),
        }}
        options={groupOptions}
      />
    </AsyncGate>
  );
};

export default SecurityGroups;
