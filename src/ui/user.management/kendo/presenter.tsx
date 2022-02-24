import { Grid } from "@material-ui/core";
import React, { useState } from "react";
import { EMPLOYEES_URL } from "../../../state/ducks/userManagement/constants";
import { GetEmployeeResponse } from "../../../state/ducks/userManagement/types";
import { TableDataProps, TablePanelStateProps } from "../../components/table/types";
import UserProfileAdminContainer from "../profile/UserProfileAdmin.container";
import { DEFAULT_SELECTED_EMPLOYEE } from "../utils/types";
import gridConfiguration from "./column.definition";
import { KendoPanel } from "./KendoPanel";
import KendoGridStyles from "./styles";

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
  const classes = KendoGridStyles();
  const [showUserProfile, setUserProfile] = useState(false);
  const [selectedEmployee, setEmployee] = useState<GetEmployeeResponse>(DEFAULT_SELECTED_EMPLOYEE);

  const openUserProfile = () => setUserProfile(true);
  const closeUserProfile = () => setUserProfile(false);

  const handleUserProfileDialog = (rowData: GetEmployeeResponse) => {
    setEmployee(rowData);
    openUserProfile();
  };

  return (
    <Grid container className={classes.cRoot}>
      <Grid xs item={true}>
        <KendoPanel<GetEmployeeResponse>
          gridConfiguration={gridConfiguration}
          queryUrl={EMPLOYEES_URL}
          gridData={data}
          tableName={tableName}
          onSelect={({ dataItem }) => () => handleUserProfileDialog(dataItem as GetEmployeeResponse)}
          tableCriteria={tableCriteria}
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

export default UserManagementKendoPresenter;
