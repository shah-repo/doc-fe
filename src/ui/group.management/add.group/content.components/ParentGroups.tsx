import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import Select, { components } from "react-select";
import { ReactComponent as DeleteIcon } from "../../../../assets/images/circle-remove.svg";
import { GroupType } from "../../../../state/ducks/auth/types";
import { userManagementSelectors } from "../../../../state/ducks/userManagement";
import { selectStyles } from "../../../components/forms/fields/Autocomplete/Autocomplete";
import Text from "../../../components/Text";

interface Props {
  parentGroups: any[];
  setParentGroups: (selectedItems: any) => void;
  currentGroupId: string;
}

export const ParentGroups: React.FunctionComponent<Props> = ({
  parentGroups,
  setParentGroups,
  currentGroupId,
}) => {
  const allGroups = useSelector(userManagementSelectors.getOfficialGroups);
  const availableGroups = allGroups.filter((group) => group.value !== currentGroupId);

  const MultiValueRemove = (props) =>
    props.data.type === GroupType.MANAGMENT ?
      <components.MultiValueRemove {...props}>
        <DeleteIcon style={{ width: 12, height: 12 }}/>
      </components.MultiValueRemove> :
      <></>;

  return (
    <Grid>
      <Box width={700} mt={5}>
        <Typography variant="h4" style={{ marginBottom: "16px" }}>
          <Text translation="common.parent.groups" />
        </Typography>
        <Select
          id="Group-addParentGroups"
          isMulti={true}
          options={availableGroups}
          onChange={(state: any) => setParentGroups(state)}
          value={parentGroups}
          components={{ MultiValueRemove }}
          styles={selectStyles}
        />
      </Box>
    </Grid>
  );
};

export default ParentGroups;
