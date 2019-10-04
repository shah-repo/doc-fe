import Dialog from "@material-ui/core/Dialog";
import React from "react";
import ViewFileContent from "./components/dialog.content";
import ViewFileTitle from "./components/dialog.title";
import { PDF } from "./utils/constants";
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
  const isPDF = attachment!.type === PDF;
  const classes = styles({ isPDF });
  return (
    <Dialog
      onClose={handleClose}
      open={isOpen}
      classes={{ paper: classes.paper }}
      maxWidth="lg"
      fullWidth={isPDF}
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
