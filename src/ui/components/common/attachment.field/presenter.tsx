import { Box, Button } from "@material-ui/core";
import React from "react";
import Text from "../../Text";
import { styles } from "./utils/styles";
import { AttachmentFieldProps } from "./utils/types";
import AttachFileIcon from '@material-ui/icons/AttachFile';

export const AttachmentFieldPresenter: React.FunctionComponent<
AttachmentFieldProps
> = ({ name, multiple, component = "button", onChange, disabled }) => {
  const isField = component === "field";
  const text = isField ? "common.upload.files" : "common.add.attachment";
  const classes = styles({ isField });

  return (
    <Box mt={1} className={classes.root} id="AttachmentFieldPresenter-field">

      <Button
        color="primary"
        size="small"
        startIcon={<AttachFileIcon />}
      >
        <Text translation={text} />
      </Button>
    </Box>
  );
};

export default AttachmentFieldPresenter;
