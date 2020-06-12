import { Box } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { components } from "react-select";
import { authSelectors } from "../../../state/ducks/auth";
import { changeRequestsActions, changeRequestsSelectors } from "../../../state/ducks/changeRequest";
import { ApplicationState } from "../../../state/reducers";
import AsyncGate from "../../components/AsyncGate";
import AutocompleteField from "../../components/forms/fields/Autocomplete/Autocomplete";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import { FBApproversProps } from "./FBApprovers.types";


const FBApproversField: React.FunctionComponent<FBApproversProps> = ({
  name,
  disabled,
  dialogState,
  docRevState,
  ...props
}) => {

  const formatOptionLabel = ({ value, label, groups }) => {
    const uniqueValues = groups ? groups.filter((x, i, a) => a.indexOf(x) === i) : [];
    return (
      <div style={{ display: "flex" }} key={value}>
        <div>{label}</div>
        <div style={{ marginLeft: "10px", color: "#ccc" }}>
          {groups ? uniqueValues.join(",  ") : ""}
        </div>
      </div>);
  };


  const MultiValueLabel = ({ props, data }) => (<components.MultiValueLabel {...props}>
    <Box marginLeft={1}><Text message={data.label}/></Box>
  </components.MultiValueLabel>);

  const loadAvailableApproversAction = useActionCreator(changeRequestsActions.loadAvailableApprovers);
  const loadApproversAsyncState = useSelector(changeRequestsSelectors.getLoadApproversAsyncState);
  const availableApprovers = useSelector((state: ApplicationState) => {
    const currentUserId = authSelectors.currentUserId(state);
    return changeRequestsSelectors.getApproversListWithoutCurrentUser(state, currentUserId);
  });

  return (
    <div>
      <React.Fragment>
        <AsyncGate
          asyncState={loadApproversAsyncState}
          asyncAction={loadAvailableApproversAction}
          startActionOnMount={true}
        >
          <AutocompleteField
            name="approvals"
            label="common.approvers"
            autocompleteProps={{
              id: "approvals",
              isMulti: true,
              isClearable: false,
              backspaceRemovesValue: false,
              formatOptionLabel,
              components: { MultiValueLabel },
            }}
            options={availableApprovers}
            // isDisabled={disabled}
          />
        </AsyncGate>
      </React.Fragment>
    </div>
  );
};

export default FBApproversField;
