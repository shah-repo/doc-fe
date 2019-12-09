import { Button, Paper, Typography } from "@material-ui/core";
import { FormikProps } from "formik";
import * as React from "react";
import { AsyncState } from "../../../state/types";
import InputField from "../../components/forms/fields/Input";
import { email, required, validator } from "../../components/forms/fields/validators";
import FormMessage from "../../components/forms/FormMessage";
import SubmitButton from "../../components/forms/SubmitButton";
import Text from "../../components/Text";
import { ForgotPasswordEmail } from "../types";
import { styles } from "./SignUp.styles";

interface Props extends FormikProps<ForgotPasswordEmail> {
  logo: string;
  closeForgotPasswordPage: () => void;
  asyncState: AsyncState;
  showVerificationState: (values: ForgotPasswordEmail, message: string) => void;
}

const ForgotPasswordPage: React.FunctionComponent<Props> = ({
    logo,
    closeForgotPasswordPage,
    asyncState,
    showVerificationState,
    values,
}) => {
  const classes = styles();
  console.log(asyncState);
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <img
          src={logo}
          alt="Logo"
          className={classes.logo}
        />
        <Typography variant="h4" className={classes.boldTitle}>
          <Text translation={"forgot.password"} />
        </Typography>
        <Typography variant="subtitle1" className={classes.marginTitle}>
          <Text translation={"forgot.password.message"} />
          <FormMessage asyncState={asyncState} className={classes.status} />
        </Typography>
        <InputField
            name="email"
            label="login.email"
            size="sm"
            gutter={false}
            inputProps={{ autoComplete: "email", autoFocus: true, id: "email" }}
            validate={validator(required, email)}
            lpignore={false}
        />
        <SubmitButton
          onClick={() => showVerificationState(values, "forgot.password.email")}
          asyncState={asyncState}
          label={"forgot.password.reset"}
          className={classes.submit}
        />
        <Button className={classes.navigationLink} onClick={closeForgotPasswordPage} >
          <Text translation={"forgot.password.close"} />
        </Button>
      </Paper>
    </div>
  );
};

export default ForgotPasswordPage;
