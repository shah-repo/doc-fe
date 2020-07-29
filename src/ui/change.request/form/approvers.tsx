import { Box } from "@material-ui/core";
import { uniqBy } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { components } from "react-select";
import { ReactComponent as CheckedMark } from "../../../assets/images/check_mark.svg";
import { ReactComponent as UncheckedMark } from "../../../assets/images/uncheck_mark.svg";
import { authSelectors } from "../../../state/ducks/auth";
import { Group } from "../../../state/ducks/auth/types";
import { changeRequestsActions, changeRequestsSelectors } from "../../../state/ducks/changeRequest";
import { Approval, Owner } from "../../../state/ducks/common";
import { ApplicationState } from "../../../state/reducers";
import AsyncGate from "../../components/AsyncGate";
import AutcompleteField from "../../components/forms/fields/Autocomplete/Autocomplete";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import Text from "../../components/Text";
import { ApproveAndReleaseFormValues } from "../../documentRevision/forms/types";
import useActionCreator from "../../hooks/useActionCreator";
import { toUniqGroupOptions } from "./transform";


interface OwnProps {
  dataProp?: Approval[];
  withoutCurrentUser?: boolean;
  documentTypeGroups?: Group[];
  values?: ApproveAndReleaseFormValues;
  owner?: Owner;
}

export type Props = OwnProps;

export const Approvers: React.FunctionComponent<Props> = ({
  dataProp,
  withoutCurrentUser = false,
  documentTypeGroups,
  values,
  owner,
}) => {
  // We should check if we need all of this
  // Now that approvers are moved to the FB
  // This is now only used for Approve&Release
  const joinedEmployees = (groups: Group[]) => groups.map((group) => group.joinedEmployees.map((employee) =>
    ({ group: group.name, id: employee.id, name: employee.user?.name })
  ));
  const approvers = documentTypeGroups ? joinedEmployees(documentTypeGroups).flat() : [];

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

  const renderGroupApproversResults = () => {
    const uniqGroups = uniqBy(documentTypeGroups, "id");
    const selectedEmployees = (values?.approvals || []).map((e) => e.value);

    return (
      <Box display="flex" flexWrap="wrap">
        {
          uniqGroups.map((group, index) =>
            <Box marginRight={6} marginBottom={4} key={group.id} display="inline-flex">
              {
                group
                  .joinedEmployees
                  .some((employee) => (
                    selectedEmployees?.includes(employee.id)) || owner?.id === employee.id) ?
                  <CheckedMark data-cy={"checked-" + index} /> : <UncheckedMark data-cy={"unchecked"} />
              }
              <Box paddingLeft={1} display="initial" data-cy={"group-" + index}>
                <Text message={group.name} />
              </Box></Box>
          )
        }
      </Box>
    );
  };

  const arrayOfOptions = [
    ...toUniqGroupOptions(approvers), ...availableApprovers,
  ];

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
    <Box marginLeft={1}><Text message={data.label} /></Box>
  </components.MultiValueLabel>);

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
        }}
        options={uniqBy(arrayOfOptions, "value").filter((e: any) => e.value !== owner?.id) as OptionType[]}
      />
      {documentTypeGroups && renderGroupApproversResults()}
    </AsyncGate>
  );
};

export default Approvers;
