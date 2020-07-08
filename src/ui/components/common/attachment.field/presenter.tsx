import { Box } from "@material-ui/core";
import React from "react";
import { AttachmentLineTypeSelector } from "../attachment.linetype/AttachmentLineTypeSelector";
import { styles } from "./utils/styles";
import { AttachmentFieldProps } from "./utils/types";

interface Props extends AttachmentFieldProps {
  onChange: (lineType: string, cleanCopyRequired: boolean) => (event: React.FormEvent<HTMLInputElement>) => any;
  isUploading: boolean;
}

export const AttachmentFieldPresenter: React.FunctionComponent<
Props
> = ({ name, multiple, component = "button", disabled, upload, form, field, onChange, isUploading }) => {
  const isField = component === "field";
  const classes = styles({ isField });

  return (
    <Box mt={1} className={classes.root} id="AttachmentFieldPresenter-field" data-cy={"AttachmentFieldPresenter-field"}>
      <AttachmentLineTypeSelector
        {...{ field, upload, form, name, multiple, disabled, onChange, isField, isUploading }}
      />
    </Box>
  );
};

export default AttachmentFieldPresenter;
