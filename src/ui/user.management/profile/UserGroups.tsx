import { Box, Button, Icon, Typography } from "@material-ui/core";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Select from "react-select";
import {
  EmployeeGroupsEditRequestBody,
  LoadCompanyGroups,
  userManagementActions,
} from "../../../state/ducks/userManagement";
import SummaryField from "../../common/summary/base";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";

interface OwnProps {
  canManageUsers: boolean;
  employeeGroups: OptionType[];
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
  const async = useAsync();
  const onSubmit = (employeeId: string, values: EmployeeGroupsEditRequestBody) => {
    async.start(
        editEmployeeGroups,
        employeeId,
        values,
      async,
    );
  };

  useEffect(() => {
    loadCompanyGroups();
  }, []);

  const handleGroups = (groups: OptionType[]) => {
    return groups.map((group) => group.label).join(", ");
  };

  const [showEditGroups, setEditGroups] = useState(false);

  const openEditGroups = () => setEditGroups(true);
  const closeEditGroups = () => setEditGroups(false);

  const onChange = (state: any) => console.log(state);

  const groups = {
      groups: [
        {
          id: "082a1f68-6e68-4133-ab24-43eb25800e4c",
        },
        {
          id: "c628093a-79c0-4d65-9c28-8fe5be4a9d93",
        },
        {
          id: "a20a6714-502f-4585-94db-3cb1134a2951",
        },
      ],
  };

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
        value={handleGroups(employeeGroups)}
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
        onClick={() => onSubmit("729e5452-e683-4c5e-866f-acc89e8ed733", groups)}
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

export default connect<{}, DispatchProps, OwnProps, {}>(null, {
  editEmployeeGroups: userManagementActions.editEmployeeGroups,
})(UserGroups);
