import MuiDialogTitle from "@material-ui/core/DialogTitle";
import React, { useEffect, useState } from "react";
import { Attachment } from "../../../../../state/ducks/attachments";
import { styles } from "../utils/styles";
import { ViewFileTitleProps } from "../utils/types";

const ViewFileTitle: React.FunctionComponent<ViewFileTitleProps> = ({
  attachment,
}) => {
  const file = (attachment || {}) as Attachment;
  const fileName = `${file.name}.${file.type}`;
  const classes = styles();
  return (
    <MuiDialogTitle className={classes.title}>
      {fileName}
    </MuiDialogTitle>
  );
};

export default ViewFileTitle;
