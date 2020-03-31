import { Box, Grid, Typography } from "@material-ui/core";
import { isEmpty } from "lodash";
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

  const onSelectParentGroup = (selectedItems: any) => {
    if (isEmpty(selectedItems)) {
      setParentGroups([]);
      return;
    }
    const selectedItemsData = allGroups.filter((group) => selectedItems.some((item) => group.label === item.label));
    setParentGroups(selectedItemsData);
  };

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
          onChange={(selectedItems: any) => onSelectParentGroup(selectedItems)}
          value={parentGroups}
        />
      </Box>
    </Grid>
  );
};

export default ParentGroups;
