import { Box, Button, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography } from "@material-ui/core";
import { isEmpty } from "lodash";
import React from "react";
import Select from "react-select";
import { GroupTag, Permission } from "../../../state/ducks/auth/types";
import { GetEmployeeResponse } from "../../../state/ducks/userManagement";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import Text from "../../components/Text";
import { transformToArray, transformToEmployeesOptions, transformToOptions } from "../utils/transform";
import { GroupRequestBody } from "../utils/types";

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
}

export const AddGroupContentPresenter: React.FunctionComponent<Props> = ({
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
}) => {
  const groupNameRenderer = () => (
    <Box width={700}>
      <Typography variant="h4">
        <Text translation="common.group.name" />
      </Typography>
      <TextField
        variant="outlined"
        id="AddGroup-groupName"
        value={group.name}
        onChange={(event: any) => setGroup({...group, name: event.target.value})}
        style={{ width: "700px", marginTop: "16px" }}
      />
    </Box>
  );

  const addMembersRenderer = () => (
    <Box width={700} mt={5}>
      <Typography variant="h4" style={{ marginBottom: "16px" }}>
        <Text message={"common.members"} />
      </Typography>
      <Select
        id="AddGroup-members"
        isMulti={true}
        options={transformToEmployeesOptions(employees)}
        onChange={(state: any) => setMembers(state)}
        value={members}
        placeholder="Start typing to see the list of users…"
      />
    </Box>
  );

  const permissionsRenderer = () => (
    <Box width={700} mt={5}>
      <Typography variant="h4" style={{ marginBottom: "16px" }}>
        <Text message={"common.permissions"} />
      </Typography>
      <Select
        id="AddGroup-permissions"
        isMulti={true}
        options={transformToOptions(currentEmployeePermissions)}
        onChange={(state: any) => setGroup({...group, permissions: transformToArray(state)})}
      />
    </Box>
  );

  const tagsRenderer = () => (
    <Box width={700} mt={5}>
      <Typography variant="h4" style={{ marginBottom: "16px" }}>
        <Text message={"common.tags"} />
      </Typography>
      <Select
        id="AddGroup-addTags"
        isMulti={true}
        options={transformToOptions(currentEmployeeTags)}
        onChange={(state: any) => setGroup({...group, tags: transformToArray(state)})}
      />
    </Box>
  );

  const buttonsRenderer = () => (
    <Box mt={5}>
      <Button variant="outlined" onClick={handleReset} id="AddGroup-reset">
        <Text translation="common.reset" />
      </Button>
      <Button
        id="AddGroup-createGroup"
        variant="contained"
        onClick={handleSubmit}
        disabled={isEmpty(group.name)}
      >
        <Text translation="common.save" />
      </Button>
    </Box>
  );

  const groupTypeRenderer = () => (
    <Box width={700} mt={-6} mb={2}>
      <Typography variant="h4" style={{ marginBottom: "16px" }}>
        <Text message={"group.management.group.type"} />
      </Typography>
      <RadioGroup
        id="AddGroup-groupType"
        name="groupType"
        onChange={(event: any) => setGroup({...group, isOfficial: event.target.value === "official" ? true : false })}>
        <FormControlLabel
          id="AddGroup-officialOption"
          label="Official"
          value="official"
          control={<Radio/>}
        />
        <FormControlLabel
          id="AddGroup-unofficialOption"
          label="Unofficial"
          value="unofficial"
          control={<Radio/>}
        />
      </RadioGroup>
    </Box>
  );

  return (
    <Grid
      container={true}
      alignItems="center"
      direction="column"
      style={{ marginTop: "250px" }}
    >
      {hasOfficialPermission && isCreateMode && groupTypeRenderer()}
      {groupNameRenderer()}
      {addMembersRenderer()}
      {hasOfficialPermission && isCreateMode && permissionsRenderer()}
      {hasOfficialPermission && isCreateMode && tagsRenderer()}
      {buttonsRenderer()}
    </Grid>
  );
};

export default AddGroupContentPresenter;
