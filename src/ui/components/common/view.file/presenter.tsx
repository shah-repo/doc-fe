import Dialog from "@material-ui/core/Dialog";
import React, { useEffect, useState } from "react";
import ViewFileContent from "./components/dialog.content";
import ViewFileTitle from "./components/dialog.title";
import { styles } from "./utils/styles";
import { ViewFilePresenterProps } from "./utils/types";

const ViewFilePresenter: React.FunctionComponent<ViewFilePresenterProps> = ({
  handleClose,
  isOpen,
  asyncState,
  url,
  attachment,
  attachments,
  ...props
}) => {
  const classes = styles();
  return (
    <Dialog
      onClose={handleClose}
      open={isOpen}
      classes={{ paper: classes.paper }}
      maxWidth="lg"
      fullWidth={true}
    >
      <ViewFileTitle
        attachment={attachment}
        attachments={attachments}
        {...props}
      />
      <ViewFileContent
        asyncState={asyncState}
        url={url}
        type={attachment!.type}
      />
    </Dialog>
  );
};

export default ViewFilePresenter;
