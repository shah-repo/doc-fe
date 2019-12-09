import * as React from "react";
import { LOGIN_URL } from "../../constants/urls";
import SignupFormContainer from "../forms/SignupForm.container";

const SignUpPresenter: React.FunctionComponent = () => {
    return (
        <SignupFormContainer
            signMessage="signup.message"
            signLabel="signup.sign.in"
            route={LOGIN_URL}
            title="signup.title"
        />
    );
};

export default SignUpPresenter;
