import * as React from "react";
import { LOGIN_URL } from "../../constants/urls";
import { LoginContainerProps } from "../Login.container";
import SignupFormContainer from "./SignupForm.container";

export type Props = LoginContainerProps;

const SignUpContainer: React.FunctionComponent<Props> = () => {
    return (
        <SignupFormContainer
            signMessage="signup.message"
            signLabel="signup.sign.in"
            route={LOGIN_URL}
            title="signup.title"
        />
    );
};

export default SignUpContainer;
