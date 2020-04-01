import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import { userManagementSelectors } from "../../../../state/ducks/userManagement";
import Text from "../../../components/Text";

interface Props {
  parentGroups: any[];
  setParentGroups: (selectedItems: any) => void;
}

export const ParentGroups: React.FunctionComponent<Props> = ({
  parentGroups,
  setParentGroups,
}) => {
  const allGroups = useSelector(userManagementSelectors.getOfficialGroups);

  return (
    <Grid>
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
    </Grid>
  );
};

export default ParentGroups;
