import { Grid } from "@material-ui/core";
import React, { useState } from "react";
import { GROUPS_URL } from "../../../state/ducks/userManagement/constants";
import { LoadCompanyGroup } from "../../../state/ducks/userManagement/types";
import {
  TableDataProps,
  TablePanelStateProps,
} from "../../components/table/types";
import AddGroup from "../add.group/Group";
import GroupsDisplay from "../display.groups/GroupsDisplay";
import gridConfiguration from "./column.definition";
import { KendoPanel } from "./KendoPanel";
import KendoGridStyles from "./styles";

interface Props {
  tableName: string;
  tableData: TableDataProps<any>;
  clearFilter?: () => void;
  tableCriteria: TablePanelStateProps;
  handlePermission: (dataItem: LoadCompanyGroup) => void;
  previewGroupsDialog: any;
  editGroupsDialog: any;
  selectedGroup: LoadCompanyGroup;
  canCreateGroups: boolean;
}

const GroupManagementKendoPresenter: React.FunctionComponent<Props> = ({
  tableName,
  tableData,
  tableCriteria,
  handlePermission,
  previewGroupsDialog,
  editGroupsDialog,
  selectedGroup,
  canCreateGroups,
}) => {
  const classes = KendoGridStyles();
  const [refreshTable, setRefreshTable] = useState(false);
  const closeDialog = (flag: boolean | undefined) => {
    if (flag) {
      setRefreshTable(true);
    }
    editGroupsDialog.close();
  };
  return (
    <Grid container={true} className={classes.cRoot}>
      <Grid item={true}>
        <KendoPanel<LoadCompanyGroup>
          gridConfiguration={gridConfiguration}
          queryUrl={GROUPS_URL}
          tableName={tableName}
          onSelect={({ dataItem }) => () => handlePermission(dataItem)}
          refreshTable={refreshTable}
          canCreateGroups={canCreateGroups}
          gridData={tableData}
          tableCriteria={tableCriteria}
        />
      </Grid>
      <GroupsDisplay
        closeDialog={previewGroupsDialog.close}
        isOpen={previewGroupsDialog.isOpen}
        selectedGroup={selectedGroup}
      />
      <AddGroup
        isOpen={editGroupsDialog.isOpen}
        closeDialog={closeDialog}
        selectedGroup={selectedGroup}
        title={"group.management.edit.group"}
      />
    </Grid>
  ); };

export default GroupManagementKendoPresenter;
