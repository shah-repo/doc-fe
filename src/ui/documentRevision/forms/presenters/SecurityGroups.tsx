import * as React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { userManagementSelectors } from "../../../../state/ducks/userManagement";
import AutocompleteField from "../../../components/forms/fields/Autocomplete/Autocomplete";


const SecurityGroups: React.FunctionComponent = () => {
  const intl = useIntl();
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);

  return (
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
  );
};

export default SecurityGroups;
