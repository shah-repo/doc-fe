import { Avatar, Paper, Typography } from "@material-ui/core";
import { LockOutlined as LockOutlinedIcon } from "@material-ui/icons";
import * as React from "react";
import Text from "../../components/Text";
import { LOGIN_URL } from "../../constants/urls";
import LoginFormContainer from "../forms/LoginForm.container";
import { styles } from "./SignUp.styles";

const SignUpPresenter: React.FunctionComponent = () => {
    const classes = styles();
    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    <Text translation="signup.title" />
                </Typography>
                <LoginFormContainer
                    buttonLabel="signup.button"
                    signMessage="signup.message"
                    signLabel="login.button"
                    route={LOGIN_URL}
                />
            </Paper>
        </div>
    );
};

export default SignUpPresenter;
