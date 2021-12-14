import { Grid } from "@material-ui/core";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { getHasPermission } from "../../../common/utils/selectors";
import { Permission } from "../../../state/ducks/auth/types";
import { companyActions, companySelectors } from "../../../state/ducks/company";
import { EMPLOYEES_URL } from "../../../state/ducks/userManagement/constants";
import { GetEmployeeResponse } from "../../../state/ducks/userManagement/types";
import { toastError } from "../../components/notifications";
import { TableDataProps, TablePanelStateProps } from "../../components/table/types";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { DropboxResponse } from "../profile/dialog/DialogContent";
import UserProfileAdminContainer from "../profile/UserProfileAdmin.container";
import { DEFAULT_SELECTED_EMPLOYEE } from "../utils/types";
import gridConfiguration from "./kendogrid.column.definition";
import KendoGridStyles from "./kendogrid.styles";
import { KendoPanel } from "./KendoPanel";

interface Props {
  tableName: string;
  tableCriteria: TablePanelStateProps;
  tableData: TableDataProps<any>;
  clearFilter?: () => void;
}

const UserManagementKendoPresenter: React.FunctionComponent<Props> = ({
  tableName,
  tableData,
}) => {
  const classes = KendoGridStyles();
  const intl = useIntl();
  const [showUserProfile, setUserProfile] = useState(false);
  const [selectedEmployee, setEmployee] = useState<GetEmployeeResponse>(DEFAULT_SELECTED_EMPLOYEE);

  const hasDropboxPermission = useSelector(getHasPermission(Permission.COMPANY_DROPBOX_INTEGRATION));
  const dropboxAsync = useAsync<DropboxResponse>({
    onSuccess: (data?: DropboxResponse) => {
      window.open(data?.data.url);
    },
    onError: (error) => {
      toastError(intl.formatMessage({ id: "dropbox.connection.error" }));
    },
  });
  const enableDropboxAction = useActionCreator(companyActions.enableDropbox);
  const isCompanyDropboxEnabled = useSelector(companySelectors.isDropboxEnabled);

  const openUserProfile = () => setUserProfile(true);
  const closeUserProfile = () => setUserProfile(false);

  const handleUserProfileDialog = (rowData: GetEmployeeResponse) => {
    setEmployee(rowData);
    openUserProfile();
  };

  return (
    <Grid container className={classes.cRoot}>
      <Grid item={true}>
        <KendoPanel<GetEmployeeResponse>
          columns={gridConfiguration}
          queryUrl={EMPLOYEES_URL}
          data={tableData}
          cellMeasure={true}
          tableName={tableName}
          hasDropboxPermission={hasDropboxPermission}
          dropboxAsync={dropboxAsync}
          enableDropboxAction={enableDropboxAction}
          isCompanyDropboxEnabled={isCompanyDropboxEnabled}
          onSelect={({ dataItem }) => () => handleUserProfileDialog(dataItem)}
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
