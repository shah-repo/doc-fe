import { Box, Button, Grid, TextField, Typography } from "@material-ui/core";
import { isEmpty, uniqBy } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import Select from "react-select";
import { GroupTag, Permission } from "../../../state/ducks/auth/types";
import { GroupRequestBody } from "../../../state/ducks/groupManagement/types";
import { GetEmployeeResponse } from "../../../state/ducks/userManagement";
import { AsyncActionPayload } from "../../../state/types";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import FormMessage from "../../components/forms/FormMessage";
import Text from "../../components/Text";
import { toArray, toMembersOptions, toOptions } from "../utils/transform";
import GroupInfoPresenter from "./GroupInfo.presenter";
import GroupType from "./GroupType";

interface Props {
  employees: GetEmployeeResponse[];
  members: OptionType[];
  setMembers: (state: any) => void;
  handleReset: () => void;
  handleSubmit: () => void;
  hasOfficialPermission: boolean;
  currentEmployeePermissions: Permission[];
  currentEmployeeTags: GroupTag[];
  isCreateMode?: boolean;
  group: GroupRequestBody;
  setGroup: (values: GroupRequestBody) => void;
  handleAsyncState: () => AsyncActionPayload;
  allGroups: any[];
  parentGroups: any[];
  setParentGroups: (state: any) => void;
}

export const GroupContentPresenter: React.FunctionComponent<Props> = ({
  employees,
  members,
  setMembers,
  handleReset,
  handleSubmit,
  hasOfficialPermission,
  currentEmployeePermissions,
  isCreateMode,
  currentEmployeeTags,
  group,
  setGroup,
  handleAsyncState,
  allGroups,
  parentGroups,
  setParentGroups,
}) => {
  const intl = useIntl();
  const canCreateOfficialGroup = hasOfficialPermission && group.isOfficial;

  const groupNameRenderer = () => (
    <Box width={700}>
      <Typography variant="h4">
        <Text translation="common.group.name" />
      </Typography>
      <TextField
        variant="outlined"
        id="Group-groupName"
        value={group.name}
        onChange={(event: any) =>
          setGroup({ ...group, name: event.target.value })
        }
        style={{ width: "700px", marginTop: "16px" }}
      />
      <FormMessage asyncState={handleAsyncState()} />
    </Box>
  );

  const addMembersRenderer = () => (
    <Box width={700} mt={5}>
      <Typography variant="h4" style={{ marginBottom: "16px" }}>
        <Text message={"common.members"} />
      </Typography>
      <Select
        id="Group-members"
        isMulti={true}
        options={toMembersOptions(employees)}
        onChange={(state: any) => setMembers(state)}
        value={members}
        placeholder={intl.formatMessage({
          id: "group.management.list.of.users",
        })}
      />
    </Box>
  );

  const permissionsRenderer = () => (
    <Box width={700} mt={5}>
      <Typography variant="h4" style={{ marginBottom: "16px" }}>
        <Text message={"common.permissions"} />
      </Typography>
      <Select
        id="Group-permissions"
        isMulti={true}
        options={toOptions(currentEmployeePermissions)}
        value={toOptions(group.permissions)}
        onChange={(state: any) =>
          setGroup({ ...group, permissions: toArray(state) })
        }
      />
    </Box>
  );

  const tagsRenderer = () => (
    <Box width={700} mt={5}>
      <Typography variant="h4" style={{ marginBottom: "16px" }}>
        <Text message={"common.tags"} />
      </Typography>
      <Select
        id="Group-addTags"
        isMulti={true}
        options={toOptions(currentEmployeeTags)}
        onChange={(state: any) => setGroup({ ...group, tags: toArray(state) })}
        value={toOptions(group.tags)}
      />
    </Box>
  );

  const inheritText = (parentGroup) => {
    if (!isEmpty(parentGroup.parents)) {
      return `inherits from ${parentGroup.parents.map((parent) => parent.name)}`;
    }
    return "";
  };

  const renderParentContainer = (parentGroup) => parentGroup.map((p) => (
    <Box mt={6} width="700px" padding="10px" border="1px solid grey" borderRadius={4} key={p.id}>
      <Typography
        variant="h6"
        style={{
          marginBottom: 5,
          borderBottom: "solid",
          borderColor: "grey",
        }}>
        <Text message={`${p.name} ${inheritText(p)}`}/>
      </Typography>
      <GroupInfoPresenter
        items={p.permissions}
        title="common.permissions"
      />
      <GroupInfoPresenter
        items={p.tags}
        title="common.tags"
      />
    </Box>)
  );

  const renderSelectedGroupInfo = (parentGroups) => {
    const arrayOfIds = parentGroups.map((p) => p.value);
    const savedParents = allGroups.filter((group) => arrayOfIds.includes(group.value));
    const ids = savedParents.map((s) => s.joinedParents.map((e) => e));
    return renderParentContainer(uniqBy(ids.flat(), "id"));
  };


  const parentGroupsRenderer = () => (
    <Box width={700} mt={5}>
      <Typography variant="h4" style={{ marginBottom: "16px" }}>
        <Text translation="common.parent.groups" />
      </Typography>
      <Select
        id="Group-addParentGroups"
        isMulti={true}
        options={allGroups}
        onChange={(state: any) => setParentGroups(state)}
        value={parentGroups}
      />
    </Box>
  );

  const resetButtonRenderer = () => (
    <Button variant="outlined" onClick={handleReset} id="Group-reset">
      <Text translation="common.reset" />
    </Button>
  );

  const submitButtonRenderer = () => (
    <Button
      id="Group-createGroup"
      variant="contained"
      onClick={handleSubmit}
      disabled={isEmpty(group.name)}
    >
      <Text translation="common.save" />
    </Button>
  );
  return (
    <Grid
      container={true}
      alignItems="center"
      direction="column"
      style={{ marginTop: 90 }}
    >
      <Grid>
        {hasOfficialPermission && isCreateMode && (
          <GroupType group={group} setGroup={setGroup} />
        )}
        {groupNameRenderer()}
        {addMembersRenderer()}
        {canCreateOfficialGroup && permissionsRenderer()}
        {canCreateOfficialGroup && tagsRenderer()}
        {canCreateOfficialGroup && parentGroupsRenderer()}
        {!isEmpty(parentGroups) && renderSelectedGroupInfo(parentGroups)}
        <Grid item={true} style={{ textAlign: "right" }}>
          {isCreateMode && resetButtonRenderer()}
          {submitButtonRenderer()}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GroupContentPresenter;
