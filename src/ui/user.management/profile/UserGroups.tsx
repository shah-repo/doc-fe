import { Box, Button, Icon, Typography } from "@material-ui/core";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { LoadCompanyGroups, userManagementActions } from "../../../state/ducks/userManagement";
import SummaryField from "../../common/summary/base";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";

interface OwnProps {
    canManageUsers: boolean;
    employeeGroups: OptionType[];
}

type Props = OwnProps;

export const UserGroups: React.FunctionComponent<Props> = ({
    canManageUsers,
    employeeGroups,
}) => {

  const [groupOptions, setGroupOptions] = useState<OptionType[]>([]);
  const loadCompanyGroupsAction = useActionCreator(userManagementActions.loadCompanyGroups);
  const employeeGroupsValues: string[] = [];

  const async = useAsync<LoadCompanyGroups>({
    onSuccess: (data = []) => {
      const options: OptionType[] = data.map((group) => ({
        value: group.id,
        label: group.name,
      }));
      setGroupOptions(options);
    },
  });

  const loadCompanyGroups = () => async.start(loadCompanyGroupsAction, async);

  useEffect(() => {
    loadCompanyGroups();
  }, []);

  employeeGroups.map((group) => employeeGroupsValues.push(group.label));

  const [showEditGroups, setEditGroups] = useState(false);

  const openEditGroups = () => setEditGroups(true);
  const closeEditGroups = () => setEditGroups(false);

  const onChange = (state: any) => console.log(state);

  const addGroupsRenderer = () => (
    <Button
        variant="text"
        color="primary"
        onClick={openEditGroups}
        fullWidth={true}
        style={{
        width: "auto",
        margin: "19px 0 0 0",
        padding: "0",
        }}
    >
        <Icon style={{ marginRight: "10px" }}>
        <AddCircleOutlineOutlinedIcon />
        </Icon>
        <Text translation="user.management.add.groups" />
    </Button>
  );

  const groupsRenderer = () => (
    <Box>
      <SummaryField
        label="user.management.groups"
        value={employeeGroupsValues.join(", ")}
      />
    {canManageUsers && addGroupsRenderer()}
    </Box>
  );

  const editGroupsRenderer = () => (
    <Box>
      <Typography variant="h6">
        <Text message={"user.management.groups"} />
      </Typography>
      <Select
        id="groups"
        isMulti={true}
        options={groupOptions}
        placeholder="Start typing to see the list of groups…"
        onChange={onChange}
        defaultValue={employeeGroups}
      />
    <Button
        style={{
        width: "auto",
        margin: "19px 0 0 0",
        padding: "0",
        }}
        variant="text"
        color="primary"
        fullWidth={true}
    >
        <Text translation="common.done" />
    </Button>
    <Button
        style={{
        width: "auto",
        margin: "19px 0 0 0",
        padding: "0",
        }}
        variant="text"
        color="primary"
        fullWidth={true}
        onClick={closeEditGroups}
    >
        <Text translation="common.cancel" />
    </Button>
    </Box>
  );
  return (
    <Box minWidth="500px" mt={7}>
      {!showEditGroups && groupsRenderer()}
      {showEditGroups && editGroupsRenderer()}
    </Box>
  );
};

export default UserGroups;
