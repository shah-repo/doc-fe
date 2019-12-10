import { Box, Button, Icon, Typography } from "@material-ui/core";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Select from "react-select";
import {
  LoadCompanyGroups,
  userManagementActions,
} from "../../../state/ducks/userManagement";
import SummaryField from "../../common/summary/base";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { toEmployeeGroupsEditRequestBody } from "../utils/transform";

interface OwnProps {
  canManageUsers: boolean;
  employeeGroups: OptionType[];
  employeeId: string;
}

interface DispatchProps {
  editEmployeeGroups: typeof userManagementActions.editEmployeeGroups;
}
type Props = OwnProps & DispatchProps;

export const UserGroups: React.FunctionComponent<Props> = ({
  canManageUsers,
  employeeGroups,
  editEmployeeGroups,
}) => {
  let groups: OptionType[] | null = employeeGroups;

  const [showEditGroups, setEditGroups] = useState(false);
  const openEditGroups = () => setEditGroups(true);
  const closeEditGroups = () => setEditGroups(false);

  const [groupOptions, setGroupOptions] = useState<OptionType[]>([]);
  const loadCompanyGroupsAction = useActionCreator(
    userManagementActions.loadCompanyGroups,
  );

  const asyncGroup = useAsync<LoadCompanyGroups>({
    onSuccess: (data = []) => {
      const options: OptionType[] = data.map((group) => ({
        value: group.id,
        label: group.name,
      }));
      setGroupOptions(options);
    },
  });

  const loadCompanyGroups = () => asyncGroup.start(loadCompanyGroupsAction, asyncGroup);
  useEffect(() => {
    loadCompanyGroups();
  }, []);

  const async = useAsync();
  const onSubmit = (employeeId: string, values: OptionType[] | null) => {
    async.start(
        editEmployeeGroups,
        employeeId,
        toEmployeeGroupsEditRequestBody(values),
      async,
    );
  };

  const handleGroups = (groups: OptionType[]) => {
    return groups.map((group) => group.label).join(", ");
  };

  const onChange = (state: any) => groups = state;

  const addGroupsRenderer = () => (
    <Button
      variant="text"
      color="primary"
      onClick={openEditGroups}
      style={{ width: "auto", margin: "19px 0 0 0", padding: "0"}}
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
        value={handleGroups(employeeGroups)}
      />
      {canManageUsers && addGroupsRenderer()}
    </Box>
  );

  const editGroupsRenderer = () => (
    <Box>
      <Typography variant="h6" style={{ marginBottom: "16px" }}>
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
        style={{ width: "auto", marginLeft: "0", color: "white", backgroundColor: "#6E09EA"}}
        variant="contained"
        color="primary"
        onClick={() => {onSubmit("729e5452-e683-4c5e-866f-acc89e8ed733", groups); closeEditGroups(); }}
      >
        <Text translation="common.done" />
      </Button>
      <Button
        variant="outlined"
        style={{width: "auto", color: "#6E09EA", borderColor: "#6E09EA"}}
        onClick={closeEditGroups}
      >
        <Text translation="common.cancel" />
      </Button>
    </Box>
  );
  return (
    <Box minWidth="500px">
      {!showEditGroups && groupsRenderer()}
      {showEditGroups && editGroupsRenderer()}
    </Box>
  );
};

export default connect<{}, DispatchProps, OwnProps, {}>(null, {
  editEmployeeGroups: userManagementActions.editEmployeeGroups,
})(UserGroups);
