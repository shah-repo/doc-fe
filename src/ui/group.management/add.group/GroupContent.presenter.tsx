import { Box, Button, Grid, TextField, Typography } from "@material-ui/core";
import { isEmpty } from "lodash";
import React from "react";
import Select from "react-select";
import { GroupTag, Permission } from "../../../state/ducks/auth/types";
import { GroupRequestBody } from "../../../state/ducks/groupManagement/types";
import { GetEmployeeResponse } from "../../../state/ducks/userManagement";
import { AsyncActionPayload } from "../../../state/types";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import FormMessage from "../../components/forms/FormMessage";
import Text from "../../components/Text";
import { toArray, toMembersOptions, toOptions } from "../utils/transform";
import GroupType from "./GroupType";
import { useIntl } from "react-intl";

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
}) => {
  const intl = useIntl();
  const canCreateOfficialGroup =
    hasOfficialPermission && group.isOfficial;

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
        placeholder={intl.formatMessage({id: "group.management.list.of.users"})}
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

  const buttonsRenderer = () => (
    <Grid item={true} style={{ textAlign: "right" }}>
      <Button variant="outlined" onClick={handleReset} id="Group-reset">
        <Text translation="common.reset" />
      </Button>
      <Button
        id="Group-createGroup"
        variant="contained"
        onClick={handleSubmit}
        disabled={isEmpty(group.name)}
      >
        <Text translation="common.save" />
      </Button>
    </Grid>
  );

  return (
    <Grid
      container={true}
      alignItems="center"
      direction="column"
      style={{ marginTop: "250px" }}
    >
      <Grid>
        {hasOfficialPermission && isCreateMode && (
          <GroupType group={group} setGroup={setGroup} />
        )}
        {groupNameRenderer()}
        {addMembersRenderer()}
        {canCreateOfficialGroup && permissionsRenderer()}
        {canCreateOfficialGroup && tagsRenderer()}
        {buttonsRenderer()}
      </Grid>
    </Grid>
  );
};

export default GroupContentPresenter;
