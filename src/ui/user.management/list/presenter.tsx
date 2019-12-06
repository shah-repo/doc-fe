import { Button, Grid } from "@material-ui/core";
import React from "react";
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
import { userManagementDetailsPath } from "../utils/paths";
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
  const cellHrefRenderer = (rowData: GetEmployeeResponse): string => {
    return userManagementDetailsPath(rowData.user.id);
  };
  const customDataSet = (data: GetEmployeeResponse[]) => {
    return data.map((employee) => {
      const groups = employee
        .groups
        .map((group) => group.name)
        .join(", ");

      return {
        ...employee,
        groups,
      } as unknown as GetEmployeeResponse;
      // hack to avoid doing having to create a new interface
      // groups should be array
    });
  };

  const columns: Array<TableColumnProps<GetEmployeeResponse>> = [
    {
      key: "name" as keyof GetEmployeeResponse,
      label: "common.name",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.user.name,
      },
      cellHref: cellHrefRenderer,
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
      cellHref: cellHrefRenderer,
      searchOptions: {
        defaultValue: tableState.queryDict.email,
      },
    },
    {
      key: "groupId" as keyof GetEmployeeResponse,
      label: "common.groups",
      cellHref: cellHrefRenderer,
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.groups,
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
      cellHref: cellHrefRenderer,
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
      <Grid item={true} xs={6} style={{ textAlign: "right" }}>
        <AddEmployeeContainer />
      </Grid>
      <Grid item={true} className={classes.item}>
        <TablePanel<GetEmployeeResponse>
          columns={columns}
          queryUrl={EMPLOYEES_URL}
          cellMeasure={true}
          tableName={tableName}
          customDataSet={customDataSet}
        />
      </Grid>
    </Grid>
  );
};

export default UserManagementListPresenter;
