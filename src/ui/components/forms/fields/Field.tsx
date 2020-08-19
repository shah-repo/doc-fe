import { FormControl, FormHelperText, Typography } from "@material-ui/core";
import { FormControlProps } from "@material-ui/core/FormControl";
import { InputLabelProps } from "@material-ui/core/InputLabel";
import { FieldProps as FormikFieldProps } from "formik";
import _ from "lodash";
import * as React from "react";
import { TypographyProps, TypographySize } from "../../../../state/ducks/common";
import { Translation } from "../../../translations/types";
import HeaderField from "../../common/header.field/field";
import Text from "../../Text";
import { styles } from "./Field.styles";
import { LabelField } from "./Input.styles";

export interface FieldOwnProps {
  label?: Translation | string;
  formControlProps?: FormControlProps;
  inputLabelProps?: InputLabelProps;
  variant?: "standard" | "outlined" | "filled";
  required?: boolean;
  gutter?: boolean;
  minDate?: Date;
  actionsRenderer?: () => any;
}

export interface FieldStyleProps {
  gutter?: boolean;
  error?: boolean;
}

type FieldProps = FieldOwnProps & FormikFieldProps & Partial<TypographyProps>;

const Field: React.FunctionComponent<FieldProps> = ({
  field,
  form,
  form: { touched, errors, isSubmitting },
  children,
  formControlProps,
  label,
  variant,
  required,
  size = "md",
  gutter = true,
  actionsRenderer,
}) => {
  // storing BE response in status
  const error = _.get(errors, field.name);
  const isFieldTouched = _.get(touched, field.name);
  const shouldDisplayError = Boolean(isFieldTouched && error);
  const classes = styles({ gutter, error: shouldDisplayError });

  // Workaround for untouched select fields
  if (error && !shouldDisplayError && isSubmitting) {
    form.setFieldTouched(field.name, true);
  }

  const LabelComponent = () => {
    if (actionsRenderer) {
      return (
        <HeaderField dataProp={label || ""} actionsRenderer={actionsRenderer} />
      );
    }
    return (
      label && (
        <LabelField htmlFor={field.name} style={{ position: "inherit" }}>
          <Typography
            variant={TypographySize[size]}
            className={classes.typography}
          >
            <Text message={label} />
          </Typography>
        </LabelField>
      )
    );
  };

  const ErrorComponent = shouldDisplayError && (
    <FormHelperText>
      <Text message={String(error)} />
    </FormHelperText>
  );

  return (
    <FormControl
      id={`field-${field.name}`}
      variant={variant || "standard"}
      required={required}
      fullWidth={true}
      error={shouldDisplayError}
      className={classes.form}
      data-cy={`field-${field.name}`}
      {...formControlProps}
    >
      {LabelComponent()}
      {children}
      {ErrorComponent}
    </FormControl>
  );
};

export default Field;
