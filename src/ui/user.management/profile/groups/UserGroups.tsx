import { Box, Button, Icon, Typography } from "@material-ui/core";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Nullable } from "../../../../state/ducks/common";
import { GetEmployeeResponse, userManagementActions, userManagementSelectors } from "../../../../state/ducks/userManagement";
import SummaryField from "../../../common/summary/base";
import { MultiValueRemove, selectStyles } from "../../../components/forms/fields/Autocomplete/Autocomplete";
import { OptionType } from "../../../components/forms/fields/Autocomplete/types";
import Text from "../../../components/Text";
import useAsync from "../../../hooks/useAsync";
import { toEmployeeGroupsEditRequestBody } from "../../utils/transform";
import { styles } from "./UserGroups.style";


interface OwnProps {
  canManageUsers: boolean;
  employeeGroups: OptionType[];
  employeeId: string;
  callbackUpdateGroups?: (values: GetEmployeeResponse) => void;
  fromUserProfile?: boolean;
}

type Props = OwnProps;

export const UserGroups: React.FunctionComponent<Props> = ({
  canManageUsers,
  employeeGroups,
  callbackUpdateGroups,
  employeeId,
  fromUserProfile = false,
}) => {
  const classes = styles();

  const dispatch = useDispatch();

  let groups: Nullable<OptionType[]> = employeeGroups;
  const [showEditGroups, setEditGroups] = useState(false);
  const openEditGroups = () => setEditGroups(true);
  const closeEditGroups = () => setEditGroups(false);

  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);

  const async = useAsync({
    onSuccess: (data: any) => {
      if (callbackUpdateGroups) {
        callbackUpdateGroups(data);
      }
    },
  });

  const onSubmit = (employeeId: string, values: Nullable<OptionType[]>) => {
    dispatch(
      userManagementActions.editEmployeeGroups(
        employeeId,
        toEmployeeGroupsEditRequestBody(values),
        async,
      ),
    );
  };

  const handleGroups = (groups: OptionType[]) => groups.map((group) => group.label).join(", ");

  const onChange = (state: any) => (groups = state);

  const addGroupsRenderer = () => (
    <Button
      variant="text"
      color="primary"
      onClick={openEditGroups}
      className={classes.addGroupsButton}
      id="UserGroups-addGroups"
    >
      <Icon style={{ marginRight: "10px" }}>
        <AddCircleOutlineOutlinedIcon />
      </Icon>
      <Text translation="user.management.add.to.groups" />
    </Button>
  );

  const groupsRenderer = () => (
    <Box>
      <SummaryField
        label="common.groups"
        value={handleGroups(employeeGroups)}
        noValueOption={<Text translation="user.management.no.groups.specified" />}
      />
      {canManageUsers && !fromUserProfile && addGroupsRenderer()}
    </Box>
  );

  const editGroupsRenderer = () => (
    <Box>
      <Typography variant="h6" style={{ marginBottom: "16px" }}>
        <Text message={"common.groups"} />
      </Typography>
      <Select
        id="UserGroups-groups"
        isMulti={true}
        components={{ MultiValueRemove }}
        styles={selectStyles}
        options={groupOptions}
        placeholder="Start typing to see the list of groups…"
        onChange={onChange}
        defaultValue={employeeGroups}
      />
      <Button
        className={classes.containedButton}
        variant="contained"
        color="primary"
        onClick={() => {
          onSubmit(employeeId, groups);
          closeEditGroups();
        }}
        id="UserGroups-done"
      >
      </Button>
      <Button
        className={classes.outlinedButton}
        variant="outlined"
        onClick={closeEditGroups}
        id="UserGroups-cancel"
      >
        <Text translation="common.cancel" />
      </Button>
    </Box>
  );
  return (
    <Box minWidth="500px" maxWidth="700px">
      {!showEditGroups && groupsRenderer()}
      {showEditGroups && editGroupsRenderer()}
    </Box>
  );
};

export default UserGroups;
