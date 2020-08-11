import { Grid } from "@material-ui/core";
import React from "react";
import { Employee } from "../../../state/ducks/company";
import { LoadCompanyGroup } from "../../../state/ducks/userManagement";
import { GROUPS_URL } from "../../../state/ducks/userManagement/constants";
import ClearFilters from "../../components/table/ClearFilters";
import { TableColumnProps } from "../../components/table/column/types";
import DocumentInfo from "../../components/table/DocumentInfo";
import { TablePanel } from "../../components/table/panel";
import { TableDataProps, TablePanelStateProps } from "../../components/table/types";
import AddGroupContainer from "../add.group/AddGroup.container";
import AddGroup from "../add.group/Group";
import { GroupsDisplay } from "../display.groups/GroupsDisplay";
import { styles } from "./styles";

export interface Props {
  tableName: string;
  tableData: TableDataProps<any>;
  clearFilter?: () => void;
  tableCriteria: TablePanelStateProps;
  handlePermission: (rowData: LoadCompanyGroup) => void;
  previewGroupsDialog: any;
  editGroupsDialog: any;
  selectedGroup: LoadCompanyGroup;
  canCreateGroups: boolean;
}

export const GroupManagementListPresenter: React.FunctionComponent<Props> = ({
  tableName,
  tableData,
  clearFilter,
  tableCriteria,
  handlePermission,
  previewGroupsDialog,
  editGroupsDialog,
  selectedGroup,
  canCreateGroups,
}) => {
  const classes = styles();
  const handleMembers = (members: Employee[]) => members.map((member) => member.user && member.user.name).join(", ");

  const columns: TableColumnProps<LoadCompanyGroup>[] = [
    {
      key: "groupName" as keyof LoadCompanyGroup,
      id: "GroupManagementListPresenter-name",
      label: "common.name",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.name,
      },
      searchOptions: {
        defaultValue: tableCriteria.queryDict?.groupName,
      },
    },
    {
      key: "userName" as keyof LoadCompanyGroup,
      id: "GroupManagementListPresenter-employees",
      label: "common.members",
      columnOptions: {
        cellDataGetter: ({ rowData }) => handleMembers(rowData.employees),
      },
      searchOptions: {
        defaultValue: tableCriteria.queryDict?.userName,
      },
    },
    {
      key: "isOfficial",
      id: "GroupManagementListPresenter-groupType",
      label: "group.management.group.type",
      searchOptions: {
        searchType: "select",
        selectOptions: [
          { text: "Official", value: "true" },
          { text: "Unofficial", value: "false" },
        ],
        defaultValue: tableCriteria.queryDict?.isOfficial,
      },
      columnOptions: {
        cellDataGetter: ({ rowData }) =>
          rowData.isOfficial ? "Official" : "Unofficial",
      },
    },
  ];

  return (
    <Grid container={true} className={classes.root}>
      <Grid item={true} xs={6}>
        <ClearFilters {...{ clearFilter }}/>
        <DocumentInfo numberOfRecords={tableData.length} />
      </Grid>
      <Grid item={true} xs={6} style={{ textAlign: "right", marginBottom: "16px" }}>
        {canCreateGroups && <AddGroupContainer />}
      </Grid>
      <Grid item={true} className={classes.item}>
        <TablePanel<LoadCompanyGroup>
          columns={columns}
          queryUrl={GROUPS_URL}
          cellMeasure={true}
          tableName={tableName}
          onSelect={({ rowData }) => () => handlePermission(rowData)}
        />
      </Grid>
      <GroupsDisplay
        closeDialog={previewGroupsDialog.close}
        isOpen={previewGroupsDialog.isOpen}
        selectedGroup={selectedGroup}
      />
      <AddGroup
        isOpen={editGroupsDialog.isOpen}
        closeDialog={editGroupsDialog.close}
        selectedGroup={selectedGroup}
        title={"group.management.edit.group"}
      />
    </Grid>
  );
};

export default GroupManagementListPresenter;
