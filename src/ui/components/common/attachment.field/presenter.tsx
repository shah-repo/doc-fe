import { Box, Link } from "@material-ui/core";
import AttachFile from "@material-ui/icons/AttachFile";
import React from "react";
import Text from "../../Text";
import { styles } from "./utils/styles";
import { AttachmentFieldProps } from "./utils/types";

export const AttachmentFieldPresenter: React.FunctionComponent<
  AttachmentFieldProps
> = ({ name, multiple, component = "button", onChange, disabled }) => {
  const isField = component === "field";
  const text = isField ? "common.upload.files" : "common.add.attachment";
  const classes = styles({ isField });

  return (
    <Box mt={0.2} className={classes.root}>
      <input
        accept="*"
        className={classes.input}
        id={`${name}-button-file`}
        multiple={multiple}
        type="file"
        onChange={onChange}
        onBlur={onChange}
        disabled={disabled}
      />
      <label htmlFor={`${name}-button-file`}>
        <Link component="span" variant="button" className={classes.link}>
          <AttachFile className={classes.icon} />
          <Text translation={text} />
        </Link>
      </label>
    </Box>
  );
};

export default AttachmentFieldPresenter;
