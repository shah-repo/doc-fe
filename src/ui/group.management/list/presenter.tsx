import React from "react";
import { TableDataProps } from "../../components/table/types";
import { Grid, Button } from "@material-ui/core";
import { styles } from "./styles";
import Text from "../../components/Text";
import DocumentInfo from "../../components/table/DocumentInfo";
import { TablePanel } from "../../components/table/panel";
import { LoadCompanyGroup } from "../../../state/ducks/userManagement";
import { TableColumnProps } from "../../components/table/column/types";
import { GROUPS_URL } from "../../../state/ducks/userManagement/constants";
import { Employee } from "../../../state/ducks/company";


export interface Props {
    tableName: string;
    tableData: TableDataProps<any>;
    clearFilter?: () => void;
  }

export const GroupManagementListPresenter: React.FunctionComponent<Props> = ({
    tableName,
    tableData,
    clearFilter,
}) => {
  const classes = styles();

  const handleMembers = (members: Employee[]) => {
    return members.map((member) => member.user!.name).join(", ");
  };

  const columns: Array<TableColumnProps<LoadCompanyGroup>> = [
    {
      key: "name" as keyof LoadCompanyGroup,
      id: "GroupManagementListPresenter-name",
      label: "common.name",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.name,
      },
    },
    {
      key: "employees" as keyof LoadCompanyGroup,
      id: "GroupManagementListPresenter-employees",
      label: "common.members",
      columnOptions: {
        cellDataGetter: ({ rowData }) => handleMembers(rowData.employees),
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
            id="GroupManagementListPresenter-clearButton"
        >
            <Text translation="common.clear.filters" />
        </Button>
        <DocumentInfo numberOfRecords={tableData.length} />
        </Grid>
        <Grid item={true} className={classes.item}>
        <TablePanel<LoadCompanyGroup>
            columns={columns}
            queryUrl={GROUPS_URL}
            cellMeasure={true}
            tableName={tableName}
            /* onSelect={({ rowData }) => () => handleUserProfileDialog(rowData)} */
        />
        </Grid>
    </Grid>
  );
};

export default GroupManagementListPresenter;