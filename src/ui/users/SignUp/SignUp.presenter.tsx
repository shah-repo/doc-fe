import * as React from "react";
import { LOGIN_URL } from "../../constants/urls";
import LoginFormContainer from "../forms/LoginForm.container";

const SignUpPresenter: React.FunctionComponent = () => {
    return (
        <LoginFormContainer
            signMessage="signup.message"
            signLabel="signup.sign.in"
            route={LOGIN_URL}
            title="signup.title"
        />
    );
};

export default SignUpPresenter;
