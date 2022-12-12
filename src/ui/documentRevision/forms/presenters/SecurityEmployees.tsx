import * as React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { authSelectors } from "../../../../state/ducks/auth";
import { changeRequestsSelectors } from "../../../../state/ducks/changeRequest";
import { ApplicationState } from "../../../../state/reducers";
import AutocompleteField from "../../../components/forms/fields/Autocomplete/Autocomplete";

interface Props {
  portal?: boolean;
  isDisabled?: boolean;
}

const SecurityEmployees: React.FunctionComponent<Props> = ({ portal, isDisabled }) => {
  const intl = useIntl();
  const availableApprovers = useSelector((state: ApplicationState) => {
    const currentUserId = authSelectors.currentUserId(state);
    return changeRequestsSelectors.getApproversListWithoutCurrentUser(
      state,
      currentUserId
    );
  });

  return (
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
      portal={portal}
      isDisabled={isDisabled}
    />
  );
};

export default SecurityEmployees;
