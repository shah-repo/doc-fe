import { Box } from "@material-ui/core";
import { concat, difference, filter, find, includes, isEmpty, last, uniqBy } from "lodash";
import React, { useState } from "react";
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
  shouldShowDAMCheck?: boolean;
  isDocumentPO: boolean;
}

export type Props = OwnProps;

export const Approvers: React.FunctionComponent<Props> = ({
  dataProp,
  withoutCurrentUser = false,
  documentTypeGroups,
  values,
  owner,
  shouldShowDAMCheck = true,
  isDocumentPO,
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

  const initialGroups = uniqBy(documentTypeGroups, "id")
    .reduce<any[]>((groups, group) => {
      if (includes(group.joinedEmployees.map((e) => e.id), owner?.id)) {
        groups.push({
          ...group,
          groupApprover: owner?.id,
        });
      }
      return groups;
    }, []);

  const [checkedGroups, setCheckedGroups] = useState<any[]>(initialGroups);
  const [selectedApprovers, setSelectedApprovers] = useState<any[]>([]);


  const markGroupChecked = (selectedUsers: any[]) => {
    if (!selectedUsers || isEmpty(selectedUsers)) {
      setCheckedGroups(initialGroups);
      return;
    }
    const uniqGroups = uniqBy(documentTypeGroups, "id").reverse();
    if (isDocumentPO) {
      if (!isEmpty(difference(selectedUsers, selectedApprovers))) { // user added
        const newUserId = last(difference(selectedUsers, selectedApprovers)).value;
        const checkedGroup =
          find(uniqGroups, (group) =>
            includes(group.joinedEmployees.map((e) => e.id), newUserId)
            && !includes(checkedGroups.map((g) => g.id), group.id)) as any;
        if (!checkedGroup) { return; }
        checkedGroup.groupApprover = newUserId;
        const newGroups = concat(checkedGroups, checkedGroup);
        setCheckedGroups(newGroups);
      } else if (!isEmpty(difference(selectedApprovers, selectedUsers))) { // user removed
        const removedUserId = last(difference(selectedApprovers, selectedUsers)).value;
        const newGroups = checkedGroups.filter((group) => group.groupApprover === removedUserId);
        setCheckedGroups(newGroups);
      }
    } else {
      const newGroups =
        filter(uniqGroups, (group) =>
          group
            .joinedEmployees
            .some((employee) => (
              selectedUsers
                .map((u) => u.value)
                .includes(employee.id)) || owner?.id === employee.id)
        );
      setCheckedGroups(newGroups);
    }
    setSelectedApprovers(selectedUsers);
  };

  const renderGroupApproversResults = () => {
    const uniqGroups = uniqBy(documentTypeGroups, "id");
    return (
      <Box display="flex" flexWrap="wrap">
        {
          uniqGroups.map((group, index) =>
            <Box marginRight={6} marginBottom={4} key={group.id} display="inline-flex">
              {
                includes(checkedGroups.map((g) => g.id), group.id) ?
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
        onChange={(users) => markGroupChecked(users as any[])}
      />
      {documentTypeGroups && shouldShowDAMCheck && renderGroupApproversResults()}
    </AsyncGate>
  );
};

export default Approvers;
