import { Paper, Typography } from "@material-ui/core";
import { Form } from "formik";
import * as React from "react";
import { AsyncState } from "../../../state/types";
import InputField from "../../components/forms/fields/Input";
import { email, required, validator } from "../../components/forms/fields/validators";
import FormMessage from "../../components/forms/FormMessage";
import SubmitButton from "../../components/forms/SubmitButton";
import Text from "../../components/Text";
import { styles } from "./SignUp.styles";

interface ConfirmForgotPasswordPresenter {
    asyncState: AsyncState;
    logo: string;
}

const ConfirmForgotPasswordPresenter: React.FunctionComponent<ConfirmForgotPasswordPresenter> = ({
    asyncState, logo,
}) => {
  const classes = styles();
  return (
    <div className={classes.root}>
        <Paper className={classes.paper}>
            <img
              src={logo}
              alt="Logo"
              className={classes.logo}
            />
            <Typography variant="h4" className={classes.title}>
                <Text translation={"forgot.password.confirm"} />
            </Typography>
            <Form className={classes.formStyle}>
            <FormMessage asyncState={asyncState} className={classes.status} />
                <InputField
                    name="email"
                    label="login.email"
                    size="sm"
                    gutter={false}
                    inputProps={{ autoComplete: "email", autoFocus: true, id: "email" }}
                    validate={validator(required, email)}
                    lpignore={false}
                />
                <InputField
                    name="password"
                    label="login.password"
                    size="sm"
                    gutter={false}
                    inputProps={{ autoComplete: "current-password", id: "password", type: "password" }}
                    validate={validator(required)}
                    lpignore={false}
                />
                <InputField
                    name="confirmPass"
                    label="confirm.password"
                    size="sm"
                    gutter={false}
                    inputProps={{ autoComplete: "current-password", id: "confirmPass", type: "password" }}
                    validate={validator(required)}
                    lpignore={false}
                />
                <SubmitButton
                    asyncState={asyncState}
                    label={"login.submit"}
                    className={classes.submit}
                />
                </Form>
        </Paper>
    </div>
  );
};

export default ConfirmForgotPasswordPresenter;
