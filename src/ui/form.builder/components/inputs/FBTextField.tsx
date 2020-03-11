import { TextField } from "@material-ui/core";
import { RenderInputParams } from "@material-ui/lab/Autocomplete/Autocomplete";
import _ from "lodash";
import React from "react";
import FBStore from "../../stores/ui/FBStore";
import { FBInputProps } from "../../types/common";
import FBInput from "../common/FBInput";

const FBTextField: React.FunctionComponent<FBInputProps & Partial<RenderInputParams>> = ({
  rows = 1,
  placeholder,
  error,
  id,
  disabled,
  InputLabelProps,
  InputProps,
  inputProps,
  ...props
}) => {
  const disableEdit = disabled || _.get(props.hellosignFlowProps, "type") === "HS_DEFINED_FIELD" || FBStore.getValue("signatureRequestId");
  console.log(FBStore.getValue("signatureRequestId"));
  return (
    <FBInput disabled={disableEdit} {...props} type="textfield">
      <TextField
        multiline={Boolean(rows && (rows as number) > 1)}
        variant="outlined"
        label=""
        id="FBTextField-input"
        {...{ rows, placeholder, error, id, InputLabelProps, InputProps, inputProps }}
      />
    </FBInput>
  );
}

export default FBTextField;
