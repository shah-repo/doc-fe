import { Box, Button, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { ReactComponent as SlackLogo } from "../../../../assets/images/slack_full_logo.svg";
import { getTableCriteria } from "../../../../common/utils/selectors";
import { attachmentsActions } from "../../../../state/ducks/attachments";
import { authSelectors } from "../../../../state/ducks/auth";
import { EmployeeEditRequestBody } from "../../../../state/ducks/auth/types";
import { companySelectors } from "../../../../state/ducks/company";
import { tableSearchActions } from "../../../../state/ducks/tableSearch";
import { userManagementActions } from "../../../../state/ducks/userManagement";
import { GetEmployeeResponse } from "../../../../state/ducks/userManagement/types";
import { AsyncState } from "../../../../state/types";
import { OptionType } from "../../../components/forms/fields/Autocomplete/types";
import SubmitButton from "../../../components/forms/SubmitButton";
import { toastError } from "../../../components/notifications";
import Text from "../../../components/Text";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import EnableDropboxButton from "../../EnableDropboxButton/EnableDropboxButton";
import styles from "../../profile/UserProfile.styles";
import { toEmployeeActiveStatusEditRequestBody } from "../../utils/transform";
import AcctCodes from "../AddressesAndCodes/AcctCodes";
import Addresses from "../AddressesAndCodes/Addresses";
import ApiTokenContent from "../apiTokenContent/ApiTokenContent";
import CompanyStageManagementContainer from "../company.stage.management/CompanyStageManagement.container";
import UserGroups from "../groups/UserGroups";
import HelloSignAccess from "../HelloSignAccess";
import NavigationManagementContainer from "../navigation.management/NavigationManagement.container";
import WhiteLabelingManagementContainer from "../whiteLabeling.management/WhiteLabelingManagement.container";

interface OwnProps {
  canManageUsers: boolean;
  employeeGroups: OptionType[];
  employeeId: string;
  editCurrentEmployee: (values: EmployeeEditRequestBody) => void;
  callbackUpdateGroups?: (values: GetEmployeeResponse) => void;
  callbackUpdateActiveStatus?: (values: GetEmployeeResponse) => void;
  callbackUpdateWithUpload?: (avatar: string, name: string) => void;
  showEditUser: boolean;
  showEdit: () => void;
  closeEdit: () => void;
  userInfo: EmployeeEditRequestBody;
  asyncState: AsyncState;
  getUrl: () => void;
  slackIntegrationEnabled: boolean;
  slackTeamId: string;
  slackUserId: string;
  email: string;
  activeStatus: boolean;
  file: File | null;
  setFile: (value: File | null) => void;
  setUserInfo: (values: EmployeeEditRequestBody) => void;
  userId: string;
  isCurrentUser: boolean;
  isUsernameEmpty: boolean;
  isDeveloper: boolean;
  canUpdateCompany: boolean;
}

type Props = OwnProps;

export interface DropboxResponse {
  code: number;
  status: string;
  data: {
    url: string;
  };
}

const DialogContent: React.FunctionComponent<Props> = ({
  canManageUsers,
  employeeGroups,
  employeeId,
  callbackUpdateGroups,
  callbackUpdateActiveStatus,
  showEdit,
  showEditUser,
  closeEdit,
  userInfo,
  editCurrentEmployee,
  slackIntegrationEnabled,
  slackTeamId,
  getUrl,
  asyncState,
  slackUserId,
  email,
  activeStatus,
  file,
  setFile,
  setUserInfo,
  userId,
  callbackUpdateWithUpload,
  isCurrentUser,
  isUsernameEmpty,
  isDeveloper,
  canUpdateCompany,
}) => {
  const classes = styles();
  const dispatch = useDispatch();
  const history = useHistory();

  const TABLE_NAME = "userManagement";

  const [avatarURL, setAvatarURL] = useState<string>("");
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));
  const companyMine = useSelector(companySelectors.getCompanyMine);
  const { helloSignIntegrationEnabled } = companyMine;

  const isCompanyDropboxEnabled = useSelector(companySelectors.isDropboxEnabled);
  const isEmployeeDropboxEnabled = useSelector(authSelectors.isDropboxEnabled);
  const dropboxAsync = useAsync<DropboxResponse>({
    onSuccess: (data?: DropboxResponse) => {
      window.open(data?.data.url);
    },
    onError: (error) => {
      toastError(error as string);
    },
  });
  const enableDropboxAction = useActionCreator(userManagementActions.enableDropbox);

  // this is a hack for back button to redirect to user management table
  useEffect(() => () => {
    history.goForward();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const asyncS3link = useAsync({
    onSuccess: (data: any) => {
      setAvatarURL(data.url.substr(0, data.url.indexOf("?")));
      if (!isCurrentUser && file) {
        dispatch(
          attachmentsActions.uploadAvatar(
            data.url,
            userId,
            userInfo.name,
            file,
            asyncUploadAvatar,
          ),
        );
      }
      if (isCurrentUser && file) {
        dispatch(
          attachmentsActions.uploadAvatar(
            data.url,
            null,
            userInfo.name,
            file,
            asyncUploadAvatar,
          ),
        );
      }
      setFile(null);
      setUserInfo({ ...userInfo, avatar: avatarURL });
    },
  });

  const asyncUploadAvatar = useAsync({
    onSuccess: (data: any) => {
      if (callbackUpdateWithUpload) {
        callbackUpdateWithUpload(avatarURL, userInfo.name);
      }
    },
  });

  const asyncActiveStatus = useAsync({
    onSuccess: (data: any) => {
      if (callbackUpdateActiveStatus) {
        callbackUpdateActiveStatus(data);
      }
      dispatch(
        tableSearchActions.setSearchCriteria(
          {
            ...tableCriteria,
            queryDict: {
              active: true,
            },
          },
          TABLE_NAME,
        ),
      );
    },
  });

  const handleActiveStatus = (activeStatus: boolean) =>
    dispatch(
      userManagementActions.editEmployeeActiveStatus(
        employeeId,
        toEmployeeActiveStatusEditRequestBody(activeStatus),
        asyncActiveStatus,
      ),
    );

  const updateProfile = () => {
    if (!file) {
      editCurrentEmployee(userInfo);
    }
    if (file) {
      dispatch(attachmentsActions.requestAvatarS3link(file.name, asyncS3link));
    }
  };

  const updateProfileButtonsRenderer = () => (
    <Box display="flex" justifyContent="flex-end">
      <Button
        variant="outlined"
        style={{ width: "auto", color: "#6E09EA", borderColor: "#6E09EA" }}
        onClick={closeEdit}
        id="DialogContent-closeEdit"
      >
        <Text translation="common.cancel" />
      </Button>
      <Button
        variant="contained"
        disabled={isUsernameEmpty}
        style={{ width: "auto", color: "white", backgroundColor: "#6E09EA" }}
        onClick={() => {
          updateProfile();
          closeEdit();
        }}
        id="DialogContent-updateProfile"
      >
        <Text translation="user.management.update.profile" />
      </Button>
    </Box>
  );

  const activeStatusButtonRenderer = () => (
    <Box display="flex" alignSelf="flex-end" mt={-5} mr={2.5}>
      <Button
        variant="outlined"
        className={classes.activeStatusButton}
        onClick={() => handleActiveStatus(!activeStatus)}
        id="DialogContent-activeStatusButton"
      >
        <Text
          translation={activeStatus ? "common.deactivate" : "common.reactivate"}
        />
      </Button>
    </Box>
  );

  return (
    <React.Fragment>
      {!isCurrentUser && activeStatusButtonRenderer()}
      <Box display="flex" alignSelf="center">
        <Typography variant="subtitle1" color="primary">
          {email}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center">
        <Button
          variant="text"
          color="primary"
          style={{ width: "auto" }}
          onClick={showEdit}
          id="DialogContent-showEdit"
        >
          <Text translation="common.edit" />
        </Button>
      </Box>
      <Box alignSelf="center" mt={7} width="700px">
        <UserGroups
          canManageUsers={canManageUsers}
          employeeGroups={employeeGroups}
          employeeId={employeeId}
          callbackUpdateGroups={callbackUpdateGroups}
          fromUserProfile= {true}
        />
        <Box display="flex" alignItems="flex-end" mt={2}>
          {canUpdateCompany && <HelloSignAccess helloSignStatus={helloSignIntegrationEnabled}/>}
          {/* Employee Dropbox button */}
          <EnableDropboxButton
            shouldDisplayButton={Boolean(isCompanyDropboxEnabled)}
            disabled={Boolean(isEmployeeDropboxEnabled)}
            {...{ dropboxAsync, enableDropboxAction }}
          />
          {slackIntegrationEnabled && slackTeamId && !slackUserId && (
            <div>
              <Typography variant="h4" className={classes.integrations}>
                <Text translation="integrations.title" />
              </Typography>
              <SlackLogo className={classes.slack} />
              <SubmitButton
                onClick={getUrl}
                asyncState={asyncState}
                label={"integrations.add"}
                className={classes.addButton}
                id="DialogContent-addEmployee"
              />
            </div>
          )}
        </Box>
        <NavigationManagementContainer/>
        <CompanyStageManagementContainer/>
        <WhiteLabelingManagementContainer/>
        <Addresses canUpdateCompany={canUpdateCompany} addresses={companyMine.addresses} />
        <AcctCodes canUpdateCompany={canUpdateCompany} acctCodes={companyMine.acctCodes} />
        {showEditUser && updateProfileButtonsRenderer()}
        {isDeveloper && <ApiTokenContent />}
      </Box>
    </React.Fragment>
  );
};

export default DialogContent;
