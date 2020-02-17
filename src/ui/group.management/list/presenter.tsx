import { Button, Grid } from "@material-ui/core";
import React, { useState } from "react";
import { Employee } from "../../../state/ducks/company";
import { LoadCompanyGroup } from "../../../state/ducks/userManagement";
import { GROUPS_URL } from "../../../state/ducks/userManagement/constants";
import { TableColumnProps } from "../../components/table/column/types";
import DocumentInfo from "../../components/table/DocumentInfo";
import { TablePanel } from "../../components/table/panel";
import { TableDataProps, TablePanelStateProps } from "../../components/table/types";
import Text from "../../components/Text";
import AddGroup from "../add.group/AddGroup";
import AddGroupContainer from "../add.group/container";
import { GroupsDisplay } from "../groups/GroupsDisplay";
import { DEFAULT_SELECTED_GROUP } from "../utils/types";
import { styles } from "./styles";

export interface Props {
    tableName: string;
    tableData: TableDataProps<any>;
    clearFilter?: () => void;
    tableCriteria: TablePanelStateProps;
  }

export const GroupManagementListPresenter: React.FunctionComponent<Props> = ({
    tableName,
    tableData,
    clearFilter,
    tableCriteria,
}) => {
  const classes = styles();
  // should move usetState to container
  const [selectedGroup, setGroup] = useState<LoadCompanyGroup>(DEFAULT_SELECTED_GROUP);
  const [showGroupsPreview, setGroupsPreview] = useState(false);

  const openGroupsPreview = () => setGroupsPreview(true);
  const closeGroupsPreview = () => setGroupsPreview(false);

  const handleGroupsPreview = (rowData: LoadCompanyGroup) => {
    setGroup(rowData);
    openGroupsPreview();
  };

  const handleGroupsEdit = (rowData: LoadCompanyGroup) => {
    setGroup(rowData);
    openGroupsEdit();
  };

  const handleMembers = (members: Employee[]) => {
    return members.map((member) => member.user!.name).join(", ");
  };

  const [showGroupsEdit, setGroupsEdit] = useState(false);
  const openGroupsEdit = () => setGroupsEdit(true);
  const closeGroupsEdit = () => setGroupsEdit(false);

// column for official/unofficial group needs to be added after BE is done
  const columns: Array<TableColumnProps<LoadCompanyGroup>> = [
    {
      key: "groupName" as keyof LoadCompanyGroup,
      id: "GroupManagementListPresenter-name",
      label: "common.name",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.name,
      },
      searchOptions: {
        defaultValue: tableCriteria.queryDict.groupName,
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
        defaultValue: tableCriteria.queryDict.userName,
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
        defaultValue: tableCriteria.queryDict.isOfficial,
      },
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.isOfficial ? "Official" : "Unofficial",
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
        <Grid
          item={true}
          xs={6}
          style={{ textAlign: "right" }}
        >
        <AddGroupContainer />
        </Grid>
        <Grid item={true} className={classes.item}>
        <TablePanel<LoadCompanyGroup>
            columns={columns}
            queryUrl={GROUPS_URL}
            cellMeasure={true}
            tableName={tableName}
            // here should go condition related to the permissions
            // for now it only opens edit groups
            onSelect={({ rowData }) => () => true ? handleGroupsEdit(rowData) : handleGroupsPreview(rowData)}
        />
        </Grid>
        <GroupsDisplay
          closeDialog={closeGroupsPreview}
          isOpen={showGroupsPreview}
          selectedGroup={selectedGroup}
        />
        <AddGroup
          isOpen={showGroupsEdit}
          closeDialog={closeGroupsEdit}
          selectedGroup={selectedGroup}
          title={<Text translation={"group.management.edit.group"} />}
        />
    </Grid>
  );
};

export default GroupManagementListPresenter;
