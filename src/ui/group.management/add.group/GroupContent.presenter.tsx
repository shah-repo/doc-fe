import { Grid } from "@material-ui/core";
import React from "react";
import { Permission } from "../../../state/ducks/auth/types";
import { GroupRequestBody } from "../../../state/ducks/groupManagement";
import { GetEmployeeResponse } from "../../../state/ducks/userManagement";
import { AsyncActionPayload } from "../../../state/types";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import ActionButtons from "./content.components/ActionButtons";
import JoinedGroups from "./content.components/JoinedGroups";
import ParentGroups from "./content.components/ParentGroups";
import Permissions from "./content.components/Permissions";
import SharedContent from "./content.components/SharedContent";

interface Props {
  employees: GetEmployeeResponse[];
  members: OptionType[];
  setMembers: (state: any) => void;
  isCreateMode?: boolean;
  group: GroupRequestBody;
  setGroup: (values: GroupRequestBody) => void;
  handleAsyncState: () => AsyncActionPayload;
  hasOfficialPermission: boolean;
  currentEmployeePermissions: Permission[];
  canCreateOfficialGroup: boolean;
  parentGroups: any[];
  setParentGroups: (selectedItems: any) => void;
  handleReset: () => void;
  handleSubmit: () => void;
}

export const GroupContentPresenter: React.FunctionComponent<Props> = ({
  employees,
  members,
  setMembers,
  isCreateMode,
  group,
  setGroup,
  handleAsyncState,
  hasOfficialPermission,
  currentEmployeePermissions,
  canCreateOfficialGroup,
  parentGroups,
  setParentGroups,
  handleReset,
  handleSubmit,
}) => (
  <Grid
    container={true}
    alignItems="center"
    direction="column"
    style={{ marginTop: 90 }}
  >
    <Grid>
      <SharedContent
        employees={employees}
        members={members}
        setMembers={setMembers}
        isCreateMode={isCreateMode}
        group={group}
        setGroup={setGroup}
        handleAsyncState={handleAsyncState}
        hasOfficialPermission={hasOfficialPermission}
      />
      {canCreateOfficialGroup &&
        <Permissions
          group={group}
          setGroup={setGroup}
          currentEmployeePermissions={currentEmployeePermissions}
        />}
      {canCreateOfficialGroup &&
        <ParentGroups
          parentGroups={parentGroups}
          setParentGroups={setParentGroups}
          currentGroupId={group.id}
        />}
      <JoinedGroups
        parentGroups={parentGroups}
      />
      <ActionButtons
        handleReset={handleReset}
        handleSubmit={handleSubmit}
        group={group}
        isCreateMode={isCreateMode}
      />
    </Grid>
  </Grid>
);

export default GroupContentPresenter;
