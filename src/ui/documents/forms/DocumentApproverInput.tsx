import {  IconButton, InputAdornment, Typography } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import React from "react";
import InputField from "../../components/forms/fields/Input";
import { email, required, validator } from "../../components/forms/fields/validators";

interface Props {
  index: number;
  removeApprover: () => void;
}

const DocumentApproverInput: React.FunctionComponent<Props> = ({ index, removeApprover }) => {
  const ApproverNumber = (
    <InputAdornment position="start">
      <Typography>
        {index + 1}.
      </Typography>
    </InputAdornment>
  );

  const RemoveButton = (
    <InputAdornment position="end">
      <IconButton aria-label="Delete" onClick={removeApprover}>
        <Delete fontSize="small" />
      </IconButton>
    </InputAdornment>
  );

  return (
    <InputField
      key={index}
      name={`approvers.${index}`}
      validate={validator(required, email)}
      inputProps={{ startAdornment: ApproverNumber, endAdornment: RemoveButton }}
    />
  );
};

export default DocumentApproverInput;
