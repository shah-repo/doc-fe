import { Grid } from "@material-ui/core";
import React from "react";
import { GROUPS_URL } from "../../../state/ducks/userManagement/constants";
import { LoadCompanyGroup } from "../../../state/ducks/userManagement/types";
import {
  TableDataProps,
  TablePanelStateProps,
} from "../../components/table/types";
import AddGroup from "../add.group/Group";
import GroupsDisplay from "../display.groups/GroupsDisplay";
import gridConfiguration from "./kendogrid.column.definition";
import { KendoPanel } from "./KendoPanel";

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
  clearFilter,
  tableCriteria,
  handlePermission,
  previewGroupsDialog,
  editGroupsDialog,
  selectedGroup,
  canCreateGroups,
}) => (
  <Grid container={true}>
    <Grid item={true}>
      <KendoPanel<LoadCompanyGroup>
        columns={gridConfiguration}
        queryUrl={GROUPS_URL}
        cellMeasure={true}
        tableName={tableName}
        onSelect={({ dataItem }) =>
          () =>
            handlePermission(dataItem)}
        editGroupsDialog={editGroupsDialog}
        selectedGroup={selectedGroup}
        canCreateGroups={canCreateGroups}
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

export default GroupManagementKendoPresenter;
