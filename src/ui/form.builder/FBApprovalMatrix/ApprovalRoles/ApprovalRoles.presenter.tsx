import { Box, createStyles, makeStyles, TextField, Typography } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";
import Select from "react-select";
import { MultiValueRemove, selectStyles as selectStyle } from "../../../components/forms/fields/Autocomplete/Autocomplete";
import Text from "../../../components/Text";
import { toMembersOptions } from "../../../group.management/utils/transform";
import { ApprovalRolesPresenterProps } from "../FBApprovalMatrix.types";

const styles = makeStyles(() =>
  createStyles({
    boxWithBorder: {
      borderBottom: `1px solid ${"#B4C0CA"}`,
    },
    boxWithoutBorder: {
      border: "none",
    },
  },
  ));

const ApprovalRolesPresenter: React.FunctionComponent<ApprovalRolesPresenterProps> = ({
  name,
  groups,
  employees,
  employeeOptions,
  groupOptions,
  isWithoutBorder,
  handleEditRoleDetails,
  index,
  isDisabled,
  disabledSelectField,
}) => {
  const intl = useIntl();
  const classes = styles();

  const approvalRoleRenderer = () => (
    <Box paddingBottom="16px">
      <Typography variant="h6">
        <Text translation="form.builder.approval.role" />
      </Typography>
      <TextField
        variant="outlined"
        id="ApprovalRoles-groupName"
        value={name}
        disabled={isDisabled}
        onChange={(e) => handleEditRoleDetails(e, index, "name")}
        style={{ width: "100%", marginTop: "16px" }}
      />
    </Box>
  );

  const employeesSelection = employees ? employees.map((employee) => employee.id) : [];
  const selectStyles = {
    menu: (styles) => ({ ...styles, zIndex: 999 }),
    ...selectStyle,
  };
  const approvingUsersRenderer = () => (
    <Box paddingBottom="16px">
      <Typography variant="h6" style={{ marginBottom: "16px" }}>
        <Text translation="form.builder.approving.users" />
      </Typography>
      <Select
        isDisabled={disabledSelectField}
        styles={selectStyles}
        id="ApprovalRoles-members"
        isMulti={true}
        options={toMembersOptions(employeeOptions)}
        value={toMembersOptions(employeeOptions).filter((option) => {
          if (employeesSelection.includes(option.value)) {
            return option;
          }
          return null;
        })}
        onChange={(e) => handleEditRoleDetails(e, index, "employees")}
        placeholder={intl.formatMessage({
          id: "form.builder.approving.roles.placeholder",
        })}
        components={{ MultiValueRemove }}
      />
    </Box>
  );
  const groupsSelection = groups ? groups.map((group) => group.id) : [];
  const approvingGroupsRenderer = () => (
    <Box>
      <Typography variant="h6" style={{ marginBottom: "16px" }}>
        <Text translation= "form.builder.approving.groups" />
      </Typography>
      <Select
        isDisabled={disabledSelectField}
        styles={selectStyles}
        id="ApprovalRoles-members"
        isMulti={true}
        options={groupOptions}
        value={groupOptions.filter((option) => {
          if (groupsSelection.includes(option.value)) {
            return option;
          }
          return null;
        })}
        onChange={(e) => handleEditRoleDetails(e, index, "groups")}
        placeholder={intl.formatMessage({
          id: "form.builder.approving.roles.placeholder",
        })}
        components={{ MultiValueRemove }}
      />
    </Box>
  );

  return (
    <Box
      className={isWithoutBorder ? classes.boxWithoutBorder : classes.boxWithBorder}
      pb={4}
      mb={2}
    >
      {approvalRoleRenderer()}
      {approvingUsersRenderer()}
      {approvingGroupsRenderer()}
    </Box>
  ); };

export default ApprovalRolesPresenter;
