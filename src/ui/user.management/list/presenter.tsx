import { Button, Grid } from "@material-ui/core";
import React, { useState } from "react";
import { Group } from "../../../state/ducks/auth/types";
import {
  DocumentRevision,
} from "../../../state/ducks/documentRevisions";
import { GetEmployeeResponse } from "../../../state/ducks/userManagement";
import { EMPLOYEES_URL } from "../../../state/ducks/userManagement/constants";
import { SelectOption } from "../../components/forms/fields/Select";
import { TableColumnProps } from "../../components/table/column/types";
import { DocumentInfo } from "../../components/table/DocumentInfo";
import { TablePanel } from "../../components/table/panel";
import { TablePanelStateProps } from "../../components/table/types";
import Text from "../../components/Text";
import AddEmployeeContainer from "../add.employee/container";
import AddSlackButtonContainer from "../AddSlackButton/AddSlackButton.container";
import UserProfileAdminContainer from "../profile/UserProfileAdmin.container";
import { DEFAULT_SELECTED_EMPLOYEE } from "../utils/types";
import { styles } from "./styles";

export interface Props {
  tableName: string;
  tableState: TablePanelStateProps<DocumentRevision>;
  clearFilter?: () => void;
  groupOptions: SelectOption[];
}

export const UserManagementListPresenter: React.FunctionComponent<Props> = ({
  tableName,
  tableState,
  clearFilter,
  groupOptions,
}) => {
  const classes = styles();
  const [showUserProfile, setUserProfile] = useState(false);
  const [selectedEmployee, setEmployee] = useState<GetEmployeeResponse>(DEFAULT_SELECTED_EMPLOYEE);

  const openUserProfile = () => setUserProfile(true);
  const closeUserProfile = () => setUserProfile(false);

  const handleUserProfileDialog = ( rowData: GetEmployeeResponse ) => {
    setEmployee(rowData);
    openUserProfile();
  };

  const handleGroups = (groups: Group[]) => {
    return groups.map((group) => group.name).join(", ");
  };

  const columns: Array<TableColumnProps<GetEmployeeResponse>> = [
    {
      key: "name" as keyof GetEmployeeResponse,
      label: "common.name",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.user.name,
      },
      searchOptions: {
        defaultValue: tableState.queryDict.name,
      },
    },
    {
      key: "email" as keyof GetEmployeeResponse,
      label: "common.email",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.user.email,
      },
      searchOptions: {
        defaultValue: tableState.queryDict.email,
      },
    },
    {
      key: "groupId" as keyof GetEmployeeResponse,
      label: "common.groups",
      columnOptions: {
        cellDataGetter: ({ rowData }) => handleGroups(rowData.groups),
      },
      searchOptions: {
        searchType: "select",
        selectOptions: groupOptions,
        defaultValue: tableState.queryDict.groupId,
      },
    },
    {
      key: "active",
      label: "common.active",
      searchOptions: {
        searchType: "select",
        selectOptions: [
          { text: "Inactive", value: "false" },
          { text: "Active", value: "true" },
        ],
        defaultValue: tableState.queryDict.active,
      },
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.active ? "Active" : "Inactive",
        width: 50,
      },
    },
  ];

  return (
    <Grid container={true} className={classes.root}>
      <Grid item={true} xs={6}>
        <Button
          color="primary"
          variant="outlined"
          className={classes.clearButton}
          onClick={clearFilter}
        >
          <Text translation="common.clear.filters" />
        </Button>
        <DocumentInfo numberOfRecords={tableState.queryData.length} />
      </Grid>
      <Grid
        container={true}
        xs={6}
        style={{ textAlign: "right" }}
        alignItems="flex-start"
        justify="flex-end"
        direction="row"
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
