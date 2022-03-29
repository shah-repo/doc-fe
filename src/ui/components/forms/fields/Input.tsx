import { InputBaseProps as MuiInputProps } from "@material-ui/core/InputBase";
import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import * as React from "react";
import { RenderSize } from "../../../../state/ducks/common/types";
import Field, { FieldOwnProps } from "./Field";
import { InputField as MuiInput } from "./Input.styles";

interface InputOwnProps extends FieldOwnProps {
  inputProps?: MuiInputProps;
  size?: RenderSize;
  actionsRenderer?: () => any;
  lpignore?: boolean;
  dataCy?: string;
}

type InputPropsWithFormik = InputOwnProps & FormikFieldProps;

const Input: React.FunctionComponent<InputPropsWithFormik> = ({
  inputProps,
  size = "md",
  actionsRenderer,
  lpignore = true,
  dataCy,
  ...fieldProps
}) => (
  <Field size={size} actionsRenderer={actionsRenderer} {...fieldProps} inputLabelProps={{ shrink: true }} >
    <MuiInput
      required={false}
      inputProps={{ "data-lpignore": lpignore, "data-cy": dataCy }}
      {...fieldProps.field}
      {...inputProps}
      onBlur={(evt) => {
        fieldProps.field.onBlur(evt);
          inputProps?.onBlur?.(evt);
      }}
    />
  </Field>
);

type InputFieldProps = InputOwnProps & FieldConfig;

const InputField: React.FunctionComponent<InputFieldProps> = (props) => <FormikField component={Input} {...props} />;

export default InputField;
