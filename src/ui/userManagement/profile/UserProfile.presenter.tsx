import { AppBar, Box, Button, Dialog, IconButton, Toolbar, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import SummaryField from "../../common/summary/base";
import ProfilePhotoUpload from "../../components/common/profilePhoto.filed/profilePhoto";
import Text from "../../components/Text";
import UserGroups from "./UserGroups";
import styles from "./UserProfile.styles";

interface OwnProps {
    isOpen: boolean;
    close: () => void;
    canEditGroups?: boolean;
}

type Props = OwnProps;

export const UserProfilePresenter: React.FunctionComponent<Props> = ({
    isOpen,
    close,
    canEditGroups = true,
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
                    {"Linda Corsey"}
                </Typography>
                <Button
                    variant="text"
                    color="primary"
                    fullWidth={true}
                    style={{
                    width: "auto",
                    }}
                >
                    <Text translation="common.edit" />
                </Button>
            </Box>
        </AppBar>
        <Box
            display="flex"
            justifyContent="center"
            mt={20}
        >
            <div className={classes.profilePhoto}>
            </div>
        </Box>
        <ProfilePhotoUpload/>
        <Box
            alignSelf="center"
            mt={12}
        >
            <SummaryField label="user.management.last.training" value={"01/08/2018"}/>
            <UserGroups canEditGroups={canEditGroups} />
            {canEditGroups && deactivateButtonRenderer()}
        </Box>
    </Dialog>
    );
};

export default UserProfilePresenter;
