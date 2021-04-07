import { TextField, TextFieldProps } from "@material-ui/core";
import { RenderInputParams } from "@material-ui/lab/Autocomplete/Autocomplete";
import { get } from "lodash";
import React from "react";
import FBStore from "../../stores/ui/FBStore";
import { FBInputProps } from "../../types/common";
import FBInput from "../common/FBInput";

type FBTextFieldProps =
  & FBInputProps
  & Partial<Omit<RenderInputParams, "InputProps">>
  & Pick<TextFieldProps, "InputProps">;

const FBTextField: React.FunctionComponent<FBTextFieldProps> = ({
  rows = 1,
  placeholder,
  id,
  disabled,
  InputLabelProps,
  InputProps,
  inputProps,
  ...props
}) => {
  const disableEdit =
    disabled ||
    get(props.hellosignFlowProps, "type") === "HS_DEFINED_FIELD" ||
    FBStore.getValue("signatureRequestId");

  return (
    <FBInput disabled={disableEdit} {...props} type="textfield">
      <TextField
        multiline={Boolean(rows && (rows as number) > 1)}
        variant="outlined"
        label=""
        id="FBTextField-input"
        {...{ rows, placeholder, id, InputLabelProps, InputProps, inputProps }}
      />
    </FBInput>
  );
};

export default FBTextField;
