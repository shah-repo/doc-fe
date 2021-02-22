import { Box, Grid, TextField, Typography } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";
import Select from "react-select";
import { GroupRequestBody } from "../../../../state/ducks/groupManagement/types";
import { GetEmployeeResponse } from "../../../../state/ducks/userManagement";
import { AsyncActionPayload } from "../../../../state/types";
import { MultiValueRemove, selectStyles } from "../../../components/forms/fields/Autocomplete/Autocomplete";
import { OptionType } from "../../../components/forms/fields/Autocomplete/types";
import FormMessage from "../../../components/forms/FormMessage";
import Text from "../../../components/Text";
import { toMembersOptions } from "../../utils/transform";
import GroupType from "./GroupType";

interface Props {
  employees: GetEmployeeResponse[];
  members: OptionType[];
  setMembers: (state: any) => void;
  isCreateMode?: boolean;
  group: GroupRequestBody;
  setGroup: (values: GroupRequestBody) => void;
  handleAsyncState: () => AsyncActionPayload;
  hasOfficialPermission: boolean;
}

const SharedContent: React.FunctionComponent<Props> = ({
  employees,
  members,
  setMembers,
  isCreateMode,
  group,
  setGroup,
  handleAsyncState,
  hasOfficialPermission,
}) => {
  const intl = useIntl();

  const groupNameRenderer = () => (
    <Box width={700}>
      <Typography variant="h4">
        <Text translation="common.group.name" />
      </Typography>
      <TextField
        variant="outlined"
        id="Group-groupName"
        data-cy="Group-groupName"
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
        components={{ MultiValueRemove }}
        options={toMembersOptions(employees)}
        styles={selectStyles}
        onChange={(state: any) => setMembers(state)}
        value={members}
        placeholder={intl.formatMessage({
          id: "group.management.list.of.users",
        })}
      />
    </Box>
  );

  return (
    <Grid>
      {hasOfficialPermission && isCreateMode && (
        <GroupType group={group} setGroup={setGroup} />
      )}
      {groupNameRenderer()}
      {addMembersRenderer()}
    </Grid>
  );
};

export default SharedContent;
