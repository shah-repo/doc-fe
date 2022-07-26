import { Grid } from "@material-ui/core";
import React, { useState } from "react";
import { EMPLOYEES_URL } from "../../../state/ducks/userManagement/constants";
import { GetEmployeeResponse } from "../../../state/ducks/userManagement/types";
import { TableDataProps, TablePanelStateProps } from "../../components/table/types";
import UserProfileAdminContainer from "../profile/UserProfileAdmin.container";
import { DEFAULT_SELECTED_EMPLOYEE } from "../utils/types";
import gridConfiguration from "./column.definition";
import { KendoPanel } from "./KendoPanel";

interface Props {
  tableName: string;
  tableCriteria: TablePanelStateProps;
  data: TableDataProps<GetEmployeeResponse>;
}

const UserManagementKendoPresenter: React.FunctionComponent<Props> = ({
  tableName,
  data,
  tableCriteria,
}) => {
  const [showUserProfile, setUserProfile] = useState(false);
  const [selectedEmployee, setEmployee] = useState<GetEmployeeResponse>(DEFAULT_SELECTED_EMPLOYEE);

  const openUserProfile = () => setUserProfile(true);
  const closeUserProfile = () => setUserProfile(false);

  const handleUserProfileDialog = (rowData: GetEmployeeResponse) => {
    setEmployee(rowData);
    openUserProfile();
  };

  return (
    <Grid container>
      <KendoPanel<GetEmployeeResponse>
        gridConfiguration={gridConfiguration}
        queryUrl={EMPLOYEES_URL}
        rerender={!showUserProfile}
        gridData={data}
        tableName={tableName}
        onSelect={({ dataItem }) => () => handleUserProfileDialog(dataItem as GetEmployeeResponse)}
        tableCriteria={tableCriteria}
      />
      <UserProfileAdminContainer
        closeUserProfile={closeUserProfile}
        showUserProfile={showUserProfile}
        selectedEmployee={selectedEmployee}
      />
    </Grid>
  );
};

export default UserManagementKendoPresenter;
