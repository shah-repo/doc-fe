import MuiDialogTitle from "@material-ui/core/DialogTitle";
import React, { useEffect, useState } from "react";
import { Attachment } from "../../../../../state/ducks/attachments";
import { styles } from "../utils/styles";
import { ViewFileTitleProps } from "../utils/types";
import ViewFileTitleControls from "./dialog.controls";

const ViewFileTitle: React.FunctionComponent<ViewFileTitleProps> = ({
  attachment,
  attachments,
}) => {
  const currentIndex = 1;
  const numberOfViewableFiles = 2;
  const file = (attachment || {}) as Attachment;
  const fileName = `${file.name}.${file.type}`;
  const classes = styles();
  return (
    <MuiDialogTitle className={classes.title}>
      {fileName}
      <ViewFileTitleControls
        attachment={attachment}
        attachments={attachments}
      />
    </MuiDialogTitle>
  );
};

export default ViewFileTitle;
