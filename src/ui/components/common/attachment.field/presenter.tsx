import { Box } from "@material-ui/core";
import React from "react";
import { styles } from "./utils/styles";
import { AttachmentFieldProps } from "./utils/types";
import { AttachmentGroupTypeSelector } from "../attachment.grouptype/AttachmentGroupTypeSelector";

export const AttachmentFieldPresenter: React.FunctionComponent<
AttachmentFieldProps
> = ({ name, multiple, component = "button", disabled, upload, form, field }) => {
  const isField = component === "field";
  const classes = styles({ isField });

  return (
    <Box mt={1} className={classes.root} id="AttachmentFieldPresenter-field">
      <AttachmentGroupTypeSelector
        upload = {upload}
        form = {form}
        name = {name}
        multiple = {multiple}
        field = {field}
        disabled = {disabled}
      />
    </Box>
  );
};

export default AttachmentFieldPresenter;
