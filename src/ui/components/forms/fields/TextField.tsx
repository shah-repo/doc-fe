import { Field } from "formik";
import { TextFieldProps as MuiFormikTextFieldProps } from "formik-material-ui";
import React from "react";
import Text from "../../../components/Text";
import { Translation } from "../../../translations/types";
import { StyledTextField } from "./TextField.styles";

interface TextFieldProps {
  label: Translation | string;
}

type Props = TextFieldProps & MuiFormikTextFieldProps;

const TextField: React.FunctionComponent<Props> = ({
  label,
  ...other
}) => {

  return (
    <Field
      component={StyledTextField}
      name="assessments.description"
      label={<Text message={label} />}
      margin="normal"
      variant="filled"
      multiline={true}
      rows="2"
      fullWidth={true}
      {...other}
    />
  );
};

export default TextField;
