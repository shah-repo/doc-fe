import { Box } from "@material-ui/core";
import { isEmpty } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { components } from "react-select";
import { ReactComponent as CheckMark } from "../../../assets/images/check_mark.svg";
import { authSelectors } from "../../../state/ducks/auth";
import { Group } from "../../../state/ducks/auth/types";
import { changeRequestsActions, changeRequestsSelectors } from "../../../state/ducks/changeRequest";
import { Approval } from "../../../state/ducks/common";
import { ApplicationState } from "../../../state/reducers";
import AsyncGate from "../../components/AsyncGate";
import AutcompleteField from "../../components/forms/fields/Autocomplete/Autocomplete";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import { toUniqGroupOptions } from "./transform";


interface OwnProps {
  dataProp?: Approval[];
  withoutCurrentUser?: boolean;
  documentTypeGroups?: Group[];
}

export type Props = OwnProps;

export const Approvers: React.FunctionComponent<Props> = ({
  dataProp,
  withoutCurrentUser = false,
  documentTypeGroups,
}) => {

  const joinedEmployees = (groups: Group[]) => groups.map((group) => group.joinedEmployees.map((employee) =>
    ({ group: group.name, ...employee.user })
  ));
  const approvers = joinedEmployees(documentTypeGroups as Group[]).flat();

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
    multiValueRemove: (base: React.CSSProperties, state: any) =>
      (dataProp && dataProp.some((approver) => approver.approver.id === state.data.value)) ?
        { ...base, display: "none" } :
        base,
  };

  const options = isEmpty(approvers) ? availableApprovers : toUniqGroupOptions(approvers);

  const renderGroupApproversResults = () => (
    <Box display="flex" flexWrap="wrap">
      {documentTypeGroups?.map((group) =>
        <Box marginRight={6} marginBottom={4} key={group.id} >
          <div><CheckMark /></div>
          <Box paddingLeft={1} display="initial">
            <Text message={group.name} />
          </Box></Box>
        )}
    </Box>);

  const formatOptionLabel = ({ value, label, groups }) => (
    <div style={{ display: "flex" }} key={value}>
      <div>{label}</div>
      <div style={{ marginLeft: "10px", color: "#ccc" }}>
        {groups.join(",  ")}
      </div>
    </div>);

  const MultiValueLabel = ({ props, data }) => {
    console.log(data);
    return (<components.MultiValueLabel {...props}>
      <Box marginLeft={1}>{data.label}</Box>
    </components.MultiValueLabel>);
  };

  const customFilter = ({ option, searchText }) => {
    if (
      option.data.label.toLowerCase().includes(searchText.toLowerCase()) ||
      option.data.groups.map((group) => group.toLowerCase().includes(searchText.toLowerCase()))
    ) {
      return true;
    } else {
      return false;
    }
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
          formatOptionLabel,
          components: { MultiValueLabel },
          filterOption: { customFilter },
        }}
        options={options as OptionType[]}
      />
      {documentTypeGroups && renderGroupApproversResults()}
    </AsyncGate>
  );
};

export default Approvers;
