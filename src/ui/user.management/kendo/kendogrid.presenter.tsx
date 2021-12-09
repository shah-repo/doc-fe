import { Grid } from "@material-ui/core";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { getHasPermission } from "../../../common/utils/selectors";
import { Permission } from "../../../state/ducks/auth/types";
import { companyActions, companySelectors } from "../../../state/ducks/company";
import { EMPLOYEES_URL } from "../../../state/ducks/userManagement/constants";
import { GetEmployeeResponse } from "../../../state/ducks/userManagement/types";
import { SelectOption } from "../../components/forms/fields/Select";
import { toastError } from "../../components/notifications";
import ClearFilters from "../../components/table/ClearFilters";
import { DocumentInfo } from "../../components/table/DocumentInfo";
import { TableDataProps, TablePanelStateProps } from "../../components/table/types";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import AddEmployeeContainer from "../add.employee/container";
import AddSlackButtonContainer from "../AddSlackButton/AddSlackButton.container";
import EnableDropboxButton from "../EnableDropboxButton/EnableDropboxButton";
import { DropboxResponse } from "../profile/dialog/DialogContent";
import UserProfileAdminContainer from "../profile/UserProfileAdmin.container";
import { DEFAULT_SELECTED_EMPLOYEE } from "../utils/types";
import gridConfiguration from "./kendogrid.column.definition";
import { KendoPanel } from "./KendoPanel";

interface Props {
  tableName: string;
  tableCriteria: TablePanelStateProps;
  tableData: TableDataProps<any>;
  clearFilter?: () => void;
  groupOptions: SelectOption[];
  handleResendEmail: (employee: GetEmployeeResponse) => void;
}

const UserManagementKendoPresenter: React.FunctionComponent<Props> = ({
  tableName,
  tableCriteria,
  tableData,
  clearFilter,
  groupOptions,
  handleResendEmail,
}) => {
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

  // const handleGroups = (groups: Group[]) => groups.map((group) => group.name).join(", ");
  // const handleEmail = (user: User) => {
  //   if (user.locked) {
  //     return intl.formatMessage({
  //       id: "reset.password",
  //     });
  //   }
  //   if (!user.confirmed) {
  //     return intl.formatMessage({
  //       id: "user.management.resend.signup.email",
  //     });
  //   }
  //   return  intl.formatMessage({
  //     id: "user.management.signed.up",
  //   });
  // };
  // const handleEmailCellType = (user: User) => {
  //   if (user.locked || !user.confirmed) {
  //     return "LINK";
  //   }
  //   return "BASE";
  // };

  // const columns: TableColumnProps<GetEmployeeResponse>[] = [
  //   {
  //     key: "name" as keyof GetEmployeeResponse,
  //     id: "UserManagementListPresenter-name",
  //     dataKey: "user.name",
  //     label: "common.name",
  //     columnOptions: {
  //       cellDataGetter: ({ rowData }) => rowData.user.name,
  //     },
  //     searchOptions: {
  //       defaultValue: tableCriteria.queryDict.name,
  //     },
  //   },
  //   {
  //     key: "email" as keyof GetEmployeeResponse,
  //     id: "UserManagementListPresenter-email",
  //     label: "common.email",
  //     dataKey: "user.email",
  //     columnOptions: {
  //       cellDataGetter: ({ rowData }) => rowData.user.email,
  //     },
  //     searchOptions: {
  //       defaultValue: tableCriteria.queryDict.email,
  //     },
  //   },
  //   {
  //     key: "groupId" as keyof GetEmployeeResponse,
  //     id: "UserManagementListPresenter-groupId",
  //     dataKey: "groups",
  //     label: "common.groups",
  //     columnOptions: {
  //       cellDataGetter: ({ rowData }) => handleGroups(rowData.groups),
  //     },
  //     searchOptions: {
  //       searchType: "select",
  //       selectOptions: groupOptions,
  //       defaultValue: tableCriteria.queryDict.groupId,
  //     },
  //   },
  //   {
  //     key: "active",
  //     id: "UserManagementListPresenter-active",
  //     label: "common.active",
  //     searchOptions: {
  //       searchType: "select",
  //       selectOptions: [
  //         { text: "Inactive", value: "false" },
  //         { text: "Active", value: "true" },
  //       ],
  //       defaultValue: tableCriteria.queryDict.active,
  //     },
  //     columnOptions: {
  //       cellDataGetter: ({ rowData }) => rowData.active ? "Active" : "Inactive",
  //       width: 50,
  //     },
  //   },
  //   {
  //     key: "confirmed" as keyof GetEmployeeResponse,
  //     label: "user.management.signed.up",
  //     dataKey: "user.confirmed",
  //     omitSearch: true,
  //     onSelect: ({ rowData }) => () => {  handleResendEmail(rowData); },
  //     cellType: (rowData) => handleEmailCellType(rowData.user),
  //     columnOptions: {
  //       cellDataGetter: ({ rowData }) => handleEmail(rowData.user),
  //       width: 50,
  //     },
  //   },
  // ];

  return (
    <Grid container={true}>
      <Grid item={true} xs={6}>
        <ClearFilters {...{ clearFilter }}/>
        <DocumentInfo numberOfRecords={tableData.length} />
      </Grid>
      <Grid
        item={true}
        xs={6}
        style={{ textAlign: "right", marginBottom: "16px" }}
      >
        <Grid
          container
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {/* Company dropbox button */}
          <EnableDropboxButton
            shouldDisplayButton={hasDropboxPermission}
            {...{ dropboxAsync, enableDropboxAction }}
            disabled={Boolean(isCompanyDropboxEnabled)}
          />
          <AddSlackButtonContainer />
          <AddEmployeeContainer />
        </Grid>
      </Grid>
      <Grid item={true}>
        <KendoPanel<GetEmployeeResponse>
          columns={gridConfiguration}
          queryUrl={EMPLOYEES_URL}
          cellMeasure={true}
          tableName={tableName}
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
