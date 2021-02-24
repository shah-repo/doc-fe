import { Grid } from "@material-ui/core";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { Group } from "../../../state/ducks/auth/types";
import { EMPLOYEES_URL } from "../../../state/ducks/userManagement/constants";
import { GetEmployeeResponse } from "../../../state/ducks/userManagement/types";
import { SelectOption } from "../../components/forms/fields/Select";
import ClearFilters from "../../components/table/ClearFilters";
import { TableColumnProps } from "../../components/table/column/types";
import { DocumentInfo } from "../../components/table/DocumentInfo";
import { TablePanel } from "../../components/table/panel";
import { TableDataProps, TablePanelStateProps } from "../../components/table/types";
import AddEmployeeContainer from "../add.employee/container";
import AddSlackButtonContainer from "../AddSlackButton/AddSlackButton.container";
import UserProfileAdminContainer from "../profile/UserProfileAdmin.container";
import { DEFAULT_SELECTED_EMPLOYEE } from "../utils/types";
import { styles } from "./styles";

interface Props {
  tableName: string;
  tableCriteria: TablePanelStateProps;
  tableData: TableDataProps<any>;
  clearFilter?: () => void;
  groupOptions: SelectOption[];
  handleResendSignupEmail: (email: string) => void;
}

const UserManagementListPresenter: React.FunctionComponent<Props> = ({
  tableName,
  tableCriteria,
  tableData,
  clearFilter,
  groupOptions,
  handleResendSignupEmail,
}) => {
  const intl = useIntl();
  const classes = styles();
  const [showUserProfile, setUserProfile] = useState(false);
  const [selectedEmployee, setEmployee] = useState<GetEmployeeResponse>(DEFAULT_SELECTED_EMPLOYEE);

  const openUserProfile = () => setUserProfile(true);
  const closeUserProfile = () => setUserProfile(false);

  const handleUserProfileDialog = (rowData: GetEmployeeResponse) => {
    setEmployee(rowData);
    openUserProfile();
  };

  const handleGroups = (groups: Group[]) => groups.map((group) => group.name).join(", ");
  const handleSignupEmail = (confirmed: boolean) => confirmed ?
    intl.formatMessage({
      id: "user.management.signed.up",
    }) :
    intl.formatMessage({
      id: "user.management.resend.signup.email",
    });

  const columns: TableColumnProps<GetEmployeeResponse>[] = [
    {
      key: "name" as keyof GetEmployeeResponse,
      id: "UserManagementListPresenter-name",
      label: "common.name",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.user.name,
      },
      searchOptions: {
        defaultValue: tableCriteria.queryDict.name,
      },
    },
    {
      key: "email" as keyof GetEmployeeResponse,
      id: "UserManagementListPresenter-email",
      label: "common.email",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.user.email,
      },
      searchOptions: {
        defaultValue: tableCriteria.queryDict.email,
      },
    },
    {
      key: "groupId" as keyof GetEmployeeResponse,
      id: "UserManagementListPresenter-groupId",
      label: "common.groups",
      columnOptions: {
        cellDataGetter: ({ rowData }) => handleGroups(rowData.groups),
      },
      searchOptions: {
        searchType: "select",
        selectOptions: groupOptions,
        defaultValue: tableCriteria.queryDict.groupId,
      },
    },
    {
      key: "active",
      id: "UserManagementListPresenter-active",
      label: "common.active",
      searchOptions: {
        searchType: "select",
        selectOptions: [
          { text: "Inactive", value: "false" },
          { text: "Active", value: "true" },
        ],
        defaultValue: tableCriteria.queryDict.active,
      },
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.active ? "Active" : "Inactive",
        width: 50,
      },
    },
    {
      key: "confirmed" as keyof GetEmployeeResponse,
      label: "user.management.signed.up",
      omitSearch: true,
      onSelect: ({ rowData }) => () => handleResendSignupEmail(rowData.user.email),
      cellType: (rowData) => rowData.user.confirmed ? "BASE" : "LINK",
      columnOptions: {
        cellDataGetter: ({ rowData }) => handleSignupEmail(rowData.user.confirmed),
        width: 50,
      },
    },
  ];

  return (
    <Grid container={true} className={classes.root}>
      <Grid item={true} xs={6}>
        <ClearFilters {...{ clearFilter }}/>
        <DocumentInfo numberOfRecords={tableData.length} />
      </Grid>
      <Grid
        item={true}
        xs={6}
        style={{ textAlign: "right", marginBottom: "16px" }}
      >
        <AddSlackButtonContainer />
        <AddEmployeeContainer />
      </Grid>
      <Grid item={true} className={classes.item}>
        <TablePanel<GetEmployeeResponse>
          columns={columns}
          queryUrl={EMPLOYEES_URL}
          cellMeasure={true}
          tableName={tableName}
          onSelect={({ rowData }) => () => handleUserProfileDialog(rowData)}
        />
      </Grid>
      <UserProfileAdminContainer
        closeUserProfile={closeUserProfile}
        showUserProfile={showUserProfile}
        selectedEmployee={selectedEmployee}
      />
    </Grid>
  );
};

export default UserManagementListPresenter;
