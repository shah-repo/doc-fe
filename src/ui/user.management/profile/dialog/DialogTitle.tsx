import { AppBar, Box, IconButton, InputBase, Toolbar, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import { EmployeeEditRequestBody } from "../../../../state/ducks/auth/types";
import Text from "../../../components/Text";
import styles from "../UserProfile.styles";

interface OwnProps {
    close: () => void;
    showEditUser: boolean;
    name: string;
    userInfo: EmployeeEditRequestBody;
    setUserInfo: (values: EmployeeEditRequestBody) => void;
  }

type Props = OwnProps;

export const DialogTitle: React.FunctionComponent<Props> = ({
    close,
    showEditUser,
    name,
    userInfo,
    setUserInfo,
}) => {
    const classes = styles();
    const handleNameChange = (event: React.ChangeEvent<{value: string}>) =>
    setUserInfo({...userInfo, name: event.target.value});

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
    return (
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
    );
};

export default DialogTitle;
