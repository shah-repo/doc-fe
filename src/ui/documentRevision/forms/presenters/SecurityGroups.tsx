import * as React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { userManagementActions, userManagementSelectors } from "../../../../state/ducks/userManagement";
import AsyncGate from "../../../components/AsyncGate";
import AutocompleteField from "../../../components/forms/fields/Autocomplete/Autocomplete";
import useActionCreator from "../../../hooks/useActionCreator";
import { DocumentRevisionFormValues } from "../types";

interface Props {
  values: DocumentRevisionFormValues;
  type?: string;
}

const SecurityGroups: React.FunctionComponent<Props> = ({
  values,
  type,
}) => {
  const intl = useIntl();
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
  const loadGroupAsyncState = useSelector(
    userManagementSelectors.getLoadGroupsAsyncState
  );
  const loadGroupsAction = useActionCreator(
    userManagementActions.loadCompanyGroups
  );

  return (
    <>
      {
        (!values.status || type === "newOutput") && (
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
        )
      }
    </>
  );
};

export default SecurityGroups;
