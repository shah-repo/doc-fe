import { Box, Button, Typography } from "@material-ui/core";
import classNames from "classnames";
import React from "react";
import { useDispatch } from "react-redux";
import { ReactComponent as SlackLogo } from "../../../../assets/images/slack_full_logo.svg";
import { EmployeeEditRequestBody } from "../../../../state/ducks/auth/types";
import {
  GetEmployeeResponse,
  userManagementActions,
} from "../../../../state/ducks/userManagement";
import { AsyncState } from "../../../../state/types";
import { OptionType } from "../../../components/forms/fields/Autocomplete/types";
import SubmitButton from "../../../components/forms/SubmitButton";
import Text from "../../../components/Text";
import useAsync from "../../../hooks/useAsync";
import styles from "../../profile/UserProfile.styles";
import { toEmployeeActiveStatusEditRequestBody } from "../../utils/transform";
import UserGroups from "../groups/UserGroups";

interface OwnProps {
  canManageUsers: boolean;
  employeeGroups: OptionType[];
  employeeId: string;
  editCurrentEmployee: (values: EmployeeEditRequestBody) => void;
  callbackUpdateGroups?: (values: GetEmployeeResponse) => void;
  callbackUpdateActiveStatus?: (values: GetEmployeeResponse) => void;
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
}

type Props = OwnProps;

export const DialogContent: React.FunctionComponent<Props> = ({
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
}) => {
  const classes = styles();
  const dispatch = useDispatch();

  const async = useAsync({
    onSuccess: (data: any) => {
      if (callbackUpdateActiveStatus) {
        callbackUpdateActiveStatus(data);
      }
    },
  });

  const deactivateUser = () =>
    dispatch(
      userManagementActions.editEmployeeActiveStatus(
        employeeId,
        toEmployeeActiveStatusEditRequestBody(false),
        async,
      ),
    );

  const updateProfileButtonsRenderer = () => (
    <Box display="flex" justifyContent="flex-end">
      <Button
        variant="outlined"
        style={{ width: "auto", color: "#6E09EA", borderColor: "#6E09EA" }}
        onClick={closeEdit}
      >
        <Text translation="common.cancel" />
      </Button>
      <Button
        variant="contained"
        style={{ width: "auto", color: "white", backgroundColor: "#6E09EA" }}
        onClick={() => {
          editCurrentEmployee(userInfo);
          closeEdit();
        }}
      >
        <Text translation="user.management.update.profile" />
      </Button>
    </Box>
  );

  const deactivateButtonRenderer = () => (
    <Box display="flex" alignSelf="flex-end" mt={-5} mr={2.5}>
      <Button
        variant="outlined"
        disabled={!activeStatus}
        className={classNames(classes.deactivateButtonEnabled, {
          [classes.deactivateButtonDisabled]: !activeStatus,
        })}
        onClick={() => deactivateUser()}
      >
        <Text translation="common.deactivate" />
      </Button>
    </Box>
  );

  return (
    <React.Fragment>
      {canManageUsers && deactivateButtonRenderer()}

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
        >
          <Text translation="common.edit" />
        </Button>
      </Box>
      <Box alignSelf="center" mt={7}>
        <UserGroups
          canManageUsers={canManageUsers}
          employeeGroups={employeeGroups}
          employeeId={employeeId}
          callbackUpdateGroups={callbackUpdateGroups}
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
            />
          </div>
        )}
        {showEditUser && updateProfileButtonsRenderer()}
      </Box>
    </React.Fragment>
  );
};

export default DialogContent;
