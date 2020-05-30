import { Box } from "@material-ui/core";
import React from "react";
import { styles } from "./utils/styles";
import { AttachmentFieldProps } from "./utils/types";
import { AttachmentGroupTypeSelector } from "./AttachmentGroupTypeSelector";

export const AttachmentFieldPresenter: React.FunctionComponent<
AttachmentFieldProps
> = ({ name, multiple, component = "button", onChange, disabled }) => {
  const isField = component === "field";
  const text = isField ? "common.upload.files" : "common.add.attachment";
  const classes = styles({ isField });

  return (
    <Box mt={1} className={classes.root} id="AttachmentFieldPresenter-field">
      <AttachmentGroupTypeSelector text={text}></AttachmentGroupTypeSelector>
    </Box>
  );
};

export default AttachmentFieldPresenter;
