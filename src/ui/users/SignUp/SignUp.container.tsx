import * as React from "react";
import { LoginContainerProps } from "../Login.container";
import SignUpPresenter from "./SignUp.presenter";
// import { styles } from "./SignUp.styles";

export type Props = LoginContainerProps;

const SignUpContainer: React.FunctionComponent<Props> = () => {
    // const classes = styles();
    return (
        <SignUpPresenter />
    );
};

export default SignUpContainer;
