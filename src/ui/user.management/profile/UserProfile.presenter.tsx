import { AppBar, Box, Button, Dialog, IconButton, Toolbar, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import { GetEmployeeResponse } from "../../../state/ducks/userManagement";
import SummaryField from "../../common/summary/base";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import AvatarContainer from "../../components/icons/avatar/avatar.container";
import Text from "../../components/Text";
import UserGroups from "./UserGroups";
import styles from "./UserProfile.styles";

interface OwnProps {
    isOpen: boolean;
    close: () => void;
    canManageUsers: boolean;
    employeeGroups: OptionType[];
    employee: Partial<GetEmployeeResponse>;
}

type Props = OwnProps;

export const UserProfilePresenter: React.FunctionComponent<Props> = ({
    isOpen,
    close,
    canManageUsers,
    employeeGroups,
    employee,
}) => {

    const classes = styles();
    const deactivateButtonRenderer = () => (
    <Button
        variant="text"
        color="primary"
        fullWidth={true}
    >
        <Text translation="user.management.deactivate" />
    </Button>
    );
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
                <Typography variant="h3" className={classes.userName}>
                    {employee.user!.name}
                </Typography>
{/*                 <Button
                    variant="text"
                    color="primary"
                    fullWidth={true}
                    style={{
                    width: "auto",
                    }}
                >
                    <Text translation="common.edit" />
                </Button> */}
            </Box>
        </AppBar>
        <Box
            display="flex"
            justifyContent="center"
            mt={20}
        >
            <AvatarContainer/>
        </Box>
        <Box
            alignSelf="center"
            mt={12}
        >
            <SummaryField label="user.management.last.training" value={"01/08/2018"}/>
            <UserGroups canManageUsers={canManageUsers} employeeGroups={employeeGroups}/>
            {canManageUsers && deactivateButtonRenderer()}
        </Box>
    </Dialog>
    );
};

export default UserProfilePresenter;
