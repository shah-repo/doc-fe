import { Button } from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import React, { useEffect, useState } from "react";
import { Attachment } from "../../../../../state/ducks/attachments";
import Text from "../../../Text";
import { styles } from "../utils/styles";
import { ViewFileTitleProps } from "../utils/types";

const ViewFileTitleControls: React.FunctionComponent<ViewFileTitleProps> = ({
  attachment,
  attachments,
}) => {
  const classes = styles();
  return (
    <span className={classes.buttonsContainer}>
      <Button
        color="secondary"
        variant="outlined"
      >
        <Text translation="common.previous" />
      </Button>
      <Button
        color="secondary"
        variant="contained"
      >
        <Text translation="common.next" />
      </Button>
    </span>
  );
};

export default ViewFileTitleControls;
