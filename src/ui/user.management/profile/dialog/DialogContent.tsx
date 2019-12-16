import { Box, Button, Typography } from "@material-ui/core";
import React from "react";
import { ReactComponent as SlackLogo } from "../../../../assets/images/slack_full_logo.svg";
import { EmployeeEditRequestBody } from "../../../../state/ducks/auth/types";
import { GetEmployeeResponse } from "../../../../state/ducks/userManagement";
import { AsyncState } from "../../../../state/types";
import { OptionType } from "../../../components/forms/fields/Autocomplete/types";
import SubmitButton from "../../../components/forms/SubmitButton";
import Text from "../../../components/Text";
import styles from "../../profile/UserProfile.styles";
import UserGroups from "../groups/UserGroups";
/* import SummaryField from "../../common/summary/base";*/

interface OwnProps {
    canManageUsers: boolean;
    employeeGroups: OptionType[];
    employeeId: string;
    editCurrentEmployee: (values: EmployeeEditRequestBody) => void;
    callbackUpdateGroups?: (values: GetEmployeeResponse) => void;
    showEditUser: boolean;
    showEdit: () => void;
    closeEdit: () => void;
    userInfo: EmployeeEditRequestBody;
    asyncState: AsyncState;
    getUrl: () => void;
    slackIntegrationEnabled: boolean;
    slackTeamId: string;
    hasSlackPermission: boolean;
  }

type Props = OwnProps;

export const DialogContent: React.FunctionComponent<Props> = ({
    canManageUsers,
    employeeGroups,
    employeeId,
    callbackUpdateGroups,
    showEdit,
    showEditUser,
    closeEdit,
    userInfo,
    editCurrentEmployee,
    slackIntegrationEnabled,
    slackTeamId,
    hasSlackPermission,
    getUrl,
    asyncState,
}) => {
    const classes = styles();
    const updateProfileButtonsRenderer = () => (
        <Box display="flex" justifyContent="flex-end">
            <Button
                variant="outlined"
                style={{width: "auto", color: "#6E09EA", borderColor: "#6E09EA"}}
                onClick={closeEdit}
            >
                <Text translation="common.cancel" />
            </Button>
            <Button
                variant="contained"
                style={{width: "auto", color: "white", backgroundColor: "#6E09EA"}}
                onClick={() => {editCurrentEmployee(userInfo); closeEdit(); }}
            >
                <Text translation="user.management.update.profile" />
            </Button>
        </Box>
    );

    /*const deactivateButtonRenderer = () => (
        <Box display="flex" justifyContent="start">
            <Button
                variant="outlined"
                color="primary"
                style={{margin: "48px 0 0 0"}}
            >
                <Text translation="common.deactivate" />
            </Button>
        </Box>
    ); */

    return (
    <React.Fragment>
        <Box display="flex" justifyContent="center">
            <Button
                variant="text"
                color="primary"
                style={{width: "2auto"}}
                onClick={showEdit}
            >
                <Text translation="common.edit" />
            </Button>
        </Box>
        <Box
            alignSelf="center"
            mt={7}
        >
            {/*<SummaryField label="user.management.last.training" value={"01/08/2018"}/>*/}
            <UserGroups
                canManageUsers={canManageUsers}
                employeeGroups={employeeGroups}
                employeeId={employeeId}
                callbackUpdateGroups={callbackUpdateGroups}
            />
            {slackIntegrationEnabled && !slackTeamId && hasSlackPermission &&
            <div>
                <Typography variant="h4" className={classes.integrations} >
                    <Text translation="integrations.title" />
                </Typography>
                 <SlackLogo className={classes.slack} />
                <SubmitButton
                    onClick={getUrl}
                    asyncState={asyncState}
                    label={"integrations.add"}
                    className={classes.addButton}
                />
            </div>}
            {/* {canManageUsers && deactivateButtonRenderer()} */}
            {showEditUser && updateProfileButtonsRenderer()}
        </Box>
    </React.Fragment>
    );
};

export default DialogContent;
