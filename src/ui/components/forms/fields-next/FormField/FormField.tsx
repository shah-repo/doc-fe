import { CircularProgress, FormControl, FormHelperText, InputLabel } from "@material-ui/core";
import cx from "classnames";
import React from "react";
import { withThemeNext } from "../../../../layout/theme-next";
import { renderNode } from "../utils";
import useStyles from "./FormField.styles";
import { FormFieldProps } from "./FormField.types";

const FormField: React.FC<FormFieldProps> = ({
  prefix,
  suffix,
  children,
  loading,
  fullWidth = true,
  helperText,
  helperTextProps,
  label,
  labelProps,
  ...props
}, ref) => {
  const classes = useStyles();

  return (
    <FormControl {...props} ref={ref} fullWidth={fullWidth}>
      {prefix}
      {label && (
        <InputLabel
          {...labelProps}
          shrink={true}
          className={cx(classes.label, labelProps?.className)}
        >
          {renderNode(label)}
          {loading && <CircularProgress size={14} className={classes.loading} />}
        </InputLabel>
      )}
      {children}
      {helperText && (
        <FormHelperText {...helperTextProps}>
          {renderNode(helperText)}
        </FormHelperText>
      )}
      {suffix}
    </FormControl>
  );
};

export default withThemeNext(React.forwardRef(FormField));
