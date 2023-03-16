import { InputBase } from "@material-ui/core";
import React from "react";
import { withThemeNext } from "../../../../layout/theme-next";
import { PasswordFieldProps } from "./PasswordField.types";

const PasswordField: React.FC<PasswordFieldProps> = ({ singleMode, ...props }, ref) => (
  <>
    {singleMode && (
      <input autoComplete="username" style={{ width: 0, height: 0, opacity: 0, position: "absolute" }} />
    )}
    <InputBase
      {...props}
      type="password"
      ref={ref}
    />
  </>
);

export default withThemeNext(React.forwardRef(PasswordField));
