import * as React from "react";
import { useSelector } from "react-redux";
import { authSelectors } from "../../../../state/ducks/auth";
import { changeRequestsSelectors } from "../../../../state/ducks/changeRequest";
import { ApplicationState } from "../../../../state/reducers";
import AutocompleteField from "../../../components/forms/fields/Autocomplete/Autocomplete";
import { useAssignOperatorsToDocument } from "../../../hooks/docCustomization/useCustomization";

interface Props {
  documentTypeId: string;
  isDisabled?: boolean;
}

const OperatorAccess: React.FunctionComponent<Props> = ({ documentTypeId, isDisabled }) => {
  const availableApprovers = useSelector((state: ApplicationState) => {
    const currentUserId = authSelectors.currentUserId(state);
    return changeRequestsSelectors.getApproversListWithoutCurrentUser(
      state,
      currentUserId
    );
  });
  const { isVisible } = useAssignOperatorsToDocument(documentTypeId);

  if (!isVisible) {
    return null;
  }

  return (
    <AutocompleteField
      name="operators"
      label="document.assign.to"
      autocompleteProps={{
        id: "operators",
        isMulti: true,
        closeMenuOnSelect: false,
      }}
      options={availableApprovers}
      isDisabled={isDisabled}
    />
  );
};

export default OperatorAccess;
