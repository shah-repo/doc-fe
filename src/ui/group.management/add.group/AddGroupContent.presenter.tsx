import { Box, Button, Grid, TextField, Typography } from "@material-ui/core";
import { isEmpty } from "lodash";
import React from "react";
import Select from "react-select";
import { GetEmployeeResponse } from "../../../state/ducks/userManagement";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import Text from "../../components/Text";
import { transformToEmployeesOptions } from "../utils/transform";

interface Props {
  employees: GetEmployeeResponse[];
  groupName: string;
  members: OptionType[];
  handleGroupNameChange: (event: React.ChangeEvent<{ value: string }>) => void;
  handleMembersChange: (state: any) => void;
  handleReset: () => void;
  handleSubmit: () => void;
}

export const AddGroupContentPresenter: React.FunctionComponent<Props> = ({
  employees,
  groupName,
  members,
  handleGroupNameChange,
  handleMembersChange,
  handleReset,
  handleSubmit,
}) => {
  // permissions should be added
  const groupNameRenderer = () => (
    <Box width={700}>
      <Typography variant="h4">
        <Text translation="common.group.name" />
      </Typography>
      <TextField
        variant="outlined"
        id="AddGroup-groupName"
        value={groupName}
        onChange={handleGroupNameChange}
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
        onChange={handleMembersChange}
        value={members}
        placeholder="Start typing to see the list of users…"
      />
    </Box>
  );

  const buttonsRenderer = () => (
    <Box mt={5}>
      <Button variant="outlined" onClick={handleReset} id="AddGroup-reset">
        <Text translation="common.reset" />
      </Button>
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={isEmpty(groupName)}
        id="AddGroup-createGroup"
      >
        <Text translation="common.save" />
      </Button>
    </Box>
  );
  return (
    <Grid
      container={true}
      alignItems="center"
      direction="column"
      style={{ marginTop: "250px" }}
    >
      {groupNameRenderer()}
      {addMembersRenderer()}
      {buttonsRenderer()}
    </Grid>
  );
};

export default AddGroupContentPresenter;
