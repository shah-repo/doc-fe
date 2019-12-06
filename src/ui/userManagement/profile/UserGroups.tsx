import { Box, Button, Icon, Typography } from "@material-ui/core";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import React, { useState } from "react";
import Select from "react-select";
import SummaryField from "../../common/summary/base";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import Text from "../../components/Text";

interface OwnProps {
    canEditGroups: boolean;
}

type Props = OwnProps;

export const UserGroups: React.FunctionComponent<Props> = ({
    canEditGroups,
}) => {
  // groups mock
  const availableGroups: OptionType[] = [
    {
      label: "5K Club",
      value: "5kclub",
    },
    {
      label: "HR",
      value: "hr",
    },
    {
      label: "Rockstars",
      value: "rockstars",
    },
    {
        label: "2K Approvers",
        value: "2kapprovers",
    },
    {
       label: "General",
       value: "general",
    },
  ];

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
        value={"5K Club, HR, Rockstars, 2K Approvers, General"}
      />
    {canEditGroups && addGroupsRenderer()}
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
        options={availableGroups}
        placeholder="Start typing to see the list of groups…"
        onChange={onChange}
        defaultValue={availableGroups}
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
