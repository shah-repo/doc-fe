import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import Select, { components } from "react-select";
import { ReactComponent as DeleteIcon } from "../../../../assets/images/circle-remove.svg";
import { authSelectors } from "../../../../state/ducks/auth";
import { Permission } from "../../../../state/ducks/auth/types";
import { GroupRequestBody } from "../../../../state/ducks/groupManagement/types";
import Text from "../../../components/Text";
import { toArray, toOptions } from "../../utils/transform";

interface Props {
  group: GroupRequestBody;
  setGroup: (values: GroupRequestBody) => void;
  currentEmployeePermissions: Permission[];
}

export const Permissions: React.FunctionComponent<Props> = ({
  group,
  setGroup,
  currentEmployeePermissions,
}) => {
  const currentEmployeeTags = useSelector(authSelectors.currentEmployeeTags);
  const MultiValueRemove = (props) => (
    <components.MultiValueRemove {...props}>
      <DeleteIcon style={{ width: 12, height: 12 }} />
    </components.MultiValueRemove>
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
        components={{ MultiValueRemove }}
        onChange={(state: any) =>
          setGroup({ ...group, permissions: toArray(state) })
        }
        styles={{
          multiValue: (base) => ({
            ...base,
            background: "#EDF4FF",
          }),
          multiValueRemove: (base) => ({
            ...base,
            "&:hover": {
              background: "transparent",
              cursor: "pointer",
            },
          }),
        }}
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

  return (
    <Grid>
      {permissionsRenderer()}
      {tagsRenderer()}
    </Grid>
  );
};

export default Permissions;
