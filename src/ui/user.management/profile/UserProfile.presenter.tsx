import { AppBar, Box, Button, Dialog, IconButton, InputBase, Toolbar, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import { ReactComponent as SlackLogo } from "../../../assets/images/slack_full_logo.svg";
import { EmployeeEditRequestBody } from "../../../state/ducks/auth/types";
import { GetEmployeeResponse } from "../../../state/ducks/userManagement";
import { AsyncState } from "../../../state/types";
/* import SummaryField from "../../common/summary/base";*/
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import SubmitButton from "../../components/forms/SubmitButton";
import AvatarContainer from "../../components/icons/avatar/avatar.container";
import Text from "../../components/Text";
import UserGroups from "./UserGroups";
import styles from "./UserProfile.styles";

interface OwnProps {
    isOpen: boolean;
    close: () => void;
    canManageUsers: boolean;
    employeeGroups: OptionType[];
    name: string;
    avatar: string | null;
    editCurrentEmployee: (values: EmployeeEditRequestBody) => void;
    showEditUser: boolean;
    showEdit: () => void;
    closeEdit: () => void;
    employeeId: string;
    callbackUpdateGroups?: (values: GetEmployeeResponse) => void;
    asyncState: AsyncState;
    getUrl: () => void;
    slackIntegrationEnabled: boolean;
    slackTeamId: string;
    hasSlackPermission: boolean;
}

type Props = OwnProps;

export const UserProfilePresenter: React.FunctionComponent<Props> = ({
    isOpen,
    close,
    canManageUsers,
    employeeGroups,
    name,
    avatar,
    editCurrentEmployee,
    showEditUser,
    showEdit,
    closeEdit,
    employeeId,
    callbackUpdateGroups,
    asyncState,
    getUrl,
    slackIntegrationEnabled,
    slackTeamId,
    hasSlackPermission,
}) => {
    const classes = styles();
    let userInfo: EmployeeEditRequestBody = {
        name,
        avatar,
    };

    const handleNameChange = (event: React.ChangeEvent<{value: string}>) =>
    userInfo = {...userInfo, name: event.target.value};

    const userNameRenderer = (name: string) => (
        <Typography variant="h3" className={classes.userName}>
            {name}
        </Typography>
    );

    const editUserNameRenderer = (name: string) => (
        <InputBase
            defaultValue={name}
            onChange={handleNameChange}
            className={classes.userNameEdit}
        />
    );

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
                <Text translation="user.management.deactivate" />
            </Button>
        </Box>
    ); */
    return (
    <Dialog fullScreen={true} open={isOpen}>
        <AppBar className={classes.appBar}>
            <Toolbar>
                <IconButton className={classes.iconButton} onClick={close} aria-label="Close">
                    <CloseIcon/>
                </IconButton>
            </Toolbar>
            <Box
                display="block"
                textAlign="center"
            >
            <Typography variant="h4" className={classes.userProfile}>
                <Text translation="user.management.profile"/>
            </Typography>
                {!showEditUser && userNameRenderer(name)}
                {showEditUser && editUserNameRenderer(name)}
            </Box>
        </AppBar>
        <Box
            display="flex"
            justifyContent="center"
            mt={20}
        >
            <AvatarContainer/>
        </Box>
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
            /></div>}
            {/* {canManageUsers && deactivateButtonRenderer()} */}
            {showEditUser && updateProfileButtonsRenderer()}
        </Box>
    </Dialog>
    );
};

export default UserProfilePresenter;
