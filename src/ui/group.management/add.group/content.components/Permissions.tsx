import { Box, Grid, Typography } from "@material-ui/core";
import { cloneDeep } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import { authSelectors } from "../../../../state/ducks/auth";
import { GroupTag, Permission } from "../../../../state/ducks/auth/types";
import { GroupRequestBody } from "../../../../state/ducks/groupManagement/types";
import { MultiValueRemove, selectStyles, selectTheme } from "../../../components/forms/fields/Autocomplete/Autocomplete";
import Text from "../../../components/Text";
import { toArray, toOptions } from "../../utils/transform";

interface Props {
  group: GroupRequestBody;
  setGroup: (values: GroupRequestBody) => void;
  currentEmployeePermissions: Permission[];
}

const Permissions: React.FunctionComponent<Props> = ({
  group,
  setGroup,
  currentEmployeePermissions,
}) => {
  const currentEmployeeTags = cloneDeep(useSelector(authSelectors.currentEmployeeTags));
  if (!currentEmployeeTags.includes(GroupTag.PO_ADMIN)) {
    currentEmployeeTags.push(GroupTag.PO_ADMIN);
  }

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
        components={{ MultiValueRemove }}
        onChange={(state: any) =>
          setGroup({ ...group, permissions: toArray(state) })
        }
        styles={selectStyles}
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
        components={{ MultiValueRemove }}
        options={toOptions(currentEmployeeTags)}
        onChange={(state: any) => setGroup({ ...group, tags: toArray(state) })}
        value={toOptions(group.tags)}
        styles={selectStyles}
        theme={selectTheme}
      />
    </Box>
  );

  return (
    <Grid>
      {permissionsRenderer()}
      {tagsRenderer()}
    </Grid>
  );
};

export default Permissions;
