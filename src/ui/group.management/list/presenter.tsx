import { Button, Grid } from "@material-ui/core";
import classNames from "classnames";
import React, { useState } from "react";
import { ReactComponent as TriangleDown } from "../../../assets/images/triangle-down.svg";
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

  /** Marks which row is expanded (in case there are more than 15 group members). */
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);

  /** Handles group members display for each row.
   * @param members List of all the group members.
   * @param groupId Id of the group, used for member list expansion.
   */
  const handleMembers = (members: Employee[], groupId: string) => {
    const NUMBER_OF_MEMBERS_TO_DISPLAY = 15;
    const membersToDisplay = groupId === expandedGroupId ? members : members.slice(0, NUMBER_OF_MEMBERS_TO_DISPLAY);
    const remainder = groupId === expandedGroupId ? 0 : members.length - NUMBER_OF_MEMBERS_TO_DISPLAY;
    return (
      <>
        {membersToDisplay.map((member) => member.user && member.user.name).join(", ")}
        {
          members.length > NUMBER_OF_MEMBERS_TO_DISPLAY && (
            <>
              {groupId !== expandedGroupId && "..."}
              <Button
                color="primary"
                variant="contained"
                className={classes.remainderButton}
                onClick={(e) => handleExpandMembers(e, groupId)}
              >
                {remainder}
                <TriangleDown className={classNames({
                  [classes.triangleDown]: true,
                  expanded: groupId === expandedGroupId,
                })}/>
              </Button>
            </>
          )
        }
      </>
    );
  };

  /** Handles click on Expand button (to show more than 15 group members).
   * @param groupId Id of the group to be expanded.
   */
  const handleExpandMembers = (e: React.MouseEvent<HTMLButtonElement>, groupId: string) => {
    e.stopPropagation();
    setExpandedGroupId(groupId === expandedGroupId ? null : groupId);
  };

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
        cellDataGetter: ({ rowData }) => handleMembers(rowData.employees, rowData.id),
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
