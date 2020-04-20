import { Box, createStyles, makeStyles, TextField, Typography } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";
import Select from "react-select";
import Text from "../../../components/Text";
import { toMembersOptions } from "../../../group.management/utils/transform";
import { toOptions } from "./utils/transform";

interface Props {
  name: string;
  groups: any;
  employees: any;
  groupOptions: any;
  employeeOptions: any;
  isWithoutBorder: boolean;
}

export const styles = makeStyles(() =>
  createStyles({
    boxWithBorder: {
      borderBottom: `1.5px solid ${"#B4C0CA"}`,
    },
    boxWithoutBorder: {
      border: "none",
    },
  },
  ));

const ApprovalRolesPresenter: React.FunctionComponent<Props> = ({
  name,
  groups,
  employees,
  employeeOptions,
  groupOptions,
  isWithoutBorder,
}) => {
  const intl = useIntl();
  const classes = styles();

  const approvalRoleRenderer = () => (
    <Box paddingBottom="16px">
      <Typography variant="h4">
        <Text translation="form.builder.approval.role" />
      </Typography>
      <TextField
        variant="outlined"
        id="ApprovalRoles-groupName"
        value={name}
        style={{ width: "100%", marginTop: "16px" }}
      />
    </Box>
  );

  const approvingUsersRenderer = () => (
    <Box paddingBottom="16px">
      <Typography variant="h4" style={{ marginBottom: "16px" }}>
        <Text translation="form.builder.approving.users" />
      </Typography>
      <Select
        id="ApprovalRoles-members"
        isMulti={true}
        options={toMembersOptions(employeeOptions)}
        value={toMembersOptions(employees)}
        placeholder={intl.formatMessage({
          id: "form.builder.approving.roles.placeholder",
        })}
      />
    </Box>
  );

  const approvingGroupsRenderer = () => (
    <Box>
      <Typography variant="h4" style={{ marginBottom: "16px" }}>
        <Text translation= "form.builder.approving.groups" />
      </Typography>
      <Select
        id="ApprovalRoles-members"
        isMulti={true}
        options={groupOptions}
        value={toOptions(groups)}
        placeholder={intl.formatMessage({
          id: "form.builder.approving.roles.placeholder",
        })}
      />
    </Box>
  );

  return (
    <Box className={isWithoutBorder ? classes.boxWithoutBorder : classes.boxWithBorder} paddingBottom="32px" marginBottom="16px">
      {approvalRoleRenderer()}
      {approvingUsersRenderer()}
      {approvingGroupsRenderer()}
    </Box>
  ); };

export default ApprovalRolesPresenter;
